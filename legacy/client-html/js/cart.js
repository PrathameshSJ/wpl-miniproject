/**
 * BakeEase Cart — localStorage-based cart management
 */

function getCart() {
    return JSON.parse(localStorage.getItem('bakeease_cart') || '[]');
}

function saveCart(cart) {
    localStorage.setItem('bakeease_cart', JSON.stringify(cart));
    updateCartBadge();
}

function addToCart(product) {
    const cart = getCart();
    const existing = cart.find(item => item.product_id === product.product_id);
    if (existing) {
        existing.quantity += (product.quantity || 1);
    } else {
        cart.push({
            product_id: product.product_id,
            name: product.name,
            base_price: parseFloat(product.base_price),
            image_url: product.image_url,
            quantity: product.quantity || 1,
            customisation: product.customisation || null,
        });
    }
    saveCart(cart);
    showToast(`${product.name} added to cart!`, 'success');
}

function removeFromCart(productId) {
    const cart = getCart().filter(item => item.product_id !== productId);
    saveCart(cart);
}

function updateCartQuantity(productId, qty) {
    const cart = getCart();
    const item = cart.find(i => i.product_id === productId);
    if (item) {
        item.quantity = Math.max(1, qty);
        saveCart(cart);
    }
}

function clearCart() {
    localStorage.removeItem('bakeease_cart');
    updateCartBadge();
}

function getCartTotal() {
    return getCart().reduce((sum, item) => sum + (item.base_price * item.quantity), 0);
}

function getCartCount() {
    return getCart().reduce((sum, item) => sum + item.quantity, 0);
}

function updateCartBadge() {
    const badges = document.querySelectorAll('.cart-badge');
    const count = getCartCount();
    badges.forEach(badge => {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'flex' : 'none';
    });
}
