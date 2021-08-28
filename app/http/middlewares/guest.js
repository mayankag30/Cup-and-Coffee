// Authorization
// certain pages should not be displayed only when the user is logged in

function guest(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  return res.redirect("/");
}

module.exports = guest;
