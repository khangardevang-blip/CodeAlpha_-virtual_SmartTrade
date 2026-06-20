const API_BASE = 'http://localhost:8080/api';

window.SPA = {
    fetchAuth: async (url, options = {}) => {
        const token = localStorage.getItem('smarttrade_token');
        if(!token) { window.location.hash = 'login'; return; }
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            ...(options.headers || {})
        };
        const res = await fetch(url, { ...options, headers });
        if(res.status === 401 || res.status === 403) {
            localStorage.removeItem('smarttrade_token');
            window.location.hash = 'login';
        }
        return res;
    },

    showToast: (message, type = 'info') => {
        const c = document.getElementById('toastContainer');
        const bg = type === 'error' ? 'bg-danger' : (type === 'success' ? 'bg-success' : 'bg-primary');
        const t = document.createElement('div');
        t.className = `toast align-items-center text-white ${bg} border-0 show`;
        t.innerHTML = `<div class="d-flex"><div class="toast-body">${message}</div><button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button></div>`;
        c.appendChild(t);
        setTimeout(() => t.remove(), 3000);
    },

    logout: () => {
        localStorage.removeItem('smarttrade_token');
        localStorage.removeItem('smarttrade_username');
        window.location.hash = 'login';
    },

    onRouteLoad: (hash) => {
        if(hash === 'login') SPA.initLogin();
        else if(hash === 'register') SPA.initRegister();
        else if(['dashboard', 'market', 'portfolio', 'history', 'settings', 'admin'].includes(hash)) SPA.initDashboard();

        document.querySelectorAll('.sidebar-menu .nav-link-item').forEach(link => {
            if(link.getAttribute('href') === '#' + hash) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    },

    initLogin: () => {
        document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const u = document.getElementById('loginUsername').value;
            const p = document.getElementById('loginPassword').value;
            try {
                const r = await fetch(`${API_BASE}/auth/login`, {
                    method: 'POST', headers:{'Content-Type':'application/json'},
                    body: JSON.stringify({username: u, password: p})
                });
                let data = {};
                try { data = await r.json(); } catch(e) {}
                if(r.ok) {
                    localStorage.setItem('smarttrade_token', data.token);
                    localStorage.setItem('smarttrade_username', data.username);
                    window.location.hash = 'dashboard';
                } else {
                    document.getElementById('loginError').innerText = data.message || "Invalid username or password";
                    document.getElementById('loginError').classList.remove('d-none');
                }
            } catch(err) {
                document.getElementById('loginError').innerText = "Network error or server down.";
                document.getElementById('loginError').classList.remove('d-none');
            }
        });
    },

    initRegister: () => {
        document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const u = document.getElementById('regUsername').value;
            const em = document.getElementById('regEmail').value;
            const p = document.getElementById('regPassword').value;
            try {
                const r = await fetch(`${API_BASE}/auth/register`, {
                    method: 'POST', headers:{'Content-Type':'application/json'},
                    body: JSON.stringify({username: u, email: em, password: p})
                });
                let data = {};
                try { data = await r.json(); } catch(e) {}
                document.getElementById('regMessage').innerText = data.message || "Registration failed. Try a different username.";
                document.getElementById('regMessage').classList.remove('d-none');
                document.getElementById('regMessage').className = r.ok ? 'small mt-3 text-profit' : 'small mt-3 text-loss';
                if(r.ok) setTimeout(() => window.location.hash = 'login', 2000);
            } catch(err) {
                document.getElementById('regMessage').innerText = "Network error or server down.";
                document.getElementById('regMessage').classList.remove('d-none');
                document.getElementById('regMessage').className = 'small mt-3 text-loss';
            }
        });
    },

    initDashboard: async () => {
        const un = localStorage.getItem('smarttrade_username');
        if(un) {
            const el = document.getElementById('sidebarUsername');
            if(el) el.innerText = un;
            const initEl = document.getElementById('sidebarAvatar');
            if(initEl) initEl.innerText = un.charAt(0).toUpperCase();
        }
        document.getElementById('logoutBtn')?.addEventListener('click', SPA.logout);
        
        // Tab routing logic
        const hash = window.location.hash.slice(1) || 'dashboard';
        const pSec = document.getElementById('portfolioSection');
        const mSec = document.getElementById('marketSection');
        const hSec = document.getElementById('historySection');
        const sSec = document.getElementById('settingsSection');
        const aSec = document.getElementById('adminSection');
        if(pSec && mSec && hSec && sSec && aSec) {
            pSec.classList.add('d-none');
            mSec.classList.add('d-none');
            hSec.classList.add('d-none');
            sSec.classList.add('d-none');
            aSec.classList.add('d-none');
            
            if(hash === 'portfolio') {
                pSec.className = 'col-lg-12'; pSec.classList.remove('d-none');
            } else if(hash === 'market') {
                mSec.className = 'col-lg-12'; mSec.classList.remove('d-none');
            } else if(hash === 'history') {
                hSec.classList.remove('d-none');
            } else if(hash === 'settings') {
                sSec.classList.remove('d-none');
            } else if(hash === 'admin') {
                aSec.classList.remove('d-none');
                SPA.loadAdminUsers();
            } else {
                pSec.className = 'col-lg-8'; pSec.classList.remove('d-none');
                mSec.className = 'col-lg-4'; mSec.classList.remove('d-none');
            }
        }
        
        if(window.dashboardInterval) clearInterval(window.dashboardInterval);
        const loadData = async () => { await Promise.all([SPA.loadProfileAndPortfolio(), SPA.loadMarket(), SPA.loadHistory()]); };
        await loadData();
        SPA.setTradeType('BUY');
        window.dashboardInterval = setInterval(loadData, 3000);
        
        document.getElementById('tradeForm')?.addEventListener('submit', SPA.executeTrade);
        document.getElementById('tradeStockSelect')?.addEventListener('change', SPA.updateEstimatedTotal);
        document.getElementById('tradeQuantity')?.addEventListener('input', SPA.updateEstimatedTotal);
    },

    loadProfileAndPortfolio: async () => {
        try {
            const [profRes, portRes] = await Promise.all([
                SPA.fetchAuth(`${API_BASE}/user/profile`),
                SPA.fetchAuth(`${API_BASE}/user/portfolio`)
            ]);
            if(!profRes || !profRes.ok) return;
            const prof = await profRes.json();
            const port = await portRes.json();
            window.userPortfolio = port;

            document.getElementById('balanceValue').innerText = `₹${prof.balance.toFixed(2)}`;
            document.getElementById('topbarBalance').innerText = `₹${prof.balance.toFixed(2)}`;
            const sUsername = document.getElementById('settingsUsername');
            const sEmail = document.getElementById('settingsEmail');
            if(sUsername) sUsername.value = prof.username;
            if(sEmail) sEmail.value = prof.email;
            
            if(prof.role === 'ADMIN') {
                document.getElementById('adminSidebarLink')?.classList.remove('d-none');
            }

            let pVal = 0, pCount = 0, totalPnl = 0;
            let labels = [], data = [], holdingsHtml = '';
            
            port.forEach(p => {
                if(p.quantity > 0) {
                    const val = p.stock.currentPrice * p.quantity;
                    const cost = p.averageBuyPrice * p.quantity;
                    const pnl = val - cost;
                    const pnlClass = pnl >= 0 ? 'text-profit' : 'text-loss';
                    
                    totalPnl += pnl;
                    pVal += val;
                    pCount++;
                    labels.push(p.stock.symbol);
                    data.push(val.toFixed(2));
                    
                    holdingsHtml += `
                        <tr class="align-middle border-bottom border-light">
                            <td>
                                <div class="fw-bold">${p.stock.symbol}</div>
                                <small class="text-muted">${p.stock.name}</small>
                            </td>
                            <td>${p.quantity}</td>
                            <td>₹${p.averageBuyPrice.toFixed(2)}</td>
                            <td>₹${p.stock.currentPrice.toFixed(2)}</td>
                            <td class="${pnlClass} fw-bold">${pnl >= 0 ? '+' : ''}₹${pnl.toFixed(2)}</td>
                        </tr>
                    `;
                }
            });
            const hlEl = document.getElementById('holdingsList');
            if(hlEl) { hlEl.innerHTML = holdingsHtml || `<tr><td colspan="5" class="text-center text-muted py-4">No holdings yet.</td></tr>`; }
            document.getElementById('portfolioValue').innerText = `₹${(pVal).toFixed(2)}`;
            const pnlEl = document.getElementById('totalPnl');
            if(pnlEl) {
                pnlEl.innerText = `${totalPnl >= 0 ? '+' : ''}₹${totalPnl.toFixed(2)}`;
                pnlEl.className = `stat-value ${totalPnl >= 0 ? 'text-profit' : 'text-loss'}`;
            }
            document.getElementById('positionsCount').innerText = pCount;

            labels.push('Cash');
            data.push(prof.balance.toFixed(2));

            const ctx = document.getElementById('portfolioChart');
            if(ctx) {
                if(window.pChart && window.pChart.canvas !== ctx) {
                    window.pChart.destroy();
                    window.pChart = null;
                }
                
                if(window.pChart) {
                    window.pChart.data.labels = labels;
                    window.pChart.data.datasets[0].data = data;
                    window.pChart.update();
                } else {
                    window.pChart = new Chart(ctx, {
                        type: 'doughnut',
                        data: { labels, datasets: [{ data, backgroundColor: ['#2962FF', '#089981', '#F23645', '#E2A111', '#B2B5BE'], borderWidth: 0 }] },
                        options: { responsive: true, maintainAspectRatio: false, cutout: '75%', plugins: { legend: { position: 'right', labels: { color: '#1E2329' } }, tooltip: { animation: false } }, animation: false }
                    });
                }
            }
        } catch(e) {}
    },

    loadMarket: async () => {
        try {
            const res = await SPA.fetchAuth(`${API_BASE}/stocks`);
            if(!res || !res.ok) return;
            const stocks = await res.json();
            window.availableStocks = stocks;
            
            let html = '';
            stocks.forEach(s => {
                const change = s.currentPrice - s.previousClose;
                const pct = (change / s.previousClose) * 100;
                const colorClass = change >= 0 ? 'text-profit' : 'text-loss';
                const sign = change >= 0 ? '+' : '';
                html += `
                    <div class="d-flex justify-content-between align-items-center p-3 mb-2 rounded" style="background: rgba(0,0,0,0.02); border: 1px solid var(--card-border);">
                        <div><div class="fw-bold">${s.symbol}</div><small class="text-muted">${s.name}</small></div>
                        <div class="text-end"><div class="fw-bold">₹${s.currentPrice.toFixed(2)}</div><small class="${colorClass}">${sign}${pct.toFixed(2)}%</small></div>
                    </div>
                `;
            });
            document.getElementById('marketList').innerHTML = html;
            
            // Only update prices in dropdown without recreating options
            const sel = document.getElementById('tradeStockSelect');
            if(sel && sel.options.length > 0) {
                Array.from(sel.options).forEach(opt => {
                    if(opt.disabled) return;
                    const sid = parseInt(opt.value);
                    const s = stocks.find(x => x.id === sid);
                    if(s) {
                        opt.dataset.price = s.currentPrice;
                        if(document.getElementById('tradeType').value === 'BUY') {
                            opt.innerText = `${s.symbol} - ₹${s.currentPrice.toFixed(2)}`;
                        } else {
                            const p = window.userPortfolio?.find(x => x.stock.id === sid);
                            if(p) opt.innerText = `${s.symbol} - ₹${s.currentPrice.toFixed(2)} (${p.quantity} shares)`;
                        }
                    }
                });
                SPA.updateEstimatedTotal();
            }
        } catch(e) {}
    },

    loadHistory: async () => {
        try {
            const res = await SPA.fetchAuth(`${API_BASE}/user/transactions`);
            if(!res || !res.ok) return;
            const history = await res.json();
            const list = document.getElementById('historyList');
            if(!list) return;
            
            if(history.length === 0) {
                list.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-4">No transactions yet.</td></tr>`;
                return;
            }
            
            let html = '';
            history.forEach(t => {
                const date = new Date(t.timestamp).toLocaleString();
                const typeClass = t.type === 'BUY' ? 'text-profit' : 'text-loss';
                const total = t.price * t.quantity;
                html += `
                    <tr>
                        <td class="text-muted small">${date}</td>
                        <td class="fw-bold ${typeClass}">${t.type}</td>
                        <td class="fw-bold">${t.stock.symbol}</td>
                        <td>${t.quantity}</td>
                        <td>₹${t.price.toFixed(2)}</td>
                        <td class="fw-bold">₹${total.toFixed(2)}</td>
                    </tr>
                `;
            });
            list.innerHTML = html;
        } catch(e) {}
    },

    loadAdminUsers: async () => {
        try {
            const res = await SPA.fetchAuth(`${API_BASE}/admin/users`);
            if(!res || !res.ok) return;
            const users = await res.json();
            const list = document.getElementById('adminUserList');
            if(!list) return;
            
            if(users.length === 0) {
                list.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-4">No users found.</td></tr>`;
                return;
            }
            
            let html = '';
            users.forEach(u => {
                const isBtnDisabled = u.role === 'ADMIN' ? 'disabled' : '';
                html += `
                    <tr>
                        <td class="text-muted small">#${u.id}</td>
                        <td class="fw-bold">${u.username}</td>
                        <td>${u.email}</td>
                        <td><span class="badge ${u.role === 'ADMIN' ? 'bg-warning text-dark' : 'bg-secondary'}">${u.role}</span></td>
                        <td class="fw-bold">₹${u.balance.toFixed(2)}</td>
                        <td class="text-end">
                            <button class="btn btn-sm btn-outline-danger" onclick="SPA.deleteUser(${u.id})" ${isBtnDisabled}><i class="bi bi-trash-fill"></i></button>
                        </td>
                    </tr>
                `;
            });
            list.innerHTML = html;
        } catch(e) {}
    },

    deleteUser: async (id) => {
        if(!confirm("Are you sure you want to permanently delete this user? This action cannot be undone.")) return;
        try {
            const res = await SPA.fetchAuth(`${API_BASE}/admin/users/${id}`, { method: 'DELETE' });
            if(res.ok) {
                SPA.showToast("User deleted successfully.", "success");
                SPA.loadAdminUsers();
            } else {
                const data = await res.json();
                SPA.showToast(data.message || "Failed to delete user.", "error");
            }
        } catch(e) {
            SPA.showToast("Network error.", "error");
        }
    },

    setTradeType: (type) => {
        document.getElementById('tradeType').value = type;
        const btn = document.getElementById('tradeBtn');
        const sel = document.getElementById('tradeStockSelect');
        
        if(type === 'BUY') {
            btn.innerText = 'Place Buy Order';
            btn.className = 'btn btn-success w-100 py-3 fw-bold rounded-3';
            sel.innerHTML = '';
            window.availableStocks?.forEach(s => sel.innerHTML += `<option value="${s.id}" data-price="${s.currentPrice}">${s.symbol} - ₹${s.currentPrice}</option>`);
        } else {
            btn.innerText = 'Place Sell Order';
            btn.className = 'btn btn-danger w-100 py-3 fw-bold rounded-3';
            sel.innerHTML = '';
            window.userPortfolio?.forEach(p => {
                if(p.quantity > 0) sel.innerHTML += `<option value="${p.stock.id}" data-price="${p.stock.currentPrice}">${p.stock.symbol} - ₹${p.stock.currentPrice} (${p.quantity} shares)</option>`;
            });
            if(sel.innerHTML === '') sel.innerHTML = `<option disabled selected>No shares to sell</option>`;
        }
        SPA.updateEstimatedTotal();
    },

    updateEstimatedTotal: () => {
        const sel = document.getElementById('tradeStockSelect');
        if(!sel || sel.selectedIndex === -1 || sel.value === '') {
            document.getElementById('tradeEstimatedTotal').innerText = '₹0.00'; return;
        }
        const price = parseFloat(sel.options[sel.selectedIndex].dataset.price);
        const qty = parseInt(document.getElementById('tradeQuantity').value) || 0;
        document.getElementById('tradeEstimatedTotal').innerText = `₹${(price * qty).toFixed(2)}`;
    },

    executeTrade: async (e) => {
        e.preventDefault();
        const type = document.getElementById('tradeType').value;
        const stockId = document.getElementById('tradeStockSelect').value;
        const qty = document.getElementById('tradeQuantity').value;
        
        try {
            const endpoint = type === 'BUY' ? '/user/trade/buy' : '/user/trade/sell';
            const res = await SPA.fetchAuth(`${API_BASE}${endpoint}`, {
                method: 'POST', body: JSON.stringify({ stockId, quantity: parseInt(qty) })
            });
            const data = await res.json();
            
            const msg = document.getElementById('tradeMessage');
            msg.innerText = data.message;
            msg.classList.remove('d-none');
            msg.className = res.ok ? 'small mt-3 text-center text-profit' : 'small mt-3 text-center text-loss';
            
            if(res.ok) {
                await SPA.loadProfileAndPortfolio();
                setTimeout(() => { bootstrap.Modal.getInstance(document.getElementById('tradeModal')).hide(); msg.classList.add('d-none'); }, 1500);
            }
        } catch(err) {}
    }
};
