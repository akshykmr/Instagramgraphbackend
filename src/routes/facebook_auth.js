const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const express = require("express");
const User = require("../model/userSchema");
const {fetchFacebookPage, pageWithInstaAccount} = require('../service/fetchFacebookPage')

const router = express.Router();
require("dotenv").config();

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_SECRET_KEY,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: ["id", "displayName", "photos", "email"],
    },
    async function (accessToken, refreshToken, profile, cb) {
      const isUserExist = await  User.findOne({ fetched_fb_user_Id: profile.id });

      if (!isUserExist) {
        const user = new User({
          name: profile._json.name,
          email: profile._json.email,
          fetched_fb_user_Id: profile._json.id,
          access_token:accessToken
        });
        const response = await user.save();
        console.log( "User Added Succefully, Now fetching facebookpage.............");

        const pageList = await fetchFacebookPage(response.access_token);

        const savePageInDB= await pageWithInstaAccount(pageList, response.id, response.access_token);

        console.log(savePageInDB,'saving page data')
        return cb(null, response);
      } else {

        console.log(isUserExist,"Log in success");
        const pageList = await fetchFacebookPage(isUserExist.access_token);
        const savePageInDB= await pageWithInstaAccount(pageList, isUserExist.id, isUserExist.access_token);
        return cb(null, isUserExist, accessToken);
      }
      
    }
  )
);

router.get("/login", passport.authenticate("facebook", { scope: ["email"] }));

router.get(
  "/callback",
  passport.authenticate("facebook", {
    successRedirect: "/success",
    failureRedirect: "/error",
  })
);

router.get("/success", async (req, res) => {
  console.log("success");



  // const userInfo = {
  //   id: req.session.passport.user.id,
  //   displayName: req.session.passport.user.displayName,
  //   provider: req.session.passport.user.provider,
  //   accessToken: req.session.passport.accessToken,
  // };
  // console.log(req.session, "req.session");
  res.write("yes");

  res.end();
});

router.get("/error", (req, res) => res.send("Error logging in via Facebook.."));

router.get("/signout", (req, res) => {
  try {
    req.session.destroy(function (err) {
      console.log("session destroyed.");
    });
    res.render("auth");
  } catch (err) {
    res.status(400).send({ message: "Failed to sign out fb user" });
  }
});

module.exports = router;
