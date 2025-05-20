import mongoose from 'mongoose';

const teacherSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },  // e.g., "t2"
  name: { type: String, required: true },
  department: { type: String },
  email: { type: String },
  // other fields as needed
});

const Teacher = mongoose.model('Teacher', teacherSchema);

export default Teacher;
