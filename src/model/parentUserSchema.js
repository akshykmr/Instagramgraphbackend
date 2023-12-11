require("dotenv").config();
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobileNo: {
      type: Number,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      default: "",
    },
    profile_picture: {
      type: String,
      default: "",
    },
    cover_photo: {
      type: String,
      default: "",
    },
    UserStatus: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },

    // //FACEBOOK USER
    facebook_user: {
      fetched_fb_user_Id: { type: String, unique: true },
      connected_fb_user_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "facebook_user_in_DB",
      },
    },

    // INSTAGRAM USER
    insta_user: {
      fetched_insta_user_Id: { type: String, unique: true },
      connected_insta_user_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "insta_user_in_DB",
      },
    },

    // TIKTOK USER
    tiktok_user: {
      fetched_tiktok_user_Id: { type: String, unique: true },
      connected_tiktok_user_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "tiktok_user_in_DB",
      },
    },

    // YOUTUBE USER
    youtube_user: {
      fetched_youtube_user_Id: { type: String, unique: true },
      connected_youtube_user_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "youtube_user_in_DB",
      },
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
