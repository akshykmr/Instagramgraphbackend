const axios = require("axios");
require("dotenv").config();
const FaceBookPage = require("./../model/faceBookPageSchema");
const InstaUser = require("./../model/instaUserSchema");
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
        const existingPage = await FaceBookPage.findOne({
          fetched_fb_page_Id: pageData.id,
        });
        if (existingPage) {
          // if page exist
          if (pageData.connected_instagram_account) {
            // if instaId is present in req
            if (existingPage.connected_insta_userId_of_db) {
              // if instaId present in db
              if (
                pageData.connected_instagram_account ===
                (await decryption(existingPage.fetched_connected_insta_user_Id))
              ) {
                // if both id is same
                await fetchInstaMedia(
                  // fetching instaMedia
                  existingPage.fetched_fb_user_Id,
                  existingPage.fetched_fb_page_Id,
                  pageData.connected_instagram_account.id,
                  existingPage.id // this is the pageId created in db for ref
                );
              } else {
                // if instaUser in req do not match with existing instauser
                const isInstaUserExist = await InstaUser.findOne({
                  // finding instaUser in relation with this page
                  connected_fbPage_Id_of_db: existingPage.id,
                });
                if (isInstaUserExist) {
                  // if relation found
                  isInstaUserExist.connected_fbPage_Id_of_db = ""; // removing mongooseId of page
                  isInstaUserExist.fetched_fb_page_Id = ""; // removing fetchedpage id
                  isInstaUserExist.status = "Connection_not_found_with_fb_Page"; // free user, no connection
                  await isInstaUserExist.save();
                  console.log(
                    isInstaUserExist.username,
                    " : InstaUser Updated Successfully"
                  );
                }
                // if InstaId is changed in req
                existingPage.fetched_connected_insta_user_Id = await encryption(
                  pageData.connected_instagram_account.id
                ); // insta id is updated in db
                existingPage.status = "Active"; // page is set to Active Mode
                existingPage.connected_insta_userId_of_db = ""; // removing mongoose InstaUser id to release the instaUser
                await existingPage.save();
                await fetchInstaMedia(
                  // fetching instaMedia
                  existingPage.fetched_fb_user_Id,
                  existingPage.fetched_fb_page_Id,
                  pageData.connected_instagram_account.id,
                  existingPage.id // this is the pageId created in db for ref
                );
                console.log(
                  existingPage.name,
                  " : Insta Id is updated with new one in pageDb"
                );
              }
            } else {
              // if insta Id is not present in db
              existingPage.fetched_connected_insta_user_Id = await encryption(
                pageData.connected_instagram_account.id
              ); // new insta id is added in db
              existingPage.status = "Active"; // page is set to Active Mode
              await existingPage.save();
              await fetchInstaMedia(
                // fetching instaMedia
                existingPage.fetched_fb_user_Id,
                existingPage.fetched_fb_page_Id,
                pageData.connected_instagram_account.id,
                existingPage.id // this is the pageId created in db for ref
              );
              console.log("new Insta Id is added in pageDb");
            }
          } else {
            // if instaId is not present in req
            if (existingPage.fetched_connected_insta_user_Id) {
              //if instaId is present in db

              const isInstaUserExist = await InstaUser.findOne({
                // finding existing instaUser in relation with this page
                connected_fbPage_Id_of_db: existingPage.id,
              });
              if (isInstaUserExist) {
                // if relation found
                isInstaUserExist.connected_fbPage_Id_of_db = ""; // removing mongooseId of page
                isInstaUserExist.fetched_fb_page_Id = ""; // removing fetchedpage id
                isInstaUserExist.status = "Connection_not_found_with_fb_Page"; // free user, no connection
                await isInstaUserExist.save();
              }
              existingPage.fetched_connected_insta_user_Id = ""; // removing instaIdfrom db as not found in db
              existingPage.status = "Page_not_exist_in_facebook"; // page is set to Active Mode
              existingPage.connected_insta_userId_of_db = ""; // removing instaIdfrom db as not found in db

              await existingPage.save();
              console.log("Insta Id is removed from pageDb");
            }
          }
        } else {
          if (pageData.connected_instagram_account) {
            const page = new FaceBookPage({
              // user_Id_of_db:"",
              name: pageData.name,
              category: pageData.category,

              fetched_fb_user_Id: await encryption(fbPageObject.id),
              fetched_fb_page_Id: pageData.id,

              fetched_connected_insta_user_Id: await encryption(
                pageData.connected_instagram_account.id
              ),
              status: "Active",
            });
            const response = await page.save();
            console.log("Page Added Successfully", response);
            await fetchInstaMedia(
              response.fb_user_Id,
              response.fb_page_Id,
              pageData.connected_instagram_account.id,
              response.id // this is the pageId created in db for ref
            );
          }
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
