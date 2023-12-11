const mongoose = require("mongoose");
require("dotenv").config();

const instaUserSchema = new mongoose.Schema(
  {
    parent_user_Id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Parent_User_ID_of_DB",
    },
    fetched_insta_User_Id: { type: String, required: false, unique: true },

    username: { type: String, required: true },
    biography: { type: String, required: false },
    profile_picture: { type: String, required: false },
    followers_count: { type: Number, required: false },
    follows_count: { type: Number, required: false },
    media_count: { type: Number, required: false },
    fetched_media_Ids: [{ type: String, required: false }],

    // RELATIONAL ID'S
    // fetched_fb_page_Id: { type: String, required: false, unique: true },
    // connected_fbPage_Id_of_db: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Facebook_Page_In_DB",
    //   required: false,
    //   unique: true,
    // },

    status: {
      type: String,
      enum: ["active", "block"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

const InstaUser = mongoose.model("InstaUser", instaUserSchema);

module.exports = InstaUser;
