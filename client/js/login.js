function toggleAuth(type) {
    const isLogin = type === 'login';

    document.getElementById('login-section')
        .classList.toggle('hidden', !isLogin);
    document.getElementById('register-section')
        .classList.toggle('hidden', isLogin);

    const loginTab = document.getElementById('tab-login');
    const regTab = document.getElementById('tab-register');

    loginTab.className = isLogin
        ? "flex-1 py-3 text-sm font-semibold border-b-2 border-primary text-primary transition-all"
        : "flex-1 py-3 text-sm font-semibold text-on-surface-variant hover:text-primary transition-all";

    regTab.className = !isLogin
        ? "flex-1 py-3 text-sm font-semibold border-b-2 border-primary text-primary transition-all"
        : "flex-1 py-3 text-sm font-semibold text-on-surface-variant hover:text-primary transition-all";
}
