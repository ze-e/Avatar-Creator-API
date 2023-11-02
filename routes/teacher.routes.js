const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const addRole = require("../middleware/addRole");
const teacherRoute = require("../middleware/teacherRoute");

const {
  getAllStudents,
  gainXP,
  undo,
  removeStudent,
  addStudent,
  addBadge,
  removeBadge,
  forgotStudentPassword,
} = require("../controllers/teacher.controller");

const router = express.Router();

router.use(verifyToken, addRole, teacherRoute);
router.route("/").get(getAllStudents);
router.route("/:id/xp").patch(gainXP);
router.route("/:id/undo").patch(undo);
router.route("/:id/add").patch(addStudent);
router.route("/:id/remove").patch(removeStudent);

router.route("/:id/addBadge").patch(addBadge);
router.route("/:id/removeBadge").patch(removeBadge);

// reset student password
router.route("/:id/forgotPassword").post(forgotStudentPassword);

module.exports = router;
