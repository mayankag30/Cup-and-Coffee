import axios from "axios";
import Noty from "noty";
import { initAdmin } from "./admin";

const addToCart = document.querySelectorAll(".add-to-cart");
const cartCounter = document.querySelector("#cartCounter");

function updateCart(pizza) {
  // Send request to the server and add the pizza to the cart
  axios
    .post("/update-cart", pizza)
    .then((res) => {
      cartCounter.innerText = res.data.totalQty;
      new Noty({
        type: "success",
        timeout: 1000,
        text: "Item added to cart",
        progressBar: false,
      }).show();
    })
    .catch((err) => {
      new Noty({
        type: "error",
        timeout: 1000,
        text: "Something went wrong",
        progressBar: false,
      }).show();
    });
}

addToCart.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    // Add pizza element on the session inside CART
    const pizza = JSON.parse(btn.dataset.pizza);
    updateCart(pizza);
  });
});

// Remove the alert message after X seconds
const alertMsg = document.querySelector("#success-alert");
if (alertMsg) {
  setTimeout(() => {
    alertMsg.remove();
  }, 2000);
}

initAdmin();
