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
