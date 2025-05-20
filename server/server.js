import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import leaveRoutes from './routes/leaveRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import connectDB from './config/db.js';

dotenv.config();
const app = express();

// Middlewares
app.use(cors());
//app.use(express.json({ limit: '10mb' }));
app.use(express.json());

// Connect DB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/notifications', notificationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
