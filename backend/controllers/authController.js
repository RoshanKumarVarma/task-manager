// controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ⭐ Helper: Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },                    // ⭐ Payload — what we store inside token
    process.env.JWT_SECRET,            // ⭐ Secret key to sign it
    { expiresIn: '7d' }               // ⭐ Token expires in 7 days
  );
};

// ─────────────────────────────────────
// @route   POST /api/auth/register
// @access  Public
// ─────────────────────────────────────
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body; // ⭐ Extract from request body

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 2. Hash the password
    const salt = await bcrypt.genSalt(10); // ⭐ Salt = random data added before hashing
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create user in DB
    const user = await User.create({
      name,
      email,
      password: hashedPassword, // ⭐ NEVER store plain text password
    });

    // 4. Return token
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id), // ⭐ Send token so user is logged in immediately
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────
// @route   POST /api/auth/login
// @access  Public
// ─────────────────────────────────────
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // 2. Compare password with hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // 3. Return token
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'User already exists' });
    }
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser };