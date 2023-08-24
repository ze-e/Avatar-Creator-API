const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const verifyRole = require("../middleware/verifyRole");

const {
  getAllStudents,
  gainXP,
  undo,
  removeStudent,
  addStudent
} = require("../controllers/teacher.controller");

const router = express.Router();

router.use(verifyToken, verifyRole);
router.route("/students").get(getAllStudents);
router.route("/student/:id/xp").patch(gainXP);
router.route("/student/:id/undo").patch(undo);
router.route("/student/:id/add").patch(removeStudent);
router.route("/student/:id/remove").patch(addStudent);

module.exports = router;
