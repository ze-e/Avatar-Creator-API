const User = require("../models/User.model");

async function verifyAdmin(req, res, next) {
  try {
    // check if user is admin
    const user = await User.findOne({ _id: req.user });

    if (!user) {
      req.isAdmin = false;
    } else {
      req.isAdmin = user.admin.userType === "admin";
    }

    next();
  } catch (error) {
    console.log("Error verifying admin token");
    req.isAdmin = false; // Set isAdmin to false in case of an error
    next();
  }
}

module.exports = verifyAdmin;
