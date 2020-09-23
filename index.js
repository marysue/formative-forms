const express = require("express");
var cookieParser = require('cookie-parser')
const csurf = require("csurf");
const e = require("express");
var csurfProtection = csurf({ cookie: true })

const app = express();
const port = process.env.PORT || 3000;
app.use(express.urlencoded());
app.use(cookieParser())
app.set("view engine", "pug");

const beatles = [
  { name: 'John' },
  { name: 'George' },
  { name: 'Paul' },
  { name: 'Ringo' },
  { name: 'Scooby-Doo' }
];
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
  checkBase(errors, firstName, lastName, email, password, confirmedPassword);
  req.errors = errors;
  next();
}

const checkBase = (errors, firstName, lastName, email, password, confirmedPassword) => {
  if(!firstName){errors.push("Please provide a first name.");}
  if(!lastName){errors.push("Please provide a last name.")}
  if(!email){errors.push("Please provide an email.")}
  if(!password || !confirmedPassword){errors.push("Please provide a password.")}
  else if(password!==confirmedPassword){errors.push("The provided values for the password and password confirmation fields did not match.")}
};

const validateIntUser = (req, res, next)=> {
  const { firstName, lastName, email, password, confirmedPassword, age, favoriteBeatle } = req.body;
  const errors = [];

  checkBase(errors, firstName, lastName, email, password, confirmedPassword);
  if (!age) { errors.push("age is required"); }
  if (age < 0 || age > 120) { errors.push("age must be a valid age");}
  if (isNaN(parseInt(age))) { errors.push("age must be a valid age");}
  if (!favoriteBeatle) { errors.push("favoriteBeatle is required"); }
  if (favoriteBeatle === 'Scooby-Doo') { errors.push("favoriteBeatle must be a real Beatle member");}
  req.errors = errors ;
  next();
};

app.get('/create-interesting', csurfProtection, (req, res) => {
  res.render('create-interesting', {
    csrfToken : req.csrfToken(),
    beatles }
    );
});

app.post("/create-interesting", csurfProtection, validateIntUser, (req, res) => {
  let {firstName, lastName, email, age, favoriteBeatle, iceCream } = req.body;

if (iceCream === 'on') {iceCream = 'on' } else {iceCream = false;}
  if(req.errors.length > 0) {
    res.render('create-interesting',
    {
      csrfToken : req.csrfToken(),
      beatles,
      errors: req.errors,
      firstName,
      lastName,
      email,
      age,
      favoriteBeatle,
      iceCream
    });
    return;
  }
  const user = {
    id: users.length + 1,
    firstName: firstName,
    lastName: lastName,
    email: email,
    age: age,
    favoriteBeatle: favoriteBeatle,
    iceCream: iceCream==='on'
  }
  users.push(user);
  res.redirect('/');

});
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
