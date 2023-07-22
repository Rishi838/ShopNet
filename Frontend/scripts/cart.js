import { postData } from "../frontend_utils/fetch_api.js";
async function validate_user() {
  const result = await postData("/validate", {});
  if (result.validate == 1) {
    document.getElementById("nav_auth").style.display = "none";
    document.getElementById("nav_profile").style.display = "block";
  } else {
    document.getElementById("nav_auth").style.display = "block";
    document.getElementById("nav_profile").style.display = "none";
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
    document.getElementById('cart-subtotal').innerHTML = `${result.TotalPrice}`
    document.getElementById('cart-total').innerHTML = `${result.TotalPrice}`
  };
}
function remove_listner(Currentkey) {
  return async function () {
    const result = await postData("/remove_from_cart", {
      productId: Currentkey,
    });
    document.getElementById('cart-subtotal').innerHTML = `${result.TotalPrice}`
    document.getElementById('cart-total').innerHTML = `${result.TotalPrice}`
    fetch_cart();
  };
}
async function fetch_cart() {
  const response= await fetch(`/fetch_cart`)
  const result = await response.json()
  const cart_data = result.cart
  const cart_items = cart_data.items
  const success = result.success;
  if (success == 0 || cart_data.total==0) {
    document.getElementById("cart-items").innerHTML =
      "This user has no elements in his cart";
  } else if (success == 1) {
    document.getElementById('cart-subtotal').innerHTML = `$${cart_data.total}`
    document.getElementById('cart-total').innerHTML = `$${cart_data.total}`
    document.getElementById("cart-items").innerHTML = "";
    
    for (let key in cart_items) {
      const quantity = cart_items[key];
      const response= await fetch(`/products/${key}`)
      const product = await response.json()
      const result = product.product
      const subtotal = quantity * result.Price;
      document.getElementById("cart-items").innerHTML += `
      <tr>
      <td><a href="#"><i class="fa fa-times-circle" id="${key}remove" aria-hidden="true" style="color: black;"></i>
      </a></td>
      <td><img src="${result.Image[0]}" alt=""></td>
      <td >${result.Name}</td>
      <td>$${result.Price}</td>
      <td><input type="number" id="${key}quantity" value="${quantity}"></td>
      <td id="${key}total">${subtotal}</td>
      </tr>
      `;
    }
    // Doing it to resolve closure related issues(otherwise only last event listner is executed)
    for (let key in cart_items) {
      const response= await fetch(`/products/${key}`)
      const product = await response.json()
      const result = product.product
      if (cart_items.hasOwnProperty(key)) {
        const element1 = document.getElementById(`${key}quantity`);
        element1.addEventListener("change", change_listner(key, result.Price));
        const element2 = document.getElementById(`${key}remove`);
        element2.addEventListener("click", remove_listner(key));
      }
    }
    document.getElementById('checkout').addEventListener('click',async()=>{
      location.href = `/checkout?source=cart`
   })
  }
}

fetch_cart()
