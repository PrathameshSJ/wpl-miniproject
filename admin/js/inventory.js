/**
 * BakeEase Admin Inventory — dynamic inventory management with JWT auth
 */

document.addEventListener('DOMContentLoaded', async () => {
    await loadAdminComponents();
    setActiveSidebarLink('inventory.html');
    loadInventory();
});

async function loadInventory() {
    const tbody = document.getElementById('inventory-body');
    if (!tbody) return;
    try {
        const items = await adminFetch('/inventory.php');
        if (!items.length) {
            tbody.innerHTML = '<tr><td colspan="5" class="px-6 py-12 text-center text-on-surface-variant">No inventory items</td></tr>';
            return;
        }
        tbody.innerHTML = items.map(item => {
            const isLow = item.is_low_stock;
            return `<tr class="border-b border-surface-container hover:bg-surface-container-low transition-colors ${isLow ? 'bg-red-50/50' : ''}">
                <td class="px-6 py-4 font-semibold">${item.name}</td>
                <td class="px-6 py-4">${parseFloat(item.quantity_kg).toFixed(1)} kg</td>
                <td class="px-6 py-4">${item.low_stock_threshold ? parseFloat(item.low_stock_threshold).toFixed(1)+' kg' : '-'}</td>
                <td class="px-6 py-4 text-center">${isLow ? '<span class="bg-red-100 text-red-700 px-3 py-1 rounded-full text-[11px] font-bold">Low Stock</span>' : '<span class="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[11px] font-bold">OK</span>'}</td>
                <td class="px-6 py-4 text-center"><input type="number" class="w-20 text-sm border border-stone-300 rounded px-2 py-1 text-center" value="${parseFloat(item.quantity_kg).toFixed(1)}" onchange="updateStock(${item.ingredient_id}, this.value)" min="0" step="0.1"/></td>
            </tr>`;
        }).join('');
    } catch (err) { console.error('Inventory load failed:', err); }
}

async function updateStock(id, qty) {
    try {
        await adminFetch(`/inventory.php?id=${id}`, {
            method: 'PUT',
            body: { quantity_kg: parseFloat(qty) },
        });
        adminToast('Stock updated', 'success');
        loadInventory();
    } catch (err) { adminToast('Failed: ' + err.message, 'error'); }
}
