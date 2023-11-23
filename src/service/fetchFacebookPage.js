const axios = require("axios");
require("dotenv").config();
const FaceBookPage = require("./../model/faceBookPageSchema");
const bcrypt = require("bcrypt");
const encryption = require('./../service/encryption')
const decryption = require('./../service/decryption')
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
const crypto = require("crypto");

const accessToken = process.env.ACCESS_TOKEN;
const baseUrl = process.env.FACEBOOK_BASE_URL;


const fetchFacebookPage = async (req, res, next) => {
  try {
    const facebookPageList = await axios.get(
      `${baseUrl}/me?fields=id,name,accounts{connected_instagram_account,name,category,id}&access_token=${accessToken}`
    ); // fetching facebook account along with facebook page and connected insta account
    console.log('Facebook Page Data Fetched Successfully')
    res.locals.response = facebookPageList;
    next();
  } catch (error) {
    console.log("Error While Fetching Facebook Page Data", error);
  }
};

const pageWithInstaAccount = async (req, res, next) => {
  try {
    const fbPageObject = res.locals.response.data;
    const promises = res.locals.response.data.accounts.data.map(
      async (pageData) => {
        if (pageData.connected_instagram_account) {
          const existingPage = await FaceBookPage.findOne({
            fb_page_Id: pageData.id,
          });
          console.log(crypto.randomBytes(32),'ENTT')


          const encry = await encryption(pageData.id)
          console.log(encry,'ennn');

        //  const dec = '299be0cc47a523f5062f048f69c9f0e5';

        //   const dcryp = await decryption(dec)
        //   console.log(dcryp,'dddd')

          if (!existingPage) {
            const page = new FaceBookPage({
              name: pageData.name,
              category: pageData.category,
              fb_page_Id: pageData.id,
              connected_insta_user_Id: await bcrypt.hash(
                pageData.connected_instagram_account.id,
                10
              ),
              fb_user_Id: await bcrypt.hash(fbPageObject.id, 10),
              //   user_Id : " "
            });
            const response = await page.save();
            console.log("Page Added Successfully", response);
            //   res.locals.instaId = page.connected_instagram_account.id;
          } else {
            //   res.locals.instaId = existingPage.instaId;
            res.locals.response = "Page Already Exist";
            console.log("page already exist");
          }
        } else {
          res.locals.response =
            "Please Connect Your Instagram Id with Facebook page";
        }
      }
    );
    await Promise.all(promises);
    next();
  } catch (error) {
    console.log("Error Saving Page Data", error);
  }
};

module.exports = { fetchFacebookPage, pageWithInstaAccount };
