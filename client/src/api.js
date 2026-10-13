/**
 * Central API fetch utility
 */
const API_BASE = '/api';

export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem('bakeease_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  // If sending FormData (e.g. file uploads), delete Content-Type so browser sets boundary
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  } else if (options.body && typeof options.body === 'object') {
    options.body = JSON.stringify(options.body);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401 && token) {
    // Session expired
    localStorage.removeItem('bakeease_token');
    localStorage.removeItem('bakeease_user');
    window.dispatchEvent(new Event('auth-expired'));
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `HTTP ${response.status}`);
  }

  return data;
}

export function getImageUrl(imagePath) {
  if (!imagePath) return '/images/chocolate-truffle-cake.png';
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath;
  if (imagePath.startsWith('/')) return imagePath;
  return `/images/${imagePath}`;
}
