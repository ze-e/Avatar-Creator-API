const User = require("../models/User.model");

// PATCH method to update user role
exports.updateRole = async (userId, newRole, role) => {
  if (role !== "admin") throw new Error(`Only admin has access to this route`);
  try {
    const user = await User.findOne({ _id: userId });
    if (!user) {
      throw new Error(`User not found`);
    }

    user.admin.userType = newRole

    await user.save();
    return user;
  } catch (error) {
    throw new Error(`Error while updating user information: ${error}`);
  }
};