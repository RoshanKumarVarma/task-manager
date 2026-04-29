// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// --- Routes ---
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');   // ⭐ NEW

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);                  // ⭐ NEW

// --- Test Route ---
app.get('/', (req, res) => {
  res.json({ message: '🚀 API is running...' });
});

// --- Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});