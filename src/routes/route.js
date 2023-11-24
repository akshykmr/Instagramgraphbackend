const passport = require('passport');
const express = require('express');
const axios = require('axios');
const {fetchFacebookPage} = require('./../service/fetchFacebookPage')
const {pageWithInstaAccount} = require('./../service/fetchFacebookPage')
const {fetchInstaMedia} = require('./../service/fetchInstaMedia');


const router = express.Router();



router.get('/login', passport.authenticate('facebook', { scope: ['email', 'instagram_basic','instagram_content']}));


router.get(
  '/callback',
  passport.authenticate('facebook', {
    successRedirect:'/success',
    failureRedirect: '/error'
  }),
);

router.get('/success', fetchFacebookPage , pageWithInstaAccount, (req,res)=>{
  try{
    // const facebookPageData() = res.locals.facebookPageData;
    // const previousResponse = res.locals.response;
    // console.log('Response:',previousResponse)
    res.end();
  }
  catch(e){
    console.log('error with success',e)
  }
});

// router.get('/success', async (req, res) => {
//     console.log('success')



//   const userInfo = {
//     id: req.session.passport.user.id,
//     displayName: req.session.passport.user.displayName,
//     provider: req.session.passport.user.provider,
//   };
//   console.log(userInfo)
//   res.write('yes')
  
//   res.end();

// //   res.render('fb-github-success', { user: userInfo });
// });


router.get('/error', (req, res) => res.send('Error logging in via Facebook..'));

module.exports = router;
