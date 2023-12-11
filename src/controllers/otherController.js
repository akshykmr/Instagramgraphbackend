require("dotenv").config();
const axios = require("axios");

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
    `${OAUTH_URL}authorize?client_id=${process.env.INSTAGRAM_CLIENT_ID}&redirect_uri=${process.env.INSTAGRAM_REDIRECT_URL}&scope=user_profile,use r_media&response_type=code`
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
  exchangeCodeForToken(req.body.code);
  res.send("ok");
};

const exchangeCodeForToken = async (code) => {
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
    console.log(response.data, "User Data : in response : ");

    const UserProfile =  await axios.get(
      `${GRAPH_URL}${response.data.user_id}?fields=username,profile_picture_url,followers_count,follows_count,media_count,biography,media&access_token=${response.data.access_token}`
    );

    console.log(UserProfile, "INSTAUSER");

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
