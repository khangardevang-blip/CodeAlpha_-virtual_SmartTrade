const Components = {
    Login: () => `
        <div class="d-flex align-items-center justify-content-center w-100 min-vh-100 fade-in">
            <div class="glass-card p-5 text-center" style="max-width: 400px; width: 100%;">
                <h2 class="fw-bold mb-4"><span class="text-gradient">Smart</span>Trade</h2>
                <form id="loginForm">
                    <div class="mb-3">
                        <input type="text" class="form-control py-2" id="loginUsername" placeholder="Username" required>
                    </div>
                    <div class="mb-4">
                        <input type="password" class="form-control py-2" id="loginPassword" placeholder="Password" required>
                    </div>
                    <button type="submit" class="btn btn-primary w-100 py-2 fw-bold">Sign In</button>
                    <div id="loginError" class="text-loss small mt-3 d-none"></div>
                </form>
                <div class="mt-4 small text-muted">
                    New to SmartTrade? <a href="#register" class="fw-bold text-decoration-none">Create an account</a>
                </div>
            </div>
        </div>
    `,
    Register: () => `
        <div class="d-flex align-items-center justify-content-center w-100 min-vh-100 fade-in">
            <div class="glass-card p-5 text-center" style="max-width: 400px; width: 100%;">
                <h2 class="fw-bold mb-4"><span class="text-gradient">Smart</span>Trade</h2>
                <p class="text-muted small mb-4">Join the future of trading</p>
                <form id="registerForm">
                    <div class="mb-3">
                        <input type="text" class="form-control py-2" id="regUsername" placeholder="Choose Username" required>
                    </div>
                    <div class="mb-3">
                        <input type="email" class="form-control py-2" id="regEmail" placeholder="Email Address" required>
                    </div>
                    <div class="mb-4">
                        <input type="password" class="form-control py-2" id="regPassword" placeholder="Create Password" required>
                    </div>
                    <button type="submit" class="btn btn-primary w-100 py-2 fw-bold">Sign Up</button>
                    <div id="regMessage" class="small mt-3 d-none"></div>
                </form>
                <div class="mt-4 small text-muted">
                    Already have an account? <a href="#login" class="fw-bold text-decoration-none">Sign In</a>
                </div>
            </div>
        </div>
    `,
    DashboardView: () => `
        <div class="app-container fade-in">
            <nav class="sidebar">
                <a href="#dashboard" class="sidebar-brand">
                    <i class="bi bi-graph-up-arrow text-profit"></i> <span class="text-gradient">Smart</span>Trade
                </a>
                <ul class="sidebar-menu">
                    <li><a href="#dashboard" class="nav-link-item"><i class="bi bi-grid-1x2-fill"></i> Dashboard</a></li>
                    <li><a href="#portfolio" class="nav-link-item"><i class="bi bi-pie-chart-fill"></i> Portfolio</a></li>
                    <li><a href="#market" class="nav-link-item"><i class="bi bi-activity"></i> Market</a></li>
                    <li><a href="#history" class="nav-link-item"><i class="bi bi-clock-history"></i> History</a></li>
                    <li><a href="#settings" class="nav-link-item"><i class="bi bi-gear-fill"></i> Settings</a></li>
                    <li id="adminSidebarLink" class="d-none"><a href="#admin" class="nav-link-item text-warning"><i class="bi bi-shield-lock-fill"></i> Admin Panel</a></li>
                </ul>
                <div class="sidebar-bottom mt-auto p-4 d-flex align-items-center gap-3">
                    <div class="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold" style="width:40px;height:40px" id="sidebarAvatar">U</div>
                    <div style="line-height:1.2;">
                        <div class="fw-bold" id="sidebarUsername">User</div>
                        <small class="text-profit">Online</small>
                    </div>
                </div>
            </nav>
            <div class="main-content w-100">
                <header class="topbar">
                    <input type="text" class="search-bar" placeholder="Search markets...">
                    <div class="d-flex align-items-center gap-4">
                        <div class="d-none d-md-flex gap-4 small fw-bold">
                            <div>S&P 500 <span class="text-profit ms-1"><i class="bi bi-caret-up-fill"></i> 0.8%</span></div>
                            <div>NASDAQ <span class="text-profit ms-1"><i class="bi bi-caret-up-fill"></i> 1.2%</span></div>
                        </div>
                        <div class="dropdown">
                            <button class="btn btn-link text-muted position-relative" data-bs-toggle="dropdown">
                                <i class="bi bi-bell fs-5"></i>
                                <span class="position-absolute top-25 start-75 translate-middle p-1 bg-danger border border-light rounded-circle"></span>
                            </button>
                            <ul class="dropdown-menu dropdown-menu-end glass-card p-3 shadow" style="width: 250px;">
                                <li><h6 class="dropdown-header fw-bold">Notifications</h6></li>
                                <li><hr class="dropdown-divider"></li>
                                <li class="text-center text-muted small py-3">No new notifications</li>
                            </ul>
                        </div>
                        <div class="dropdown">
                            <button class="btn btn-link text-decoration-none d-flex align-items-center gap-2" style="color: var(--text-primary);" data-bs-toggle="dropdown">
                                <span class="fw-bold" id="topbarBalance">₹0.00</span> <i class="bi bi-chevron-down small"></i>
                            </button>
                            <ul class="dropdown-menu dropdown-menu-end glass-card p-2">
                                <li><a class="dropdown-item" href="#settings">Settings</a></li>
                                <li><a class="dropdown-item text-loss" href="#" id="logoutBtn">Logout</a></li>
                            </ul>
                        </div>
                    </div>
                </header>
                <main class="p-4" id="page-content">
                    <div class="row g-4 mb-4">
                        <div class="col-md-3"><div class="glass-card stat-card"><div class="stat-title">Cash Balance</div><div class="stat-value" id="balanceValue">₹0.00</div></div></div>
                        <div class="col-md-3"><div class="glass-card stat-card"><div class="stat-title">Portfolio Value</div><div class="stat-value" id="portfolioValue">₹0.00</div></div></div>
                        <div class="col-md-3"><div class="glass-card stat-card"><div class="stat-title">Total P&L</div><div class="stat-value" id="totalPnl">₹0.00</div></div></div>
                        <div class="col-md-3"><div class="glass-card stat-card"><div class="stat-title">Positions</div><div class="stat-value" id="positionsCount">0</div></div></div>
                    </div>
                    <div class="row g-4" id="mainPanelsRow">
                        <div class="col-lg-8" id="portfolioSection">
                            <div class="glass-card p-4 mb-4">
                                <h5 class="fw-bold mb-4">Portfolio Allocation</h5>
                                <div style="position: relative; height: 300px; width: 100%;">
                                    <canvas id="portfolioChart"></canvas>
                                </div>
                            </div>
                            <div class="glass-card p-4">
                                <h5 class="fw-bold mb-4">Your Holdings</h5>
                                <div class="table-responsive">
                                    <table class="table table-hover border-transparent">
                                        <thead>
                                            <tr class="text-muted small">
                                                <th>ASSET</th>
                                                <th>QTY</th>
                                                <th>AVG PRICE</th>
                                                <th>LTP</th>
                                                <th>P&L</th>
                                            </tr>
                                        </thead>
                                        <tbody id="holdingsList">
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-4" id="marketSection">
                            <div class="glass-card p-4 h-100">
                                <div class="d-flex justify-content-between align-items-center mb-4">
                                    <h5 class="fw-bold mb-0">Market</h5>
                                    <button class="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#tradeModal">Trade</button>
                                </div>
                                <div id="marketList">Loading...</div>
                            </div>
                        </div>
                        <div class="col-lg-12 d-none" id="historySection">
                            <div class="glass-card p-4">
                                <h5 class="fw-bold mb-4">Transaction History</h5>
                                <div class="table-responsive">
                                    <table class="table table-hover border-transparent">
                                        <thead>
                                            <tr class="text-muted small">
                                                <th>DATE</th>
                                                <th>TYPE</th>
                                                <th>ASSET</th>
                                                <th>QTY</th>
                                                <th>PRICE</th>
                                                <th>TOTAL</th>
                                            </tr>
                                        </thead>
                                        <tbody id="historyList">
                                            <tr><td colspan="6" class="text-center text-muted py-4">Loading history...</td></tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-12 d-none" id="settingsSection">
                            <div class="glass-card p-5 text-center">
                                <h3 class="fw-bold mb-3">Settings</h3>
                                <p class="text-muted mb-4">Manage your account preferences</p>
                                <div class="mx-auto text-start" style="max-width: 500px;">
                                    <div class="mb-3">
                                        <label class="form-label text-muted small fw-bold">USERNAME</label>
                                        <input type="text" class="form-control" id="settingsUsername" readonly>
                                    </div>
                                    <div class="mb-4">
                                        <label class="form-label text-muted small fw-bold">EMAIL</label>
                                        <input type="email" class="form-control" id="settingsEmail" readonly>
                                    </div>
                                    <button class="btn btn-primary w-100 py-2 fw-bold disabled" disabled>Update Preferences</button>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-12 d-none" id="adminSection">
                            <div class="glass-card p-4 border border-warning" style="background: rgba(255, 193, 7, 0.05);">
                                <div class="d-flex justify-content-between align-items-center mb-4">
                                    <h5 class="fw-bold mb-0 text-warning"><i class="bi bi-shield-lock-fill"></i> Admin Panel - User Management</h5>
                                    <button class="btn btn-sm btn-outline-warning" onclick="SPA.loadAdminUsers()"><i class="bi bi-arrow-clockwise"></i> Refresh</button>
                                </div>
                                <div class="table-responsive">
                                    <table class="table table-hover border-transparent align-middle">
                                        <thead>
                                            <tr class="text-muted small">
                                                <th>ID</th>
                                                <th>USERNAME</th>
                                                <th>EMAIL</th>
                                                <th>ROLE</th>
                                                <th>BALANCE</th>
                                                <th class="text-end">ACTION</th>
                                            </tr>
                                        </thead>
                                        <tbody id="adminUserList">
                                            <tr><td colspan="6" class="text-center text-muted py-4">Loading users...</td></tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
        
        <!-- Trade Modal -->
        <div class="modal fade" id="tradeModal" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content glass-card">
                    <div class="modal-header border-0 pb-0">
                        <ul class="nav nav-tabs border-0 w-100" id="tradeTypeTabs">
                            <li class="nav-item flex-fill text-center"><button class="nav-link active w-100 fw-bold border-0 bg-transparent" style="color: var(--text-primary);" data-bs-toggle="tab" data-bs-target="#buyTab" onclick="SPA.setTradeType('BUY')">BUY</button></li>
                            <li class="nav-item flex-fill text-center"><button class="nav-link text-muted w-100 fw-bold border-0 bg-transparent" data-bs-toggle="tab" data-bs-target="#sellTab" onclick="SPA.setTradeType('SELL')">SELL</button></li>
                        </ul>
                    </div>
                    <div class="modal-body p-4 pt-3">
                        <form id="tradeForm">
                            <input type="hidden" id="tradeType" value="BUY">
                            <div class="mb-3">
                                <label class="form-label text-muted small fw-bold">ASSET</label>
                                <select class="form-select bg-transparent border-secondary" style="color: var(--text-primary);" id="tradeStockSelect"></select>
                            </div>
                            <div class="mb-4">
                                <label class="form-label text-muted small fw-bold">QUANTITY</label>
                                <input type="number" class="form-control bg-transparent border-secondary" style="color: var(--text-primary);" id="tradeQuantity" min="1" value="1">
                            </div>
                            <div class="d-flex justify-content-between align-items-center mb-4">
                                <span class="text-muted small fw-bold">ESTIMATED TOTAL</span>
                                <span class="fw-bold fs-5" id="tradeEstimatedTotal">₹0.00</span>
                            </div>
                            <button type="submit" class="btn btn-primary w-100 py-3 fw-bold rounded-3" id="tradeBtn">Review Order</button>
                            <div id="tradeMessage" class="small mt-3 text-center d-none"></div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `
};
window.Components = Components;
