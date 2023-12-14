const mongoose = require("mongoose");
require("dotenv").config();

const instaUserSchema = new mongoose.Schema(
  {
    parent_user_Id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Parent_User_ID_of_DB",
    },
    fetched_insta_User_Id: { type: String,  unique: true },

    username: { type: String, required: true },
    biography: { type: String},
    profile_picture: { type: String },
    followers_count: { type: Number  },
    follows_count: { type: Number},
    media_count: { type: Number},
    fetched_media_Ids: [{ type: String,  }],

    // RELATIONAL ID'S
    // fetched_fb_page_Id: { type: String, , unique: true },
    // connected_fbPage_Id_of_db: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Facebook_Page_In_DB",
    //   ,
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
