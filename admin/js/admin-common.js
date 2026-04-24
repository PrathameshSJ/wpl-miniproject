/**
 * BakeEase Admin Common — shared utilities for all admin pages
 * Must be loaded BEFORE page-specific admin JS files.
 */
const ADMIN_API = '/bakeease/server/api';

/* ── Admin Auth ──────────────────────────────────────────── */

function getAdminToken() {
    return localStorage.getItem('bakeease_token');
}

function getAdminUser() {
    try { return JSON.parse(localStorage.getItem('bakeease_user')); }
    catch { return null; }
}

function adminLogout() {
    localStorage.removeItem('bakeease_token');
    localStorage.removeItem('bakeease_user');
    localStorage.removeItem('bakeease_cart');
    window.location.href = '../client/login.html';
}

/** Authenticated fetch wrapper for admin API calls */
async function adminFetch(endpoint, options = {}) {
    const token = getAdminToken();
    if (!token) {
        adminLogout();
        throw new Error('Not authenticated');
    }
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            ...(options.headers || {}),
        },
        ...options,
    };
    if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
        config.body = JSON.stringify(options.body);
    }

    const res = await fetch(`${ADMIN_API}${endpoint}`, config);

    if (res.status === 401 || res.status === 403) {
        adminLogout();
        throw new Error('Admin access denied');
    }

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
    return data;
}

/* ── Admin Component Loading ─────────────────────────────── */

async function loadAdminComponents() {
    const sc = document.getElementById('sidebar-container');
    const tc = document.getElementById('topbar-container');
    await Promise.all([
        sc ? fetch('components/sidebar.html').then(r => r.text()).then(h => sc.innerHTML = h) : Promise.resolve(),
        tc ? fetch('components/topbar.html').then(r => r.text()).then(h => {
            tc.innerHTML = h;
            // Dynamic greeting + date
            const user = getAdminUser();
            const greetEl = document.getElementById('topbar-greeting');
            const dateEl = document.getElementById('topbar-date');
            if (greetEl && user) greetEl.textContent = `Good ${getTimeOfDay()}, ${user.full_name?.split(' ')[0] || 'Admin'} 👋`;
            if (dateEl) dateEl.textContent = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        }) : Promise.resolve(),
    ]);
}

function getTimeOfDay() {
    const h = new Date().getHours();
    if (h < 12) return 'morning';
    if (h < 17) return 'afternoon';
    return 'evening';
}

function setActiveSidebarLink(href) {
    const sidebar = document.querySelector('#sidebar-container aside');
    if (!sidebar) return;
    const inactive = 'text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-lg mx-2 my-1 px-4 py-2 flex items-center gap-3 transition-colors';
    const active = 'bg-primary text-on-primary rounded-lg mx-2 my-1 px-4 py-2 flex items-center gap-3 shadow-md';
    sidebar.querySelectorAll('nav a[href$=".html"]').forEach(l => l.className = inactive);
    const aLink = sidebar.querySelector(`nav a[href="${href}"]`);
    if (aLink) aLink.className = active;
}

/* ── Admin Toast ──────────────────────────────────────────── */

function adminToast(message, type = 'info', duration = 3000) {
    let container = document.querySelector('.admin-toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'admin-toast-container';
        container.style.cssText = 'position:fixed;top:80px;right:24px;z-index:9999;display:flex;flex-direction:column;gap:8px;';
        document.body.appendChild(container);
    }
    const colors = { success: '#059669', error: '#dc2626', info: '#2563eb' };
    const icons = { success: '✓', error: '✕', info: 'ℹ' };
    const toast = document.createElement('div');
    toast.style.cssText = `background:white;border-left:4px solid ${colors[type]||colors.info};padding:12px 20px;border-radius:8px;box-shadow:0 10px 40px rgba(0,0,0,0.12);display:flex;align-items:center;gap:10px;font-size:14px;font-family:Inter,sans-serif;animation:slideIn .3s ease;max-width:360px;`;
    toast.innerHTML = `<span style="color:${colors[type]};font-weight:bold;font-size:16px">${icons[type]}</span><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        toast.style.transition = 'all .3s ease';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}
