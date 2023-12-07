



const error = async (req, res) => {
  res.send("Error logging in ....");
};



const logout = async (req, res) => {
  try {
    req.session.destroy(function (err) {
      console.log("session destroyed. Logout successfull");
    });
    res.redirect("http://localhost:5000/auth/facebook");
  } catch (err) {
    res.status(400).send({ message: "Failed to sign out fb user" });
  }
};

module.exports = {
  error,
  logout,
};
