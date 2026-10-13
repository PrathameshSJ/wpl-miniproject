/**
 * BakeEase Admin Orders — dynamic order management with JWT auth
 */

document.addEventListener('DOMContentLoaded', async () => {
    await loadAdminComponents();
    setActiveSidebarLink('orders.html');
    loadOrders();

    // Close dropdowns on outside click
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown-menu') && !e.target.closest('.update-btn')) {
            document.querySelectorAll('.dropdown-menu').forEach(m => m.classList.add('hidden'));
        }
    });
});

async function loadOrders() {
    const tbody = document.getElementById('orders-body');
    if (!tbody) return;
    try {
        const orders = await adminFetch('/orders.php');
        if (!orders.length) {
            tbody.innerHTML = '<tr><td colspan="8" class="px-6 py-12 text-center text-on-surface-variant">No orders yet</td></tr>';
            return;
        }
        tbody.innerHTML = orders.map(o => {
            const statusColors = {
                pending: 'bg-orange-100 text-orange-700',
                baking: 'bg-blue-100 text-blue-700',
                out_for_delivery: 'bg-purple-100 text-purple-700',
                completed: 'bg-emerald-100 text-emerald-700',
                cancelled: 'bg-stone-200 text-stone-600',
            };
            const cls = statusColors[o.status] || 'bg-stone-200 text-stone-600';
            const items = (o.items || []).map(i => `${i.quantity}x ${i.product_name}`).join(', ');
            const date = new Date(o.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
            const payMethod = o.payment ? o.payment.method.toUpperCase() : 'N/A';
            const payColors = { UPI: 'bg-blue-50 text-blue-700', COD: 'bg-stone-100 text-stone-600', CARD: 'bg-green-50 text-green-700' };
            const payCls = payColors[payMethod] || 'bg-stone-100 text-stone-600';
            return `<tr class="hover:bg-surface-container-low/50 transition-colors">
                <td class="px-6 py-5 font-bold text-primary">#BE${String(o.order_id).padStart(4,'0')}</td>
                <td class="px-6 py-5 font-medium">${o.customer_name}</td>
                <td class="px-6 py-5 text-sm text-stone-500">${date}</td>
                <td class="px-6 py-5 text-sm">${items || '-'}</td>
                <td class="px-6 py-5 text-right font-semibold">₹${Number(o.total_amount).toLocaleString('en-IN')}</td>
                <td class="px-6 py-5"><span class="${payCls} text-[10px] font-bold px-2 py-1 rounded uppercase tracking-tighter">${payMethod}</span></td>
                <td class="px-6 py-5"><span class="${cls} px-3 py-1 rounded-full text-[11px] font-bold capitalize">${o.status.replace(/_/g,' ')}</span></td>
                <td class="px-6 py-5 text-center relative">
                    <button class="update-btn text-xs bg-primary text-white border-none rounded-lg cursor-pointer p-1.5 px-3 font-bold flex items-center gap-1" onclick="toggleDropdown(this)">Update <span class="material-symbols-outlined text-xs">expand_more</span></button>
                    <div class="dropdown-menu hidden absolute right-0 mt-2 w-48 bg-white shadow-xl rounded-lg border border-outline-variant/20 py-2 z-10 overflow-hidden">
                        ${['pending','baking','out_for_delivery','completed','cancelled'].map(s =>
                            `<button class="w-full text-left px-4 py-2 text-xs font-semibold hover:bg-surface-container-low capitalize transition-colors" onclick="updateOrderStatus(${o.order_id},'${s}')">${s.replace(/_/g,' ')}</button>`
                        ).join('')}
                    </div>
                </td>
            </tr>`;
        }).join('');
    } catch (err) { console.error('Orders load failed:', err); }
}

function toggleDropdown(btn) {
    const menu = btn.nextElementSibling;
    document.querySelectorAll('.dropdown-menu').forEach(m => { if(m !== menu) m.classList.add('hidden'); });
    menu.classList.toggle('hidden');
}

async function updateOrderStatus(orderId, status) {
    try {
        await adminFetch(`/orders.php?id=${orderId}`, {
            method: 'PATCH',
            body: { status },
        });
        document.querySelectorAll('.dropdown-menu').forEach(m => m.classList.add('hidden'));
        adminToast(`Order #BE${String(orderId).padStart(4,'0')} → ${status.replace(/_/g,' ')}`, 'success');
        loadOrders();
    } catch (err) { adminToast('Failed: ' + err.message, 'error'); }
}
