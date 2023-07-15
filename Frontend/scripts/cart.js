import { postData } from "../frontend_utils/fetch_api.js";
async function validate_user() {
  const result = await postData("/validate", {});
  if (result.validate == 0) {
    document.querySelector("body").innerHTML =
      "<h1>Please Authenticate Yourself before accessing your cart,Redirecting You to Login Page</h1>";
    setTimeout(() => {
      location.href = "/auth";
    }, 3000);
  }
}
validate_user();

function change_listner(Currentkey, price) {
  return async function () {
    const new_quantity = document.getElementById(`${Currentkey}quantity`).value;
    const result = await postData("/change_quantity", {
      productId: Currentkey,
      quantity: parseInt(new_quantity),
    });
    const new_total = new_quantity * price;
    document.getElementById(`${Currentkey}total`).innerText = `${new_total}`;
    document.getElementById('basket-subtotal').innerHTML = `${result.TotalPrice}`
    document.getElementById('basket-total').innerHTML = `${result.TotalPrice}`
    document.getElementById('paypal-button-container').innerHTML = ""
  };
}
function remove_listner(Currentkey) {
  return async function () {
    const result = await postData("/remove_from_cart", {
      productId: Currentkey,
    });
    document.getElementById('basket-subtotal').innerHTML = `${result.TotalPrice}`
    document.getElementById('basket-total').innerHTML = `${result.TotalPrice}`
    document.getElementById('paypal-button-container').innerHTML = ""
    fetch_cart();
  };
}
async function fetch_cart() {
  const cart_data = await postData("/fetch_cart", {});
  const success = cart_data.success;
  if (success == 0 || Object.keys(cart_data.cart).length == 0) {
    document.getElementById("cart-items").innerHTML =
      "This user has no elements in his cart";
  } else if (success == 1) {
    const cart_items = cart_data.cart;
    document.getElementById('basket-subtotal').innerHTML = `${cart_data.TotalPrice}`
    document.getElementById('basket-total').innerHTML = `${cart_data.TotalPrice}`
    document.getElementById("cart-items").innerHTML = "";
    for (let key in cart_items) {
      const quantity = cart_items[key];
      const result = await postData("/get_product_details", {
        productId: key,
      });
      const details = result.details;
      const subtotal = quantity * details.Price;
      document.getElementById("cart-items").innerHTML += `
      <div class="basket-product">
        <div class="item">
          <div class="product-image">
            <img src="http://placehold.it/120x166" alt="Placholder Image 2" class="product-frame">
          </div>
          <div class="product-details">
            <h1 style="font-weight:bold"> ${details.Name}</h1>
            <p><strong>${details.Description}</strong></p>
            <p>Product Code - ${details._id}</p>
          </div>
        </div>
        <div class="price">${details.Price}</div>
        <div class="quantity">
          <input type="number" id = "${key}quantity"value="${quantity}" min="1" class="quantity-field">
        </div>
        <div class="subtotal" id = "${key}total">${subtotal} </div>
        <div class="remove">
          <button id = "${key}remove">Remove</button>
        </div>
      </div>
      `;
    }
    // Doing it to resolve closure related issues(otherwise only last event listner is executed)
    for (let key in cart_items) {
      const result = await postData("/get_product_details", {
        productId: key,
      });
      const details = result.details;
      if (cart_items.hasOwnProperty(key)) {
        const element1 = document.getElementById(`${key}quantity`);
        element1.addEventListener("change", change_listner(key, details.Price));
        const element2 = document.getElementById(`${key}remove`);
        element2.addEventListener("click", remove_listner(key));
      }
    }
  }
}

fetch_cart();

function order_ready (cart){
  let arr =[]
  for(const key in cart) {
    arr.push({
      product : key,
      quantity : cart[key]
    })
  }
  return arr
}
document.getElementById('payment').addEventListener('click',async()=>{
  const Cart= await postData('/fetch_cart')
  const order_place = await postData('/payments/initiate',{
    "items" : order_ready(Cart.cart),
    "TotalPrice" : Cart.TotalPrice,
    "address" : "16 M.C Colony"
  })
  const orderDatabaseId = order_place.orderDatabaseId;
  const paypalOrderId = order_place.orderId;
  console.log(orderDatabaseId,paypalOrderId)
  paypal
        .Buttons({
          createOrder: function () {
            return paypalOrderId;
          },
          onApprove: async function (data) {
              // Make the API request to verify the payment
            const result = await postData(`/payments/${orderDatabaseId}/verify` , {
              orderId: paypalOrderId,
              cartPayment: true
            })
                if (result.success) {
                  document.getElementById('payment_status').style.color = "rgb(67, 160, 57)"
                  document.getElementById('payment_status').innerText =`Payment Verified Successfully, Redirecting You to Orders Page
                  `
                  setTimeout(()=>{
                    location.href='/orders'
                  },3000)
  
                } else {
                  document.getElementById('payment_status').style.color = "rgb(151, 37, 37)"
                  document.getElementById('payment_status').innerText =`Some Error Occured While verifying payment, Try Again`
                }
              
          },
        })
        .render("#paypal-button-container");
})