const mongoose = require("mongoose");
require("dotenv").config();

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  profile_picture: { type: String, required: false },
  fetched_fb_user_Id: { type: String, required: true, unique: true },
  access_token: { type: String, required: false, unique: true },
});

const FbUser = mongoose.model("User", userSchema);

module.exports = FbUser;
