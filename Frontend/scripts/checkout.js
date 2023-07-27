import { postData } from "../frontend_utils/fetch_api.js";
async function validate_user() {
  const result = await postData("/validate", {});
  if (result.validate == 1) {
    document.getElementById("nav_auth").style.display = "none";
    document.getElementById("nav_logout").style.display = "block";
  } else {
    document.querySelector('body').innerHTML = "<p> You need to authenticate before accessing this webpage, Redirecting to login page</p>"
    setTimeout(()=>{
      location.href = "/auth"
    },3000)
  }
}
document.getElementById('nav_logout').addEventListener('click',async()=>{
  const result=await postData('/logout',{});
 await validate_user()
})
validate_user()

const params = new URLSearchParams(window.location.search);
const source = params.get("source");

if (source === "product") {
  const productId = params.get("productId");
  const quantity = params.get("quantity");
  const response = await fetch(`/products/${productId}`);
  const result = await response.json();
  const product = result.product;
  const total_sum = quantity * product.Price;
  document.getElementById("ordered_items").innerHTML = `
  <tr>
    <td><img src="${product.Image[0]}" alt=""></td>
    <td>${product.Name}</td>
    <td>$${product.Price}</td>
    <td>${quantity}</td>
    <td>$${total_sum}</td>
  </tr>
  `;
  document.getElementById("cart_subtotal").innerHTML = `$${total_sum}`;
  document.getElementById(
    "cart_total"
  ).innerHTML = `<strong>$${total_sum}</strong>`;
  const item = [{ product: productId, quantity: quantity }];
  document.getElementById("payment").addEventListener("click", async () => {
    const address = document.getElementById("address").value;
    if (address == null || address == "") {
      document.getElementById(
        "fill_address"
      ).innerHTML = `Enter your address before proceeding`;
      return;
    } else {
      document.getElementById("fill_address").innerHTML = ``;
    }
    const order_place = await postData("/payments/initiate", {
      items: item,
      address: address,
    });
    const orderDatabaseId = order_place.orderDatabaseId;
    const paypalOrderId = order_place.orderId;
    console.log(orderDatabaseId, paypalOrderId);
    paypal
      .Buttons({
        createOrder: function () {
          return paypalOrderId;
        },
        onApprove: async function (data) {
          // Make the API request to verify the payment
          const result = await postData(`/payments/${orderDatabaseId}/verify`, {
            orderId: paypalOrderId,
            cartPayment: false,
          });
          if (result.success) {
            document.getElementById("payment_status").style.color =
              "rgb(67, 160, 57)";
            document.getElementById(
              "payment_status"
            ).innerText = `Payment Verified Successfully, Redirecting You to Orders Page
                    `;
            setTimeout(() => {
              location.href = "/orders";
            }, 3000);
          } else {
            document.getElementById("payment_status").style.color =
              "rgb(151, 37, 37)";
            document.getElementById(
              "payment_status"
            ).innerText = `Some Error Occured While verifying payment, Try Again`;
          }
        },
      })
      .render("#paypal-button");
  });
} else if (source === "cart") {
  const response = await fetch(`/fetch_cart`);
  const result = await response.json();
  const Cart = result.cart;
  console.log(result)
  if (result.success == 0 || Cart.total==0) {
    document.getElementById("ordered_items").innerHTML = "No item in this cart";
  } else {
    document.getElementById("ordered_items").innerHTML = "";
    for (const key in Cart.items) {
      const product_response = await fetch(`/products/${key}`);
      const product_result = await product_response.json();
      const product = product_result.product;
      const subtotal = product.Price * Cart.items[key];
      document.getElementById("ordered_items").innerHTML += `
      <tr>
      <td><img src="${product.Image[0]}" alt=""></td>
      <td>${product.Name}</td>
      <td>$${product.Price}</td>
      <td>${Cart.items[key]}</td>
      <td>$${subtotal}</td>
      </tr>
      `;
    }
    document.getElementById("cart_subtotal").innerHTML = `$${Cart.total}`;
    document.getElementById(
      "cart_total"
    ).innerHTML = `<strong>$${Cart.total}</strong>`;
    document.getElementById("payment").addEventListener("click", async () => {
      const address = document.getElementById("address").value;
      if (address == null || address == "") {
        document.getElementById(
          "fill_address"
        ).innerHTML = `Enter your address before proceeding`;
        return;
      } else {
        document.getElementById("fill_address").innerHTML = ``;
      }
      const order_place = await postData("/payments/initiate", {
        items: order_ready(Cart.items),
        address: address,
      });
      const orderDatabaseId = order_place.orderDatabaseId;
      const paypalOrderId = order_place.orderId;
      paypal
        .Buttons({
          createOrder: function () {
            return paypalOrderId;
          },
          onApprove: async function (data) {
            // Make the API request to verify the payment
            const result = await postData(
              `/payments/${orderDatabaseId}/verify`,
              {
                orderId: paypalOrderId,
                cartPayment: true,
              }
            );
            if (result.success) {
              document.getElementById("payment_status").style.color =
                "rgb(67, 160, 57)";
              document.getElementById(
                "payment_status"
              ).innerText = `Payment Verified Successfully, Redirecting You to Orders Page
                        `;
              setTimeout(() => {
                location.href = "/orders";
              }, 3000);
            } else {
              document.getElementById("payment_status").style.color =
                "rgb(151, 37, 37)";
              document.getElementById(
                "payment_status"
              ).innerText = `Some Error Occured While verifying payment, Try Again`;
            }
          },
        })
        .render("#paypal-button");
    });
  }
} else {
  document.getElementById('ordered_items').innerHTML = "Not a Valid Route for checkout"
}
function order_ready(cart) {
  let arr = [];
  for (const key in cart) {
    arr.push({
      product: key,
      quantity: cart[key],
    });
  }
  return arr;
}
