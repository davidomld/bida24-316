// js/cart.js

// --- Cart Data Storage and Management ---
let cart = []; // This will hold our cart items

/**
 * Loads the cart from localStorage.
 * If no cart is found, initializes an empty array.
 */
function loadCart() {
    try {
        const storedCart = localStorage.getItem('gemmesEtBijouxCart');
        cart = storedCart ? JSON.parse(storedCart) : [];
    } catch (e) {
        console.error("Error loading cart from localStorage:", e);
        cart = []; // Fallback to empty cart on error
    }
}

/**
 * Saves the current cart to localStorage.
 */
function saveCart() {
    try {
        localStorage.setItem('gemmesEtBijouxCart', JSON.stringify(cart));
    } catch (e) {
        console.error("Error saving cart to localStorage:", e);
    }
}

/**
 * Adds a product to the cart or increments its quantity if it already exists.
 * @param {object} product - The product object to add.
 * @param {string} product.id - Unique ID of the product.
 * @param {string} product.name - Name of the product.
 * @param {number} product.price - Price of the product.
 * @param {string} product.image - Image path of the product.
 */
function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    saveCart();
    updateCartIcon();
    console.log(`${product.name} added to cart! Current cart:`, cart);
}

/**
 * Updates the quantity of a specific item in the cart.
 * @param {string} productId - The ID of the product to update.
 * @param {number} newQuantity - The new quantity for the product.
 */
function updateCartItemQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (newQuantity > 0) {
            item.quantity = newQuantity;
        } else {
            // If newQuantity is 0 or less, remove the item
            removeFromCart(productId);
            return;
        }
    }
    saveCart();
    updateCartIcon();
    renderCart(); // Re-render cart on cart.html page
    console.log(`Quantity for ${productId} updated to ${newQuantity}. Current cart:`, cart);
}

/**
 * Removes an item from the cart.
 * @param {string} productId - The ID of the product to remove.
 */
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartIcon();
    renderCart(); // Re-render cart on cart.html page
    console.log(`${productId} removed. Current cart:`, cart);
}

/**
 * Calculates the total number of items in the cart (sum of quantities).
 * @returns {number} The total count of items.
 */
function getCartItemCount() {
    return cart.reduce((total, item) => total + item.quantity, 0);
}

/**
 * Calculates the total price of all items in the cart.
 * @returns {number} The total price.
 */
function getCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

/**
 * Updates the cart item count displayed on the shopping bag icon.
 * This function should be called on every page where the icon appears.
 */
function updateCartIcon() {
    const count = getCartItemCount();
    const cartIconCountElements = document.querySelectorAll('#cart-item-count, #cart-icon-count-floating');
    cartIconCountElements.forEach(element => {
        if (element) {
            element.textContent = count;
            // Show/hide the badge based on count
            if (count > 0) {
                element.classList.remove('d-none'); // Ensure it's visible
            } else {
                element.classList.add('d-none'); // Hide if cart is empty
            }
        }
    });
    console.log(`Cart icon updated. Item count: ${count}`);
}

// --- Cart Page Rendering (for cart.html) ---

/**
 * Renders the cart items dynamically on the cart.html page.
 */
