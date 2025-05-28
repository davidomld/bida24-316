// js/checkout.js

document.addEventListener('DOMContentLoaded', () => {
    const orderSummaryList = document.getElementById('checkout-order-summary-list');
    const orderTotalElement = document.getElementById('checkout-order-total');
    const cartItemCountElement = document.getElementById('checkout-cart-item-count');
    const placeOrderBtn = document.getElementById('place-order-btn');

    // Function to load and display cart items on the checkout page
    function displayOrderSummary() {
        const cartItems = JSON.parse(localStorage.getItem('gemmesEtBijouxCart')) || [];
        orderSummaryList.innerHTML = ''; // Clear existing items

        let total = 0;
        let totalCount = 0;

        if (cartItems.length === 0) {
            orderSummaryList.innerHTML = `
                <li class="list-group-item d-flex justify-content-between align-items-center text-muted">
                    Your cart is empty.
                </li>
            `;
            if (placeOrderBtn) { // Check if button exists before disabling
                placeOrderBtn.disabled = true; // Disable order button if cart is empty
            }
        } else {
            cartItems.forEach(item => {
                const subtotal = (item.price * item.quantity).toFixed(2);
                const listItem = document.createElement('li');
                listItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'lh-sm');
                listItem.innerHTML = `
                    <div>
                        <h6 class="my-0">${item.name}</h6>
                        <small class="text-muted">Quantity: ${item.quantity}</small>
                    </div>
                    <span class="text-muted">$${subtotal}</span>
                `;
                orderSummaryList.appendChild(listItem);
                total += item.price * item.quantity;
                totalCount += item.quantity;
            });
            if (placeOrderBtn) { // Check if button exists before enabling
                placeOrderBtn.disabled = false; // Enable order button
            }
        }

        // Add the total item to the end of the list
        // Only append total if cart is not empty or if you want to show 0.00
        // (the current logic adds it even for empty, which is fine)
        const totalListItem = document.createElement('li');
        totalListItem.classList.add('list-group-item', 'd-flex', 'justify-content-between');
        totalListItem.innerHTML = `
            <span>Total (USD)</span>
            <strong>$${total.toFixed(2)}</strong>
        `;
        orderSummaryList.appendChild(totalListItem);


        orderTotalElement.textContent = `$${total.toFixed(2)}`;
        cartItemCountElement.textContent = totalCount;
    }

    // Handle Place Order button click
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', (event) => {
            // Prevent default form submission for now (we're not sending to a server)
            event.preventDefault();

            const form = document.querySelector('.needs-validation');
            if (form) { // Ensure form exists
              if (!form.checkValidity()) {
                form.classList.add('was-validated');
                return; // Stop if form is not valid
              }
            }


            // In a real application, you would collect form data here
            // and send it to a backend server for processing payment and order fulfillment.

            alert('Order Placed Successfully! (This is a demo. No real payment processed.)');

            // Clear the cart after a successful "order"
            localStorage.removeItem('gemmesEtBijouxCart');

            // Redirect to a confirmation page or home page
            window.location.href = 'index.html'; // Or 'order-confirmation.html'
        });
    }

    // Initial display of order summary when page loads
    displayOrderSummary();

    // Call updateCartIcon from cart.js (if cart.js is loaded) to update the floating icon
    // This assumes cart.js is loaded after checkout.js or globally
    if (typeof updateCartIcon === 'function') {
        updateCartIcon();
    }
});
