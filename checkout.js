document.addEventListener('DOMContentLoaded', function() {
    // 1. Retrieve cart data from session storage
    const cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    const cartTotal = sessionStorage.getItem('cartTotal') || 'LKR 0.00';

    // 2. Display order summary
    const checkoutItemsContainer = document.getElementById('checkoutItems');
    const checkoutTotalElement = document.getElementById('checkoutTotal');

    if (cart.length === 0) {
        checkoutItemsContainer.innerHTML = '<p>Your cart is empty. <a href="page8.html">Continue shopping</a></p>';
        checkoutTotalElement.textContent = 'LKR 0.00';
    } else {
        let html = `
            <table class="cart-table">
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Price</th>
                        <th>Qty</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
        `;

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            html += `
                <tr>
                    <td>${item.title}</td>
                    <td>LKR ${item.price.toLocaleString()}</td>
                    <td>${item.quantity}</td>
                    <td>LKR ${itemTotal.toLocaleString()}</td>
                </tr>
            `;
        });

        html += `</tbody></table>`;
        checkoutItemsContainer.innerHTML = html;
        checkoutTotalElement.textContent = cartTotal;
    }

    // 3. Handle form submission
    document.getElementById('checkoutForm').addEventListener('submit', function(e) {
        e.preventDefault();

        // Collect form data
        const formData = {
            customer: {
                name: document.getElementById('fullName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                address: document.getElementById('address').value
            },
            payment: document.getElementById('payment').value,
            notes: document.getElementById('notes').value,
            items: cart,
            total: cartTotal
        };

        // Here you would typically send this data to your server
        console.log('Order submitted:', formData);
        
        // For demo purposes, we'll just show a confirmation
        alert(`Order confirmed! Thank you for your purchase.\nTotal: ${cartTotal}`);
        
        // Clear cart and redirect
        sessionStorage.removeItem('cart');
        sessionStorage.removeItem('cartTotal');
        window.location.href = 'page9.html';
    });

    // 4. If cart is empty, disable the form
    if (cart.length === 0) {
        document.querySelectorAll('#checkoutForm input, #checkoutForm select, #checkoutForm textarea').forEach(element => {
            element.disabled = true;
        });
        document.querySelector('.submit-order-btn').disabled = true;
    }
});