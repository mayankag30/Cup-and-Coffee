const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const ejs = require("ejs");
const path = require("path");
const expressLayout = require("express-ejs-layouts");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("express-flash");
const MongoDbStore = require("connect-mongo");
const passport = require("passport");
const PORT = process.env.PORT || 3000;

// Database Connection
mongoose.connect(process.env.MONGO_CONNECTION_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const connection = mongoose.connection;
try {
  connection.once("open", () => {
    console.log("Database connected...");
  });
} catch (err) {
  console.log("Connection failed...");
}

// Session Config
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: MongoDbStore.create({
      mongoUrl: process.env.MONGO_CONNECTION_URL,
    }),
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 24hrs
  })
);

// Passport Config
const passportInit = require("./app/config/passport");
passportInit(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Assets
app.use(express.static("public"));
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(express.json());

// Global Middleware
app.use((req, res, next) => {
  res.locals.session = req.session;
  res.locals.user = req.user;
  next();
});

// Set Template Engine
app.use(expressLayout);
app.set("views", path.join(__dirname, "/resources/views"));
app.set("view engine", "ejs");

// Web related Routes
const initRoutes = require("./routes/web");
initRoutes(app);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
