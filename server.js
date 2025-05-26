// server.js - Main Express application file
import express from 'express';
import bodyParser from 'body-parser';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import mongoose from 'mongoose';

import authRoutes from './routes/authRoutes.js'
import adminRoutes from './routes/adminRoutes.js'

// Import models
import User from './models/User.js';
import Assistant from './models/Assistant.js';
import Customer from './models/Customer.js';

// Initialize Express app
const app = express();


// Configure middleware
app.use(cors({
  origin: 'https://personalassistance.netlify.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true // only if you're using cookies or auth headers
}));
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/careAssistance', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// JWT secret
 // In production, use environment variable


app.use('/user',authRoutes)
app.use('/admin',adminRoutes)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



/*
echo "# PA_Backend_" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/VIjayPawar09/PA_Backend_.git
git push -u origin main

*/
