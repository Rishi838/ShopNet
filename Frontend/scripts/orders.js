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

function createNotification(message,type) {
  const notification = document.createElement('div');
  notification.classList.add(type);
  notification.textContent = message;
  console.log(notification)
  document.getElementById('notificationContainer').appendChild(notification);
  setTimeout(() => {
    notification.remove();
  }, 5500);
}
function print_receipt(id) {
  return async function () {
       const response = await fetch(`/receipt/${id}`,{}); // Replace with your backend URL
        const htmlContent = await response.text();
        const element = document.createElement('div');
        element.innerHTML = htmlContent;
        html2pdf().from(element).save('receipt.pdf');
       
  }
}

function cancel_order(id){
  return async function(){
    if(confirm("Warning: Cancelling your order may result in missing out on exclusive deals and limited stock. Are you sure you want to cancel?")==true)
    {
      const response = await postData(`/orders/cancel/${id}`,{})
      await fetch_orders()
      createNotification(`Order with id: ${id} Canceled Successfully`,"success_notification")
      createNotification(`Your payment has been refunded Successfully`,"success_notification")
    }
  }
}

async function fetch_orders() {
  const result = await postData("/orders", {});
  const orders = result.orders;
  if (orders.length == 0) {
    document.getElementById(
      "prev-orders"
    ).innerHTML = `There are no orders associated with this user`;
    return;
  }
  document.getElementById("prev-orders").innerHTML = ``;
  for (let i = 0; i < orders.length; i++) {
    const item = orders[i];
    document.getElementById("prev-orders").innerHTML += `
    <tr>
    <td>${i + 1}</td>
    <td>${item._id}</td>
    <td>${item.totalAmount}</td>
    <td>${item.shippingAddress}</td>
    <td>${item.status}</td>
    <td>${
      item.status == "Inventory" ||
      item.status == "Shipped" ||
      item.status == "OutForDelievery"
        ? `<a href='#' id='${item._id}cancel'>Cancel</a>`
        : "NA"
    }</td>
    <td class="receipt" style="color:blue;cursor:pointer"id="${
      item._id
    }receipt">Receipt</td>
    </tr>
      `;
  }
  for (let i = 0; i < orders.length; i++) {
    const item = orders[i];
    if (orders.includes(orders[i])) {
      const element1 = document.getElementById(`${item._id}receipt`);
      element1.addEventListener("click", print_receipt(item._id));
      if( item.status == "Inventory" ||
      item.status == "Shipped" ||
      item.status == "OutForDelievery")
      {
        const element2 = document.getElementById(`${item._id}cancel`);
        element2.addEventListener("click", cancel_order(item._id));
      }
    }
  }
}
fetch_orders();
