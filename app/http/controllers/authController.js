const User = require("../../models/userModel");
const bcrypt = require("bcrypt");
const passport = require("passport");
const passwordValidator = require("password-validator");
const schema = new passwordValidator();

function authController() {
  const _getRedirectUrl = (req) => {
    return req.user.role === "admin" ? "/admin/orders" : "/customer/orders";
  };

  return {
    login(req, res) {
      res.render("auth/login");
    },
    postLogin(req, res, next) {
      const { email, password } = req.body;
      // Validate request
      if (!email || !password) {
        // flash{error = key, message}
        req.flash("error", "All fields are required");
        return res.redirect("/login");
      }

      // first parameter is the strategy
      // the function syntax is same as done() in passport
      // info - we get messages that we passed in passport done()
      passport.authenticate("local", (err, user, info) => {
        if (err) {
          req.flash("error", info.message);
          return next(err);
        }
        if (!user) {
          req.flash("error", info.message);
          return res.redirect("/login");
        }
        // if user
        req.logIn(user, (err) => {
          if (err) {
            req.flash("error", info.message);
            return next(err);
          }
          // redirect as per the user(customer / admin)
          return res.redirect(_getRedirectUrl(req));
        });
      })(req, res, next);
    },
    register(req, res) {
      res.render("auth/register");
    },
    async postRegister(req, res) {
      const { name, email, password } = req.body;
      // console.log(req.body);
      schema.is().min(8).is().max(100).has().uppercase(1).has().lowercase(1);
      // Validate request
      if (!name || !email || !password) {
        // flash{error = key, message}
        req.flash("error", "All fields are required");
        req.flash("name", name);
        req.flash("email", email);
        return res.redirect("/register");
      }

      if (!schema.validate(password)) {
        req.flash(
          "error",
          "Password should have atleast one uppercase and one lowercase letter and minimum of 8 characters"
        );
        req.flash("name", name);
        req.flash("email", email);
        return res.redirect("/register");
      }

      // Check if email already exists
      User.exists({ email: email }, (err, result) => {
        if (result) {
          req.flash("error", "Email already exists");
          req.flash("name", name);
          req.flash("email", email);
          return res.redirect("/register");
        }
      });

      // Hash Password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a user
      const user = new User({
        name: name,
        email: email,
        password: hashedPassword,
      });

      user
        .save()
        .then((user) => {
          // If user is registered, Login

          return res.redirect("/");
        })
        .catch((err) => {
          req.flash("error", "Something went wrong");
          return res.redirect("/register");
        });
    },
    logout(req, res) {
      // This is simple due to PASSPORT
      req.logout();
      return res.redirect("/login");
    },
  };
}

module.exports = authController;
