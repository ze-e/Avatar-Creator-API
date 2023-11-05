async function teacherRoute(req, res, next) {
  // check for user
  if (!req.user)
    return res.status(403).json({ error: "User must be signed in" });

  // check if user is teacher
  if (req.role !== "teacher")
    res.status(403).json({ error: `Only teachers have access to this route` });
  else next();
}

module.exports = teacherRoute;