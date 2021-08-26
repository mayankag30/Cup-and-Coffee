const homeController = require("../app/http/controllers/homeController");
const authController = require("../app/http/controllers/authController");
const cartController = require("../app/http/controllers/customers/cartController");

function initRoutes(app) {
  // Home Route
  app.get("/", homeController().index);

  // Login Route
  app.get("/login", authController().login);

  // Regiter Route
  app.get("/register", authController().register);

  // Cart Route
  app.get("/cart", cartController().index);

  // Update Cart Route
  app.post("/update-cart", cartController().update);
}

module.exports = initRoutes;
