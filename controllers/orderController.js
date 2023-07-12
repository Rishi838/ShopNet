const orders = require("../models/orders");
const axios = require("axios");
require("dotenv").config();

const clientId = process.env.PAYPAL_CLIENT_ID;
const clientSecret = process.env.PAYPAL_SECRET;

module.exports.order_place = async (req, res) => {
  try {
    // Initialising an order item with default payment status as unverified
    const order = await orders.create({
      user: req.user._id,
      products: req.body.items,
      totalAmount: 15,
      shippingAddress: req.body.address,
    });
    // Generate an access token for merchant or buisness id
    const accessToken = await generateAccessToken();
    console.log(accessToken)
    // Set up the API request body
    const requestBody = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: "15.00", // Replace with the actual order total
          },
        },
      ],
    };

    // Make the API request to create the payment by hitting the order api of paypal
    const response = await axios.post(
      "https://api.sandbox.paypal.com/v2/checkout/orders",
      requestBody,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // Extract the PayPal Order ID from the response
    console.log(response.data)
    const paypalOrderId = response.data.id;
    console.log("order placed" , order._id)
    // Return the PayPal Order ID to the frontend
   return res.status(404).json({ orderId: paypalOrderId ,orderDatabaseId : order._id });
  } catch (error) {
    console.error("Error initiating payment:", error);
    // Handle any errors during the payment initiation process
    return res.status(500).json({ error: "Payment initiation error" });
  }
};
module.exports.payment_verify = async (req, res) => {
  // Fetch the order id whose payment has to be verified
  const paypalOrderId = req.body.orderId;
  const orderDatabaseId = req.params.orderDatabaseId
  try {
    // Generate access token
    const accessToken = await generateAccessToken();

    // Make the API request to get the payment details and check what is the current status of the payment
    const response = await axios.get(
      `https://api.sandbox.paypal.com/v2/checkout/orders/${paypalOrderId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // Check the payment status from the response
    const status = response.data.status;
    console.log(status)
    //  If the payment status is approved that means we now need to move one step further
    if (status === "APPROVED") {
      // Hit capture api to verify the payment
      const response = await axios.post(
        `https://api.sandbox.paypal.com/v2/checkout/orders/${paypalOrderId}/capture`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      // Check the payment status from the response
      const status = response.data.status;
      console.log(status)
      if (status === "COMPLETED") {
        // Update the order status in database to verified
        console.log(orderDatabaseId)
        const update_status = await orders.findOne({_id : orderDatabaseId})
        console.log(update_status)
        update_status.paymentVerified = true
        await update_status.save()
        console.log(update_status)
        // Payment captured successfully
        console.log("True")
        return res.status(200).json({ success: true });
      } else {
        // Payment capture failed
       return  res.status(500).json({ success: false });
      }
    } else {
      // Payment verification failed
      return res.status(500).json({ success: false });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    // Handle any errors during the payment verification process
  return res
      .status(500)
      .json({ success: false, error: "Payment verification error" });
  }
};

// Function to generate access token for our merchant id
async function generateAccessToken() {
  // Hitting the paypal api to generate access token
  const response = await axios.post(
    "https://api.sandbox.paypal.com/v1/oauth2/token",
    `grant_type=client_credentials`,
    {
      auth: {
        username: clientId,
        password: clientSecret,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
// Return the access token returned by the api
  return response.data.access_token;
}
