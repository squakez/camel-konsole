var express = require('express')
  , router = express.Router()

const util = require("../utils.js")
const cookieParser = require('cookie-parser');

// Session managment
router.use(function(req, res, next) {
  if (!req.cookies.user){
    // redirect to login page
    res.redirect("/login");
  } else {
    next();
  }
});

// Kamelets
router.get("/knative", (req, res) => {
  res.render("knative/list", {namespace: "default", user: req.cookies.user});
});

module.exports = router
