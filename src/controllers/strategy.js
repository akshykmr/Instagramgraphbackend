const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const InstagramStrategy = require("passport-instagram").Strategy;
const FbUser = require("../model/fbUserSchema");
const { fetchFacebookPage, pageWithInstaAccount} = require("../service/facebook/fetchFacebookPage");
const generateJWT = require("../service/genJWTToken");
require("dotenv").config();


// FACEBOOK STRATEGY
passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_SECRET_KEY,
        callbackURL: process.env.FACEBOOK_CALLBACK_URL,
        profileFields: ["id", "displayName", "photos", "email"],
      },

      async function (accessToken, refreshToken, profile, cb) {

        const isUserExist = await FbUser.findOne({
          fetched_fb_user_Id: profile.id,
        }); // FINDING USER IN DB
  
        if (!isUserExist) { // IF USER IN NOT PRESENT IN DB
          const fbuser = new FbUser({
            name: profile._json.name,
            email: profile._json.email,
            fetched_fb_user_Id: profile._json.id,
            access_token: accessToken,
          });

          const response = await fbuser.save(); // SAVING USER IN DB

          console.log(response,
            "User Added Succefully, Now fetching facebookpage............."
          );
  
          const pageList = await fetchFacebookPage(response.access_token); // FETCHING FACEBOOK PAGE
  
          const savePageInDB = await pageWithInstaAccount(
            pageList,
            response.id,
            response.access_token
          ); // FETCHING INSTAGRAM USER AND MEDIA AND SAVING DATA IN DB


        //   const token = generateJWT(response.id);
          return cb(null, response);



        } else {  // IF USER EXIST IN DB

            console.log(isUserExist,'user exist fetching user data.....')

        //   const pageList = await fetchFacebookPage(isUserExist.access_token);
   
          // const token = generateJWT(isUserExist.id);
          // console.log(token,'jwt token')

  
        //   const savePageInDB= await pageWithInstaAccount(pageList, isUserExist.id, isUserExist.access_token);
  
          return cb(null, isUserExist);
        }
      }
    )
  );


// INSTAGRAM STRATEGY
  passport.use(new InstagramStrategy({
    clientID: process.env.INSTAGRAM_CLIENT_ID,
    clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
    callbackURL: process.env.INSTAGRAM_CALLBACK_URL
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log('user loged in with insta')
    return cb(null, profile);
  }
));

