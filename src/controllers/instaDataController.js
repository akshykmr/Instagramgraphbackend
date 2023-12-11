// const createUser = async (req, res) => {
//     try {
  
//       const {email, mobileNo} = req.body;
//       console.log("userdata", req.body);
  
//       const existingUserWithEmail = await User.findOne({ email });
//       const existingUserWithMobile = await User.findOne({ mobileNo });
  
//       if (existingUserWithEmail) {
//         console.log("User with this email already exists");
//         return res.json({
//           success: false,
//           message: "Email already exists, please choose another email",
//           action : "email"
//         });
//       } else if (existingUserWithMobile) {
//         console.log("User with this mobile number already exists");
//         return res.json({
//           success: false,
//           message:
//             "Mobile number already exists, please choose another mobile number",
//         });
//       } 
//       console.log("0")
//       const {password} = req.body;
  
//         const hashedPassword = await bcrypt.hash(password, 10); 
//         console.log("1")
//         const profileImg = req.file;
//         console.log("2")
  
//         const imagePath = profileImg.path;
//         console.log("3")
  
//         const imgResult = await cloudinary.uploader.upload(imagePath);
//         console.log("4")
  
//         const user = new User({
//           firstName: req.body.firstName,
//           lastName: req.body.lastName,
//           email: req.body.email,
//           password: hashedPassword,
//           mobileNo: req.body.mobileNo,
//           profilePic: {
//             imgUrl: imgResult.url,
//             imgPublic_Id: imgResult.public_id,
//           },
//           loggedInWithGoogle: false,
//         });
//         console.log("5")
  
  
//         const token = await user.generateAuthToken();
//         console.log("6")
  
//         const response = await user.save();
//         console.log("7")
  
//         res.json({
//           success: true,
//           message: "User successfully registered",
//           response,
//           token,
//         });
//         console.log("User successfully registered");
//         const path = imagePath;
//         fs.unlink(path, (err) => {
//           if (err) {
//             console.error("Error deleting temporary file:", err);
//           } else {
//             console.log("Temporary file deleted successfully:");
//           }
//         });
      
//     } catch (error) {
//       res
//         .status(500)
//         .json({ error: "An error occurred while registering the user." });
//     }
//   };