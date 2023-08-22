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
  addToInventory,
  equipItem,
  unequipItem
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

router
    .route("/user/:id/inventory")
    .patch(addToInventory);

router.route("/user/:id/gear/equip").patch(equipItem);
router.route("/user/:id/gear/unequip").patch(unequipItem);

module.exports = router;
