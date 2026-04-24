/**
 * BakeEase Product Detail — fetch single product + reviews
 */
document.addEventListener('DOMContentLoaded', initProductPage);

async function initProductPage() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (!id) { window.location.href = 'catalog.html'; return; }

    try {
        const product = await apiFetch(`/products.php?id=${id}`);
        renderProduct(product);
        loadProductReviews(id);
        loadRelatedProducts(product.category_id, product.product_id);
    } catch (err) {
        console.error('Failed to load product:', err);
        document.getElementById('product-detail').innerHTML = '<p class="text-center text-error py-20">Product not found</p>';
    }
}

function renderProduct(p) {
    const container = document.getElementById('product-detail');
    if (!container) return;
    const img = p.image_url ? `./images/${p.image_url}` : './images/chocolate-truffle-cake.png';
    const rating = parseFloat(p.avg_rating || 0).toFixed(1);
    const price = parseFloat(p.base_price).toLocaleString('en-IN');
    const stars = renderStars(parseFloat(p.avg_rating || 0));

    document.title = `${p.name} — BakeEase`;

    container.innerHTML = `
    <nav class="flex items-center space-x-2 text-[13px] text-on-surface-variant mb-8">
        <a class="hover:text-primary transition-colors" href="home.html">Home</a>
        <span class="material-symbols-outlined text-sm">chevron_right</span>
        <a class="hover:text-primary transition-colors" href="catalog.html">Menu</a>
        <span class="material-symbols-outlined text-sm">chevron_right</span>
        <a class="hover:text-primary transition-colors" href="catalog.html?category=${p.category_id}">${p.category_name}</a>
        <span class="material-symbols-outlined text-sm">chevron_right</span>
        <span class="font-semibold text-on-surface">${p.name}</span>
    </nav>
    <div class="flex flex-col lg:flex-row gap-16">
        <div class="w-full lg:w-1/2">
            <div class="relative group aspect-square rounded-xl overflow-hidden shadow-lg bg-surface-container-lowest">
                <img alt="${p.name}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="${img}"/>
            </div>
        </div>
        <div class="w-full lg:w-1/2 flex flex-col space-y-8">
            <div class="space-y-4">
                <div class="flex items-center space-x-3">
                    <span class="px-3 py-1 border border-primary text-primary text-[10px] font-bold uppercase tracking-widest rounded">${p.category_name}</span>
                </div>
                <h1 class="text-[42px] font-headline font-bold text-on-surface leading-tight tracking-tight">${p.name}</h1>
                <div class="flex items-center space-x-4">
                    <div class="flex items-center">${stars}<span class="ml-2 font-semibold text-on-surface">${rating}</span></div>
                    <span class="text-on-surface-variant/60 text-sm">(${p.review_count} reviews)</span>
                </div>
                <span class="text-[32px] font-headline font-bold text-primary-container">₹${price}</span>
            </div>
            <div class="space-y-6 pt-4 border-t border-outline-variant/10">
                <p class="text-on-surface-variant leading-relaxed text-lg">${p.description || ''}</p>
            </div>
            <div class="space-y-6 pt-6 border-t border-outline-variant/10">
                <div class="flex flex-col sm:flex-row gap-4 items-stretch">
                    <div class="flex items-center justify-between border border-outline-variant/30 rounded-full px-4 py-2 min-w-[120px] bg-surface-container-lowest">
                        <button class="p-1 hover:text-primary transition-colors" onclick="changeQty(-1)"><span class="material-symbols-outlined">remove</span></button>
                        <span id="product-qty" class="font-bold px-4">1</span>
                        <button class="p-1 hover:text-primary transition-colors" onclick="changeQty(1)"><span class="material-symbols-outlined">add</span></button>
                    </div>
                    <button class="flex-1 px-8 py-4 border-2 border-primary text-primary font-bold uppercase tracking-widest rounded-full hover:bg-primary/5 transition-all"
                            onclick="addProductToCart(${p.product_id}, '${p.name.replace(/'/g,"\\'")}', ${p.base_price}, '${p.image_url||''}')">Add to Cart</button>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                    <div class="flex items-center space-x-2 text-on-surface-variant text-sm"><span class="material-symbols-outlined text-primary">local_shipping</span><span>Delivery in 2–4 hrs</span></div>
                    <div class="flex items-center space-x-2 text-on-surface-variant text-sm"><span class="material-symbols-outlined text-primary">cake</span><span>Custom message</span></div>
                    <div class="flex items-center space-x-2 text-on-surface-variant text-sm"><span class="material-symbols-outlined text-primary">check_circle</span><span>Fresh daily</span></div>
                </div>
            </div>
        </div>
    </div>`;
}

