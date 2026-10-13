/**
 * BakeEase API Client
 * Central fetch wrapper with JWT injection and error handling
 */
const API_BASE = '/bakeease/server/api';

async function apiFetch(endpoint, options = {}) {
    const token = localStorage.getItem('bakeease_token');
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            ...(options.headers || {}),
        },
        ...options,
    };
    if (options.body && typeof options.body === 'string') {
        config.body = options.body;
    } else if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
        config.body = JSON.stringify(options.body);
    }

    const res = await fetch(`${API_BASE}${endpoint}`, config);

    // Only treat 401 as session-expired if we HAD a token (i.e. user was logged in)
    if (res.status === 401 && token) {
        localStorage.removeItem('bakeease_token');
        localStorage.removeItem('bakeease_user');
        // Only redirect if we're not already on login page
        if (!window.location.pathname.includes('login')) {
            window.location.href = window.location.pathname.includes('/admin/')
                ? '../client/login.html'
                : 'login.html';
        }
        throw new Error('Session expired');
    }

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error || `HTTP ${res.status}`);
    }

    return data;
}
