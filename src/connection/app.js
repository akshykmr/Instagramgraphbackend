const express = require("express");
const cors = require("cors");
const routes = require("../routes/route");
const session = require("express-session");
const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
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

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_SECRET_KEY,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
    },
    async function (accessToken, refreshToken, profile, cb) {
   
      console.log(accessToken, refreshToken, profile, "data");

      return cb(null, profile, accessToken, refreshToken);
    }
  )
);

app.use("/", routes);

module.exports = app;
