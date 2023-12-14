require("dotenv").config();
const axios = require("axios");
const User = require("../model/parentUserSchema");
const fetchInstaUsers = require('../service/instagram/fetchInstaUserAndMedia')
const OAUTH_URL = process.env.INSTAGRAM_OAUTH_URL;

const GRAPH_URL = process.env.INSTAGRAM_GRAPH_URL;

const verifyUserForInsta = async (req, res) => {
  res.json({
    success: true,
    message: "Token Valid",
  });
};


const loginWithInsta = async (req, res) => {
  res.redirect(
    `https://api.instagram.com/oauth/authorize?client_id=260114580407008&redirect_uri=https://main--graphapi.netlify.app/auth/&scope=user_profile,user_media&response_type=code`
  );
};

const error = async (req, res) => {
  res.send("Error logging in ....");
};

const fbLogout = async (req, res) => {
  try {
    req.session.destroy(function (err) {
      console.log("session destroyed. Logout successfull");
    });
    res.redirect("http://localhost:5000/auth/facebook");
  } catch (err) {
    res.status(400).send({ message: "Failed to sign out fb user" });
  }
};

const innstLogout = async (req, res) => {
  try {
    req.session.destroy(function (err) {
      console.log("session destroyed. Logout successfull");
    });
    res.send("Logout from Instagram");
  } catch (err) {
    res.status(400).send({ message: "Failed to sign out fb user" });
  }
};



// GETTING INSTA ACCESS TOKEN FROM FRONTEND
const loginAndHandleCallback = async (req, res) => {
 const gettingInstaDetails = await exchangeCodeForToken(req.body.code, req.user.item);
  res.send(gettingInstaDetails);
};

const exchangeCodeForToken = async (code, userId) => {
  try {

    const formData = new FormData();
    formData.append("client_id", process.env.INSTAGRAM_CLIENT_ID);
    formData.append("client_secret", process.env.INSTAGRAM_CLIENT_SECRET);
    formData.append("grant_type", "authorization_code");
    formData.append("redirect_uri", process.env.INSTAGRAM_REDIRECT_URL);
    formData.append("code", code);

    const response = await axios.post(
      `${OAUTH_URL}access_token`,
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    console.log(response.data, ": fetched ista userId and access token");

    // const getUserProfile =  await axios.get(
    //   `${GRAPH_URL}${response.data.user_id}?fields=username,profile_picture_url,followers_count,follows_count,media_count,biography,media&access_token=${response.data.access_token}`
    // );

  const parentUser = await User.findById(userId);

  console.log(parentUser,userId,'finidng....')
  const fetchingInstaMedia = await fetchInstaUsers(
    // fetching instaMedia
    response.data.access_token,
    parentUser.id,
    response.data.user_id
  );
  return fetchingInstaMedia

  //   console.log(getUserProfile, "INSTAUSER");

    // Return the access token
    // return response.data.access_token;
  } catch (error) {
    console.error("Error exchanging code for token:", error.message);
    throw error;
  }
};

module.exports = {
  loginAndHandleCallback,
  loginWithInsta,
  error,
  fbLogout,
  innstLogout,
  verifyUserForInsta
};