function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalElement = document.getElementById('cart-total');
    // >>> ADDED THESE TWO LINES (Crucial for showing/hiding summary and empty message) <<<
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const cartSummaryContainer = document.getElementById('cart-summary-container');

    // >>> UPDATED THE CHECK TO INCLUDE THE NEW ELEMENTS <<<
    if (!cartItemsContainer || !cartTotalElement || !emptyCartMessage || !cartSummaryContainer) {
        // This function is only for cart.html, so skip if elements aren't found
        return;
    }

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = ''; // Clear items (important if going from full to empty)
        emptyCartMessage.classList.remove('d-none'); // Show empty message
        cartSummaryContainer.classList.add('d-none');   // Hide summary container and buttons

        cartTotalElement.textContent = '0.00';
        // These 'disabled' settings will apply if the buttons are hidden anyway
        document.getElementById('checkout-btn').disabled = true;
        document.getElementById('continue-shopping-btn').disabled = false;
        console.log("Cart is empty. Displaying empty cart message.");
        return;
    }

    // If cart is NOT empty:
    emptyCartMessage.classList.add('d-none');       // Hide empty message
    cartSummaryContainer.classList.remove('d-none'); // Show summary container and buttons

    document.getElementById('checkout-btn').disabled = false;
    document.getElementById('continue-shopping-btn').disabled = false;

    let cartTableHTML = `
        <table class="table cart-table">
            <thead>
                <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
    `;

    cart.forEach(item => {
        const subtotal = (item.price * item.quantity).toFixed(2);
        cartTableHTML += `
            <tr>
                <td class="d-flex align-items-center">
                    <img src="${item.image}" alt="${item.name}" class="me-3">
                    <span class="product-name">${item.name}</span>
                </td>
                <td>$${parseFloat(item.price).toFixed(2)}</td>
                <td>
                    <div class="quantity-controls">
                        <button class="btn btn-sm decrease-quantity" data-product-id="${item.id}">-</button>
                        <input type="number" value="${item.quantity}" min="1" class="form-control quantity-input" data-product-id="${item.id}">
                        <button class="btn btn-sm increase-quantity" data-product-id="${item.id}">+</button>
                    </div>
                </td>
                <td>$${subtotal}</td>
                <td>
                    <button class="btn btn-sm remove-item-btn" data-product-id="${item.id}">
                        <i class="bi bi-x-circle"></i>
                    </button>
                </td>
            </tr>
        `;
    });

    cartTableHTML += `
            </tbody>
        </table>
    `;

    cartItemsContainer.innerHTML = cartTableHTML;
    cartTotalElement.textContent = getCartTotal().toFixed(2);

    // Add event listeners for quantity controls and remove buttons
    cartItemsContainer.querySelectorAll('.increase-quantity').forEach(button => {
        button.addEventListener('click', (event) => {
            const productId = event.target.dataset.productId;
            const input = cartItemsContainer.querySelector(`.quantity-input[data-product-id="${productId}"]`);
            updateCartItemQuantity(productId, parseInt(input.value) + 1);
        });
    });

    cartItemsContainer.querySelectorAll('.decrease-quantity').forEach(button => {
        button.addEventListener('click', (event) => {
            const productId = event.target.dataset.productId;
            const input = cartItemsContainer.querySelector(`.quantity-input[data-product-id="${productId}"]`);
            updateCartItemQuantity(productId, parseInt(input.value) - 1);
        });
    });

    cartItemsContainer.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', (event) => {
            const productId = event.target.dataset.productId;
            let newQuantity = parseInt(event.target.value);
            if (isNaN(newQuantity) || newQuantity < 0) {
                newQuantity = 1; // Default to 1 if invalid input
                event.target.value = 1;
            }
            updateCartItemQuantity(productId, newQuantity);
        });
    });

    cartItemsContainer.querySelectorAll('.remove-item-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const productId = event.target.closest('button').dataset.productId;
            removeFromCart(productId);
        });
    });
    console.log("Cart rendered. Current cart items:", cart);
}

// --- Event Listeners and Initial Load ---

document.addEventListener('DOMContentLoaded', () => {
    loadCart(); // Load cart when any page loads
    updateCartIcon(); // Update cart icon on any page load

    // Attach listeners for "Add to Cart" buttons if present on the page
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    if (addToCartButtons.length > 0) {
        console.log(`Found ${addToCartButtons.length} "Add to Cart" buttons. Attaching listeners.`);
        addToCartButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const product = {
                    id: event.target.dataset.productId,
                    name: event.target.dataset.productName,
                    price: parseFloat(event.target.dataset.productPrice),
                    image: event.target.dataset.productImage
                };
                addToCart(product);
            });
        });
    } else {
        console.log("No 'Add to Cart' buttons found on this page.");
    }

    // Only render cart if on cart.html page
    if (document.getElementById('cart-items-container')) {
        renderCart();
    }

    // Checkout button functionality
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length > 0) {
                cart = []; // Clear the cart
                saveCart();
                updateCartIcon();
                renderCart(); // Re-render to show empty cart message
                alert("Proceeding to checkout! (Cart has been cleared for this demo.)");
            } else {
                alert("Your cart is empty. Please add items before checking out.");
            }
        });
    }

    // Continue Shopping button functionality
    const continueShoppingBtn = document.getElementById('continue-shopping-btn');
    if (continueShoppingBtn) {
        continueShoppingBtn.addEventListener('click', () => {
            window.location.href = 'collections.html'; // Redirect to collections page
        });
    }
});
