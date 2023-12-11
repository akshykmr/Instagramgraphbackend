// const passport = require("passport");
// const FacebookStrategy = require("passport-facebook").Strategy;
// const InstagramStrategy = require("passport-instagram").Strategy;
// const express = require("express");
// const User = require("../model/userSchema");
// const {
//   fetchFacebookPage,
//   pageWithInstaAccount,
// } = require("../service/fetchFacebookPage");
// const generateJWT = require("../service/genJWTToken");
// const FacebookPage = require("../model/faceBookPageSchema");
// const InstaUser = require("../model/instaUserSchema");
// const Video = require("../model/instaVideosSchema");

// const router = express.Router();
// require("dotenv").config();
// const axios = require("axios");


// passport.use(new InstagramStrategy({
//   clientID: process.env.INSTAGRAM_CLIENT_ID,
//   clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
//   callbackURL: 'http://localhost:5000/callback',
// },
// function(accessToken, refreshToken, profile, done) {
//   console.log('after login ');
//   // Call cb with null as the first argument to indicate no error
//   return done(null, profile);
// }
// ));



// router.get('/instagram', passport.authenticate('instagram'));

//   router.get('/callback', 
//   passport.authenticate('instagram', { failureRedirect: '/login' }),
//   function(req, res) {
//     // Successful authentication, redirect home.
//     res.redirect('/successs');
//   });

// // localhost:5000/instagram

// router.get('/successs', async(req, res) => {
//   res.redirect("https://api.instagram.com/oauth/authorize?client_id=7951924054824115&redirect_uri=https://socialsizzle.herokuapp.com/auth/&scope=user_profile,user_media&response_type=code")
//   console.log("Facebook Page Data Fetched Successfully");
// });



// passport.use(
//   new FacebookStrategy(
//     {
//       clientID: process.env.FACEBOOK_CLIENT_ID,
//       clientSecret: process.env.FACEBOOK_SECRET_KEY,
//       callbackURL: process.env.FACEBOOK_CALLBACK_URL,
//       profileFields: ["id", "displayName", "photos", "email"],
//     },
//     async function (accessToken, refreshToken, profile, cb) {
//       const isUserExist = await User.findOne({
//         fetched_fb_user_Id: profile.id,
//       });

//       if (!isUserExist) {
//         const user = new User({
//           name: profile._json.name,
//           email: profile._json.email,
//           fetched_fb_user_Id: profile._json.id,
//           access_token: accessToken,
//         });
//         const response = await user.save();
//         console.log(
//           "User Added Succefully, Now fetching facebookpage.............", accessToken
//         );

//         const pageList = await fetchFacebookPage(response.access_token);

//         const savePageInDB = await pageWithInstaAccount(
//           pageList,
//           response.id,
//           response.access_token
//         );
//         const token = generateJWT(response.id);
//         console.log(savePageInDB, "saving page data");
//         // console.log(token, "jwt token");
//         return cb(null, response, token);
//       } else {
//         const pageList = await fetchFacebookPage(isUserExist.access_token);
//         console.log(pageList, "Log in success");
//         // const token = generateJWT(isUserExist.id);
//         // console.log(token,'jwt token')
//         // const pageList = await fetchFacebookPage(isUserExist.access_token);

//         // const savePageInDB= await pageWithInstaAccount(pageList, isUserExist.id, isUserExist.access_token);

//         return cb(null, isUserExist);
//       }
//     }
//   )
// );

// router.get("/login", passport.authenticate("facebook", 
// { scope: ["email",
// "manage_fundraisers",
// "read_insights",
// "publish_video",
// "catalog_management",
// "pages_manage_cta",
// "pages_manage_instant_articles",
// "pages_show_list",
// "read_page_mailboxes",
// "ads_management",
// "ads_read",
// "business_management",
// "pages_messaging",
// "pages_messaging_subscriptions",
// "instagram_basic",
// "instagram_manage_comments",
// "instagram_manage_insights",
// "instagram_content_publish",
// "leads_retrieval",
// "whatsapp_business_management",
// "instagram_manage_messages",
// "page_events",
// "pages_read_engagement",
// "pages_manage_metadata",
// "pages_read_user_content",
// "pages_manage_ads",
// "pages_manage_posts",
// "pages_manage_engagement",
// "whatsapp_business_messaging",
// "instagram_shopping_tag_products",
// "instagram_manage_events",
// "public_profile",] }));

// router.get(
//   "/callback",
//   passport.authenticate("facebook", {
//     successRedirect:
//       "https://facebookgraphapi.netlify.app/facebook",
//     failureRedirect: "/error",
//   })
// );

// router.get("/success", async (req, res) => {
//   try {
//     if (req.user) {
//       const facebookPages = await FacebookPage.find({ user_Id_of_db: req.user._id });

//       const responseData = [];
      
//       for (const page of facebookPages) {
//         const instaUser = await InstaUser.findOne({
//           connected_fbPage_Id_of_db: page._id,
//         });

//         if (instaUser) {
//           const media = await Video.find({
//             posted_by: instaUser._id,
//           });

//           responseData.push({
//             page: {
//               id: page._id,
//               name: page.name,
//               category:page.category
//               // Add other page details as needed
//             },
//             instaUser: {
//               id: instaUser._id,
//               username: instaUser.username,
//               biography: instaUser.biography,
//               profile_picture: instaUser.profile_picture,
//               followers_count: instaUser.followers_count,
//               follows_count: instaUser.follows_count,
//               media_count: instaUser.media_count,
//               // Add other instaUser details as needed
//             },
//             media: media,
//           });
//         }
//       }

//       res.status(200).json({
//         success: true,
//         message: "Successful",
//         user: req.user,
//         cookies: req.cookies,
//         data: responseData,
//       });
//     } else {
//       console.log('User not found');
//       res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }
//   } catch (error) {
//     console.error("Error in /success route:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//     });
//   }
// });

// router.get("/error", (req, res) => res.send("Error logging in via Facebook.."));

// router.get("/signout", (req, res) => {
//   try {
//     res.redirect('http://localhost:3000/');
//      req.session.destroy(function (err) {
//       console.log("session destroyed.");
//     });
//     // req.logout();
//   } catch (err) {
//     res.status(400).send({ message: "Failed to sign out fb user" });
//   }
// });

// module.exports = router;
