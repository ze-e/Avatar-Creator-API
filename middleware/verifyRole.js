const User = require("../models/User.model");

async function verifyRole(req, res, next) {
  try {
    // check if user is admin
    const user = await User.findOne({ _id: req.user });

    if (!user) {
      req.role = null;
    } else {
      req.role = user.admin.userType;
    }

    next();
  } catch (error) {
    console.log("Error verifying role");
    req.role = null; // Set role to null in case of an error
    next();
  }
}

module.exports = verifyRole;
