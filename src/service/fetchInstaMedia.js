const axios = require("axios");
require("dotenv").config();
const InstaUser = require('./../model/instaUserSchema');
const Media = require('../model/instaVideosSchema')
const https = require("https");
const fs = require("fs");
const path = require("path");

const baseUrl = process.env.FACEBOOK_BASE_URL;

const fetchInstaMedia = async (accessToken, pageIdbyMongo, pageIdbyFacebook, instaUserIdbyFacebook) => {
  try {
    // console.log("FACEBOOK USER ID",fb_user_Id, "FACEBOOK PAGE ID",fb_page_Id, "CONNECTED ISTA USER ID", connected_insta_user_Id, "NEW PAGE ID USER ID", connected_fbPage_Id ,'idssss')
    const fetchInstaProfile = await axios.get(
      `${baseUrl}/${instaUserIdbyFacebook}?fields=username,profile_picture_url,media_count,media&access_token=${accessToken}`
    );
    console.log(fetchInstaProfile.data,'instaprofile');

    const instaProfile = fetchInstaProfile.data;
    const existingUser = await InstaUser.findOne({ insta_User_Id: instaProfile.id})
    if(!existingUser){
        const instaUser= new InstaUser({
            username: instaProfile.username,
            profile_picture:  instaProfile.profile_picture_url,
            mediaCount :  instaProfile.media_count,
            fetched_media_Ids : [],
            fetched_insta_User_Id_of_this:instaProfile.id,
            // relational keys
            fetched_fb_page_Id : pageIdbyFacebook,
            connected_fbPage_Id_of_db: pageIdbyMongo,
        });
        for (let i = 0; i < instaProfile.media.data.length; i++) {
            instaUser.fetched_media_Ids.push(instaProfile.media.data[i].id);
        }
        const response = await instaUser.save();
        console.log(response,'Insta User Added Successfully')
    }
    const promises = fetchInstaProfile.data.media.data.map(async (item) => {
      const fetchedMedia = await axios.get(
        `${baseUrl}/${item.id}?fields=caption,like_count,media_type,media_url,permalink,thumbnail_url,comments{from,text,replies}&access_token=${accessToken}`
      );
      if (fetchedMedia.data.media_type === "VIDEO") {
        console.log(fetchedMedia.data, "media");

        const filePath = path.join(
          __dirname,
          "..",
          "..",
          "videos",
          `${item.id}.mp4`
        );

        const mediaInDB = await Media.findOne({
          video_Id : fetchedMedia.data.id
        });

        if(!mediaInDB){
          const media = new Media({
            video_url : fetchedMedia.data.media_url,
            permalink : fetchedMedia.data.permalink,
            thumbnail_url : fetchedMedia.data.permalink,
            video_Id : fetchedMedia.data.id,
            // posted_by : response.id,
            // timestamp : fetchedMedia.data,
            caption : fetchedMedia.data.caption,
            fetched_insta_user_Id : instaUserIdbyFacebook,
            like_count : fetchedMedia.data.like_count,
          });
          const video = await media.save();
          console.log('video saved succes');
          // Create the write stream
        const stream = fs.createWriteStream(filePath);

        https.get(`${fetchedMedia.data.media_url}`, function (response) {
          response.pipe(stream);
          console.log("data saved");
        });
        }
        else {
          console.log('video not saved')
        }

        
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
