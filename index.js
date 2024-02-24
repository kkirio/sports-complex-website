//require all necessary modules and libraries
const mongoose = require("mongoose");
const express = require("express");
const methodOverride = require("method-override");
const layouts = require("express-ejs-layouts");
const connectFlash = require("connect-flash");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
const expressValidator = require("express-validator");
const passport = require("passport");
const User = require("./models/user");
const router = require("./routes/index");

const app = express();
/* Connect to "mongodb://localhost:27017/brandeisAthleticsComplex" on Mac
   Connect to "mongodb://0.0.0.0:27017/brandeisAthleticsComplex" on Windows */
mongoose.connect("mongodb://0.0.0.0:27017/brandeisAthleticsComplex");
const db = mongoose.connection;
db.once("open", () => {
  console.log("Successfully connected to mongodb!");
});

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded());
app.set("view engine", "ejs");
app.use(layouts);
app.use(expressValidator());
app.use(
  methodOverride("_method", {
    methods: ["POST", "GET"],
  })
);
app.use(cookieParser("secret-pascode"));
app.use(
  expressSession({
    secret: "secret_passcode",
    cookie: {
      maxAge: 40000,
    },
    resave: false,
    saveUninitialized: false,
  })
);
app.use(connectFlash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//use connectFlush middleware function
app.use((req, res, next) => {
  res.locals.flashMessages = req.flash();
  res.locals.loggedIn = req.isAuthenticated();
  res.locals.currentUser = req.user;
  next();
});


//use the index page in router to render entire application
app.use("/", router);

app.listen(3000, () => {
  console.log("application is running");
});









