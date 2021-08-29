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
const Emitter = require("events");
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

// Event Emitter
const eventEmitter = new Emitter();
// to use in anywhere inside our application we bind it to our app
app.set("eventEmitter", eventEmitter);

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

const server = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

// Socket
const io = require("socket.io")(server);
io.on("connection", (socket) => {
  // Join - socket.id is not the order id
  // Recieve what was emitted from the client
  socket.on("join", (orderId) => {
    // Data is recieved which is sent from client
    // Room is created
    socket.join(orderId);
  });
});

// Listening to event
eventEmitter.on("orderUpdated", (data) => {
  // data recieved from statusController
  // to(roomName)
  io.to(`order_${data.id}`).emit("orderUpdated", data);
});

eventEmitter.on("orderPlaced", (data) => {
  io.to("adminRoom").emit("orderPlaced", data);
});
