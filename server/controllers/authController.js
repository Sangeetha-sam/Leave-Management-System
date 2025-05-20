import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Helper: generate JWT token
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET || 'yourDefaultSecret', { expiresIn: '7d' });

// Register new user
export const register = async (req, res) => {
  console.log('Incoming Register Request:', req.body);

  const { name, email, password, role, department } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields required' });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log('Registration failed: User already exists');
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log('Hashed password:', hashedPassword);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'teacher',
      department,
    });
    console.log('User created:', user);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      token: generateToken(user._id),
    });
  } catch (err) {
    console.error('Register Error:', err);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// Login user
export const login = async (req, res) => {
  console.log('Login request body:', req.body);

  const { email, password } = req.body;
  if (!email || !password) {
    console.log('Login failed: Missing fields');
    return res.status(400).json({ message: 'All fields required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`Login failed: No user found with email ${email}`);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log('Stored hashed password:', user.password);
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match result:', isMatch);

    if (!isMatch) {
      console.log('Login failed: Passwords do not match');
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Successful login
    const token = generateToken(user._id);
    console.log('Login successful, issuing token:', token);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      token,
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Get current user profile
export const getProfile = async (req, res) => {
  if (!req.user) {
    console.log('getProfile failed: Unauthorized access');
    return res.status(401).json({ message: 'Unauthorized' });
  }

  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    department: req.user.department,
  });
};
