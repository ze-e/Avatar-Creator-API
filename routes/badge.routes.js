const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const addRole = require("../middleware/addRole");
const teacherRoute = require("../middleware/teacherRoute");
const upload = require("../middleware/upload");

const { createBadge, getBadge } = require("../controllers/badge.controller");

const router = express.Router();

router.use(verifyToken, addRole, teacherRoute);

// router.route("/").get(getBadges);
router.route("/:id").get(getBadge)
.patch(editBadge).delete(deleteBadge);
// router.route("/:id").delete(deleteBadge);
router.post("/create", upload.single("file"), createBadge)

module.exports = router;