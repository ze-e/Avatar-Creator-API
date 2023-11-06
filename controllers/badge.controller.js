const badgeService = require("../services/badge.service");
const Grid = require("gridfs-stream");
const { gfs } = require("../middleware/media");

exports.createBadge = async (req, res) => {

    if (!req.file) {
      return res.status(400).send("Please upload an image.");
    }

      const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!allowedMimeTypes.includes(req.file.mimetype)) {
        return res
          .status(400)
          .send("Only PNG, JPG, or GIF images are allowed.");
      }
  try {
    const message = await badgeService.createBadge(
      req.body.data,
      req.file, // Assuming you're using a file upload middleware like 'multer'
      req.user._id
    );
    res.status(200).json({
      message,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBadge = async (req, res) => {

  try {
  try {
    const file = await gfs.files.findOne({ filename });
    const readStream = gfs.createReadStream(file.filename);
    return readStream.pipe(res);
  } catch (e) {
    return `Could not get badge: ${e}`;
  }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteBadge = async (req, res) => {

}
