const User = require("../models/User.model");

async function teacherRoute(req, res, next) {
    // check if user is teacher
    if (req.role !== "teacher")
      throw new Error(`Only teachers have access to this route`);
    next();
}

module.exports = teacherRoute;
