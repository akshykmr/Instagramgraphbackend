const mongoose = require('mongoose');
require("dotenv").config();


const fbuserSchema = new mongoose.Schema({
    username: String,
    email: String,
    profile_picture: String,
    // Other user-related fields
});

const FbUser = mongoose.model('User', fbuserSchema);

module.exports = FbUser;