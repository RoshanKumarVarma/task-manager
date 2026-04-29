// routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');

// ⭐ All routes are protected — must have valid JWT
router.get('/',     protect, getTasks);
router.post('/',    protect, createTask);
router.put('/:id',  protect, updateTask);
router.delete('/:id', protect, deleteTask);

module.exports = router;