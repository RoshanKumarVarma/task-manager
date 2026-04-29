// models/Task.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId, // ⭐ Links task to a User
      ref: 'User',                          // ⭐ References the User model
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',   // ⭐ Optional field, defaults to empty string
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed'], // ⭐ Only these 3 values allowed
      default: 'pending',
    },
    dueDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // ⭐ Auto-adds createdAt and updatedAt
  }
);

module.exports = mongoose.model('Task', taskSchema);