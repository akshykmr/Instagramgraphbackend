// models/authentication.js
const mongoose = require("mongoose");
require("dotenv").config();


const facebookPageSchema = new mongoose.Schema({
  user_Id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  category: { type: String, required: true },
  fb_user_Id: { type: String, required: true },
  fb_page_Id: { type: String, required: false },
  connected_insta_user_Id: { type: String, required:true },
})

const FacebookPage = mongoose.model("FaceBookPage", facebookPageSchema);
module.exports = FacebookPage;
