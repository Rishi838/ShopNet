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

function func(id, products) {
  return async function () {
    if(document.getElementById(`${id}order_details`).innerHTML != "")
    {
      document.getElementById(`${id}order_details`).innerHTML = ""
      return;
    }
    for (let i = 0; i < products.length; i++) {
      const product_details = await postData("/get_product_details", {
        productId: products[i].product,
      });  
        document.getElementById(`${id}order_details`).innerHTML += `
      <div class="product_details">
      ${product_details.details.Name}: ${products[i].quantity}
    </div>`;
    }
  };
}

async function fetch_orders() {
  const result = await postData("/orders", {});
  const orders = result.orders;
  console.log(orders);
  if(orders.length ==0){
    document.getElementById("order").innerHTML = `There are no orders associated with this user`;
   return; 
  }
  document.getElementById("order").innerHTML = ``;
  for (let i = 0; i < orders.length; i++) {
    const item = orders[i];
    document.getElementById("order").innerHTML += `
        <div class="item">
        <span>Order ID: <strong>${item._id}</strong></span>
        <span>Amount: <strong>${item.totalAmount}</strong></span>
        <span>Status: <strong>${item.status}</strong></span>
        <span>Address: <strong>${item.shippingAddress}</strong></span>
        <span>Date: <strong>${item.createdAt}</strong></span>
        <button id="${item._id}details"> Order Details </button>
        <div id="${item._id}order_details"></div>
      </div>
      `;
  }
  for (let i = 0; i < orders.length; i++) {
    const item = orders[i];
    if (orders.includes(orders[i])) {
      const element = document.getElementById(`${item._id}details`);
      element.addEventListener("click", func(item._id, item.products));
    }
  }
}
fetch_orders();
