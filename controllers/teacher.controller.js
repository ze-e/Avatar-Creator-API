const userService = require("../services/teacher.service");

exports.getAllStudents = async (req, res) => {
  try {
    const users = await userService.getAllStudents(req.user, req.role);
    res.status(200).json({ data: users, message: "got students" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.gainXP = async (req, res) => {
  if (!req.user)
    return res.status(403).json({ error: "User must be signed in" });
  try {
    let user;
    if (req.role !== 'teacher')
      return res
        .status(403)
        .json({ error: "Only teacher can edit user" });
    else
      user = await userService.gainXP(req.params.id, req.body.amount, req.role, req.user);
    res.status(200).json({ data: user, message: "user gained xp!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.removeStudent = async (req, res) => {
  if (!req.user)
    return res.status(403).json({ error: "User must be signed in" });
  try {
    let user;
    if (req.role !== "teacher")
      return res.status(403).json({ error: "Only teacher can edit user" });
    else
      teacherData = await userService.removeStudent(req.params.id, req.role, req.user);
    res
      .status(200)
      .json({ data: teacherData, message: "user removed from students!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addStudent = async (req, res) => {
  if (!req.user)
    return res.status(403).json({ error: "User must be signed in" });
  try {
    let user;
    if (req.role !== "teacher")
      return res.status(403).json({ error: "Only teacher can edit user" });
    else
      teacherData = await userService.addStudent(req.params.id, req.role, req.user);
    res
      .status(200)
      .json({ data: teacherData, message: "user added to students!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.undo = async (req, res) => {
  if (!req.user)
    return res.status(403).json({ error: "User must be signed in" });
  try {
    let user;
    if (req.role !== "teacher")
      return res
        .status(403)
        .json({ error: "Only teacher can edit user" });
    else
      user = await userService.undo(
        req.params.id,
        req.body.key,
        req.role,
        req.user
      );
    res.status(200).json({ data: user, message: "undo completed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
