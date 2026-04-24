/**
 * BakeEase Admin Reports — dynamic reports data
 */

document.addEventListener('DOMContentLoaded', async () => {
    await loadAdminComponents();
    setActiveSidebarLink('reports.html');
    loadReports();
});

async function loadReports() {
    try {
        const data = await adminFetch('/reports.php');
        
        // Update top cards
        const numbers = document.querySelectorAll('.text-3xl.font-headline');
        if (numbers[0]) numbers[0].textContent = data.total_orders.toLocaleString('en-IN');
        if (numbers[1]) numbers[1].textContent = `₹${data.avg_order_value.toLocaleString('en-IN', {maximumFractionDigits: 2})}`;
        if (numbers[2]) numbers[2].textContent = data.customer_growth.toLocaleString('en-IN');

        // Update high value orders
        const tbody = document.querySelector('tbody');
        if (tbody && data.high_value_orders) {
            if (!data.high_value_orders.length) {
                tbody.innerHTML = '<tr><td colspan="5" class="px-8 py-12 text-center text-on-surface-variant">No orders yet</td></tr>';
            } else {
                tbody.innerHTML = data.high_value_orders.map((o, i) => {
                    const colors = ['bg-orange-100 text-orange-900', 'bg-stone-100 text-stone-900', 'bg-primary-container/20 text-primary'];
                    const colorCls = colors[i % colors.length];
                    return `<tr class="hover:bg-surface-container-low/50 transition-colors">
                        <td class="px-8 py-4 font-mono text-xs text-primary">#BE-${String(o.order_id).padStart(4,'0')}</td>
                        <td class="px-8 py-4">
                            <div class="flex items-center gap-3">
                                <div class="w-8 h-8 rounded-full ${colorCls} flex items-center justify-center text-xs font-bold">${o.initials}</div>
                                <span class="text-sm font-medium">${o.full_name}</span>
                            </div>
                        </td>
                        <td class="px-8 py-4 text-sm text-on-surface-variant">${o.items_summary}</td>
                        <td class="px-8 py-4 text-sm">${o.delivery_address || '-'}</td>
                        <td class="px-8 py-4 text-right text-sm font-bold">₹${Number(o.total_amount).toLocaleString('en-IN')}</td>
                    </tr>`;
                }).join('');
            }
        }
        
        // Update sales by category dynamically
        const catContainer = document.querySelector('.grid.grid-cols-1.lg\\:grid-cols-2 > div:nth-child(1) .space-y-4');
        if (catContainer && data.category_sales) {
            const totalCatRev = data.category_sales.reduce((sum, c) => sum + Number(c.revenue), 0);
            const colors = ['bg-primary', 'bg-primary-container', 'bg-secondary', 'bg-surface-container-highest'];
            
            catContainer.innerHTML = data.category_sales.map((c, i) => {
                const percent = totalCatRev > 0 ? ((Number(c.revenue) / totalCatRev) * 100).toFixed(1) : 0;
                const col = colors[i % colors.length];
                return `<div class="flex items-center gap-3">
                    <span class="w-2 h-2 rounded-full ${col}"></span>
                    <div>
                        <p class="text-xs font-bold uppercase tracking-wide">${c.category_name}</p>
                        <p class="text-sm font-body text-on-surface-variant">${percent}% (₹${Number(c.revenue).toLocaleString('en-IN')})</p>
                    </div>
                </div>`;
            }).join('');
            
            // Also update the center donut text
            const donutText = document.querySelector('.absolute.inset-0.flex.flex-col > span:first-child');
            const donutLabel = document.querySelector('.absolute.inset-0.flex.flex-col > span:last-child');
            if (donutText && data.category_sales[0]) {
                donutText.textContent = `${totalCatRev > 0 ? ((Number(data.category_sales[0].revenue) / totalCatRev) * 100).toFixed(0) : 0}%`;
                donutLabel.textContent = data.category_sales[0].category_name;
            }
        }

        // Update Top Selling Locations
        const locContainer = document.querySelector('.grid.grid-cols-1.lg\\:grid-cols-2 > div:nth-child(2) .space-y-6');
        if (locContainer && data.location_sales) {
            const maxRev = data.location_sales.length > 0 ? Number(data.location_sales[0].revenue) : 1;
            locContainer.innerHTML = data.location_sales.map(l => {
                const percent = Math.max(10, (Number(l.revenue) / maxRev) * 100);
                return `<div class="space-y-2">
                    <div class="flex justify-between text-xs font-bold uppercase tracking-widest">
                        <span>${l.location}</span>
                        <span class="text-primary">₹${Number(l.revenue).toLocaleString('en-IN')}</span>
                    </div>
                    <div class="h-3 w-full bg-surface-container-low rounded-full overflow-hidden">
                        <div class="h-full bg-primary-container rounded-full" style="width: ${percent}%"></div>
                    </div>
                </div>`;
            }).join('');
        }

    } catch (err) { console.error('Reports load failed:', err); }
}
