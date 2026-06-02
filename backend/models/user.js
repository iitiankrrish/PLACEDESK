const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
        message: (props) => `${props.value} is not a valid email address`,
      },
    },

    password: {
      type: String,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['student', 'pic_member'],
      default: 'student',
    },

    enrollmentNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    picKey: {
      type: String,
    },
  },
  { timestamps: true }
);
userSchema.methods.verifyPicKey = function (key) {
  return this.picKey === key;
};

const User = mongoose.model("users", userSchema);
module.exports = User;