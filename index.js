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

const validateUser = (req, res, next) => {
  const{firstName, lastName, email, password, confirmedPassword} = req.body;
  const errors = [];
  if(!firstName){errors.push("Please provide a first name.");}
  if(!lastName){errors.push("Please provide a last name.")}
  if(!email){errors.push("Please provide an email.")}
  if(!password || !confirmedPassword){errors.push("Please provide a password.")}
  else if(password!==confirmedPassword){errors.push("The provided values for the password and password confirmation fields did not match.")}

  req.errors = errors;
  next();
}

app.post("/create", csurfProtection, validateUser, (req, res) => {
  const {firstName, lastName, email} = req.body;
  if(req.errors.length > 0){
    res.render('create', 
    {
      csrfToken : req.csrfToken(),
      errors: req.errors,
      firstName,
      lastName,
      email
    })
    return;
  }
  const user = {
    id: users.length + 1,
    firstName: firstName,
    lastName: lastName,
    email: email
    //where password?
  }
  users.push(user);
  res.redirect('/')
})

app.get("/", (req, res) => {
  res.render('index', {users})
});

app.get("/create", csurfProtection, (req, res) => {
  res.render("create", {csrfToken: req.csrfToken()});
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports = app;
