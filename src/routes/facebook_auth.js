const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const express = require("express");
const User = require("../model/userSchema");
const {
  fetchFacebookPage,
  pageWithInstaAccount,
} = require("../service/fetchFacebookPage");
const generateJWT = require("../service/genJWTToken");
const FacebookPage = require("../model/faceBookPageSchema");
const InstaUser = require("../model/instaUserSchema");
const Video = require("../model/instaVideosSchema");

const router = express.Router();
require("dotenv").config();


router.get("/login", passport.authenticate("facebook", { scope: ["email"] }));

router.get(
  "/callback",
  passport.authenticate("facebook", {
    successRedirect:
      "/successs",
    failureRedirect: "/error",
  })
);
router.get("/successs", (req, res) => res.send("login"));

router.get("/success", async (req, res) => {
  try {
    if (req.user) {
      const facebookPages = await FacebookPage.find({ user_Id_of_db: req.user._id });

      const responseData = [];
      
      for (const page of facebookPages) {
        const instaUser = await InstaUser.findOne({
          connected_fbPage_Id_of_db: page._id,
        });

        if (instaUser) {
          const media = await Video.find({
            posted_by: instaUser._id,
          });

          responseData.push({
            page: {
              id: page._id,
              name: page.name,
              category:page.category
              // Add other page details as needed
            },
            instaUser: {
              id: instaUser._id,
              username: instaUser.username,
              biography: instaUser.biography,
              profile_picture: instaUser.profile_picture,
              followers_count: instaUser.followers_count,
              follows_count: instaUser.follows_count,
              media_count: instaUser.media_count,
              // Add other instaUser details as needed
            },
            media: media,
          });
        }
      }

      res.status(200).json({
        success: true,
        message: "Successful",
        user: req.user,
        cookies: req.cookies,
        data: responseData,
      });
    } else {
      console.log('User not found');
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
  } catch (error) {
    console.error("Error in /success route:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});



router.get("/error", (req, res) => res.send("Error logging in via Facebook.."));

router.get("/signout", (req, res) => {
  try {
    req.session.destroy(function (err) {
      console.log("session destroyed.");
    });
    res.send("logout")
  } catch (err) {
    res.status(400).send({ message: "Failed to sign out fb user" });
  }
});

module.exports = router;
