document.addEventListener('DOMContentLoaded', () => {
    const products = [
        // Rings
        { id: 'ring1', name: 'Classic Solitaire Ring', price: 1890.00, imageUrl: 'images/rings/ring1.jpg', category: 'rings' },
        { id: 'ring2', name: 'Vintage Emerald Ring', price: 2500.00, imageUrl: 'images/rings/ring2.jpg', category: 'rings' },
        { id: 'ring3', name: 'Diamond Pave Band', price: 1200.00, imageUrl: 'images/rings/ring3.jpg', category: 'rings' },
        { id: 'ring4', name: 'Modern Sculptural Ring', price: 1550.00, imageUrl: 'images/rings/ring4.jpg', category: 'rings' },

        // Timepieces & Watches
        { id: 'watch1', name: 'Elegant Leather Watch', price: 450.00, imageUrl: 'images/watches/watch1.jpg', category: 'watches' },
        { id: 'watch2', name: 'Luxury Chronograph', price: 890.00, imageUrl: 'images/watches/watch2.jpg', category: 'watches' },
        { id: 'watch3', name: 'Minimalist Dress Watch', price: 320.00, imageUrl: 'images/watches/watch3.jpg', category: 'watches' },
        { id: 'watch4', name: 'Sophisticated Dive Watch', price: 670.00, imageUrl: 'images/watches/watch4.jpg', category: 'watches' },

        // Necklaces & Pendants
        { id: 'necklace1', name: 'Diamond Solitaire Necklace', price: 2100.00, imageUrl: 'images/necklaces/necklace1.jpg', category: 'necklaces' },
        { id: 'necklace2', name: 'Cultured Pearl Necklace', price: 780.00, imageUrl: 'images/necklaces/necklace2.jpg', category: 'necklaces' },
        { id: 'necklace3', name: 'Art Deco Gemstone Necklace', price: 1350.00, imageUrl: 'images/necklaces/necklace3.jpg', category: 'necklaces' },
        { id: 'necklace4', name: 'Personalized Engraved Pendant', price: 490.00, imageUrl: 'images/necklaces/necklace4.jpg', category: 'necklaces' },

        // Earrings
        { id: 'earring1', name: 'Classic Diamond Studs', price: 950.00, imageUrl: 'images/earrings/earring1.jpg', category: 'earrings' },
        { id: 'earring2', name: 'Pearl Drop Earrings', price: 620.00, imageUrl: 'images/earrings/earring2.jpg', category: 'earrings' },
        { id: 'earring3', name: 'Modern Gold Hoops', price: 300.00, imageUrl: 'images/earrings/earring3.jpg', category: 'earrings' },
        { id: 'earring4', name: 'Statement Chandelier Earrings', price: 1100.00, imageUrl: 'images/earrings/earring4.jpg', category: 'earrings' }
    ];

    function createProductCard(product) {
        const cardCol = document.createElement('div');
        cardCol.className = 'item-card'; // Use item-card for consistent styling

        cardCol.innerHTML = `
            <img src="${product.imageUrl}" alt="${product.name}">
            <div class="card-body">
                <h4>${product.name}</h4>
                <p>$${product.price.toFixed(2)}</p>
                <button class="btn btn-primary add-to-cart-btn" data-product-id="${product.id}">Add to Cart</button>
            </div>
        `;
        return cardCol;
    }

    function loadProducts() {
        const ringsContainer = document.getElementById('rings-collection');
        const watchesContainer = document.getElementById('watches-collection');
        const necklacesContainer = document.getElementById('necklaces-collection');
        const earringsContainer = document.getElementById('earrings-collection');

        products.forEach(product => {
            const productCard = createProductCard(product);
            if (product.category === 'rings') {
                ringsContainer.appendChild(productCard);
            } else if (product.category === 'watches') {
                watchesContainer.appendChild(productCard);
            } else if (product.category === 'necklaces') {
                necklacesContainer.appendChild(productCard);
            } else if (product.category === 'earrings') {
                earringsContainer.appendChild(productCard);
            }
        });

        // Add event listeners for "Add to Cart" buttons
        document.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const productId = event.target.dataset.productId;
                const productToAdd = products.find(p => p.id === productId);
                if (productToAdd) {
                    addToCart(productToAdd);
                    alert(`${productToAdd.name} added to cart!`);
                }
            });
        });
    }

    // Load products when the DOM is ready
    loadProducts();

    // Call updateCartDisplay if it exists (from cart.js)
    if (typeof updateCartDisplay === 'function') {
        updateCartDisplay();
    }
});
