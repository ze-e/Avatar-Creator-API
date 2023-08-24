const User = require("../models/User.model")

// Update existing records to add "studentData" for users with userType "user"
async function updateExistingUsers() {
  try {
    const query = {
      "admin.userType": "user",
      "admin.teacherData": { $exists: false },
    };
    const update = { $set: { "admin.teacherData": { teacher: null } } };

    const result = await User.updateMany(query, update);

    console.log(result);
    if (result.nModified) console.log(`${result.nModified} records updated.`);
  } catch (error) {
    console.error("Error updating users:", error);
  }
}

module.exports = updateExistingUsers