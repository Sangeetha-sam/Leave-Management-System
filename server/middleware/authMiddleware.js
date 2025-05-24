// // middleware/authMiddleware.js
// import jwt from 'jsonwebtoken';
// import User from '../models/User.js';

// export const protect = async (req, res, next) => {
//   const token = req.headers.authorization?.split(' ')[1]; // Bearer token

//   if (!token) {
//     return res.status(401).json({ message: 'No token, authorization denied' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET || 'yourDefaultSecret');
//     req.user = await User.findById(decoded.id).select('-password');
//     next();
//   } catch (err) {
//     console.error('Auth Middleware Error:', err);
//     res.status(401).json({ message: 'Invalid token' });
//   }
// };
// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id).select('-password');
      if (!user) return res.status(401).json({ message: 'User not found' });

      req.user = user; // ←✅ includes department and role
      next();
    } catch (error) {
      console.error('JWT auth error:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// authMiddleware.js

export const requireRole = (role) => (req, res, next) => {
  if (!req.user || req.user.role?.toLowerCase() !== role.toLowerCase()) {
    return res.status(403).json({ message: 'Forbidden: Insufficient role' });
  }
  next();
};


