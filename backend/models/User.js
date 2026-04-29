// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'], // ⭐ Custom error message
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,    // ⭐ No two users can have same email
      lowercase: true, // ⭐ Stores email as lowercase always
      trim: true,      // ⭐ Removes accidental spaces
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,    // ⭐ Minimum password length
    },
  },
  {
    timestamps: true, // ⭐ Auto-adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model('User', userSchema);