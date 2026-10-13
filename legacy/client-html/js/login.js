/**
 * BakeEase Login/Register — handles login form, register form, admin redirect
 */

function toggleAuth(type) {
    const isLogin = type === 'login';
    document.getElementById('login-section').classList.toggle('hidden', !isLogin);
    document.getElementById('register-section').classList.toggle('hidden', isLogin);

    const loginTab = document.getElementById('tab-login');
    const regTab = document.getElementById('tab-register');
    loginTab.className = isLogin
        ? "flex-1 py-3 text-sm font-semibold border-b-2 border-primary text-primary transition-all"
        : "flex-1 py-3 text-sm font-semibold text-on-surface-variant hover:text-primary transition-all";
    regTab.className = !isLogin
        ? "flex-1 py-3 text-sm font-semibold border-b-2 border-primary text-primary transition-all"
        : "flex-1 py-3 text-sm font-semibold text-on-surface-variant hover:text-primary transition-all";
}

document.addEventListener('DOMContentLoaded', () => {
    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = loginForm.querySelector('button[type="submit"]');
            const email = loginForm.querySelector('input[type="email"]').value;
            const password = loginForm.querySelector('input[type="password"]').value;
            btn.textContent = 'Signing in...';
            btn.disabled = true;
            try {
                const data = await login(email, password);
                if (typeof showToast === 'function') showToast('Welcome back!', 'success');
                // Redirect based on role
                if (data.user && data.user.role === 'admin') {
                    setTimeout(() => window.location.href = '../admin/dashboard.html', 400);
                } else {
                    setTimeout(() => window.location.href = 'home.html', 400);
                }
            } catch (err) {
                if (typeof showToast === 'function') showToast(err.message || 'Login failed', 'error');
                btn.textContent = 'Login to Kitchen';
                btn.disabled = false;
            }
        });
    }

    // Register form
    const regForm = document.getElementById('register-form');
    if (regForm) {
        regForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = regForm.querySelector('button[type="submit"]');
            const inputs = regForm.querySelectorAll('input');
            const data = {
                full_name: inputs[0].value,
                phone: inputs[1].value,
                email: inputs[2].value,
                password: inputs[3].value,
            };
            if (!data.full_name || !data.email || !data.password) {
                if (typeof showToast === 'function') showToast('Please fill all required fields', 'error');
                return;
            }
            btn.textContent = 'Creating account...';
            btn.disabled = true;
            try {
                await register(data);
                if (typeof showToast === 'function') showToast('Account created! Welcome to BakeEase!', 'success');
                setTimeout(() => window.location.href = 'home.html', 400);
            } catch (err) {
                if (typeof showToast === 'function') showToast(err.message || 'Registration failed', 'error');
                btn.textContent = 'Create Account';
                btn.disabled = false;
            }
        });
    }
});
