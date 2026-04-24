/**
 * BakeEase Cart Page Logic
 */

let currentCoupon = null;
let deliveryType = 'delivery'; // 'delivery' or 'pickup'
let deliveryFee = 49;

document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('cart-items-container')) return;
    initCartPage();
});

function initCartPage() {
    // Clean up test cake
    const cartItems = getCart();
    if (cartItems.length === 1 && cartItems[0].name === 'Test Cake') {
        localStorage.removeItem('bakeease_cart');
        window.location.reload();
        return;
    }

    renderCart();

    // Default date to tomorrow
    const dateInput = document.getElementById('delivery-date');
    if (dateInput) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const yyyy = tomorrow.getFullYear();
        const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
        const dd = String(tomorrow.getDate()).padStart(2, '0');
        dateInput.value = `${yyyy}-${mm}-${dd}`;
    }

    // Delivery vs Pickup Toggle
    const btnDelivery = document.getElementById('btn-delivery');
    const btnPickup = document.getElementById('btn-pickup');
    const addressContainer = document.getElementById('address-container');

    btnDelivery.addEventListener('click', () => {
        deliveryType = 'delivery';
        deliveryFee = 49;
        
        btnDelivery.classList.add('bg-white', 'shadow-sm', 'text-primary');
        btnDelivery.classList.remove('text-on-surface-variant');
        
        btnPickup.classList.remove('bg-white', 'shadow-sm', 'text-primary');
        btnPickup.classList.add('text-on-surface-variant');
        
        addressContainer.classList.remove('hidden');
        updateTotals();
    });

    btnPickup.addEventListener('click', () => {
        deliveryType = 'pickup';
        deliveryFee = 0;
        
        btnPickup.classList.add('bg-white', 'shadow-sm', 'text-primary');
        btnPickup.classList.remove('text-on-surface-variant');
        
        btnDelivery.classList.remove('bg-white', 'shadow-sm', 'text-primary');
        btnDelivery.classList.add('text-on-surface-variant');
        
        addressContainer.classList.add('hidden');
        updateTotals();
    });

    // Payment method toggle visual
    const paymentRadios = document.querySelectorAll('input[name="payment"]');
    paymentRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            document.querySelectorAll('input[name="payment"]').forEach(r => {
                const label = r.closest('label');
                if (r.checked) {
                    label.classList.add('border-2', 'border-primary', 'bg-primary/5');
                    label.classList.remove('border', 'border-outline-variant/30', 'hover:border-primary/50');
                } else {
                    label.classList.remove('border-2', 'border-primary', 'bg-primary/5');
                    label.classList.add('border', 'border-outline-variant/30', 'hover:border-primary/50');
                }
            });
        });
    });

    // Coupon logic
    document.getElementById('apply-coupon-btn').addEventListener('click', async () => {
        const code = document.getElementById('coupon-input').value.trim();
        if (!code) {
            showToast('Please enter a coupon code', 'error');
            return;
        }

        const subtotal = getCartTotal();
        try {
            const data = await apiFetch('/coupons.php', {
                method: 'POST',
                body: { code, cart_total: subtotal }
            });

            currentCoupon = data;
            document.getElementById('coupon-input').value = '';
            
            const msgBox = document.getElementById('coupon-message-container');
            const msgText = document.getElementById('coupon-message');
            msgBox.classList.remove('hidden');
            msgText.textContent = `${data.code} applied — ${data.discount_pct}% off!`;
            
            showToast('Coupon applied successfully!', 'success');
            updateTotals();
        } catch (err) {
            showToast(err.message || 'Failed to apply coupon', 'error');
        }
    });

    document.getElementById('remove-coupon-btn').addEventListener('click', () => {
        currentCoupon = null;
        document.getElementById('coupon-message-container').classList.add('hidden');
        showToast('Coupon removed', 'info');
        updateTotals();
    });

    // Place Order
    document.getElementById('place-order-btn').addEventListener('click', placeOrder);
}

