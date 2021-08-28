// Authorization
// certain pages should be displayed only when the user is logged in

function auth(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect("/login");
}

module.exports = auth;
