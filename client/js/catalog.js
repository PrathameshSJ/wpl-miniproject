/**
 * BakeEase Catalog — dynamic product grid, search, sort, filter
 */
document.addEventListener('DOMContentLoaded', initCatalog);

let catalogState = { search: '', sort: 'newest', category: null, page: 1, limit: 12 };

async function initCatalog() {
    setupSearchBar();
    setupSortDropdown();
    await loadCatalogProducts();
}

function setupSearchBar() {
    const input = document.getElementById('catalog-search');
    if (!input) return;
    let timer;
    input.addEventListener('input', () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            catalogState.search = input.value.trim();
            catalogState.page = 1;
            loadCatalogProducts();
        }, 300);
    });
}

function setupSortDropdown() {
    const select = document.getElementById('catalog-sort');
    if (!select) return;
    select.addEventListener('change', () => {
        catalogState.sort = select.value;
        catalogState.page = 1;
        loadCatalogProducts();
    });
}

async function loadCatalogProducts() {
    const grid = document.getElementById('catalog-grid');
    if (!grid) return;

    // Show skeleton
    grid.innerHTML = Array(6).fill(0).map(() => `
        <div class="bg-surface-container rounded-xl overflow-hidden animate-pulse">
            <div class="aspect-[4/5] bg-surface-container-highest"></div>
            <div class="p-5 space-y-3">
                <div class="h-2 w-16 bg-surface-container-highest rounded"></div>
                <div class="h-4 w-3/4 bg-surface-container-highest rounded"></div>
                <div class="flex justify-between items-center pt-2">
                    <div class="h-6 w-20 bg-surface-container-highest rounded"></div>
                    <div class="h-4 w-10 bg-surface-container-highest rounded"></div>
                </div>
            </div>
        </div>
    `).join('');

    try {
        let url = `/products.php?limit=${catalogState.limit}&offset=${(catalogState.page - 1) * catalogState.limit}&sort=${catalogState.sort}`;
        if (catalogState.search) url += `&search=${encodeURIComponent(catalogState.search)}`;
        if (catalogState.category) url += `&category=${catalogState.category}`;

        const data = await apiFetch(url);
        const countEl = document.getElementById('catalog-count');
        if (countEl) countEl.textContent = `Showing ${data.products.length} of ${data.total} products`;

        if (!data.products.length) {
            grid.innerHTML = '<div class="col-span-full text-center py-20"><span class="material-symbols-outlined text-6xl text-outline mb-4">search_off</span><p class="text-lg text-on-surface-variant">No products found</p></div>';
            return;
        }

        grid.innerHTML = data.products.map(p => {
            const img = p.image_url ? `./images/${p.image_url}` : './images/chocolate-truffle-cake.png';
            const rating = parseFloat(p.avg_rating || 0).toFixed(1);
            const price = parseFloat(p.base_price).toLocaleString('en-IN');
            return `
            <div class="group relative bg-surface-container-lowest rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer" onclick="window.location.href='product.html?id=${p.product_id}'">
                <div class="relative aspect-[4/5] overflow-hidden">
                    <img alt="${p.name}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src="${img}" loading="lazy"/>
                    <div class="absolute top-3 left-3 flex gap-2"><div class="veg-dot mt-1"></div></div>
                    <button class="absolute bottom-4 right-4 p-3 bg-white/90 backdrop-blur rounded-full text-primary shadow-lg translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300"
                            onclick="event.stopPropagation(); addToCart({product_id:${p.product_id}, name:'${p.name.replace(/'/g,"\\'")}', base_price:${p.base_price}, image_url:'${p.image_url||''}'})">
                        <span class="material-symbols-outlined">add_shopping_cart</span>
                    </button>
                </div>
                <div class="p-5">
                    <span class="text-[10px] font-bold text-outline uppercase tracking-[0.2em] mb-1 block">${p.category_name || ''}</span>
                    <h4 class="text-lg font-headline text-on-surface mb-2">${p.name}</h4>
                    <div class="flex items-center justify-between">
                        <span class="text-xl font-bold text-primary">₹${price}</span>
                        <div class="flex items-center gap-1">
                            <span class="material-symbols-outlined text-sm text-amber-500 star-filled">star</span>
                            <span class="text-sm font-semibold text-on-surface">${rating}</span>
                        </div>
                    </div>
                </div>
            </div>`;
        }).join('');
    } catch (err) {
        grid.innerHTML = '<p class="col-span-full text-center text-error py-12">Failed to load products</p>';
        console.error(err);
    }
}

function setCatalogCategory(catId, btn) {
    catalogState.category = catalogState.category === catId ? null : catId;
    catalogState.page = 1;
    if (btn) {
        document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('bg-primary-fixed-dim', 'text-on-primary-fixed'));
        if (catalogState.category) btn.classList.add('bg-primary-fixed-dim', 'text-on-primary-fixed');
    }
    loadCatalogProducts();
}
