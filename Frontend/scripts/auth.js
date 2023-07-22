import {  login_listner, resend_listner, signup_listner, validate_user} from '../frontend_utils/login_script.js'
// Function to validate user that whether it should  access page or not
validate_user()
// var m1 = document.getElementById("m1");

// For Signup Form
// var m2 = document.getElementById("m2");


// var m3 = document.getElementById("m3");

// For Logout Btn
// var m4 = document.getElementById("m4");


// When user enter credentials and click on login btn for verifying
document.getElementById('login').addEventListener('click', login_listner)
// When user enter credentials and click on signup btn for verifying
document.getElementById('signup').addEventListener('click', signup_listner)


let signup = document.querySelector(".signup-slider");
let login = document.querySelector(".login-slider");
let slider = document.querySelector(".slider");
let formSection = document.querySelector(".form-section");
 
signup.addEventListener("click", () => {
    slider.classList.add("moveslider");
    formSection.classList.add("form-section-move");
});
 
login.addEventListener("click", () => {
    slider.classList.remove("moveslider");
    formSection.classList.remove("form-section-move");
});