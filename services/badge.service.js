// const Badge = require("../models/Badge.model");
import Badge from ("../models/Badge.model");
// const fileType = require('file-type');
// const { fileTypeFromFile } = require("file-type");
import { fileTypeFromFile } from "file-type";

exports.createBadge = async ({data, teacherId}) => {

  try {
    // Check the file type
    const allowedFileTypes = ['jpg', 'jpeg', 'png', 'gif'];
    const fileBuffer = Buffer.from(data.file, 'base64');

    // Determine the file type based on its content
    const detectedType = await fileTypeFromFile(fileBuffer);
    if (detectedType && !allowedFileTypes.includes(detectedType.ext)) {
      throw new Error("File must be of type: " + allowedFileTypes.join(", "));
    }

    // If file is of correct type, save file
    const badgeData = {
      name: data.name,
      description: data.description,
      image: {
        image: data.file,
        contentType: detectedType.ext,
      },
      teacherId,
    };

    const badge = await Badge.create(badgeData);
    return badge;
  }
  catch (error) {
    throw new Error(`Error while uploading badge: ${error}`);
  }
}
