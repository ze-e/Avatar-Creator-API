const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const verifyAdmin = require("../middleware/verifyAdmin");

const {
  getAllUsers,
  getUserById,
  createUser,
  loginUser,
  getCurrentUser,
  updateUser,
  deleteUser,
} = require("../controllers/users.controller");

const router = express.Router();

router.use(verifyToken, verifyAdmin);
router.route("/users").get(getAllUsers);
router.route("/login").post(loginUser);
router.route("/register").post(createUser);
router.route("/user").get(getCurrentUser);
router
  .route("/user/:id")
  .get(getUserById)
  .delete(deleteUser)
  .patch(updateUser);

module.exports = router;
