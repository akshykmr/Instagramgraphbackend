const User = require("../model/parentUserSchema");
const bcrypt = require("bcrypt");
const generateJWT = require("../service/genJWTToken");



// REGISTRATION HANDLER

const registerUser = async (req, res) => {
  try {
    const { email, mobileNo } = req.body;

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
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        mobileNo: req.body.mobileNo,
        bio: req.body.bio,
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
        res.json({
          success: true,
          message: "Login Success",
          user: existingUser,
          token: token,
        });
      } else {
        res.json({ success: false, message: "Invalid Password" });
      }
    } else {
      res.json({ success: false, message: "Invalid UserId" });
    }
  } catch (error) {
    console.log(error, "error occured");
  }
};

module.exports = {
  registerUser,
  loginUser,
};
