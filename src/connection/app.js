const express = require("express");
require("dotenv").config();
const cors = require("cors");
// const facebookRoutes = require("../routes/facebook_auth");
const route = require("../routes/route");
const session = require("express-session");
const passport = require("passport");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const path = require("path");
const strategy = require("../controllers/strategy");

const app = express();

app.use(cookieParser());

app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: "SECRET",
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // Set the session cookie expiration time (in milliseconds)
      secure: false, // Set to true if your app is served over HTTPS
      httpOnly: true, // This prevents client-side JavaScript from accessing the cookie
    },
  })
);

app.use(express.json());

app.use("/videos", express.static(path.join(__dirname, "..", "..", "videos")));

app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: ["http://localhost:3000", process.env.CORS_ORIGIN],
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

// app.use("/", facebookRoutes);

app.use("/", route);

module.exports = app;
