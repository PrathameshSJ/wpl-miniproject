/**
 * BakeEase Homepage — dynamic categories + products
 */

document.addEventListener('DOMContentLoaded', initHomePage);

async function initHomePage() {
    loadCategories();
    loadFeaturedProducts();
    loadTopReviews();
}

async function loadTopReviews() {
    try {
        const reviews = await apiFetch('/reviews.php?top=1');
        const container = document.getElementById('reviews-section');
        if (!container || !reviews.length) return;
        container.innerHTML = reviews.slice(0, 3).map(r => {
            const stars = Array.from({length: 5}, (_, i) =>
                i < r.rating
                    ? '<span class="material-symbols-outlined star-filled" style="font-variation-settings:\'FILL\' 1">star</span>'
                    : '<span class="material-symbols-outlined" style="font-variation-settings:\'FILL\' 0">star</span>'
            ).join('');
            const initials = r.reviewer_name.split(' ').map(n => n[0]).join('').substring(0,2);
            return `
            <div class="testimonial">
                <span class="material-symbols-outlined quote-icon">format_quote</span>
                <div class="testimonial-stars">${stars}</div>
                <p class="testimonial-text">"${r.comment}"</p>
                <p style="font-size:0.75rem;color:var(--on-surface-variant);margin-top:0.5rem">on <strong>${r.product_name}</strong></p>
                <div class="testimonial-author">
                    <div class="testimonial-avatar" style="display:flex;align-items:center;justify-content:center;background:var(--primary-container);color:white;font-weight:bold;font-size:0.85rem;border-radius:50%;width:40px;height:40px">${initials}</div>
                    <div>
                        <p class="testimonial-name">${r.reviewer_name}</p>
                        <p class="testimonial-location">${new Date(r.created_at).toLocaleDateString('en-IN', {month:'short', year:'numeric'})}</p>
                    </div>
                </div>
            </div>`;
        }).join('');
    } catch (err) {
        console.error('Failed to load reviews:', err);
    }
}

async function loadCategories() {
    try {
        const categories = await apiFetch('/categories.php');
        const bar = document.getElementById('category-bar');
        if (!bar) return;
        bar.innerHTML = categories.map((cat, i) => `
            <button class="pill ${i === 0 ? 'pill-active' : 'pill-inactive'}"
                    onclick="filterByCategory(${cat.category_id}, this)"
                    data-category="${cat.category_id}">
                ${cat.icon_url || ''} ${cat.name}
            </button>
        `).join('');
    } catch (err) {
        console.error('Failed to load categories:', err);
    }
}

async function loadFeaturedProducts(categoryId = null) {
    try {
        let url = '/products.php?limit=8';
        if (categoryId) url += `&category=${categoryId}`;
        const data = await apiFetch(url);
        renderProductGrid('featured-grid', data.products);
    } catch (err) {
        console.error('Failed to load products:', err);
    }
}

function filterByCategory(categoryId, btn) {
    // Update pill states
    document.querySelectorAll('#category-bar .pill').forEach(p => {
        p.classList.remove('pill-active');
        p.classList.add('pill-inactive');
    });
    btn.classList.remove('pill-inactive');
    btn.classList.add('pill-active');
    loadFeaturedProducts(categoryId);
}

function renderProductGrid(containerId, products) {
    const grid = document.getElementById(containerId);
    if (!grid) return;
    if (!products.length) {
        grid.innerHTML = '<p class="col-span-full text-center text-on-surface-variant py-12">No products found</p>';
        return;
    }
    grid.innerHTML = products.map(p => createProductCard(p)).join('');
}

function createProductCard(product) {
    const imgSrc = product.image_url ? `./images/${product.image_url}` : './images/chocolate-truffle-cake.png';
    const rating = parseFloat(product.avg_rating || 0).toFixed(1);
    const price = parseFloat(product.base_price).toLocaleString('en-IN');
    return `
        <div class="card" onclick="window.location.href='product.html?id=${product.product_id}'" style="cursor:pointer">
            <div class="card-img">
                <img alt="${product.name}" src="${imgSrc}" loading="lazy"/>
                <div class="card-badges">
                    <span class="badge">${product.category_name || ''}</span>
                    <div class="veg-indicator" title="Vegetarian"></div>
                </div>
            </div>
            <div class="card-body">
                <div class="card-rating">
                    <span class="material-symbols-outlined star-filled" style="font-variation-settings:'FILL' 1">star</span>
                    <span class="card-rating-value">${rating}</span>
                </div>
                <h3 class="card-title">${product.name}</h3>
                <p class="card-desc">${product.description || ''}</p>
                <div class="card-footer">
                    <span class="card-price">₹${price}</span>
                    <button class="add-btn" onclick="event.stopPropagation(); addToCart(${JSON.stringify({product_id: product.product_id, name: product.name, base_price: product.base_price, image_url: product.image_url}).replace(/"/g, '&quot;')})">
                        <span class="material-symbols-outlined add-btn-icon">add_shopping_cart</span>
                    </button>
                </div>
            </div>
        </div>
    `;
}
