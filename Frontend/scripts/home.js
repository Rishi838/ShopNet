import { postData } from "../frontend_utils/fetch_api.js";
async function validate_user(){
  const result = await postData('/validate' ,{})
  
  if(result.validate == 1){
    document.getElementById('auth').style.display = "none"
    document.getElementById('profile').style.display = "block"
  }else{
    document.getElementById('auth').style.display = "block"
    document.getElementById('profile').style.display = "none"
  }
}
validate_user()
// Navbar js starts here
// define all UI variable
const navToggler = document.querySelector(".nav-toggler");
const navMenu = document.querySelector(".site-navbar ul");
const navLinks = document.querySelectorAll(".site-navbar a");

// load all event listners
allEventListners();

// functions of all event listners
function allEventListners() {
  // toggler icon click event
  navToggler.addEventListener("click", togglerClick);
  // nav links click event
  navLinks.forEach((elem) => elem.addEventListener("click", navLinkClick));
}

// togglerClick function
function togglerClick() {
  navToggler.classList.toggle("toggler-open");
  navMenu.classList.toggle("open");
}

// navLinkClick function
function navLinkClick() {
  if (navMenu.classList.contains("open")) {
    navToggler.click();
  }
}
// Navbar Js ends here
// Carousel js starts here
/*

3D Carousel images gallery. inspired from David DeSandro's tutorial (https://3dtransforms.desandro.com/)

*/

window.addEventListener(
  "load",
  function () {
    carouselRUN();
  },
  false
);

function carouselRUN() {
  var carousel = document.getElementById("carousel");
  var scene = document.getElementById("scene");
  var carousel_items_Arrey = document.getElementsByClassName("carousel_item");
  var carousel_btn = document.getElementById("carousel_btn");
  var n = carousel_items_Arrey.length;
  var curr_carousel_items_Arrey = 0;
  var theta = (Math.PI * 2) / n;
  var interval = null;
  var autoCarousel = carousel.dataset.auto;

  setupCarousel(n, parseFloat(getComputedStyle(carousel_items_Arrey[0]).width));
  window.addEventListener(
    "resize",
    function () {
      clearInterval(interval);
      setupCarousel(
        n,
        parseFloat(getComputedStyle(carousel_items_Arrey[0]).width)
      );
    },
    false
  );
setupNavigation();

function setupCarousel(n, width) {
    var apothem = width / (2 * Math.tan(Math.PI / n));
    scene.style.transformOrigin = `50% 50% ${-apothem}px`;

    for (let i = 1; i < n; i++) {
      carousel_items_Arrey[i].style.transformOrigin = `50% 50% ${-apothem}px`;
      carousel_items_Arrey[i].style.transform = `rotateY(${i * theta}rad)`;
    }

    if (autoCarousel === "true") {
      setCarouselInterval();
    }
  }

  function setCarouselInterval() {
    interval = setInterval(function () {
      curr_carousel_items_Arrey++;
      scene.style.transform = `rotateY(${
        curr_carousel_items_Arrey * -theta
      }rad)`;
    }, 3000);
  }

  function setupNavigation() {
    carousel_btn.addEventListener(
      "click",
      function (e) {
        e.stopPropagation();
        var target = e.target;

        if (target.classList.contains("next")) {
          curr_carousel_items_Arrey++;
        } else if (target.classList.contains("prev")) {
          curr_carousel_items_Arrey--;
        }
        clearInterval(interval);
        scene.style.transform = `rotateY(${
          curr_carousel_items_Arrey * -theta
        }rad)`;

        if (autoCarousel === "true") {
          setTimeout(setCarouselInterval(), 3000);
        }
      },
      true
    );
  }
}

function add_to_cart(Id){
  return async function(){
    const items =[{productId : Id,quantity : 1}]
    const result = await postData('add_to_cart',{items})
    
  }
}

function buy_now(Id,Price){
  return async function(){
    const order_place = await postData('/payments/initiate',{
      "items" : [{product: Id,quantity :1}],
      "TotalPrice" : Price,
      "address" : "16 M.C Colony"
    })
    const orderDatabaseId = order_place.orderDatabaseId;
    const paypalOrderId = order_place.orderId;
    console.log(orderDatabaseId,paypalOrderId)
    paypal
          .Buttons({
            createOrder: function () {
              console.log(paypalOrderId)
              return paypalOrderId;
            },
            onApprove: async function (data) {
                // Make the API request to verify the payment
              const result = await postData(`/payments/${orderDatabaseId}/verify` , {
                orderId: paypalOrderId,
                cartPayment: false
              })
                  if (result.success) {
                    document.getElementById(`${Id}feedback`).style.color = "rgb(67, 160, 57)"
                    document.getElementById(`${Id}feedback`).innerText =`Payment Verified Successfully, Redirecting You to Orders Page
                    `
                    setTimeout(()=>{
                      location.href='/orders'
                    },3000)
    
                  } else {
                    document.getElementById(`${Id}feedback`).style.color = "rgb(151, 37, 37)"
                    document.getElementById(`${Id}feedback`).innerText =`Some Error Occured While verifying payment, Try Again`
                  }
                
            },
          })
          .render(`#${Id}paypal_button`);  
  }
}

async function fetch_products(){
  const products = await postData('/all_product_details',{})
  
  document.getElementById('products').innerHTML=""
  for(let i=0;i<products.length;i++){
    document.getElementById('products').innerHTML += `
    <div class="product">
            <img src="https://images.unsplash.com/photo-1503524921528-8f5fa912ea75?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" width="250px" height="250px" alt="">
            <div class="content">
              <h3><a href="#">${products[i].Name}</a></h3>
              <span><a href="#">${products[i].Price}$</a></span>
            </div>
            <div class="link">
              <button id="${products[i]._id}buy">Buy Now</button>
              <button id="${products[i]._id}cart">Add to Cart</button>
            </div>
            <div id = "${products[i]._id}paypal_button"></div>
            <div id="${products[i]._id}feedback"></div>
            </div>
    `
  }
  for(let i=0;i<products.length;i++){
    if(products.includes(products[i]))
    {
      let element1 = document.getElementById(`${products[i]._id}cart`)
      element1.addEventListener('click' , add_to_cart(products[i]._id))
      let element2 = document.getElementById(`${products[i]._id}buy`)
      element2.addEventListener('click' , buy_now(products[i]._id,products[i].Price))
    }
  }
}
fetch_products()