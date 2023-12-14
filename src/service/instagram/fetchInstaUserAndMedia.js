const axios = require("axios");
require("dotenv").config();
const InstaUser = require("../../model/instaUserSchema");
const ParentUser = require('../../model/parentUserSchema');
const Media = require("../../model/instaVideosSchema");
const https = require("https");
const fs = require("fs");
const path = require("path");

const GRAPH_URL = process.env.INSTAGRAM_GRAPH_URL;

const fetchInstaUsers = async (
  accessToken,
  parentuserIdbyMongo,
  fetchedInstaUserId
) => {
  try {
  
    const fetchInstaProfile = await axios.get(
      `${GRAPH_URL}/${fetchedInstaUserId}?fields=username,profile_picture_url,followers_count,follows_count,media_count,biography,media&access_token=${accessToken}`
    );

    console.log(fetchInstaProfile,'instag profile')

    const instaProfile = fetchInstaProfile.data;

    const existingUser = await InstaUser.findOne({
      fetched_insta_User_Id: instaProfile.id,
    });

    if (!existingUser) {
      const instaUser = new InstaUser({
        parent_user_Id:parentuserIdbyMongo,
        username: instaProfile.username,
        biography: instaProfile.biography,
        profile_picture: instaProfile.profile_picture_url,
        followers_count: instaProfile.followers_count,
        follows_count: instaProfile.follows_count,
        media_count: instaProfile.media_count,
        fetched_media_Ids: [],
        fetched_insta_User_Id: instaProfile.id,
        // relational keys
        // fetched_fb_page_Id: pageIdbyFacebook,
        // connected_fbPage_Id_of_db: pageIdbyMongo,
      });
      for (let i = 0; i < instaProfile.media.data.length; i++) {
        instaUser.fetched_media_Ids.push(instaProfile.media.data[i].id);
      }
      const newUserCreated = await instaUser.save();

      console.log(newUserCreated,'new instagram user')

     
      // Update the connected_insta_user_Id in the ParentUser document
      const updateInParentUser = await ParentUser.findOneAndUpdate(
        { _id: parentuserIdbyMongo },
        {
          $set: {
            'insta_user.fetched_insta_user_Id': fetchedInstaUserId,
            'insta_user.connected_insta_user_Id': newUserCreated.id,
          },
        },
        { new: true }
      );


      console.log(updateInParentUser,"Insta User Added Successfully Now fetching Insta media..............");

      ///FETCHING INSTA MEDIA
      const fetchingInstaMedia = await fetchInstaMedia(instaProfile.media.data, newUserCreated.id, fetchedInstaUserId,  accessToken)
      return fetchingInstaMedia;
    } 
    else {
      console.log('InstaUser Exist In db')
    }
    // return "instapart is complete";
  } catch (error) {
    console.log("Error In InstaGram Fetching", error);
  }
};

const fetchInstaMedia = async (mediaArray, instaUserInDB, fetchedInstaUserId, accessToken) => {

  const promises = mediaArray.map(async (item) => {

    const fetchedMedia = await axios.get(
      `${GRAPH_URL}/${item.id}?fields=caption,media_type,media_url&access_token=${accessToken}`
    );

    // ,like_count,permalink,thumbnail_url,comments{from,text,replies} - CAN BE USE WITH FACEBOOK GRAPH ONLY

    console.log(fetchInstaMedia,'fetched media')
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
        // const media = new Media({
        //   video_url : fetchedMedia.data.media_url,
        //   // permalink : fetchedMedia.data.permalink,
        //   // thumbnail_url : fetchedMedia.data.permalink,
        //   video_Id : fetchedMedia.data.id,
        //   posted_by : instaUserInDB ,
        //   // timestamp : fetchedMedia.data,
        //   // caption : fetchedMedia.data.caption,
        //   fetched_insta_user_Id : fetchedInstaUserId,
        //   // like_count : fetchedMedia.data.like_count,
        // });
        const media = new Media({
          video_url: fetchedMedia.data.media_url,
          video_Id: fetchedMedia.data.id,
          posted_by: instaUserInDB,
          fetched_insta_user_Id: fetchedInstaUserId,
        });

        const video = await media.save();
        console.log(video.caption,'video is saved successfully');
        return video;
        // Create the write stream
      // const stream = fs.createWriteStream(filePath);

      // https.get(`${fetchedMedia.data.media_url}`, function (response) {
      //   response.pipe(stream);
      //   console.log("Video Downloaded Successfully");
      // });
      }
      else {
        console.log(mediaInDB.caption,' video is already exist')
      }
    } else 
    console.log(item.caption,'is not a video')
  });
  const result = await Promise.all(promises);
  return result;
// return "Insta media has been  stored"
};

module.exports = fetchInstaUsers;
