// controllers/taskController.js
const Task = require('../models/Task');

// ─────────────────────────────────────
// @route   GET /api/tasks
// @access  Private
// ─────────────────────────────────────
const getTasks = async (req, res) => {
  try {
    // ⭐ Only get tasks belonging to logged-in user
    const tasks = await Task.find({ user: req.user._id })
                            .sort({ createdAt: -1 }); // newest first
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────
// @route   POST /api/tasks
// @access  Private
// ─────────────────────────────────────
const createTask = async (req, res) => {
  try {
    const { title, description, status, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    // ⭐ Attach logged-in user's ID to the task
    const task = await Task.create({
      user: req.user._id,
      title,
      description,
      status,
      dueDate,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────
// @route   PUT /api/tasks/:id
// @access  Private
// ─────────────────────────────────────
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // ⭐ Make sure user owns this task
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // ⭐ Returns updated document instead of old one
    );

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────
// @route   DELETE /api/tasks/:id
// @access  Private
// ─────────────────────────────────────
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // ⭐ Make sure user owns this task
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await task.deleteOne();
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };