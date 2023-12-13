const User = require("../model/parentUserSchema");
const bcrypt = require("bcrypt");
const generateJWT = require("../service/genJWTToken");



// REGISTRATION HANDLER

const registerUser = async (req, res) => {
  try {
    const { email, mobileNo } = req.body;

    console.log(req.body,'req body')

    const existingUserWithEmail = await User.findOne({ email });
    const existingUserWithMobile = await User.findOne({ mobileNo });

    if (existingUserWithEmail) {
      console.log("User Already Exist with this email");
      return res.json({
        success: false,
        message: "Email already exists, please choose another email",
        duplicateItem: "email",
      });
    } else if (existingUserWithMobile) {
      console.log("User with this mobile number already exists");
      return res.json({
        success: false,
        message:
          "Mobile number already exists, please choose another mobile number",
        duplicateItem: "mobile",
      });
    } else {
      const { password } = req.body;

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        mobileNo: req.body.mobileNo,
        UserStatus: "Active",
      });

      const response = await user.save();

      //   const token = await generateJWT(response.id);

      // console.log("7");

      res.json({
        success: true,
        message: "User successfully registered",
        user: response,
        // token: token,
      });
      console.log("User successfully registered");
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while registering the user." });
  }
};


// LOGIN HANDLER

const loginUser = async (req, res) => {
  try {
    const { userId, password } = req.body;

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userId);

    const query = isEmail ? { email: userId } : { mobileNo: userId };

    const existingUser = await User.findOne(query);

    if (existingUser) {
      const isPasswordValid = await bcrypt.compare(
        password,
        existingUser.password
      );

      if (isPasswordValid) {
        const token = await generateJWT(existingUser.id);

        // Check if InstaUser is present
        const instaUserPresent = existingUser.insta_user.connected_insta_user_Id !== null;
        

        res.json({
          success: true,
          message: "Login Success",
          user: existingUser,
          token: token,
          instaUserPresent: instaUserPresent, // Additional key indicating if InstaUser is present
        });
      } else {
        res.json({ success: false, message: "Invalid Password" });
      }
    } else {
      res.json({ success: false, message: "Invalid UserId" });
    }
  } catch (error) {
    console.log(error, "error occurred");
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


module.exports = {
  registerUser,
  loginUser,
};
