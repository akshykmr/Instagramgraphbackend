const axios = require("axios");
require("dotenv").config();
const InstaUser = require('./../model/instaUserSchema');
const https = require("https");
const fs = require("fs");
const path = require("path");

const accessToken = process.env.ACCESS_TOKEN;
const baseUrl = process.env.FACEBOOK_BASE_URL;

const fetchInstaMedia = async (fb_user_Id,fb_page_Id, connected_insta_user_Id, connected_fbPage_Id ) => {
  try {
    // console.log("FACEBOOK USER ID",fb_user_Id, "FACEBOOK PAGE ID",fb_page_Id, "CONNECTED ISTA USER ID", connected_insta_user_Id, "NEW PAGE ID USER ID", connected_fbPage_Id ,'idssss')
    const fetchInstaProfile = await axios.get(
      `${baseUrl}/${connected_insta_user_Id}?fields=username,profile_picture_url,media_count,media&access_token=${accessToken}`
    );
    console.log(fetchInstaProfile.data,'instaprofile');

    const instaProfile = fetchInstaProfile.data;
    const existingUser = await InstaUser.findOne({ insta_User_Id: instaProfile.id})
    if(!existingUser){
        const instaUser= new InstaUser({
            // user_Id:"",
            username: instaProfile.username,
            profile_picture:  instaProfile.profile_picture_url,
            mediaCount :  instaProfile.media_count,
            media_Ids : [],
            fb_user_Id: fb_user_Id,
            connected_fbPage_Id: connected_fbPage_Id,
            insta_User_Id: instaProfile.id,
        });
        for (let i = 0; i < instaProfile.media.data.length; i++) {
            instaUser.media_Ids.push(instaProfile.media.data[i].id);
        }
        const response = await instaUser.save();
        console.log(response,'Insta User Added Successfully')
    }
    const promises = fetchInstaProfile.data.media.data.map(async (item) => {
      const fetchMedia = await axios.get(
        `${baseUrl}/${item.id}?fields=caption,like_count,media_type,media_url,permalink,thumbnail_url,comments{from,text,replies}&access_token=${accessToken}`
      );

      if (fetchMedia.data.media_type === "VIDEO") {
        console.log(fetchMedia.data, "media");

        const filePath = path.join(
          __dirname,
          "..",
          "..",
          "videos",
          `${item.id}.mp4`
        );

        // Create the write stream
        const stream = fs.createWriteStream(filePath);

        https.get(`${fetchMedia.data.media_url}`, function (response) {
          response.pipe(stream);
          console.log("data saved");
        });
      }
    });
    await Promise.all(promises);
    // next();
  } catch (error) {
    console.log("Error While Fetching Facebook Page Data", error);
    next();
  }
};

module.exports = fetchInstaMedia;
