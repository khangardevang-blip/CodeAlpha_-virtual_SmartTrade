class Router {
    constructor(routes) {
        this.routes = routes;
        this.appElement = document.getElementById('app');
        window.addEventListener('hashchange', () => this.handleRoute());
        window.addEventListener('load', () => this.handleRoute());
        // Call immediately in case load already fired
        this.handleRoute();
    }

    handleRoute() {
        if(window.dashboardInterval) {
            clearInterval(window.dashboardInterval);
            window.dashboardInterval = null;
        }
        let hash = window.location.hash.slice(1) || 'login';
        
        const isLoggedIn = !!localStorage.getItem('smarttrade_token');
        if (isLoggedIn && (hash === 'login' || hash === 'register')) {
            window.location.hash = 'dashboard';
            return;
        }
        if (!isLoggedIn && hash !== 'login' && hash !== 'register') {
            window.location.hash = 'login';
            return;
        }

        const component = this.routes[hash] || this.routes['login'];
        this.appElement.innerHTML = component();
        
        if (window.SPA && window.SPA.onRouteLoad) {
            window.SPA.onRouteLoad(hash);
        }
    }
}

const routes = {
    'login': Components.Login,
    'register': Components.Register,
    'dashboard': Components.DashboardView,
    'market': Components.DashboardView,
    'portfolio': Components.DashboardView,
    'history': Components.DashboardView,
    'settings': Components.DashboardView,
    'admin': Components.DashboardView
};

window.router = new Router(routes);
