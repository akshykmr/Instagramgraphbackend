const axios = require("axios");
require("dotenv").config();
const FaceBookPage = require("./../model/faceBookPageSchema");
const encryption = require("./../service/encryptData.js");
const decryption = require("./../service/decryptData");
const fetchInstaMedia = require("./fetchInstaMedia.js");
const accessToken = process.env.ACCESS_TOKEN;
const baseUrl = process.env.FACEBOOK_BASE_URL;

const fetchFacebookPage = async (req, res, next) => {
  try {
    const facebookPageList = await axios.get(
      `${baseUrl}/me?fields=id,name,accounts{connected_instagram_account,name,category,id}&access_token=${accessToken}`
    ); // fetching facebook account along with facebook page and connected insta account
    console.log("Facebook Page Data Fetched Successfully");
    res.locals.response = facebookPageList;
    // console.log(facebookPageList.data.accounts.data);
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
          if (!existingPage) {
            const page = new FaceBookPage({
              name: pageData.name,
              category: pageData.category,
              fb_page_Id: pageData.id,
              connected_insta_user_Id: await encryption(
                pageData.connected_instagram_account.id
              ),
              fb_user_Id: await encryption(fbPageObject.id),
              //   user_Id : " "
            });
            const response = await page.save();
            console.log("Page Added Successfully", response);
            await fetchInstaMedia(
              response.fb_user_Id,
              response.fb_page_Id,
              pageData.connected_instagram_account.id,
              response.id
            );
          } else {
            if (
              pageData.connected_instagram_account.id !==
              (await encryption(existingPage.connected_fbPage_Id))
            ) {
              existingPage.connected_fbPage_Id = await encryption(
                pageData.connected_instagram_account.id
              );
              existingPage.save();
              console.log("Insta Id updated in page Schema");
            } else
              await fetchInstaMedia(
                existingPage.fb_user_Id,
                existingPage.fb_page_Id,
                await decryption(existingPage.connected_insta_user_Id),
                existingPage.id,
              );
            console.log("Page already exist");
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
