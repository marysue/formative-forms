const express = require("express");
var cookieParser = require('cookie-parser')
const csurf = require("csurf");
var csurfProtection = csurf({ cookie: true })

const app = express();
const port = process.env.PORT || 3000;
app.use(express.urlencoded());
app.use(cookieParser())
app.set("view engine", "pug");

const users = [
  {
    id: 1,
    firstName: "Jill",
    lastName: "Jack",
    email: "jill.jack@gmail.com"
  }
];
app.get("/", (req, res) => {
  res.render('index', {users})
});

app.get("/create", csurfProtection, (req, res) => {
  res.render("create", {csrfToken: req.csrfToken()});
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports = app;
