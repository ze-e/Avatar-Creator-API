const Badge = require("../models/Badge.model");
const fs = require("fs");

exports.createBadge = (data, image, teacherId) => {
  try {
  const { name, description } = data;
    const badgeData = {
      name,
      description,
      image: {
        data: fs.readFileSync(image.path), // Read the image file as binary data
        contentType: image.mimetype, // Set the content type from the uploaded file
      },
      teacherId
    };

    Badge.create(badgeData, (error, badge) => {
      if (error) {
        console.error(error);
        throw new Error(`Error while uploading badge: ${error}`);
      }
      return `Badge uploaded successfully. ${badge}`
    });
  }
  catch (error) {
    throw new Error(`Error while uploading badge: ${error}`);
  }
}

exports.deleteBadge = (id) => {
}
