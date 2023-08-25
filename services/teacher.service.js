const User = require("../models/User.model");
const { sanitizeUser, saveLastState } = require("../utils/user");
const { gainLevel } = require("../utils/levels");
const { seedLevelTable } = require("../data/levels.sample.data");
const { connections } = require("mongoose");

// GET all students objects
exports.getAllStudents = async (userId, role) => {
  if (role !== 'teacher') throw new Error(`Only teachers have students`);

  try {
    let users;
    const currentUser = await User.findById(userId);
    const teacherDataStudents = currentUser.teacherData.students;

    users = await User.find({ _id: { $in: teacherDataStudents } });

    users.forEach((u) => sanitizeUser(u)); // delete admin fields
    return users;
  } catch (error) {
    throw new Error(`Error while retrieving users: ${error}`);
  }
};

// increase xp and gold by amount
exports.gainXP = async (userId, amount, role, teacherId) => {
  try {
    if (role !== 'teacher') throw new Error(`Only teachers have access to this route`);

    let teacher = await User.findOne({ _id: teacherId });

    if (!teacher) {
      throw new Error(`Teacher not found`);
    }

    if (!teacher.teacherData.students.includes(userId))
    throw new Error(`Student must be of teacher`);

    let user = await User.findOne({ _id: userId });
    if (!user) {
      throw new Error(`User not found`);
    }

    // save old values in undo
    const prevData = [
      { key: "xp", value: user.data.xp },
      { key: "level", value: user.data.level },
      { key: "gold", value: user.data.gold },
    ]; // also add previous level
    user = saveLastState(user, prevData);

    // create new values
    user.data.gold = parseInt(user.data.gold) + parseInt(amount);
    user.data.xp = parseInt(user.data.xp) + parseInt(amount);
    user.data.level = gainLevel(
      seedLevelTable(),
      user.data.xp,
      user.data.level
    );

    user.save();
    return user;
  } catch (error) {
    throw new Error(`Error while gaining xp: ${error}`);
  }
};

// remove student
exports.removeStudent = async (userId, role, teacherId) => {
  try {
    if (role !== "teacher")
      throw new Error(`Only teachers have access to this route`);

    const teacher = await User.findOne({ _id: teacherId });

    if (!teacher) {
      throw new Error(`Teacher not found`);
    }

    if (!teacher.teacherData.students.includes(userId))
      throw new Error(`Student must be of teacher`);

    const user = await User.findOne({ _id: userId });
    if (!user) {
      throw new Error(`User not found`);
    }

    if (user.admin.userType !== 'user') {
      throw new Error(`User must be student`);
    }

    teacher.teacherData.students = user.teacherData.students.filter(
      (s) => s !== user._id
    );
    user.studentData.teacher = null;

    user.save();
    teacher.save();
    return teacher.teacherData;
  } catch (error) {
    throw new Error(`Error while removing student: ${error}`);
  }
};

// add student
exports.addStudent = async (userId, role, teacherId) => {
  try {
    if (role !== 'teacher') throw new Error(`Only teachers have access to this route`);

    const teacher = await User.findOne({ _id: teacherId });

    if (!teacher) {
      throw new Error(`Teacher not found`);
    }

    if (teacher.teacherData.students.includes(userId))
    throw new Error(`Student is already assigned to teacher`);

    const user = await User.findOne({ _id: userId });
    if (!user) {
      throw new Error(`User not found`);
    }

    if (user.admin.userType !== "user") {
      throw new Error(`User must be student`);
    }

    teacher.teacherData.students = teacher.teacherData.students.concat(userId);
    user.studentData.teacher = teacher._id;

    teacher.save();
    user.save();
    return teacher.teacherData;
  } catch (error) {
    throw new Error(`Error while adding student: ${error}`);
  }
};

exports.undo = async (userId, key, role, teacherId) => {
  try {
    if (!role) throw new Error(`Only teachers have access to this route`);

    let teacher = await User.findOne({ _id: teacherId });

    if (!teacher) {
      throw new Error(`Teacher not found`);
    }

    if (!teacher.teacherData.students.includes(userId)) throw new Error(`Student must be of teacher`);
    const user = await User.findOne({ _id: userId });
    try {
      // reset values
      if (Array.isArray(key)) {
        key.forEach((k) => {
          const prevData = user.admin.prevData;
          user.data[k] = prevData.find((d) => d.key === k).value;
        });
        // erase from prevData
        user.admin.prevData = user.admin.prevData.filter(
          (i) => !key.includes(i.key)
        );
      } else {
        const prevData = user.admin.prevData;
        user.data[key] = prevData.find((d) => d.key === key).value;
        // erase from prevData
        user.admin.prevData = user.admin.prevData.filter((i) => i.key !== key);
      }
      user.admin.lastUpdated = null;
      user.save();
    } catch (e) {
      throw new Error(`Error updating keys: ${e}`);
    }
    return user;
  } catch (error) {
    throw new Error(`Error while gaining xp: ${error}`);
  }
};
