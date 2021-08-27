const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/userModel");
const bcrypt = require("bcrypt");

function init(passport) {
  passport.use(
    new LocalStrategy(
      {
        // username = email, in our case
        usernameField: "email",
      },
      async (email, password, done) => {
        // Login logic
        // check if email exists in the database
        const user = await User.findOne({ email: email });
        if (!user) {
          return done(null, false, { message: "No user with this email" });
        }

        bcrypt
          .compare(password, user.password)
          .then((match) => {
            if (match) {
              return done(null, user, { message: "Logged In Successfully" });
            }
            return done(null, false, { message: "Wrong username or password" });
          })
          .catch((err) => {
            return done(null, false, { message: "Something went wrong!" });
          });
      }
    )
  );

  passport.serializeUser((user, done) => {
    // session k andr userid store hogi jisse pta chlega ki user logged in h yaa nii
    done(null, user._id);
  });

  passport.deserializeUser((id, done) => {
    // session k andr ka data(id) get krna h
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
}

module.exports = init;
