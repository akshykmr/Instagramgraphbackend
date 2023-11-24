const mongoose = require('mongoose');
require("dotenv").config();


const fbUserSchema = new mongoose.Schema({
    username: String,
    email: String,
    profile_picture: String,
    pageId : [],
    profile_picture:  { type: String, required: true },

    // Other user-related fields
});

const FbUser = mongoose.model('User', fbUserSchema);

module.exports = FbUser;