const userService = require("../services/teacher.service");

exports.getAllStudents = async (req, res) => {
  try {
    const users = await userService.getAllStudents(req.user);
    res.status(200).json({ data: users, message: "got students" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.gainXP = async (req, res) => {
  if (!req.user)
    return res.status(403).json({ error: "User must be signed in" });
  try {
    const user = await userService.gainXP(req.params.id, req.body.amount, req.user);
    res.status(200).json({ data: user, message: "user gained xp!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.removeStudent = async (req, res) => {
  if (!req.user)
    return res.status(403).json({ error: "User must be signed in" });
  try {
      teacherData = await userService.removeStudent(req.params.id, req.user);
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
      teacherData = await userService.addStudent(req.params.id, req.user);
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
    const user = await userService.undo(
      req.params.id,
      req.body.key,
      req.user
    );
    res.status(200).json({ data: user, message: "undo completed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addBadge = async (req, res) => {
  if (!req.user)
    return res.status(403).json({ error: "User must be signed in" });
  try {
    const user = await userService.addBadge(
      req.params.id,
      req.body.badgeId,
      req.user
    );
    res
      .status(200)
      .json({ data: user, message: `user gained badge: ${req.body.badgeId}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.removeBadge = async (req, res) => {
  if (!req.user)
    return res.status(403).json({ error: "User must be signed in" });
  try {
    const user = await userService.removeBadge(
      req.params.id,
      req.body.badgeId,
      req.user
    );
    res
      .status(200)
      .json({ data: user, message: `removed badge: ${req.body.badgeId}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};