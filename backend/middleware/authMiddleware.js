// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    let token;

    // ⭐ Check if Authorization header exists and starts with "Bearer"
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      // ⭐ Extract token — "Bearer eyJhbG..." → "eyJhbG..."
      token = req.headers.authorization.split(' ')[1];
    }

    // If no token found, reject
    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    // ⭐ Verify token using our secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // decoded = { id: "665abc...", iat: ..., exp: ... }

    // ⭐ Find the user from DB and attach to request
    // .select('-password') means "give me everything EXCEPT password"
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    next(); // ⭐ Move to the actual route handler

  } catch (error) {
    // ⭐ jwt.verify throws error if token is expired or tampered
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

module.exports = { protect };