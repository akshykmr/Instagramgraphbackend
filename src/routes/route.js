const passport = require("passport");
const express = require("express");
const scope = require("./../requirements/data.json");
const successController = require("../controllers/successController");
const controller = require("../controllers/otherController");
const localAuthController = require("../controllers/userAuthController");
const {verifyToken} = require('../controllers/verifyAuth')
const User = require("../model/parentUserSchema");


const router = express.Router();


router.get('/',(req, res)=>{
  res.send('app is ruinning')
})
//AUTH FOR LOCAL USER
router.post("/signup_as_local_user", localAuthController.registerUser);
router.post("/login_as_local_user", localAuthController.loginUser);


// INSTA AUTH WITH INSTAGRAM BASIC DISPLAY APP
router.get("/instagram/auth", verifyToken, controller.verifyUserForInsta);

router.get('/instagram/login', controller.loginWithInsta );

router.post("/instagram/auth/fetchUserData",verifyToken, controller.loginAndHandleCallback);

router.get("/instagram/auth/success", verifyToken, successController.sendDataAfterInstaLogin);


router.get('/gettest', verifyToken, async (req,res)=>{
  console.log(req.user.item,'user in req')
  const user = await User.findById(req.user.item);
  res.send(user)
})



// LOGOUT ROUTES FROM FACEBOOK AND INSTAGRAM

router.get("/auth/facebook/logout", controller.fbLogout);
router.get("/auth/instagram/logout", controller.innstLogout);
// ERROR ROUTE
router.get("/error", controller.error);

module.exports = router;






// TESTING 
router.post("/hello", controller.loginAndHandleCallback);












//FACEBOOK AUTH  WITH PASSPORT JS
router.get("/auth/facebook", passport.authenticate("facebook", { scope: scope.facebookAuthScope }));
router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/auth/facebook/success",
    failureRedirect: "/error",
  })
);
// router.get("/auth/facebook/success", successController.sendDataAfterFBLogin);


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