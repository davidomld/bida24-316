document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements for Address Section
    const addressSection = document.getElementById('address-section');
    const addressForm = document.getElementById('address-form');
    const fullNameInput = document.getElementById('fullName');
    const addressLine1Input = document.getElementById('addressLine1');
    const addressLine2Input = document.getElementById('addressLine2');
    const cityInput = document.getElementById('city');
    const stateInput = document.getElementById('state');
    const zipCodeInput = document.getElementById('zipCode');
    const countryInput = document.getElementById('country');
    const phoneNumberInput = document.getElementById('phoneNumber');
    const emailInput = document.getElementById('email');
    const addressErrorsDiv = document.getElementById('address-errors');
    const nextToPaymentButton = document.getElementById('next-to-payment-button');

    // DOM Elements for Payment Section
    const paymentSection = document.getElementById('payment-section');
    const paymentForm = document.getElementById('payment-form');
    const nameOnCardInput = document.getElementById('nameOnCard');
    const cardNumberInput = document.getElementById('cardNumber');
    const expiryDateInput = document.getElementById('expiryDate');
    const cvcInput = document.getElementById('cvc');
    const paymentErrorsDiv = document.getElementById('payment-errors');
    const submitButton = document.getElementById('submit-button');
    const backToAddressButton = document.getElementById('back-to-address-button');

    // Progress Indicator
    const checkoutProgress = document.getElementById('checkout-progress');
    const currentStepText = document.getElementById('current-step-text');

    let currentStep = 1; // 1 for Address, 2 for Payment
    let shippingDetails = {}; // To store validated address details

    // --- Form Input Formatting ---

    // Function to format card number input (add spaces every 4 digits)
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

    // --- Form Step Management ---

    function showStep(step) {
        currentStep = step;
        if (currentStep === 1) {
            addressSection.classList.remove('d-none');
            paymentSection.classList.add('d-none');
            checkoutProgress.style.width = '50%';
            currentStepText.textContent = 'Step 1: Shipping Address';
        } else if (currentStep === 2) {
            addressSection.classList.add('d-none');
            paymentSection.classList.remove('d-none');
            checkoutProgress.style.width = '100%';
            currentStepText.textContent = 'Step 2: Payment Details';
        }
    }

    // --- Address Form Submission ---
    addressForm.addEventListener('submit', (event) => {
        event.preventDefault();
        addressErrorsDiv.textContent = ''; // Clear previous errors

        let isValid = true;

        // Basic validation for address fields
        if (fullNameInput.value.trim() === '') {
            addressErrorsDiv.textContent = 'Full Name is required.';
            isValid = false;
        } else if (addressLine1Input.value.trim() === '') {
            addressErrorsDiv.textContent = 'Address Line 1 is required.';
            isValid = false;
        } else if (cityInput.value.trim() === '') {
            addressErrorsDiv.textContent = 'City is required.';
            isValid = false;
        } else if (zipCodeInput.value.trim() === '') {
            addressErrorsDiv.textContent = 'Zip/Postal Code is required.';
            isValid = false;
        } else if (countryInput.value.trim() === '') {
            addressErrorsDiv.textContent = 'Country is required.';
            isValid = false;
        } else if (emailInput.value.trim() === '' || !emailInput.value.includes('@')) {
            addressErrorsDiv.textContent = 'A valid Email Address is required.';
            isValid = false;
        }

        if (isValid) {
            // Store shipping details (in a real app, you'd send this to a backend)
            shippingDetails = {
                fullName: fullNameInput.value.trim(),
                addressLine1: addressLine1Input.value.trim(),
                addressLine2: addressLine2.value.trim(),
                city: cityInput.value.trim(),
                state: stateInput.value.trim(),
                zipCode: zipCodeInput.value.trim(),
                country: countryInput.value.trim(),
                phoneNumber: phoneNumberInput.value.trim(),
                email: emailInput.value.trim()
            };
            console.log('Shipping Details:', shippingDetails); // For debugging
            showStep(2); // Move to payment section
        }
    });

    // --- Payment Form Submission ---
    paymentForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent default form submission

        paymentErrorsDiv.textContent = ''; // Clear previous errors
        let isValid = true;

        // Basic client-side validation for demonstration
        if (nameOnCardInput.value.trim() === '') {
            paymentErrorsDiv.textContent = 'Name on Card is required.';
            isValid = false;
        } else if (cardNumberInput.value.trim().replace(/\s/g, '').length < 16 || !cardNumberInput.value.replace(/\s/g, '').match(/^\d+$/)) {
            paymentErrorsDiv.textContent = 'Please enter a valid card number (16 digits).';
            isValid = false;
        } else if (!expiryDateInput.value.trim().match(/^(0[1-9]|1[0-2])\/([0-9]{2})$/)) {
            paymentErrorsDiv.textContent = 'Please enter a valid expiry date (MM/YY format).';
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
                cardNumber: cardNumberInput.value, // In a real app, never send this to console or store unprotected
                expiry: expiryDateInput.value,
                cvc: cvcInput.value // In a real app, never send this to console or store unprotected
            });

            // Simulate a delay for processing (e.g., a "network call" delay)
            setTimeout(() => {
                alert('Order placed successfully! (This is a simulation)');

                // Clear the cart after "successful" payment
                localStorage.removeItem('cartItems');
                localStorage.removeItem('cartCount');
                localStorage.removeItem('cartTotal');

                // Update cart display (if cart.js is loaded and has this function)
                if (typeof updateCartDisplay === 'function') {
                    updateCartDisplay();
                }

                // Redirect to a thank you or order confirmation page
                window.location.href = 'order-success.html';
            }, 2000); // 2-second delay to mimic processing
        }
    });

    // --- Navigation Buttons ---
    backToAddressButton.addEventListener('click', () => {
        showStep(1); // Go back to address section
    });

    // Initial load: show the address section
    showStep(1);

    // Optional: Call updateCartDisplay when checkout page loads to show current cart icon count
    if (typeof updateCartDisplay === 'function') {
        updateCartDisplay();
    }
});
