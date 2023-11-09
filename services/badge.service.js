const Badge = require("../models/Badge.model");

exports.createBadge = async ({data, teacherId}) => {

  try {
    // Check the file type
    const allowedFileTypes = ["image/png", "image/jpeg", "image/gif"];

    // Determine the file type based on its content
    if (!allowedFileTypes.includes(data.file.fileType)) {
      throw new Error("File must be of type: " + allowedFileTypes.join(", "));
    }


    // If file is of correct type, save file
    const badgeData = {
      name: data.name,
      description: data.description,
      image: {
        image: data.file.fileData,
        contentType: data.file.fileType,
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

exports.getBadges = async ({ teacherId }) => {
  try {
    const badges = await Badge.find({teacherId});
    return badges;
  } catch (error) {
    throw new Error(`Error while getting badges: ${error}`);
  }
};

exports.getBadgeById = async (badgeId) => {
  try {
    const badge = await Badge.find({badgeId});
    return badge;
  } catch (error) {
    throw new Error(`Error while getting badge: ${error}`);
  }
};

exports.getBadgesByIds = async (badgeIds) => {
  try {
    const badges = await Badge.find({ _id: { $in: badgeIds } });
    return badges;
  } catch (error) {
    throw new Error(`Error while getting badge: ${error}`);
  }
};

exports.deleteBadge = async (badgeId, teacherId) => {
  try {
    const badge = await Badge.findById(badgeId);
    if (badge.teacherId !== teacherId)
      throw new Error("Can only delete your own badges");
    else await badge.remove();
  } catch (error) {
    throw new Error(`Error while deleting badge`);
  }
};