function renderCart() {
    const cart = getCart();
    const container = document.getElementById('cart-items-container');
    const countEl = document.getElementById('cart-item-count');

    if (cart.length === 0) {
        window.location.href = 'empty-cart.html';
        return;
    }

    const totalItems = getCartCount();
    countEl.textContent = `${totalItems} item${totalItems > 1 ? 's' : ''}`;

    container.innerHTML = '';

    cart.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'group relative flex gap-6 p-4 rounded-xl hover:bg-surface-container-low transition-colors duration-300 opacity-0 transform translate-y-4';
        
        // Simple entry animation
        setTimeout(() => {
            div.classList.remove('opacity-0', 'translate-y-4');
        }, 50 * index);

        div.innerHTML = `
            <div class="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-surface-container">
                <img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="${item.name}" src="${item.image_url ? './images/' + item.image_url : './images/placeholder.png'}" />
            </div>
            <div class="flex-grow flex flex-col justify-between">
                <div class="flex justify-between items-start">
                    <div>
                        <div class="flex items-center gap-2 mb-1">
                            <span class="material-symbols-outlined text-green-600 text-sm" data-icon="circle" data-weight="fill">circle</span>
                            <h3 class="text-xl font-bold text-on-surface">${item.name}</h3>
                        </div>
                        <p class="text-stone-500 text-sm italic">${item.customisation ? JSON.stringify(item.customisation) : ''}</p>
                    </div>
                    <button class="text-outline hover:text-error transition-colors" onclick="handleRemove(${item.product_id})">
                        <span class="material-symbols-outlined" data-icon="close">close</span>
                    </button>
                </div>
                <div class="flex justify-between items-end mt-4">
                    <div class="flex items-center bg-surface-container-lowest rounded-lg border border-outline-variant p-1">
                        <button class="w-8 h-8 flex items-center justify-center hover:bg-surface-container rounded transition-colors" onclick="handleQtyChange(${item.product_id}, ${item.quantity - 1})">-</button>
                        <span class="w-10 text-center font-semibold">${item.quantity}</span>
                        <button class="w-8 h-8 flex items-center justify-center hover:bg-surface-container rounded transition-colors" onclick="handleQtyChange(${item.product_id}, ${item.quantity + 1})">+</button>
                    </div>
                    <div class="text-right">
                        <p class="text-sm text-stone-400">₹${item.base_price} each</p>
                        <p class="text-lg font-bold text-primary">₹${item.base_price * item.quantity}</p>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(div);
    });

    updateTotals();
}

function handleRemove(productId) {
    removeFromCart(productId);
    renderCart();
}

function handleQtyChange(productId, newQty) {
    if (newQty < 1) {
        handleRemove(productId);
        return;
    }
    updateCartQuantity(productId, newQty);
    renderCart();
}

function updateTotals() {
    const subtotal = getCartTotal();
    
    let discountAmt = 0;
    if (currentCoupon) {
        discountAmt = Math.round(subtotal * (currentCoupon.discount_pct / 100));
        document.getElementById('summary-discount-row').classList.remove('hidden');
        document.getElementById('summary-discount-pct').textContent = `(${currentCoupon.discount_pct}%)`;
        document.getElementById('summary-discount-amt').textContent = `-₹${discountAmt}`;
    } else {
        document.getElementById('summary-discount-row').classList.add('hidden');
    }

    const total = subtotal - discountAmt + deliveryFee;

    document.getElementById('summary-subtotal').textContent = `₹${subtotal}`;
    document.getElementById('summary-delivery-fee').textContent = deliveryFee === 0 ? 'Free' : `₹${deliveryFee}`;
    document.getElementById('summary-total').textContent = `₹${Math.max(0, total)}`;
}

async function placeOrder() {
    const cart = getCart();
    if (!cart.length) return;

    if (!isLoggedIn()) {
        showToast('Please log in to place an order', 'error');
        setTimeout(() => window.location.href = 'login.html?redirect=cart.html', 1500);
        return;
    }

    const address = document.getElementById('delivery-address').value.trim();
    if (deliveryType === 'delivery' && !address) {
        showToast('Please provide a delivery address', 'error');
        return;
    }

    const date = document.getElementById('delivery-date').value;
    const time = document.getElementById('delivery-time').value;
    if (!date) {
        showToast('Please select a delivery date', 'error');
        return;
    }

    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;

    const btn = document.getElementById('place-order-btn');
    btn.disabled = true;
    btn.innerHTML = `<span class="material-symbols-outlined animate-spin">refresh</span> Processing...`;

    try {
        const payload = {
            items: cart.map(item => ({
                product_id: item.product_id,
                quantity: item.quantity,
                customisation: item.customisation
            })),
            delivery_type: deliveryType,
            delivery_address: deliveryType === 'delivery' ? address : null,
            scheduled_at: `${date} ${time.split(' ')[0]}`,
            payment_method: paymentMethod
        };

        // Note: Coupon code is currently not saved in the order table according to orders.php schema
        // but we could send it if the backend gets updated to support it.

        await apiFetch('/orders.php', { method: 'POST', body: payload });
        
        clearCart();
        showToast('Order placed successfully!', 'success');
        
        setTimeout(() => {
            window.location.href = 'account.html';
        }, 1500);

    } catch (err) {
        console.error(err);
        showToast(err.message || 'Failed to place order', 'error');
        btn.disabled = false;
        btn.innerHTML = `Place Order <span class="material-symbols-outlined" data-icon="arrow_forward">arrow_forward</span>`;
    }
}
