const mongoose = require('mongoose');
require("dotenv").config();


const instaUserSchema = new mongoose.Schema({
    user_Id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    username:  { type: String, required: true },
    profile_picture:  { type: String, required: false },
    mediaCount :  { type: Number, required: false },
    media_Ids : [{ type: String, required: true }],
    fb_user_Id: { type: String, required: true, unique: true },
    connected_fbPage_Id: { type: mongoose.Schema.Types.ObjectId, ref: 'facebook_Page', required: true, unique: true },
    insta_User_Id: { type: String, required:true , unique: true},
});

const InstaUser = mongoose.model('InstaUser', instaUserSchema);

module.exports = InstaUser;