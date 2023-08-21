const jwt = require("jsonwebtoken");

/* check token middleware for protected routes */
async function verifyToken(req, res, next) {
  try {
    //get user
    const authHeader = req.headers["authorization"];
    const token = authHeader.replace("Bearer ", "");
    req.user = await jwt.verify(token, process.env.SECRETKEY).userId;
  } catch (e) {
    req.user === null;
  }

  next();
}

module.exports = verifyToken;