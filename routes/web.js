const homeController = require("../app/http/controllers/homeController");
const authController = require("../app/http/controllers/authController");
const cartController = require("../app/http/controllers/customers/cartController");
const guest = require("../app/http/middlewares/guest");

function initRoutes(app) {
  // Home Route
  app.get("/", homeController().index);

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
  app.get("/cart", cartController().index);

  // Update Cart Route
  app.post("/update-cart", cartController().update);
}

module.exports = initRoutes;
