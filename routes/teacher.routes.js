const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const verifyRole = require("../middleware/verifyRole");

const {
  getAllStudents,
  gainXP,
  undo,
  removeStudent,
  addStudent,
  addBadge,
  removeBadge
} = require("../controllers/teacher.controller");

const router = express.Router();

router.use(verifyToken, verifyRole);
router.route("/").get(getAllStudents);
router.route("/:id/xp").patch(gainXP);
router.route("/:id/undo").patch(undo);
router.route("/:id/add").patch(addStudent);
router.route("/:id/remove").patch(removeStudent);

router.route("/:id/addBadge").patch(addBadge);
router.route("/:id/removeBadge").patch(removeBadge);

module.exports = router;
