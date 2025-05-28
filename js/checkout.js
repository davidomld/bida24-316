document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('payment-form');
    const nameOnCardInput = document.getElementById('nameOnCard');
    const cardNumberInput = document.getElementById('cardNumber');
    const expiryDateInput = document.getElementById('expiryDate');
    const cvcInput = document.getElementById('cvc');
    const submitButton = document.getElementById('submit-button');
    const paymentErrorsDiv = document.getElementById('payment-errors');

    // Function to format card number input
    cardNumberInput.addEventListener('input', (event) => {
        let value = event.target.value.replace(/\s+/g, ''); // Remove existing spaces
        let formattedValue = '';
        for (let i = 0; i < value.length; i++) {
            if (i > 0 && i % 4 === 0) {
                formattedValue += ' ';
            }
            formattedValue += value[i];
        }
        event.target.value = formattedValue;
    });

    // Function to format expiry date input (MM/YY)
    expiryDateInput.addEventListener('input', (event) => {
        let value = event.target.value.replace(/\D/g, ''); // Remove non-digits
        if (value.length > 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        event.target.value = value;
    });


    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent default form submission

        paymentErrorsDiv.textContent = ''; // Clear previous errors
        let isValid = true;

        // Basic client-side validation for demonstration
        if (nameOnCardInput.value.trim() === '') {
            paymentErrorsDiv.textContent = 'Name on Card is required.';
            isValid = false;
        } else if (cardNumberInput.value.trim().length < 16 || !cardNumberInput.value.replace(/\s/g, '').match(/^\d+$/)) {
            paymentErrorsDiv.textContent = 'Please enter a valid card number.';
            isValid = false;
        } else if (!expiryDateInput.value.trim().match(/^(0[1-9]|1[0-2])\/([0-9]{2})$/)) {
            paymentErrorsDiv.textContent = 'Please enter a valid expiry date (MM/YY).';
            isValid = false;
        } else if (!cvcInput.value.trim().match(/^\d{3,4}$/)) {
            paymentErrorsDiv.textContent = 'Please enter a valid CVC (3 or 4 digits).';
            isValid = false;
        }

        if (isValid) {
            submitButton.disabled = true;
            submitButton.textContent = 'Processing...';
            
            // --- Simulate a successful payment ---
            console.log('Simulating payment with details:', {
                name: nameOnCardInput.value,
                cardNumber: cardNumberInput.value,
                expiry: expiryDateInput.value,
                cvc: cvcInput.value
            });

            // Simulate a delay for processing
            setTimeout(() => {
                alert('Order placed successfully! (This is a simulation)');

                // Clear the cart after "successful" payment
                localStorage.removeItem('cartItems');
                localStorage.removeItem('cartCount');
                localStorage.removeItem('cartTotal');

                // Update cart display (if cart.js is loaded)
                if (typeof updateCartDisplay === 'function') {
                    updateCartDisplay();
                }

                // Redirect to a thank you or order confirmation page
                window.location.href = 'order-success.html'; // You would need to create this page
            }, 2000); // 2-second delay
        }
    });

    // Optional: Call updateCartDisplay if cart.js is loaded
    if (typeof updateCartDisplay === 'function') {
        updateCartDisplay();
    }
});
