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
router.get("/kamelets", (req, res) => {
  res.render("kamelets/list", {namespace: "default", user: req.cookies.user});
});

router.get("/kamelets/:kamelet", (req, res) => {
  var kamelet = req.params.kamelet;
  var kameletFile = kamelet + ".kamelet.yaml";
  res.render("kamelets/edit", {namespace: "default", user: req.cookies.user, name: kameletFile, source: getKameletSource(kameletFile)});
});

function getKameletSource(filename){
  let fs = require('fs')
  let content = fs.readFileSync(process.cwd() + "/" + filename).toString();
  return content;
}

module.exports = router
