const orders = require('../models/orders')
require('dotenv').config()

module.exports.order_place = async(req,res) =>{
    const accessToken = await generate_paypal_access_token()
    console.log(accessToken)
    res.send("Hello")
}
module.exports.payment_verify = async(req,res) =>{
    res.send("Hello")
}

initiate_payment = async(orderId, ammount) =>{

}

payment_confirmation = async(paymentId) =>{

}

generate_paypal_access_token = async() =>{
    const response = await axios.post(
        `${process.env.PAYPAL_API_BASE_URL}/v1/oauth2/token`,
        'grant_type=client_credentials',
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          auth: {
            username: process.env.PAYPAL_CLIENT_ID,
            password: process.env.PAYPAL_SECRET
          }
        }
      );
    
      return response.data.access_token;
}
