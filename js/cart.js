// This script handles the functionality for the cart.html page.

document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartSummary = document.getElementById('cart-summary');
    const cartTotalSpan = document.getElementById('cart-total');

    function getCart() {
        return JSON.parse(localStorage.getItem('wordHiveCart')) || [];
    }

    function saveCart(cart) {
        localStorage.setItem('wordHiveCart', JSON.stringify(cart));
        renderCart();
    }

    function renderCart() {
        if (!cartItemsContainer || !cartSummary || !cartTotalSpan) return;

        const cart = getCart();

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="text-gray-500 text-center">Your cart is currently empty.</p>';
            cartSummary.classList.add('hidden');
            return;
        }

        cartItemsContainer.innerHTML = cart.map((item, index) => `
            <div class="cart-item flex items-center justify-between py-4">
                <div class="flex items-center">
                    <img src="${item.img}" alt="${item.title}" class="w-16 h-24 object-cover rounded-md mr-4" onerror="this.onerror=null;this.src='https://placehold.co/100x150/cccccc/ffffff?text=Image+Not+Found';">
                    <div>
                        <h3 class="font-bold">${item.title}</h3>
                        <p class="text-gray-600 text-sm">by ${item.author}</p>
                    </div>
                </div>
                <div class="flex items-center">
                    <input type="number" value="${item.quantity}" min="1" data-index="${index}" class="quantity-input w-16 text-center border rounded-md mx-4">
                    <p class="font-bold w-20 text-right">$${(item.price * item.quantity).toFixed(2)}</p>
                    <button class="remove-btn ml-4 text-red-500 hover:text-red-700" data-index="${index}">&times;</button>
                </div>
            </div>
        `).join('');

        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotalSpan.textContent = `$${total.toFixed(2)}`;
        cartSummary.classList.remove('hidden');

        addCartEventListeners();
    }

    function addCartEventListeners() {
        cartItemsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-btn')) {
                const index = parseInt(e.target.dataset.index, 10);
                let cart = getCart();
                cart.splice(index, 1);
                saveCart(cart);
            }
        });

        cartItemsContainer.addEventListener('change', (e) => {
            if (e.target.classList.contains('quantity-input')) {
                const index = parseInt(e.target.dataset.index, 10);
                const newQuantity = parseInt(e.target.value, 10);
                let cart = getCart();
                
                if (cart[index]) {
                    if (newQuantity > 0) {
                        cart[index].quantity = newQuantity;
                    } else {
                        cart.splice(index, 1);
                    }
                    saveCart(cart);
                }
            }
        });
    }

    renderCart();
});
