const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');

const storage = new GridFsStorage({
  url: process.env.MONGODB_URI,
  options: { useNewURLParser: true, useUnifiedTypology: true },
  file: (req, file) => {
    // const match = ["image/png", "image/jpeg", "image/jpg", "image/gif"];

    // if (match.indexOf(file.mimeType) === -1) {
    //   const filename = `${Date.now()}-${file.originalname}`
    //   return filename;
    // }
    return {
      bucketName: "badge_images",
      filename: `${Date.now()}-${file.originalname}`,
    };
    }
  });

  module.exports = multer({storage})