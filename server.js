const express = require("express");
const app = express();
const ejs = require("ejs");
const path = require("path");
const expressLayout = require("express-ejs-layouts");
const PORT = process.env.PORT || 3000;

// Assets
app.use(express.static("public"));

// Set Template Engine
app.use(expressLayout);
app.set("views", path.join(__dirname, "/resources/views"));
app.set("view engine", "ejs");

// Home Page
app.get("/", (req, res) => {
  res.render("home");
});

// Cart Page
app.get("/cart", (req, res) => {
  res.render("customers/cart");
});

// Login Page
app.get("/login", (req, res) => {
  res.render("auth/login");
});

// Regiter Page
app.get("/register", (req, res) => {
  res.render("auth/register");
});

app.listen(3000, () => {
  console.log(`Listening on port ${PORT}`);
});
