const FacebookPage = require("../model/faceBookPageSchema");
const InstaUser = require("../model/instaUserSchema");
const Video = require("../model/instaVideosSchema");

const testingSendData = async (req, res) => {
  try {
    console.log("login success");
    res.send("login successfull");
  } catch (error) {
    console.log(error, "login failed");
  }
};

const sendDataAfterFBLogin = async (req, res) => {
  try {
    if (req.user) {
      const facebookPages = await FacebookPage.find({
        user_Id_of_db: req.user._id,
      });

      const responseData = [];

      for (const page of facebookPages) {
        const instaUser = await InstaUser.findOne({
          connected_fbPage_Id_of_db: page._id,
        });

        if (instaUser) {
          const media = await Video.find({
            posted_by: instaUser._id,
          });

          responseData.push({
            page: {
              id: page._id,
              name: page.name,
              category: page.category,
              // Add other page details as needed
            },
            instaUser: {
              id: instaUser._id,
              username: instaUser.username,
              biography: instaUser.biography,
              profile_picture: instaUser.profile_picture,
              followers_count: instaUser.followers_count,
              follows_count: instaUser.follows_count,
              media_count: instaUser.media_count,
            },
            media: media,
          });
        }
      }

      res.status(200).json({
        success: true,
        message: "Successful",
        user: req.user,
        cookies: req.cookies,
        data: responseData,
      });
    } else {
      console.log("User not found");
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
  } catch (error) {
    console.error("Error in /success route:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = { testingSendData, sendDataAfterFBLogin };
