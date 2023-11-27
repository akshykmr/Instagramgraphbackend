const mongoose = require("mongoose");
require("dotenv").config();

const instaUserSchema = new mongoose.Schema({
  user_Id_of_db: { type: mongoose.Schema.Types.ObjectId, ref: "UserInDB", required: false},
  username: { type: String, required: true },
  profile_picture: { type: String, required: false },
  mediaCount: { type: Number, required: false },
  fetched_media_Ids: [{ type: String, required: false }],
  fetched_fb_user_Id: { type: String, required: true, unique: true },
  fetched_insta_User_Id: { type: String, required: false, unique: true },
  // RELATIONAL ID'S
  fetched_fb_page_Id: { type: String, required: false, unique: true },
  connected_fbPage_Id_of_db: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Facebook_Page_In_DB",
    required: false,
    unique: true,
  },
  status  : ["Active", "Connection_not_found_with_fb_Page"]
});

const InstaUser = mongoose.model("InstaUser", instaUserSchema);

module.exports = InstaUser;
