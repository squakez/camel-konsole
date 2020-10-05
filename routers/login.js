var express = require('express')
  , router = express.Router()

const cookieParser = require('cookie-parser');

// Login
router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/logout", (req, res) => {
  res.clearCookie("user");
  res.redirect("/");
});

router.post("/login", (req, res) => {
  var user = req.body.user
  console.log("Logging in " + user);
  // 8 hours session
  res.cookie("user", user, {maxAge: 1000 * 60 * 60 * 8 });
  res.statusCode = 201;
  res.send("OK");
});

module.exports = router
