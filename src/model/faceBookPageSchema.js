// models/authentication.js
const mongoose = require("mongoose");
require("dotenv").config();


const facebookPageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  fb_page_Id: { type: String, required: true, unique: true },
  connected_insta_user_Id: { type: String, required:true },
//   user_Id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  fb_user_Id: { type: String, required: true, unique: true },
})

// facebookPageSchema.methods["generateAuthToken"] = async function () {
//   try {
//     const token = jwt.sign({ _id: this._id }, JWT_SECRET_KEY);
//     return token;
//   } catch (error) {
//     res.send("error", error);
//     console.log("error in token", error);
//   }
// };

const FacebookPage = mongoose.model("FaceBookPage", facebookPageSchema);
module.exports = FacebookPage;
