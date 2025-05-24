import User from '../models/User.js';

export const getAllTeachers = async (req, res) => {
  try {
    const teachers = await User.find({ role: 'teacher' }, 'name _id');
    res.json(teachers);
  } catch (error) {
    console.error('getAllTeachers error:', error);
    res.status(500).json({ message: 'Failed to fetch teachers.' });
  }
};
