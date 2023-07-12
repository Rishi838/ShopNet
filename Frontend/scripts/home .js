function initiatePayment() {
 
    fetch(`/payments/initiate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // Include necessary payment data
          "items": [
            {
              product: "64ab0d9d46ffbca2531a4141",
              quantity: 3,
            },
          ],
          "address": "Hello"
        // ...
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        const orderDatabaseId = data.orderDatabaseId
        const paypalOrderId = data.orderId;

        // Render the PayPal button with the obtained PayPal Order ID
        paypal.Buttons({
          createOrder: function () {
            return paypalOrderId
          },
          onApprove: function (data) {
            console.log(data)
            // Make the API request to verify the payment
            fetch(`/payments/${orderDatabaseId}/verify`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                orderId: data.orderID,
              }),
            })
              .then((response) => response.json())
              .then((data) => {
                if (data.success) {
                  // Payment verified successfully
                  // Proceed with further actions
                } else {
                  // Payment verification failed
                }
              });
          },
        }).render('#paypal-button-container');
      })
      .catch((error) => {
        console.error('Error:', error);
        // Handle any errors during the payment initiation process
      });
  }