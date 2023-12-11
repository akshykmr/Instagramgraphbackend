const passport = require("passport");
const express = require("express");
const scope = require("./../requirements/data.json");
const successController = require("../controllers/successController");
const controller = require("../controllers/otherController");
const localAuthController = require("../controllers/userAuthController");
const {verifyToken} = require('../controllers/verifyAuth')

const router = express.Router();



//AUTH FOR LOCAL USER
router.post("/signup_as_local_user", localAuthController.registerUser);

router.get("/login_as_local_user", localAuthController.loginUser);




//FACEBOOK AUTH  WITH PASSPORT JS
router.get("/auth/facebook", passport.authenticate("facebook", { scope: scope.facebookAuthScope }));


router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/auth/facebook/success",
    failureRedirect: "/error",
  })
);

router.get("/auth/facebook/success", successController.sendDataAfterFBLogin);


// /INSTAGRAM AUTH ROUTES WITH PASSPORT JS
router.get('/auth/instagram',
passport.authenticate('instagram'));

router.get(
  "/auth/instagram/callback",
  passport.authenticate("instagram", {
    successRedirect: "/auth/instagram/success",
    failureRedirect: "/error",
  })
);

router.get("/auth/instagram/success",successController.testingSendData);

  

// LOGOUT ROUTES FROM FACEBOOK AND INSTAGRAM

router.get("/auth/facebook/logout", controller.fbLogout);
router.get("/auth/instagram/logout", controller.innstLogout);


// ERROR ROUTE
router.get("/error", controller.error);


// INSTA AUTH WITH INSTAGRAM BASIC DISPLAY APP

router.get("/instagram/auth", verifyToken, controller.verifyUserForInsta);

router.get('/instagram/login', controller.loginWithInsta )

router.post("/success", controller.loginAndHandleCallback);


module.exports = router;
