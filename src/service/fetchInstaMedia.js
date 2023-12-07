const axios = require("axios");
require("dotenv").config();
const InstaUser = require("./../model/instaUserSchema");
const Media = require("../model/instaVideosSchema");
const https = require("https");
const fs = require("fs");
const path = require("path");

const baseUrl = process.env.FACEBOOK_BASE_URL;

const fetchInstaUsers = async (
  accessToken,
  pageIdbyMongo,
  pageIdbyFacebook,
  instaUserIdbyFacebook
) => {
  try {
  
    const fetchInstaProfile = await axios.get(
      `${baseUrl}/${instaUserIdbyFacebook}?fields=username,profile_picture_url,followers_count,follows_count,media_count,biography,media&access_token=${accessToken}`
    );

    const instaProfile = fetchInstaProfile.data;

    const existingUser = await InstaUser.findOne({
      fetched_insta_User_Id_of_this: instaProfile.id,
    });

    if (!existingUser) {
      const instaUser = new InstaUser({
        username: instaProfile.username,
        biography: instaProfile.biography,
        profile_picture: instaProfile.profile_picture_url,
        followers_count: instaProfile.followers_count,
        follows_count: instaProfile.follows_count,
        media_count: instaProfile.media_count,
        fetched_media_Ids: [],
        fetched_insta_User_Id_of_this: instaProfile.id,
        // relational keys
        fetched_fb_page_Id: pageIdbyFacebook,
        connected_fbPage_Id_of_db: pageIdbyMongo,
      });
      for (let i = 0; i < instaProfile.media.data.length; i++) {
        instaUser.fetched_media_Ids.push(instaProfile.media.data[i].id);
      }
      const newUserCreated = await instaUser.save();
      console.log(newUserCreated,"Insta User Added Successfully Now fetching Insta media..............");

      ///FETCHING INSTA MEDIA
      const fetchingInstaMedia = await fetchInstaMedia(instaProfile.media.data, newUserCreated.id, instaUserIdbyFacebook,  accessToken)
    } 
    else {
      console.log('InstaUser Exist In db')
    }
    // return "instapart is complete";
  } catch (error) {
    console.log("Error In InstaGram Fetching", error);
  }
};

const fetchInstaMedia = async (mediaArray, instaUser, instaUserIdbyFacebook, accessToken) => {

  const promises = mediaArray.map(async (item) => {

    const fetchedMedia = await axios.get(
      `${baseUrl}/${item.id}?fields=caption,like_count,media_type,media_url,permalink,thumbnail_url,comments{from,text,replies}&access_token=${accessToken}`
    );
    if (fetchedMedia.data.media_type === "VIDEO") {

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
          posted_by : instaUser ,
          // timestamp : fetchedMedia.data,
          caption : fetchedMedia.data.caption,
          fetched_insta_user_Id : instaUserIdbyFacebook,
          like_count : fetchedMedia.data.like_count,
        });
        const video = await media.save();
        console.log(video.caption,'video is saved successfully');
        // Create the write stream
      const stream = fs.createWriteStream(filePath);

      https.get(`${fetchedMedia.data.media_url}`, function (response) {
        response.pipe(stream);
        console.log("Video Downloaded Successfully");
      });
      }
      else {
        console.log(mediaInDB.caption,' video is already exist')
      }
    } else 
    console.log(item.caption,'is not a video')
  });
  await Promise.all(promises);
// return "Insta media has been  stored"
};

module.exports = fetchInstaUsers;
