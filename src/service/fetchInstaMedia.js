const axios = require("axios");
require("dotenv").config();
const FaceBookPage = require("./../model/faceBookPageSchema");
const https = require("https");
const fs = require("fs");
const path = require("path");

const accessToken = process.env.ACCESS_TOKEN;
const baseUrl = process.env.FACEBOOK_BASE_URL;

const fetchInstaMedia = async (req, res, next) => {
  try {
    const fetchInstaProfile = await axios.get(
      `${baseUrl}/${res.locals.instaId}?fields=username,profile_picture_url,media_count,media&access_token=${accessToken}`
    );

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
    next();
  } catch (error) {
    console.log("Error While Fetching Facebook Page Data", error);
    next();
  }
};

module.exports = fetchInstaMedia;
