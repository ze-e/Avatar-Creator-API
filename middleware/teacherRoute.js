async function teacherRoute(req, res, next) {
    // check if user is teacher
    if (req.role !== "teacher") res.status(500).json({ error: `Only teachers have access to this route`});
    else next();
}

module.exports = teacherRoute;
