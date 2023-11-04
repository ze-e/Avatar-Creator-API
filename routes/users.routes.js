const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const addRole = require("../middleware/addRole");

const {
  getAllUsers,
  getUserById,
  createUser,
  loginUser,
  getCurrentUser,
  updateUser,
  deleteUser,
  addToInventory,
  removeFromInventory,
  equipItem,
  unequipItem,
  forgotPassword,
  resetPassword
} = require("../controllers/users.controller");

const router = express.Router();

router.use(verifyToken, addRole);
router.route("/users").get(getAllUsers);
router.route("/login").post(loginUser);
router.route("/register").post(createUser);
router.route("/user").get(getCurrentUser);
router
  .route("/user/:id")
  .get(getUserById)
  .delete(deleteUser)
  .patch(updateUser)
  .patch()

// gear and inventory
router
  .route("/user/:id/inventory")
  .patch(addToInventory)
  .delete(removeFromInventory);
router.route("/user/:id/gear/equip").patch(equipItem);
router.route("/user/:id/gear/unequip").patch(unequipItem);

// reset password
router.route("/user/forgotPassword").post(forgotPassword);
router.route("/user/resetPassword/:token").post(resetPassword);

module.exports = router;AnimationEvent
