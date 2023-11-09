const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const addRole = require("../middleware/addRole");
const teacherRoute = require("../middleware/teacherRoute");

const { createBadge, getBadges, getBadgeById, getBadgesByIds, deleteBadge } = require("../controllers/badge.controller");

const router = express.Router();

// no token needed
router.route("/:id").get(getBadgeById);

// token needed
router.use(verifyToken, addRole);
router.route("/badges").get(getBadgesByIds);

// teacher role needed

router.use(teacherRoute);
router.route("/").get(getBadges);
router.route("/:id").delete(deleteBadge);
router.post("/create", createBadge)

module.exports = router;