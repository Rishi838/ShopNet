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
      captureId: ""
    });
    // Generate an access token for merchant or buisness id
    const accessToken = await generateAccessToken();
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
    const paypalOrderId = response.data.id;
    // Return the PayPal Order ID to the frontend
    return res.status(404).json({ orderId: paypalOrderId, orderDatabaseId: order._id });
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
      if (status === "COMPLETED") {
        // Update the order status in database to verified
        const result = await orders.findOne({ _id: orderDatabaseId })
        result.paymentVerified = true
        result.status = "Inventory"
        result.captureId = response.data.purchase_units[0].payments.captures[0].id
        await result.save()
        // Payment captured successfully
        console.log("True")
        return res.status(200).json({ success: true });
      } else {
        // Payment capture failed
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
module.exports.get_single_order_details = async (req, res) => {
  try {
    const orderId = req.params.orderId
    const userId = req.user._id

    if(!orderId)
    return res.status(404).json({message : "Please specify the order Id"})

    const result = await orders.findOne({ _id: orderId, user: userId })
    if (!result)
      return res.status(400).json({ message:"No Order with the given id is asociated with this user"})
    else {
      return res.status(200).json({ "Products": result.products, "Ammount": result.totalAmount,status : result.status, "Address": result.shippingAddress, "Order Date": result.createdAt })
    }
  } catch (err) {
    console.log(err)
    res.status(400).json({ message: "Server Error" })
  }
}
module.exports.cancel_order = async(req,res) => {
  try {
    const orderId = req.params.orderId
    const userId = req.user._id

    if(!orderId)
    return res.status(404).json({message : "Please specify the order Id to be canceled"})

    const result = await orders.findOne({ _id: orderId, user: userId })
    if (!result)
      return res.status(400).json({ message:"No Order with the given id is asociated with this user"})
    else {
      result.status = "Cancel"
      result.paymentVerified=false
      const captureId = result.captureId
      const accessToken = await generateAccessToken(); 
      const response = await axios.post(
        `https://api.sandbox.paypal.com/v2/payments/captures/${captureId}/refund`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`, 
          },
        }
      ); 
      console.log("payment refunded",response.data)
      // console.log(response.data)
      await result.save()
      return res.status(200).json({orderId : result._id , message : "Your order has been successfully Canceled" })
    }
  } catch (err) {
    console.log(err.data)
    res.status(400).json({ message: "Server Error" })
  }
}
module.exports.get_all_order_details = async (req,res) =>{
  try{
    const userId = req.user._id
    const result = await orders.find({"user" : userId})
    res.status(200).json({message : "Details Fetched Successfully", orders : result})

  }catch(err)
  {
    console.log(err)
    res.status(404).json({message : "Server Error Occured"})
  }
}

module.exports.change_status = async(req,res) =>{
  try {
    const orderId = req.params.orderId
    const userId = req.user._id
    const status = req.body.status
    if(!orderId)
    return res.status(404).json({message : "Please specify the order Id to be canceled"})

    const result = await orders.findOne({ _id: orderId, user: userId })
    if (!result)
      return res.status(400).json({ message:"No Order with the given id is asociated with this user"})
    else {
      result.status = status
      await result.save()
      return res.status(200).json({orderId : result._id , message : `Your Order Status Has Changed to ${status}` })
    }
  } catch (err) {
    console.log(err)
    res.status(400).json({ message: "Server Error" })
  }
}
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
