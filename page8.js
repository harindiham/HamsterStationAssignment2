document.addEventListener('DOMContentLoaded', function() {
    // Shopping cart array
    let cart = [];
    
    // DOM Elements
    const cartModal = document.getElementById('cartModal');
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotalElement = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const cartIcon = document.querySelector('.rightdown-menu .icon10, .rightdown-menu a[href="#"] img');
    
    // Initialize event listeners
    function init() {
        // Cart icon click
        if (cartIcon) {
            cartIcon.addEventListener('click', function(e) {
                e.preventDefault();
                cartModal.style.display = 'block';
                updateCartDisplay();
            });
        }
        
        // Close modal
        const closeBtn = document.querySelector('.close');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                cartModal.style.display = 'none';
            });
        }
        
        // Close when clicking outside
        window.addEventListener('click', function(e) {
            if (e.target === cartModal) {
                cartModal.style.display = 'none';
            }
        });
        
        // Handle all minus buttons
        document.querySelectorAll('[class*="minus"]').forEach(btn => {
            btn.addEventListener('click', function() {
                const input = this.parentElement.querySelector('.quantity-input');
                let value = parseInt(input.value) || 0;
                input.value = Math.max(0, value - 1);
            });
        });
        
        // Handle all plus buttons
        document.querySelectorAll('[class*="plus"]').forEach(btn => {
            btn.addEventListener('click', function() {
                const input = this.parentElement.querySelector('.quantity-input');
                let value = parseInt(input.value) || 0;
                input.value = value + 1;
            });
        });
        
        // Add to cart buttons
        document.querySelectorAll('[class*="cart-btn"]').forEach(btn => {
            btn.addEventListener('click', function() {
                const productCard = this.closest('[class*="product-card"]');
                addToCart(productCard);
            });
        });
        
        // Checkout button
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', proceedToCheckout);
        }
    }
    
    // Add product to cart
    function addToCart(productCard) {
        if (!productCard) return;
        
        const title = productCard.querySelector('[class*="product-title"]')?.textContent;
        const priceText = productCard.querySelector('[class*="product-price"]')?.textContent;
        const quantityInput = productCard.querySelector('.quantity-input');
        const quantity = parseInt(quantityInput?.value) || 0;
        
        if (!title || !priceText || !quantityInput) {
            showFeedback('Error: Could not find product details', 'error');
            return;
        }
        
        const price = parseFloat(priceText.replace('LKR ', '').replace(/,/g, ''));
        
        if (quantity > 0) {
            // Check if item already exists in cart
            const existingItem = cart.find(item => item.title === title);
            
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.push({
                    title: title,
                    price: price,
                    quantity: quantity
                });
            }
            
            // Reset quantity input
            quantityInput.value = 0;
            
            // Update cart display
            updateCartDisplay();
            
            // Show feedback
            showFeedback(`${quantity} ${title} added to cart!`);
        } else {
            showFeedback('Please select a quantity first!', 'error');
        }
    }
    
    // Update cart display
    function updateCartDisplay() {
        if (!cartItemsContainer || !cartTotalElement) return;
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is empty</p>';
            cartTotalElement.textContent = 'LKR 0.00';
            return;
        }
        
        let html = `
            <table class="cart-table">
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Total</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        let grandTotal = 0;
        
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            grandTotal += itemTotal;
            
            html += `
                <tr>
                    <td>${item.title}</td>
                    <td>LKR ${item.price.toLocaleString()}</td>
                    <td>${item.quantity}</td>
                    <td>LKR ${itemTotal.toLocaleString()}</td>
                    <td class="remove-item" data-index="${index}">✕</td>
                </tr>
            `;
        });
        
        html += `
                </tbody>
            </table>
        `;
        
        cartItemsContainer.innerHTML = html;
        cartTotalElement.textContent = `LKR ${grandTotal.toLocaleString()}`;
        
        // Add event listeners to remove buttons
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                cart.splice(index, 1);
                updateCartDisplay();
                showFeedback('Item removed from cart');
            });
        });
    }
    
    // Proceed to checkout
    function proceedToCheckout() {
        if (cart.length === 0) {
            showFeedback('Your cart is empty!', 'error');
            return;
        }
        
        try {
            // Save cart to session storage
            sessionStorage.setItem('cart', JSON.stringify(cart));
            
            // Calculate and save total
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            sessionStorage.setItem('cartTotal', `LKR ${total.toLocaleString()}`);
            
            // Redirect to checkout page - CHANGED FROM page9.html to checkoutpage.html
            window.location.href = 'checkout.html';
        } catch (error) {
            console.error('Checkout error:', error);
            showFeedback('Error during checkout!', 'error');
        }
    }
    // Show feedback message
    function showFeedback(message, type = 'success') {
        // Remove any existing feedback first
        const existingFeedback = document.querySelector('.feedback');
        if (existingFeedback) existingFeedback.remove();
        
        const feedback = document.createElement('div');
        feedback.className = `feedback ${type}`;
        feedback.textContent = message;
        document.body.appendChild(feedback);
        
        setTimeout(() => feedback.remove(), 3000);
    }
    
    // Initialize the application
    init();
});