const badgeService = require("../services/badge.service");

exports.createBadge = async (req, res) => {

    if (!req.files.image) {
      return res.status(400).send("Please upload an image.");
    }

      const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!allowedMimeTypes.includes(req.files.image.mimetype)) {
        return res
          .status(400)
          .send("Only PNG, JPG, or GIF images are allowed.");
      }
  try {
    const message = await badgeService.createBadge(
      req.body.data,
      req.files.image, // Assuming you're using a file upload middleware like 'multer'
      req.user._id
    );
    res.status(200).json({
      message,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
