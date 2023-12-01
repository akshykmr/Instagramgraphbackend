const axios = require("axios");
require("dotenv").config();
const FaceBookPage = require("./../model/faceBookPageSchema");
const InstaUser = require("./../model/instaUserSchema");
const encryption = require("./../service/encryptData.js");
const decryption = require("./../service/decryptData");
const fetchInstaMedia = require("./fetchInstaMedia.js");
const baseUrl = process.env.FACEBOOK_BASE_URL;

const fetchFacebookPage = async (accessToken) => {
  try {
    const facebookPageList = await axios.get(
      `${baseUrl}/me?fields=id,name,accounts{connected_instagram_account,name,category,id}&access_token=${accessToken}`
    ); // fetching facebook account along with facebook page and connected insta account
    console.log("Facebook Page Data Fetched Successfully");
    return facebookPageList.data;
  } catch (error) {
    console.log("Error While Fetching Facebook Page Data", error);
    return error;
  }
};

const pageWithInstaAccount = async (pageList, userId, accessToken) => {
  try {
    const fbPageObject = pageList;
    const promises = pageList.accounts.data.map(async (pageData) => {
      const existingPage = await FaceBookPage.findOne({
        fetched_fb_page_Id: pageData.id,
      });

      if (existingPage) {
        // if page exist
        if (pageData.connected_instagram_account) {
          // if instaId is present in req
          if (existingPage.fetched_connected_insta_user_Id) {
            // if instaId present in db
            if (
              pageData.connected_instagram_account.id ===
              existingPage.fetched_connected_insta_user_Id
            ) {
              // if both id is same
              await fetchInstaMedia(
                // fetching instaMedia
                accessToken,
                existingPage.fetched_fb_page_Id,
                existingPage.fetched_connected_insta_user_Id,
                existingPage.id // this is the pageId created in db for ref
              );
              console.log("both instaId is same");
            } else {
              // if instaId in req do not match with existing instaId
              const instaUserInDB = await InstaUser.findOne({
                // finding instaUser in relation with this page
                connected_fbPage_Id_of_db: existingPage.id,
              });
              if (instaUserInDB) {
                // if relation found
                instaUserInDB.connected_fbPage_Id_of_db = ""; // removing mongooseId of page
                instaUserInDB.fetched_fb_page_Id = ""; // removing fetchedpage id
                instaUserInDB.status = "Connection_not_found_with_fb_Page"; // free user, no connection
                await instaUserInDB.save();
                console.log(
                  instaUserInDB.username,
                  " : Connection released from facebookpage"
                );
              }
              // if InstaId is changed in req
              existingPage.fetched_connected_insta_user_Id =
                pageData.connected_instagram_account.id; // insta id is updated in db
              existingPage.status = "Active"; // page is set to Active Mode
              existingPage.connected_insta_userId_of_db = ""; // removing mongoose InstaUser id to release the instaUser
              await existingPage.save();
              // await fetchInstaMedia(
              //   // fetching instaMedia
              //   existingPage.fetched_fb_user_Id,
              //   existingPage.fetched_fb_page_Id,
              //   pageData.connected_instagram_account.id,
              //   existingPage.id // this is the pageId created in db for ref
              // );
              console.log(
                existingPage.name,
                " : Insta Id is updated with new instaId in pageDb"
              );
            }
          } else {
            // if insta Id is not present in db
            existingPage.fetched_connected_insta_user_Id =
              pageData.connected_instagram_account.id; // new insta id is added in db
            existingPage.status = "Active"; // page is set to Active Mode
            await existingPage.save();
            // await fetchInstaMedia(
            // fetching instaMedia
            //   existingPage.fetched_fb_user_Id,
            //   existingPage.fetched_fb_page_Id,
            //   pageData.connected_instagram_account.id,
            //   existingPage.id // this is the pageId created in db for ref
            // );
            console.log("Insta Id is added in pageDb");
          }
        } else {
          console.log("insta id not present in req");
          // if instaId is not present in req
          if (existingPage.fetched_connected_insta_user_Id) {
            //if instaId is present in db

            const instaUserInDB = await InstaUser.findOne({
              // finding existing instaUser in relation with this page
              connected_fbPage_Id_of_db: existingPage.id,
            });
            if (instaUserInDB) {
              // if relation found
              instaUserInDB.connected_fbPage_Id_of_db = ""; // removing mongooseId of page
              instaUserInDB.fetched_fb_page_Id = ""; // removing fetchedpage id
              instaUserInDB.status = "Connection_not_found_with_fb_Page"; // free user, no connection
              await instaUserInDB.save();
            }
            existingPage.fetched_connected_insta_user_Id = ""; // removing fetchedinstaIdfrom db as not found in db
            existingPage.connected_insta_userId_of_db = ""; // removing connected mongoose instaid from db
            existingPage.status = "Page_not_exist_in_facebook"; // page is set to Active Mode;
            await existingPage.save();
            console.log(
              "InstaId is removed from page and facebookpage is removed from InstaUser"
            );
          }
        }
      } else {
        // if page does not exist in database

        if (pageData.connected_instagram_account) {
          // if fetched page has instagram  connected
          const currentDate = new Date();
          const page = new FaceBookPage({
            user_Id_of_db: userId,
            name: pageData.name,
            category: pageData.category,

            fetched_fb_page_Id: pageData.id,

            // fetched_connected_insta_user_Id: await encryption(
            //   pageData.connected_instagram_account.id
            // ),
            fetched_connected_insta_user_Id:
              pageData.connected_instagram_account.id,
            status: "Active",
          });
          page.fetched_connected_insta_users_history.push({
            instaUser: pageData.connected_instagram_account.id,
            updatedOn: currentDate,
          });

          const response = await page.save();
          console.log("Page Added Successfully", response);
          await fetchInstaMedia(
            accessToken,
            response.id, // mongoose page id
            response.fetched_fb_page_Id, // pageId provided by facebook
            response.fetched_connected_insta_user_Id // instaUserId provided by facebook
          );
        } else {
          console.log(pageData.name, "is not connected with instagram");
        }
      }
    });
    await Promise.all(promises);
    return "success";
  } catch (error) {
    console.log("Error Saving Page Data", error);
  }
};

module.exports = { fetchFacebookPage, pageWithInstaAccount };
