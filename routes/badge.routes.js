const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const addRole = require("../middleware/addRole");
const teacherRoute = require("../middleware/teacherRoute");

const { createBadge } = require("../controllers/badge.controller");

const router = express.Router();

router.use(verifyToken, addRole, teacherRoute);

// router.route("/").get(getBadges);
// router.route("/:id").patch(editBadge).delete(deleteBadge);
router.post("/create", createBadge)

module.exports = router;