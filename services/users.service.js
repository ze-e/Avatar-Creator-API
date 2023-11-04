const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const { sanitizeUser } = require("../utils/user");
const { sendMail } = require("../utils/nodemailer");

// GET all user objects
exports.getAllUsers = async (role) => {
  try {
    const users = await User.find();
    return users.map((u) => sanitizeUser(u, role !== 'user')); // delete admin fields
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
    return sanitizeUser(user, role !== "user");
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
    return sanitizeUser(user, role !== "user");
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
    return sanitizeUser(user, true);
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
    // NOTE: this will not work for duplicate items
    user.data.inventory = user.data.inventory.filter(i => i !== item.id);

    await user.save();
    return sanitizeUser(user, true);
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
    return sanitizeUser(user, true);
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
    return sanitizeUser(user, true);
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

// PATCH method to update user password
exports.forgotPassword = async (email) => {
  try {
    const user = await User.findOne({ "admin.email": email });
    if (!user) {
      throw new Error(`User not found`);
    }

    const secret = process.env.SECRETKEY;
    const payload = { email: user.admin.email };

    //create password link. Valid for 30 minutes
    const token = jwt.sign(payload, secret, { expiresIn: "30m" });

    //send email
    console.log("created reset token for " + user.admin.email + " : " + token);
    await sendMail({
      to: user.admin.email,
      subject: "CodeQuest - Reset Password",
      text: `Copy this token to reset your email: ${token}`,
      html: `<h1>Copy this token to reset your email:</h1><br/><code>${token}</code>`,
    });
    return "Check your email for a password reset token";
  } catch (error) {
    throw new Error(`Error while sending email: ${error}`);
  }
};

exports.resetPassword = async (token, password) => {
  try {
    const secret = process.env.SECRETKEY;
    const decryptedToken = await jwt.verify(token, secret);
    const user = await User.findOne({ "admin.email": decryptedToken.email });
    if (!user) {
      throw new Error(`User not found`);
    }
    if (await bcrypt.compare(password, user.admin.password)) throw new Error(`New password cannot match old password!`);
    else user.admin.password = newpass;
    await user.save();
    return "Password updated successfully!";
  } catch (error) {
    throw new Error(`Error while updating user information: ${error}`);
  }
}

