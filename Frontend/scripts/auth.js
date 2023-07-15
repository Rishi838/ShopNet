import {  login_listner, login_on_signup, resend_listner, signup_listner, signup_on_login, validate_user } from '../frontend_utils/login_script.js'
// Function to validate user that whether it should  access page or not
validate_user()
var m1 = document.getElementById("m1");

// For Signup Form
var m2 = document.getElementById("m2");


var m3 = document.getElementById("m3");

// For Logout Btn
var m4 = document.getElementById("m4");


// When user enter credentials and click on login btn for verifying
document.getElementById('login').addEventListener('click', login_listner)
// When user enter credentials and click on signup btn for verifying
document.getElementById('signup').addEventListener('click', signup_listner)



// Redirect to login popup from signup
document.getElementById('login_on_signup').addEventListener('click', login_on_signup)
// Redirect to signup popup from login
document.getElementById('signup_on_login').addEventListener('click', signup_on_login)