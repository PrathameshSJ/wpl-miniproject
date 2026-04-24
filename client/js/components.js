/**
 * BakeEase Components — shared navbar/footer injection + toast + user dropdown
 */

async function loadNavbar() {
    const placeholder = document.getElementById('navbar-placeholder');
    if (!placeholder) return;
    try {
        const res = await fetch('components/navbar.html');
        const html = await res.text();
        placeholder.innerHTML = html;
        updateNavAuth();
        highlightActiveNavLink();
        updateCartBadge();
        initUserDropdown();
    } catch (err) {
        console.error('Navbar load failed:', err);
    }
}

async function loadFooter() {
    const placeholder = document.getElementById('footer-placeholder');
    if (!placeholder) return;
    try {
        const res = await fetch('components/footer.html');
        const html = await res.text();
        placeholder.innerHTML = html;
    } catch (err) {
        console.error('Footer load failed:', err);
    }
}

async function loadSidebar() {
    const placeholder = document.getElementById('sidebar-placeholder');
    if (!placeholder) return;
    try {
        const res = await fetch('components/sidebar.html');
        const html = await res.text();
        placeholder.innerHTML = html;
        
        // Let the parent script know sidebar is ready, so it can populate user info
        document.dispatchEvent(new Event('sidebarLoaded'));
    } catch (err) {
        console.error('Sidebar load failed:', err);
    }
}

function updateNavAuth() {
    const authBtn = document.getElementById('nav-auth-btn');
    const userMenu = document.getElementById('nav-user-menu');
    if (!authBtn || !userMenu) return;

    if (isLoggedIn()) {
        const user = getUser();
        authBtn.style.display = 'none';
        userMenu.style.display = 'block';

        const firstName = user?.full_name?.split(' ')[0] || 'User';
        const initials = (user?.full_name || 'U').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

        const nameEl = document.getElementById('nav-user-name');
        const initialsEl = document.getElementById('nav-user-initials');
        const dropdownName = document.getElementById('nav-dropdown-name');
        const dropdownEmail = document.getElementById('nav-dropdown-email');
        const adminLink = document.getElementById('nav-admin-link');

        if (nameEl) nameEl.textContent = firstName;
        if (initialsEl) initialsEl.textContent = initials;
        if (dropdownName) dropdownName.textContent = user?.full_name || 'User';
        if (dropdownEmail) dropdownEmail.textContent = user?.email || '';
        if (adminLink) adminLink.style.display = (user?.role === 'admin') ? 'flex' : 'none';
    } else {
        authBtn.style.display = '';
        userMenu.style.display = 'none';
    }
}

function initUserDropdown() {
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        const dropdown = document.getElementById('nav-dropdown');
        const trigger = document.getElementById('nav-user-trigger');
        if (dropdown && !dropdown.contains(e.target) && !trigger?.contains(e.target)) {
            dropdown.classList.add('hidden');
            const chevron = document.getElementById('nav-chevron');
            if (chevron) chevron.style.transform = '';
        }
    });
}

function toggleUserDropdown(e) {
    e.stopPropagation();
    const dropdown = document.getElementById('nav-dropdown');
    const chevron = document.getElementById('nav-chevron');
    if (!dropdown) return;
    const isHidden = dropdown.classList.toggle('hidden');
    if (chevron) chevron.style.transform = isHidden ? '' : 'rotate(180deg)';
}

function highlightActiveNavLink() {
    const current = window.location.pathname.split('/').pop() || 'home.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === current) {
            link.classList.add('text-orange-700', 'dark:text-orange-400', 'font-bold', 'border-b-2', 'border-orange-700', 'dark:border-orange-400', 'pb-1');
            link.classList.remove('text-stone-600', 'dark:text-stone-400');
        } else {
            link.classList.remove('text-orange-700', 'dark:text-orange-400', 'font-bold', 'border-b-2', 'border-orange-700', 'dark:border-orange-400', 'pb-1');
            link.classList.add('text-stone-600', 'dark:text-stone-400');
        }
    });
}

/* ── Toast ────────────────────────────────────────────────── */

function showToast(message, type = 'info', duration = 3000) {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icon = type === 'success' ? 'check_circle' : type === 'error' ? 'error' : 'info';
    toast.innerHTML = `<span class="material-symbols-outlined" style="font-size:20px">${icon}</span>${message}`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'toastOut .3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

/* ── Cart Badge ───────────────────────────────────────────── */

function updateCartBadge() {
    try {
        const cart = JSON.parse(localStorage.getItem('bakeease_cart') || '[]');
        const count = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        const badge = document.querySelector('.cart-badge');
        if (badge) {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        }
    } catch { /* ignore */ }
}

/* ── Init ─────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
    loadNavbar();
    loadFooter();
    loadSidebar();
});
