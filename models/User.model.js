const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  admin: {
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
      validate: {
        validator: function (email) {
          return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email);
        },
        message: "not a valid email",
      },
    },
    userType: {
      type: String,
      required: true,
      enum: ["user", "admin"],
      default: "user",
    },
    lastUpdated: {
      type: Date,
      default: null,
      validate: {
        validator: function (value) {
          return value === null || value instanceof Date;
        },
        message: "lastUpdated must be a valid datetime or null",
      },
    },
    prevData: [
      {
        key: {
          type: String,
        },
        value: {
          type: Schema.Types.Mixed,
        },
      },
    ],
  },
  data: {
    name: {
      type: String,
      required: true,
    },
    level: {
      type: Number,
      required: true,
      min: 1,
      max: 100,
      default: 1,
    },
    xp: {
      type: Number,
      required: true,
      default: 30,
    },
    gold: {
      type: Number,
      required: true,
      default: 30,
    },
    type: {
      type: String,
      required: true,
      enum: ["human", "elf", "robot"],
      default: "human",
    },
    birthday: {
      type: Date,
      default: Date.now(),
    },
    epiphet: {
      type: String,
      default: "the newcomer",
    },
    job: {
      type: String,
      default: "apprentice",
    },
    hometown: {
      type: String,
      default: "???",
    },
    color: {
      type: String,
      default: "???",
    },
    food: {
      type: String,
      default: "???",
    },
    description: {
      type: String,
      default: "A brand new adventurer begins his journey...",
    },
    avatar: {
      type: Number,
      required: true,
      min: 1,
      max: 3,
      default: 1,
    },
    gear: {
      head: {
        type: String,
        default: ""
      },
      RHand:
      {
        type: String,
        default: ""
      },
      legs: {
        type: String,
        default: ""
      },
      body: {
        type: String,
        default: ""
      },
      LHand:
      {
        type: String,
        default: ""
      },
      feet: {
        type: String,
        default: ""
      },

    },
    inventory: [String],
  },
});

// Custom validation for userName and email uniqueness
userSchema.pre('save', async function(next) {
  const existingUserByEmail = await mongoose.model('User').findOne({
    'admin.email': this.admin.email,
    _id: { $ne: this._id }, // Exclude current user's id during update
  });

  const existingUserByUserName = await mongoose.model('User').findOne({
    'admin.userName': this.admin.userName,
    _id: { $ne: this._id }, // Exclude current user's id during update
  });

  if (existingUserByEmail) {
    const err = new Error('email already exists');
    return next(err);
  }

  if (existingUserByUserName) {
    const err = new Error('userName already exists');
    return next(err);
  }

  next();
});

module.exports = mongoose.model("User", userSchema);