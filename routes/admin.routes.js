const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const addRole = require("../middleware/addRole");

const { updateRole } = require("../controllers/admin.controller");

const router = express.Router();

router.use(verifyToken, addRole);
router.route("/user/:id").patch(updateRole);

module.exports = router;
