const express = require("express");
const cors = require("cors");
const facebook_Routes = require("../routes/facebook_auth");
// const routes = require("../routes/route");
const session = require("express-session");
const passport = require("passport");
require("dotenv").config();
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: "SECRET",
  })
);

app.use('/videos', express.static(path.join(__dirname, '..', '..', 'videos'))); // to serve the videos from video folder

app.use(passport.initialize());

app.use(passport.session());

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});
// app.use("/", routes);
app.use("/", facebook_Routes);

module.exports = app;
