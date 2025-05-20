// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Bearer token

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'yourDefaultSecret');
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (err) {
    console.error('Auth Middleware Error:', err);
    res.status(401).json({ message: 'Invalid token' });
  }
};
