const passport = require("passport");
const express = require("express");
const scope = require("./../requirements/data.json");
const successController = require("../controllers/successController");
const controller = require("../controllers/otherController");

const router = express.Router();

//FACEBOOK AUTH ROUTES
router.get("/auth/facebook", passport.authenticate("facebook", { scope: scope.facebookAuthScope }));


router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/auth/facebook/success",
    failureRedirect: "/error",
  })
);

router.get("/auth/facebook/success", successController.sendDataAfterFBLogin);


// /INSTAGRAM AUTH ROUTES
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

  

// OTHER ROUTES

router.get("/auth/facebook/logout", controller.fbLogout);
router.get("/auth/instagram/logout", controller.innstLogout);

router.get("/error", controller.error);

module.exports = router;



router.get("/instagram", controller.loginWithInsta);

router.post("/success", controller.loginAndHandleCallback);
