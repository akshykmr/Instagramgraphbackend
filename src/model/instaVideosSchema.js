// models/authentication.js
const mongoose = require("mongoose");
require("dotenv").config();


const instaVideoSchema = new mongoose.Schema({
  video_url: { type: String, required: true },
  fb_Id: { type: Number, required: true},
  insta_Video_Id: { type: Number, required: true, unique: true },
  posted_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  timestamp: { type: Date, default: Date.now },
  name: { type: String, required: true },
  category: { type: String, required: true },
  fb_page_Id: { type: Number, required: true, unique: true },
  connected_insta_Id: { type: Number, required:true, unique: true  },
  user_Id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const Video = mongoose.model('Video', instaVideoSchema);

module.exports = Video;

