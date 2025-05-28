// This is your publishable Stripe key.
// IMPORTANT: Replace 'YOUR_STRIPE_PUBLISHABLE_KEY' with your actual publishable key from your Stripe Dashboard.
// It typically starts with 'pk_test_' for testing.
const stripe = Stripe('YOUR_STRIPE_PUBLISHABLE_KEY');

// Create an instance of Elements.
const elements = stripe.elements();

// Custom styling for the card element to make it look consistent with your Bootstrap form
const style = {
  base: {
    color: '#32325d',
    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    fontSmoothing: 'antialiased',
    fontSize: '16px',
    '::placeholder': {
      color: '#aab7c4'
    },
    lineHeight: '1.5' // Ensure line height matches Bootstrap inputs
  },
  invalid: {
    color: '#fa755a',
    iconColor: '#fa755a'
  }
};

// Create an instance of the card Element.
const card = elements.create('card', { style: style });

// Add an instance of the card Element into the `card-element` div.
card.mount('#card-element');

// Handle real-time validation errors from the card Element.
card.on('change', function(event) {
  const displayError = document.getElementById('card-errors');
  if (event.error) {
    displayError.textContent = event.error.message;
  } else {
    displayError.textContent = '';
  }
});

// Handle form submission.
const form = document.getElementById('payment-form');
form.addEventListener('submit', async function(event) {
  event.preventDefault(); // Stop the form from submitting normally

  const submitButton = document.getElementById('submit-button');
  submitButton.disabled = true; // Disable button to prevent multiple submissions
  submitButton.textContent = 'Processing...';

  const nameOnCard = document.getElementById('nameOnCard').value;

  // Create a token with the card details
  const { token, error } = await stripe.createToken(card, {
    name: nameOnCard // Pass the name from the input field
  });

  if (error) {
    // Inform the user if there was an error.
    const errorElement = document.getElementById('card-errors');
    errorElement.textContent = error.message;
    submitButton.disabled = false; // Re-enable button
    submitButton.textContent = 'Pay Now';
  } else {
    // === IMPORTANT: This is where you would send the token to your backend ===
    console.log('Stripe Token received:', token);
    alert('Payment token generated successfully! (Check console for token details)');

    // In a real application, you would now send this 'token.id' to your backend server
    // (e.g., using fetch() or XMLHttpRequest).
    // Your backend would then use Stripe's server-side library with your SECRET KEY
    // to process the actual charge.

    // Example of a fetch call to a backend (THIS WILL NOT WORK WITHOUT A SERVER):
    /*
    const cartTotal = localStorage.getItem('cartTotal') || 0; // Assuming cartTotal is stored

    try {
        const response = await fetch('/process-payment', { // Your backend endpoint
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                stripeToken: token.id,
                // Stripe expects amount in cents/lowest currency unit (e.g., $10.00 is 1000 cents)
                amount: Math.round(parseFloat(cartTotal) * 100),
                currency: 'usd', // Or your specific currency, e.g., 'BWP' for Botswana Pula
                description: 'Gemmes et Bijoux purchase',
                name: nameOnCard
            }),
        });

        const data = await response.json();

        if (data.success) {
            alert('Payment successful!');
            // Clear cart and redirect to a success page
            localStorage.removeItem('cartItems');
            localStorage.removeItem('cartCount');
            localStorage.removeItem('cartTotal');
            window.location.href = 'order-success.html'; // Create an order-success.html page
        } else {
            alert('Payment failed: ' + (data.message || 'Unknown error'));
            submitButton.disabled = false;
            submitButton.textContent = 'Pay Now';
        }
    } catch (error) {
        console.error('Network or server error:', error);
        alert('A network error occurred. Please try again.');
        submitButton.disabled = false;
        submitButton.textContent = 'Pay Now';
    }
    */

    // FOR DEMONSTRATION ONLY (Since you don't have a backend yet):
    // We'll simulate a slight delay and then enable the button again.
    // In a real application, the success/failure logic above would replace this.
    setTimeout(() => {
        alert("Simulated: Card details tokenized successfully! (Actual payment requires a backend)");
        submitButton.disabled = false;
        submitButton.textContent = 'Pay Now';
        // You can add a client-side redirect here if you want to immediately go to a "thank you" page
        // window.location.href = 'order-success.html'; // Example redirect
    }, 1500);

  }
});

// Optional: You might want to update the cart icon count on this page as well
// if you have a separate cart.js or common functions
document.addEventListener('DOMContentLoaded', () => {
  // If you have a function like updateCartDisplay in cart.js, call it here:
  if (typeof updateCartDisplay === 'function') {
    updateCartDisplay();
  }
});
