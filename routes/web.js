// Controllers
const homeController = require("../app/http/controllers/homeController");
const authController = require("../app/http/controllers/authController");
const cartController = require("../app/http/controllers/customers/cartController");
const orderController = require("../app/http/controllers/customers/orderController");
const AdminOrderController = require("../app/http/controllers/admin/orderController");

// Middlewares
const guest = require("../app/http/middlewares/guest");
const auth = require("../app/http/middlewares/auth");
const admin = require("../app/http/middlewares/admin");

function initRoutes(app) {
  // Home Route
  app.get("/", homeController().index);

  // Authentication Route
  // Login Route - this gives our login page
  app.get("/login", guest, authController().login);

  // Post Login
  app.post("/login", authController().postLogin);

  // Regiter Route - this gives our register page
  app.get("/register", guest, authController().register);

  // Post Register
  app.post("/register", authController().postRegister);

  // Logout Route
  app.post("/logout", authController().logout);

  // Cart Route
  // Cart Route
  app.get("/cart", cartController().index);

  // Update Cart Route
  app.post("/update-cart", cartController().update);

  // Customers Route
  // Orders page
  app.get("/customer/orders", auth, orderController().index);

  // Orders POST
  app.post("/orders", auth, orderController().store);

  // Admin Route
  app.get("/admin/orders", admin, AdminOrderController().index);
}

module.exports = initRoutes;
