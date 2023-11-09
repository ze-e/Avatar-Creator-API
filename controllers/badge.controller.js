const badgeService = require("../services/badge.service");

exports.createBadge = async (req, res) => {
  if (!req.body.file) {
    return res.status(400).send("Please upload an image.");
  }

  try {
    const badge = await badgeService.createBadge({
      data: req.body,
      teacherId: req.user,
    });
    res
      .status(200)
      .json({
        data: badge,
        message: `successfully created badge ${badge.name}`,
      });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBadges = async (req, res) => {
  try {
    const badge = await badgeService.getBadges({
      teacherId: req.user
    });
    res.status(200).json({
      data: badge,
      message: `got badges for teacher`,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBadgeById = async (req, res) => {
  try {
    const badge = await badgeService.getBadgesByIds(req.params.id);
    res.status(200).json({
      data: badge,
      message: `got badges`,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBadgesByIds = async (req, res) => {
  try {
    const badge = await badgeService.getBadgesByIds(req.body.badgeIds);
    res.status(200).json({
      data: badge,
      message: `got badges`,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteBadge = async (req, res) => {
  if (!req.user)return res.status(403).json({ error: "User must be signed in" });
  try {
    const user = await badgeService.deleteBadge(req.params.id, req.user);
    res.status(200).json({ message: "deleted badge" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};