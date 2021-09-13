import axios from "axios";
import Noty from "noty";
import moment from "moment";
import { initAdmin } from "./admin";
import { initStripe } from "./stripe";

const addToCart = document.querySelectorAll(".add-to-cart");
const cartCounter = document.querySelector("#cartCounter");
const updateCartAdd = document.querySelectorAll(".update-to-cart-add");
const updateCartDel = document.querySelectorAll(".update-to-cart-del");
const submitMsgButton = document.querySelector(".submitMsg");
const msgInput = document.querySelector(".msgInput");

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

function deleteCartElement(pizza) {
  // Send request to the server and add the pizza to the cart
  axios
    .post("/delete-element", pizza)
    .then((res) => {
      if (res.data) {
        cartCounter.innerText = res.data.totalQty;
      }
      new Noty({
        type: "success",
        timeout: 1000,
        text: "Item removed to cart.",
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

updateCartAdd.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    // Update element on the session inside CART
    const pizza = JSON.parse(btn.dataset.pizza);
    updateCart(pizza);
    setTimeout(() => {
      location.reload();
    }, 1000);
  });
});

updateCartDel.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    // Delete element on the session inside CART
    const pizza = JSON.parse(btn.dataset.pizza);
    deleteCartElement(pizza);
    setTimeout(() => {
      location.reload();
    }, 1000);
  });
});

// Remove the alert message after X seconds
const alertMsg = document.querySelector("#success-alert");
if (alertMsg) {
  setTimeout(() => {
    alertMsg.remove();
  }, 2000);
}

// Render the updated status
let statuses = document.querySelectorAll(".status_line");
const hiddenInput = document.querySelector("#hiddenInput");
let order = hiddenInput ? hiddenInput.value : null;
order = JSON.parse(order);
let time = document.createElement("small");

function updateStatus(order) {
  statuses.forEach((status) => {
    status.classList.remove("step-completed");
    status.classList.remove("current");
  });
  let stepCompleted = true;
  statuses.forEach((status) => {
    let dataProp = status.dataset.status;
    if (stepCompleted) {
      status.classList.add("step-completed");
    }
    if (dataProp === order.status) {
      stepCompleted = false;
      time.innerText = moment(order.updatedAt).format("hh:mm A");
      status.appendChild(time);
      if (status.nextElementSibling) {
        status.nextElementSibling.classList.add("current");
      }
    }
  });
}

updateStatus(order);

// Related to Payment Form and Stripe
initStripe();

// Socket - Client side
let socket = io();

// Join
if (order) {
  socket.emit("join", `order_${order._id}`);
}

// Update the admin orders page on adding new order to cart
let adminAreaPath = window.location.pathname;
if (adminAreaPath.includes("admin")) {
  initAdmin(socket);
  socket.emit("join", "adminRoom");
}

socket.on("orderUpdated", (data) => {
  // Make a copy of that order
  const updatedOrder = { ...order };
  // Update the order
  updatedOrder.updatedAt = moment().format();
  updatedOrder.status = data.status;
  updateStatus(updatedOrder);
  new Noty({
    type: "success",
    timeout: 1000,
    text: "Order updated",
    progressBar: false,
  }).show();
});
