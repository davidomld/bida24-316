// js/checkout.js

document.addEventListener('DOMContentLoaded', () => {
    // We need to load the cart again specifically for the checkout page
    // The loadCart() function from cart.js should already be available globally
    loadCart(); // This populates the 'cart' array

    const checkoutCartItemCount = document.getElementById('checkout-cart-item-count');
    const checkoutOrderSummaryList = document.getElementById('checkout-order-summary-list');
    const checkoutOrderTotal = document.getElementById('checkout-order-total');
    const placeOrderBtn = document.getElementById('place-order-btn');
    const checkoutForm = document.querySelector('.needs-validation'); // Get the form

    /**
     * Renders the order summary in the checkout page's sidebar.
     */
    function renderOrderSummary() {
        if (!checkoutOrderSummaryList || !checkoutOrderTotal || !checkoutCartItemCount) {
            console.warn("Checkout summary elements not found. Skipping order summary rendering.");
            return;
        }

        checkoutCartItemCount.textContent = getCartItemCount();
        checkoutOrderTotal.textContent = `$${getCartTotal().toFixed(2)}`;

        checkoutOrderSummaryList.innerHTML = ''; // Clear previous items

        if (cart.length === 0) {
            const emptyMessage = document.createElement('li');
            emptyMessage.className = 'list-group-item text-muted';
            emptyMessage.textContent = 'Your cart is empty.';
            checkoutOrderSummaryList.appendChild(emptyMessage);
            // Disable place order button if cart is empty
            if (placeOrderBtn) {
                placeOrderBtn.disabled = true;
                placeOrderBtn.textContent = 'Cart is Empty';
            }
        } else {
            cart.forEach(item => {
                const li = document.createElement('li');
                li.className = 'list-group-item d-flex justify-content-between lh-sm';
                li.innerHTML = `
                    <div>
                        <h6 class="my-0">${item.name}</h6>
                        <small class="text-muted">Quantity: ${item.quantity}</small>
                    </div>
                    <span class="text-muted">$${(item.price * item.quantity).toFixed(2)}</span>
                `;
                checkoutOrderSummaryList.appendChild(li);
            });

            // Add the total row back after the items
            const totalLi = document.createElement('li');
            totalLi.className = 'list-group-item d-flex justify-content-between';
            totalLi.innerHTML = `
                <span>Total (USD)</span>
                <strong id="checkout-order-total">$${getCartTotal().toFixed(2)}</strong>
            `;
            checkoutOrderSummaryList.appendChild(totalLi);

            // Re-enable place order button if cart has items
            if (placeOrderBtn) {
                placeOrderBtn.disabled = false;
                placeOrderBtn.textContent = 'Place Order';
            }
        }
    }

    // Call renderOrderSummary when the page loads
    renderOrderSummary();

    // --- Place Order Button / Form Submission Logic ---
    if (checkoutForm && placeOrderBtn) {
        checkoutForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent default form submission

            // Bootstrap's validation check
            if (!checkoutForm.checkValidity()) {
                event.stopPropagation();
                checkoutForm.classList.add('was-validated');
                console.log("Form validation failed.");
                return; // Stop if form is not valid
            }

            // --- Simulate Payment Processing ---
            // In a real application, you would send data to a backend here
            // and await a response from a payment gateway.
            console.log("Form is valid. Simulating order placement...");

            // Disable button to prevent multiple submissions
            placeOrderBtn.disabled = true;
            placeOrderBtn.textContent = 'Processing...';

            // Simulate a delay for payment processing
            setTimeout(() => {
                // Check if cart is still not empty (shouldn't be if form was valid)
                if (cart.length > 0) {
                    // --- Payment Success Simulation ---
                    alert("Order placed successfully! Redirecting to confirmation page.");

                    // Clear the cart after successful order
                    cart = [];
                    saveCart(); // Save the empty cart to localStorage
                    updateCartIcon(); // Update cart icon across site

                    // Redirect to payment success page
                    window.location.href = 'payment-success.html';
                } else {
                    alert("Your cart is empty. Please add items before checking out.");
                    placeOrderBtn.disabled = false; // Re-enable button
                    placeOrderBtn.textContent = 'Place Order';
                    renderOrderSummary(); // Re-render summary
                }
            }, 2000); // Simulate 2-second processing time
        });
    }
});
