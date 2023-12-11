const mongoose = require("mongoose");
require("dotenv").config();

const fbUserSchema = new mongoose.Schema({

  parent_user_Id: { type: mongoose.Schema.Types.ObjectId, ref: "Parent_User_ID_of_DB"},
  fetched_fb_user_Id: { type: String, required: true, unique: true },

  name_on_facebook: { type: String, required: true },
  email_on_facebook: { type: String, required: true },
  profile_picture_on_facebook: { type: String, required: false },
  access_token: { type: String, required: false, unique: true },
});

const FbUser = mongoose.model("FbUser", fbUserSchema);

module.exports = FbUser;