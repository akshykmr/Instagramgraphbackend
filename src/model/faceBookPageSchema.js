// models/authentication.js
const mongoose = require("mongoose");
require("dotenv").config();

const facebookPageSchema = new mongoose.Schema({
  user_Id_of_db: { type: mongoose.Schema.Types.ObjectId, ref: "UserInDB", unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  fetched_fb_page_Id: { type: String,  unique: true },
  fetched_connected_insta_users_history: [
    {
      instaUser: { type: String, required: true },
      updatedOn: { type: Date, default: Date.now },
    },
  ],
  status: ["Active", "Page_does_not_exist_in_facebook"],

  // RELATION KEYS
  fetched_connected_insta_user_Id: {
    type: String,
    unique: true,
  }, // INSTAUSERID PROVIDED BY FACEBOOK
  connected_insta_userId_of_db: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Insta_User_In_DB",
    unique: true,
  }, // INSTAUSERID PROVIDED BY MONGO COLLECTION
 
});

const FacebookPage = mongoose.model("FaceBookPage", facebookPageSchema);
module.exports = FacebookPage;
