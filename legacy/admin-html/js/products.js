/**
 * BakeEase Admin Products — full CRUD product management
 */

document.addEventListener('DOMContentLoaded', async () => {
    await loadAdminComponents();
    setActiveSidebarLink('products.html');
    loadCategories();
    loadProducts();
});

let allCategories = [];
let currentImageFile = null;

// Drag and drop overlay logic
document.addEventListener('dragenter', (e) => {
    e.preventDefault();
    if (e.dataTransfer.types.includes('Files') && !document.getElementById('add-product-panel').classList.contains('hidden')) {
        document.getElementById('fullscreen-drop-overlay').classList.remove('hidden');
    }
});

document.addEventListener('dragover', (e) => {
    e.preventDefault();
});

document.addEventListener('dragleave', (e) => {
    e.preventDefault();
    if (e.relatedTarget === null) {
        document.getElementById('fullscreen-drop-overlay').classList.add('hidden');
    }
});

document.addEventListener('drop', (e) => {
    e.preventDefault();
    document.getElementById('fullscreen-drop-overlay').classList.add('hidden');
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        processSelectedFile(file);
    }
});

function handleFileSelect(e) {
    if (e.target.files && e.target.files.length > 0) {
        processSelectedFile(e.target.files[0]);
    }
}

function processSelectedFile(file) {
    if (!file.type.match('image.*')) {
        adminToast('Please select an image file', 'error');
        return;
    }
    currentImageFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
        document.getElementById('image-placeholder').classList.add('hidden');
        document.getElementById('image-preview').classList.remove('hidden');
        document.getElementById('image-preview').querySelector('img').src = e.target.result;
    };
    reader.readAsDataURL(file);
}

async function loadCategories() {
    try {
        const res = await fetch(`${ADMIN_API}/categories.php`);
        allCategories = await res.json();
        // Populate both filter and form dropdowns
        const filterSelect = document.getElementById('category-filter');
        const formSelect = document.getElementById('product-category');
        if (filterSelect) {
            filterSelect.innerHTML = '<option value="">All Categories</option>' + allCategories.map(c => `<option value="${c.category_id}">${c.name}</option>`).join('');
        }
        if (formSelect) {
            formSelect.innerHTML = '<option value="">Select Category</option>' + allCategories.map(c => `<option value="${c.category_id}">${c.name}</option>`).join('');
        }
    } catch (err) { console.error('Categories load failed:', err); }
}

async function loadProducts() {
    const tbody = document.getElementById('products-body');
    if (!tbody) return;
    try {
        const data = await adminFetch('/products.php?limit=100&all=1');
        if (!data.products || !data.products.length) {
            tbody.innerHTML = '<tr><td colspan="7" class="px-6 py-12 text-center text-on-surface-variant">No products found</td></tr>';
            return;
        }
        tbody.innerHTML = data.products.map(p => {
            const img = p.image_url ? `../client/images/${p.image_url}` : '../client/images/chocolate-truffle-cake.png';
            const stock = p.stock_quantity ?? '-';
            return `<tr class="border-b border-stone-100 hover:bg-surface-container-low/50 transition-colors">
                <td class="px-6 py-4"><div class="flex items-center gap-4"><img class="w-10 h-10 rounded-lg object-cover" src="${img}" alt="${p.name}" onerror="this.src='../client/images/chocolate-truffle-cake.png'"/><span class="font-semibold text-primary">${p.name}</span></div></td>
                <td class="px-6 py-4 text-on-surface-variant">${p.category_name || '-'}</td>
                <td class="px-6 py-4 text-right font-medium">₹${Number(p.base_price).toLocaleString('en-IN')}</td>
                <td class="px-6 py-4 text-center ${stock <= 3 ? 'text-error font-bold' : ''}">${stock}</td>
                <td class="px-6 py-4 text-center"><div class="inline-flex items-center px-3 py-1 rounded-full ${p.is_available ? 'bg-emerald-50 text-emerald-700' : 'bg-stone-100 text-stone-500'} text-xs font-bold uppercase">${p.is_available ? 'Available' : 'Disabled'}</div></td>
                <td class="px-6 py-4 text-right space-x-2">
                    <button onclick="toggleProduct(${p.product_id}, ${p.is_available ? 0 : 1})" class="p-2 text-stone-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all" title="${p.is_available ? 'Disable' : 'Enable'}"><span class="material-symbols-outlined text-[20px]">${p.is_available ? 'visibility_off' : 'visibility'}</span></button>
                    <button onclick="deleteProduct(${p.product_id}, '${p.name.replace(/'/g,"\\'")}')" class="p-2 text-stone-400 hover:text-error hover:bg-error/5 rounded-lg transition-all" title="Delete"><span class="material-symbols-outlined text-[20px]">delete</span></button>
                </td>
            </tr>`;
        }).join('');

        // Update count
        const countEl = document.getElementById('products-count');
        if (countEl) countEl.textContent = `Showing ${data.products.length} of ${data.total} products`;
    } catch (err) { console.error('Products load failed:', err); }
}

async function toggleProduct(id, newState) {
    try {
        await adminFetch(`/products.php?id=${id}`, {
            method: 'PUT',
            body: { is_available: newState },
        });
        adminToast(newState ? 'Product enabled' : 'Product disabled', 'success');
        loadProducts();
    } catch (err) { adminToast('Failed: ' + err.message, 'error'); }
}

async function deleteProduct(id, name) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
        await adminFetch(`/products.php?id=${id}`, { method: 'DELETE' });
        adminToast('Product deleted', 'success');
        loadProducts();
    } catch (err) { adminToast('Failed: ' + err.message, 'error'); }
}

function openAddPanel() {
    document.getElementById('add-product-panel').classList.remove('hidden');
    document.getElementById('panel-title').textContent = 'Add New Product';
    // Clear form
    document.getElementById('product-name').value = '';
    document.getElementById('product-category').value = '';
    document.getElementById('product-price').value = '';
    document.getElementById('product-stock').value = '20';
    document.getElementById('product-description').value = '';
    document.getElementById('product-available').checked = true;
    
    // Clear image
    currentImageFile = null;
    document.getElementById('product-image').value = '';
    document.getElementById('image-placeholder').classList.remove('hidden');
    document.getElementById('image-preview').classList.add('hidden');
    document.getElementById('image-preview').querySelector('img').src = '';
}

function closeAddPanel() {
    document.getElementById('add-product-panel').classList.add('hidden');
}

async function saveProduct() {
    const name = document.getElementById('product-name').value.trim();
    const category_id = document.getElementById('product-category').value;
    const base_price = document.getElementById('product-price').value;
    const stock = document.getElementById('product-stock').value;
    const description = document.getElementById('product-description').value.trim();
    const is_available = document.getElementById('product-available').checked ? 1 : 0;

    if (!name || !category_id || !base_price) {
        adminToast('Name, category, and price are required', 'error');
        return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('category_id', category_id);
    formData.append('base_price', base_price);
    formData.append('stock_quantity', stock || 20);
    formData.append('description', description);
    formData.append('is_available', is_available);
    if (currentImageFile) {
        formData.append('image', currentImageFile);
    }

    try {
        const token = localStorage.getItem('bakeease_token');
        const res = await fetch(`${ADMIN_API}/products.php`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });
        
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to save product');

        adminToast('Product created!', 'success');
        closeAddPanel();
        loadProducts();
    } catch (err) { adminToast('Failed: ' + err.message, 'error'); }
}
