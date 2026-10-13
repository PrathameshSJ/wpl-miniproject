/**
 * BakeEase Auth — login, register, logout, session management
 */

async function login(email, password) {
    const data = await apiFetch('/auth.php?action=login', {
        method: 'POST',
        body: { email, password },
    });
    localStorage.setItem('bakeease_token', data.token);
    localStorage.setItem('bakeease_user', JSON.stringify(data.user));
    return data;
}

async function register(formData) {
    const data = await apiFetch('/auth.php?action=register', {
        method: 'POST',
        body: formData,
    });
    localStorage.setItem('bakeease_token', data.token);
    localStorage.setItem('bakeease_user', JSON.stringify(data.user));
    return data;
}

function logout() {
    localStorage.removeItem('bakeease_token');
    localStorage.removeItem('bakeease_user');
    localStorage.removeItem('bakeease_cart');
    window.location.href = 'login.html';
}

function isLoggedIn() {
    return !!localStorage.getItem('bakeease_token');
}

function getUser() {
    try { return JSON.parse(localStorage.getItem('bakeease_user')); }
    catch { return null; }
}

function getToken() {
    return localStorage.getItem('bakeease_token');
}

function isAdmin() {
    const user = getUser();
    return user && user.role === 'admin';
}

function requireLogin() {
    if (!isLoggedIn()) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}
