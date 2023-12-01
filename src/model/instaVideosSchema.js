// models/authentication.js
const mongoose = require("mongoose");
require("dotenv").config();


const instaVideoSchema = new mongoose.Schema({
  video_url: { type: String, required: true },
  permalink: { type: String, required: true },
  thumbnail_url: { type: String, required: true },  
  video_Id: { type: Number, required: true, unique: true },
  posted_by: { type: mongoose.Schema.Types.ObjectId, ref: 'InstaUser' },
  timestamp: { type: Date, default: Date.now },
  caption: { type: String, required: true },
  fetched_insta_user_Id: { type: Number, required:true, unique: true  },
  like_count: Number,

});

const Video = mongoose.model('Video', instaVideoSchema);

module.exports = Video;

