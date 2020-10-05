const express = require("express");
const path = require("path");
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
var publicPath = path.resolve(__dirname, "public");

app.use(express.static(publicPath));
app.use(bodyParser.json());

app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");

// Cookie management
app.use(cookieParser());

app.use(require('./routers/login'));
app.use(require('./routers/integration'));

app.listen(3000, function () {
  console.log("Listening on 3000");
});
