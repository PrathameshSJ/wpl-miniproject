/**
 * BakeEase Admin Customers — dynamic customer list with JWT auth
 */

document.addEventListener('DOMContentLoaded', async () => {
    await loadAdminComponents();
    setActiveSidebarLink('customers.html');
    loadCustomers();
});

async function loadCustomers() {
    const tbody = document.querySelector('tbody');
    if (!tbody) return;
    try {
        const customers = await adminFetch('/customers.php');
        if (!customers.length) {
            tbody.innerHTML = '<tr><td colspan="7" class="px-6 py-12 text-center text-on-surface-variant">No customers found</td></tr>';
            document.querySelector('.text-xs.text-stone-500').textContent = 'Showing 0 customers';
            return;
        }

        const getInitials = (name) => {
            if (!name) return '??';
            const parts = name.split(' ');
            if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
            return name.substring(0, 2).toUpperCase();
        };

        const colors = [
            'bg-orange-100 text-primary',
            'bg-stone-200 text-stone-600',
            'bg-secondary-container/20 text-secondary',
            'bg-primary-container/20 text-primary',
            'bg-tertiary-fixed-dim/40 text-tertiary'
        ];

        tbody.innerHTML = customers.map((c, i) => {
            const date = new Date(c.created_at).toLocaleDateString('en-IN', { month: 'short', day: '2-digit', year: 'numeric' });
            const colorCls = colors[i % colors.length];
            const initials = getInitials(c.full_name);
            const isAdmin = c.role === 'admin';
            const statusColor = isAdmin ? 'bg-orange-600' : 'bg-stone-300';
            const statusAlign = isAdmin ? 'right-0.5' : 'left-0.5';

            return `<tr class="hover:bg-stone-50/50 transition-colors">
                <td class="px-6 py-4">
                    <div class="flex items-center gap-4">
                        <div class="w-10 h-10 rounded-full ${colorCls} flex items-center justify-center font-bold text-sm">${initials}</div>
                        <div>
                            <div class="text-sm font-semibold text-stone-900">${c.full_name}</div>
                            <div class="text-xs text-stone-500">${c.tier}</div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 text-sm text-stone-600">
                    <div>${c.email}</div>
                    <div class="text-xs text-stone-400 mt-0.5">${c.phone || '-'}</div>
                </td>
                <td class="px-6 py-4 text-sm font-medium text-stone-700">${c.total_orders}</td>
                <td class="px-6 py-4 text-sm font-bold text-primary">₹${Number(c.total_spend).toLocaleString('en-IN')}</td>
                <td class="px-6 py-4 text-sm text-stone-500">${date}</td>
                <td class="px-6 py-4">
                    <button onclick="toggleAdminStatus(${c.user_id}, '${isAdmin ? 'customer' : 'admin'}')" class="w-10 h-5 ${statusColor} rounded-full relative transition-colors cursor-pointer" title="${isAdmin ? 'Revoke Admin' : 'Make Admin'}">
                        <span class="absolute ${statusAlign} top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all"></span>
                    </button>
                </td>
                <td class="px-6 py-4 text-right">
                    <button class="text-stone-400 hover:text-primary transition-colors p-1" onclick="adminToast('View details coming soon', 'info')">
                        <span class="material-symbols-outlined" data-icon="visibility">visibility</span>
                    </button>
                </td>
            </tr>`;
        }).join('');

        const countText = document.querySelector('.text-xs.text-stone-500');
        if (countText) countText.textContent = `Showing ${customers.length} of ${customers.length} customers`;

        // Update top cards
        const topCards = document.querySelectorAll('.grid > div > h4');
        if (topCards.length >= 3) {
            topCards[0].textContent = customers.length; // Total customers
            const activeCount = customers.filter(c => c.total_orders > 0).length;
            topCards[1].textContent = activeCount; // Active
            
            const totalRevenue = customers.reduce((sum, c) => sum + Number(c.total_spend), 0);
            const avgVal = customers.length ? (totalRevenue / customers.length) : 0;
            topCards[2].textContent = `₹${Math.round(avgVal).toLocaleString('en-IN')}`;
        }
    } catch (err) { console.error('Customers load failed:', err); }
}

async function toggleAdminStatus(userId, newRole) {
    if (!confirm(`Are you sure you want to make this user a ${newRole}?`)) return;
    try {
        await adminFetch(`/customers.php?id=${userId}`, {
            method: 'PUT',
            body: { role: newRole }
        });
        adminToast(`User is now ${newRole}`, 'success');
        loadCustomers();
    } catch (err) {
        adminToast('Failed: ' + err.message, 'error');
    }
}
