/**
 * BakeEase Admin Dashboard — dynamic stats from API
 */

document.addEventListener('DOMContentLoaded', async () => {
    await loadAdminComponents();
    setActiveSidebarLink('dashboard.html');
    loadDashboardData();
});

async function loadDashboardData() {
    try {
        const data = await adminFetch('/dashboard.php');

        // Stat cards
        const cards = document.querySelectorAll('.stat-value');
        if (cards[0]) cards[0].textContent = '₹' + Number(data.today_revenue).toLocaleString('en-IN');
        if (cards[1]) cards[1].textContent = data.today_orders;
        if (cards[2]) cards[2].textContent = data.pending_orders;
        if (cards[3]) cards[3].textContent = data.low_stock_count;

        // Recent orders table
        const tbody = document.getElementById('recent-orders-body');
        if (tbody && data.recent_orders) {
            tbody.innerHTML = data.recent_orders.map(o => {
                const statusColors = {
                    pending: 'bg-orange-100 text-orange-700',
                    baking: 'bg-blue-100 text-blue-700',
                    out_for_delivery: 'bg-purple-100 text-purple-700',
                    completed: 'bg-emerald-100 text-emerald-700',
                    cancelled: 'bg-stone-200 text-stone-600',
                };
                const cls = statusColors[o.status] || 'bg-stone-200 text-stone-600';
                return `<tr class="border-b border-surface-container hover:bg-surface-container-low transition-colors">
                    <td class="px-6 py-4 font-mono font-semibold">#BE${String(o.order_id).padStart(4,'0')}</td>
                    <td class="px-6 py-4">${o.customer_name}</td>
                    <td class="px-6 py-4">${o.items_summary || '-'}</td>
                    <td class="px-6 py-4 text-right font-bold">₹${Number(o.total_amount).toLocaleString('en-IN')}</td>
                    <td class="px-6 py-4 text-center"><span class="${cls} px-3 py-1 rounded-full text-[11px] font-bold capitalize">${o.status.replace(/_/g,' ')}</span></td>
                </tr>`;
            }).join('');
        }

        // Best sellers
        const bestList = document.getElementById('best-sellers');
        if (bestList && data.best_sellers) {
            bestList.innerHTML = data.best_sellers.map((b, i) => `
            <div class="flex items-center gap-4">
                <span class="w-8 h-8 flex items-center justify-center ${i===0 ? 'bg-primary text-white' : 'bg-surface-container text-on-surface'} font-bold rounded-lg shrink-0">${i+1}</span>
                <div class="flex-1"><p class="font-bold text-on-surface leading-tight">${b.name}</p><p class="text-xs text-on-surface-variant">${b.units_sold} units sold</p></div>
                <div class="text-right"><p class="font-bold text-on-surface text-sm">₹${Number(b.revenue).toLocaleString('en-IN')}</p></div>
            </div>`).join('');
        }
    } catch (err) {
        console.error('Dashboard load failed:', err);
    }
}