let currentQty = 1;
function changeQty(delta) {
    currentQty = Math.max(1, currentQty + delta);
    const el = document.getElementById('product-qty');
    if (el) el.textContent = currentQty;
}

function addProductToCart(id, name, price, imageUrl) {
    addToCart({ product_id: id, name, base_price: price, image_url: imageUrl, quantity: currentQty });
}

function renderStars(rating) {
    let html = '';
    for (let i = 1; i <= 5; i++) {
        if (rating >= i) html += '<span class="material-symbols-outlined text-amber-500 text-lg star-filled">star</span>';
        else if (rating >= i - 0.5) html += '<span class="material-symbols-outlined text-amber-500 text-lg">star_half</span>';
        else html += '<span class="material-symbols-outlined text-stone-300 text-lg">star</span>';
    }
    return html;
}

async function loadProductReviews(productId) {
    try {
        const reviews = await apiFetch(`/reviews.php?product_id=${productId}`);
        const container = document.getElementById('product-reviews');
        if (!container) return;
        if (!reviews.length) {
            container.innerHTML = '<p class="text-on-surface-variant text-center py-8">No reviews yet. Be the first!</p>';
            return;
        }
        container.innerHTML = `<h2 class="text-3xl font-headline font-bold text-on-surface mb-12">Customer Reviews</h2>` +
            reviews.map(r => `
            <div class="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/10 shadow-sm mb-4">
                <div class="flex justify-between items-start mb-4">
                    <div><h4 class="font-bold text-on-surface">${r.reviewer_name}</h4>
                    <div class="flex items-center">${renderStars(r.rating)}<span class="ml-2 text-xs text-on-surface-variant/60">${new Date(r.created_at).toLocaleDateString()}</span></div></div>
                </div>
                <p class="text-on-surface-variant leading-relaxed">${r.comment || ''}</p>
            </div>`).join('');
    } catch (err) { console.error('Reviews error:', err); }
}

async function loadRelatedProducts(categoryId, excludeId) {
    try {
        const data = await apiFetch(`/products.php?category=${categoryId}&limit=4`);
        const related = data.products.filter(p => p.product_id !== excludeId).slice(0, 4);
        const container = document.getElementById('related-products');
        if (!container || !related.length) return;
        container.innerHTML = `
        <div class="flex justify-between items-end mb-12">
            <h2 class="text-4xl font-headline font-bold text-on-surface">You Might Also Like</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">${related.map(p => {
            const img = p.image_url ? `./images/${p.image_url}` : './images/chocolate-truffle-cake.png';
            return `<div class="group cursor-pointer" onclick="window.location.href='product.html?id=${p.product_id}'">
                <div class="aspect-[4/5] rounded-xl overflow-hidden mb-4 bg-surface-container shadow-sm">
                    <img alt="${p.name}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src="${img}"/>
                </div>
                <h3 class="font-headline font-bold text-xl text-on-surface group-hover:text-primary transition-colors">${p.name}</h3>
                <p class="text-primary-container font-headline font-bold mt-1">₹${parseFloat(p.base_price).toLocaleString('en-IN')}</p>
            </div>`;
        }).join('')}</div>`;
    } catch (err) { console.error('Related products error:', err); }
}
