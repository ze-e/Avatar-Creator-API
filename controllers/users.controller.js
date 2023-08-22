const userService = require("../services/users.service");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers(req.isAdmin);
    res.status(200).json({ data: users, message: "got users" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await userService.getCurrentUser(req.user);
    res.status(200).json({ user, message: "got current user" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id, req.isAdmin);
    res.status(200).json({ user, message: "got user" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const token = await userService.loginUser({
      userName: req.body.userName,
      password: req.body.password,
    });
    if(token) return res.status(200).json({ token: token, message: "logged in successfully" });
    else return res.status(500).json({ error: "could not log in" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body.userName, req.body.email, req.body.password);
    res.status(200).json({data: user.data, message:  `successfully created user ${user.admin.userName}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateUser = async (req, res) => {
  if(!req.user) return res.status(403).json({ error: "User must be signed in" });
  try {
    let user;
    if (!req.isAdmin && req.user !== req.params.id) return res
      .status(403)
      .json({ error: "Only user and admins can edit user" });
    else user = await userService.updateUser(
      req.params.id,
      req.body.newVals,
      req.isAdmin
    );
    res.status(200).json({ data: user, message: "updated user info" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  if (!req.user) return res.status(403).json({ error: "User must be signed in" });
  else if (req.user !== req.params.id && !req.isAdmin) return res.status(403).json({ error: "Only user and admins can delete user" });
  try {
    const user = await userService.deleteUser(req.params.id, req.isAdmin);
    res.status(200).json({ message: "deleted user" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// user gear and inventory
exports.addToInventory = async (req, res) => {
  if (!req.user)
    return res.status(403).json({ error: "User must be signed in" });
  if (!req.body.item)
    return res.status(400).json({ error: "Invalid item" });
  try {
    user = await userService.addToInventory(req.params.id, req.body.item);
    res.status(200).json({ data: user.data.inventory, message: "updated user inventory" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// equip item
exports.equipItem = async (req, res) => {
  if (!req.user)
    return res.status(403).json({ error: "User must be signed in" });
  if (!req.body.item)
    return res.status(400).json({ error: "Invalid item" });
  try {
    user = await userService.equipItem(req.params.id, req.body.item);
    res.status(200).json({ data: user.data.gear, message: `equipped ${req.body.item.name}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// unequip item
exports.unequipItem = async (req, res) => {
  if (!req.user)
    return res.status(403).json({ error: "User must be signed in" });
  if (!req.body.item)
    return res.status(400).json({ error: "Invalid item" });
  try {
    user = await userService.unequipItem(req.params.id, req.body.item);
    res.status(200).json({ data: user.data.gear, message: `unequipped ${req.body.item.name}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};