const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const verifyRole = require("../middleware/verifyRole");

const { updateRole } = require("../controllers/admin.controller");

const router = express.Router();

router.use(verifyToken, verifyRole);
router.route("/user/:id").patch(updateRole);

module.exports = router;
