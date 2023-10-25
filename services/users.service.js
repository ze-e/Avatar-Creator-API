const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const { sanitizeUser } = require("../utils/user");

// GET all user objects
exports.getAllUsers = async (role) => {
  try {
    const users = await User.find();
    if (role === "user") users.map((u) => sanitizeUser(u)); // delete admin fields
    return users;
  } catch (error) {
    throw new Error(`Error while retrieving users: ${error}`);
  }
}

// GET current user
exports.getCurrentUser = async (userId) => {
  try {
    if (!userId) throw new Error(`Invalid token or userId`);
    const user = await User.findOne({ _id: userId });
    if (!user) throw new Error(`User not found`);
    else return user;
  } catch (error) {
    throw new Error(`Error while retrieving user: ${error}`);
  }
};

// GET one user object by id
exports.getUserById = async (userId, role) => {
  try {
    const user = await User.findOne({ _id: userId });
    return role === "user" ? sanitizeUser(user) : user;
  } catch (error) {
    throw new Error(`Error while retrieving user: ${error}`);
  }
};

// POST method to login a user
exports.loginUser = async ({userName, password}) => {
  try {
    let user = null;

    user = await User.findOne({ "admin.userName": userName })
    if (!user) user = await User.findOne({ "admin.email": userName });
    if (!user) throw new Error("Invalid userName or password");

    if (await bcrypt.compare(password, user.admin.password)) {
        const token = jwt.sign({ userId: user._id }, process.env.SECRETKEY, { expiresIn: "7d" });
        return token;
    } else throw new Error("Invalid userName or password");
  } catch (e) {
    throw new Error(e);
  }
}

// POST method to add a new user
exports.createUser = async (userName, email, password) => {
  try {
    const userData = {
      admin: {
        userName,
        email,
        password: await bcrypt.hash(password, 10),
      },
      data: {
        name: userName,
      },
    };
    const user = await User.create(userData);
    return user;
  } catch (error) {
    throw new Error(`Error while adding user: ${error}`);
  }
}

// PATCH method to update user
exports.updateUser = async (userId, newVals, role) => {
  try {
    const user = await User.findOne({ _id: userId });
    if (!user) {
      throw new Error(`User not found`);
    }
    const data = user.data;

    if (Array.isArray(newVals)) {
      // If newVals is an array of key-value pairs
      for (const entry of newVals) {
        const key = entry.key;
        const newVal = entry.value;
        if (key in data) {
          data[key] = newVal;
        }
      }
    } else if (typeof newVals === "object") {
      // If newVals is a single key-value pair object
      const key = newVals.key;
      const newVal = newVals.value;
      if (key in data) {
        data[key] = newVal;
      }
    }

    user.data = data;

    await user.save();
    return sanitizeUser(user);
  } catch (error) {
    throw new Error(`Error while updating user information: ${error}`);
  }
}

// Add item to inventory of user with userId
exports.addToInventory = async (userId, item) => {
  try {
    const user = await User.findOne({ _id: userId });
    if (!user) {
      throw new Error(`User not found`);
    }
    if (!item.id) throw new Error(`Invalid item`);
    const inventory = user.data.inventory;
    const gold = user.data.gold;
    if (gold - item.cost < 0)
      throw new Error(`Not enough gold for item. Need $${item.cost}`);
    if (user.data.inventory.includes(item.id))
      throw new Error(`Already own item!`);
    user.data.gold = gold - item.cost;
    user.data.inventory = [...inventory, item.id];

    await user.save();
    return sanitizeUser(user);
  } catch (error) {
    throw new Error(`Could not buy item: ${error}`);
  }
};

// Remove item from inventory of user with userId
exports.removeFromInventory = async (userId, item) => {
  try {
    const user = await User.findOne({ _id: userId });
    if (!user) {
      throw new Error(`User not found`);
    }
    if (!item.id) throw new Error(`Invalid item`);
    // TODO: this will not work for duplicate items
    user.data.inventory = user.data.inventory.filter(i => i !== item.id);

    await user.save();
    return sanitizeUser(user);
  } catch (error) {
    throw new Error(`Could not remove item: ${error}`);
  }
};

// Equip gear to user with userId
exports.equipItem = async (userId, item) => {
  try {
    const user = await User.findOne({ _id: userId });
    if (!user) {
      throw new Error(`User not found`);
    }

    if (!item.id || !item.location) throw new Error(`Invalid item`);
    user.data.gear[item.location] = item.id;

    await user.save();
    return sanitizeUser(user);
  } catch (error) {
    throw new Error(`Could not equip item: ${error}`);
  }
};

// Unequip gear to inventory of user with userId
exports.unequipItem = async (userId, item) => {
  try {
    const user = await User.findOne({ _id: userId });
    if (!user) {
      throw new Error(`User not found`);
    }

    if (!item.id || !item.location) throw new Error(`Invalid item`);
    user.data.gear[item.location] = "";

    await user.save();
    return sanitizeUser(user);
  } catch (error) {
    throw new Error(`Could not unequip item: ${error}`);
  }
};

// DELETE method to delete a user by userId
exports.deleteUser  = async (userId) =>{
  try {
    await User.findOneAndDelete({ _id: userId });
  } catch (error) {
    throw new Error(`Error while deleting user`);
  }
}
