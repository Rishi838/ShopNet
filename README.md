ShopNet
=========
### About ShopNet

ShopNet is NodeJS, Express and MongoDB based ecommerce app where user can purchase products . It has a paypal payment gateway integrated with it to process payments.

### Features

  - JWT based Safe Authentication System
  - Add to Cart and Order Place Facility
  - PayPal payment gateway
  - Immediate Refund on Payment Cancelation
  - Track your current order status and previous order
  - MVC(Models Views Controllers) Approach for easy understanding and debugging of code

### Install it in your System :
      
      Run `git clone ${Repo_URL}` in the directory you want to install the project
      In the same directory run `npm init` and `npm install` to install required modules
      Run `npm start` to start you Application

### API Information (ONLY for backend developer)

URL = BASE URL of Your Application (Eg : http://localhostL3000) 
- #### Signup Route

Route : `${URL}/signup` <br>
Method : POST <br>
JSON BODY : {<br>
  "name" : "YOUR_NAME_HERE",<br>
  "email" : "YOUR_Email_HERE",<br>
  "password" : "Your_password_here"<br>
  }<br>
<br>
  On successfull request, a verification email is sent to the mentioned email id

- #### Verification Route

This route is to verify the user email and is invoked after the  verification linked is clicked

Route : `${URL}/verify?email=${YOUR_EMAIL_HERE} & token=${Signup Token}` <br>
Method : POST <br>
JSON BODY : {}<br>
  On successfull request, access token and refresh token will be returned and stored as cookie

- #### Login Route

This route is to verify the user email and is invoked after the  verification linked is clicked

Route : `${URL}/login` <br>
Method : POST <br>
JSON BODY : {<br>
  "email" : "YOUR_Email_HERE",<br>
  "password" : "Your_password_here"<br>
  }<br>
  On successfull request, access token and refresh token will be returned and stored as cookie

## Below API's has a middleware enabled, so before hitting on these endpoints make sure you are login and tokens are stored as cookies

- #### Add to Cart Route

Route : `${URL}/add_to_cart` <br>
Method : POST <br>
JSON BODY : {<br>
  "items" : "Items array where each element is JSON object with two fields {productId and quantity} where productId must be a valid product in database",<br>
  }<br>
  On successfull request, all items will be added to the user cart

- #### Fetch Cart Route

Route : `${URL}/fetch_cart` <br>
Method : POST <br>
JSON BODY : {}<br>
  On successfull request, cart associated with the user is fetched

- #### Place Order(Payment Initiation)


Route : `${URL}/payments/initiate` <br>
Method : POST <br>
JSON BODY : {<br>
"items" : "Items array where each element is JSON object with two fields {product and quantity}",<br>
"ammount" : "TOTAL_ORDER_AMOUNT"<br>
"address" : "SHIPPING ADDRESS"<br>
}<br>
  On successfull request, a payment will be initiated and paymentID,orderID wull be returned

 - #### Confirm Order(Payment Verification)


Route : `${URL}/payments/${orderID}/verify` <br>
Method : POST <br>
JSON BODY : {<br>
"orderId" : "YOUR PAYMENTID HERE"<br>
}<br>
  On successfull request, payment will be verified and success status will be returned

- #### Track An Order


Route : `${URL}/orders/${orderID}` <br>
Method : POST <br>
JSON BODY : {}<br>
  On successfull request, all info regarding the order is returned if the order is associated with current user

- #### Track All previous order


Route : `${URL}/orders` <br>
Method : POST <br>
JSON BODY : {}<br>
  On successfull request, information regarding all previous orders is returned

- #### Cancel Order


Route : `${URL}/orders/cancel/${OrderID}` <br>
Method : POST <br>
JSON BODY : {}<br>
  On successfull request, if that order is associated with user, his order will be canceled and his payment will bbe refunded



  
