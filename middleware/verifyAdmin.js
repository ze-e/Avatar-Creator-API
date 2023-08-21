const User = require("../models/User.model");

async function verifyAdmin(req, res, next) {
  //check if user is admin
  let user = null;
  try {
    user = await User.findOne({ _id: req.user });
  }
  catch (e) {
    console.log("error verifying admin token");
  }
  if(!user) req.isAdmin = false
  else req.isAdmin = user.admin.userType === "admin" ? true : false;
  next();
}

module.exports = verifyAdmin;
