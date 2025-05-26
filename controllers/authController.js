import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { check, validationResult } from 'express-validator';
import Assistant from "../models/Assistant.js";
import Customer from "../models/Customer.js";
export const registerUser =async (req, res) => {
  const errors = validationResult(req);
  const JWT_SECRET = 'your-secret-key';
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const {
      userType,
      username,
      email,
      password,
      phoneNumber,
      // Assistant fields
      experience,
      specializations,
      availability,
      certifications,
      // Customer fields
      age,
      emergencyContact,
      medicalConditions,
      assistanceNeeded,
      preferredSchedule
    } = req.body;

    // Check if user already exists
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      console.log("=================");
      
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    user = new User({
      username,
      email,
      password: hashedPassword,
      phoneNumber,
      userType,
      createdAt: new Date()
    });

    // Save user
    await user.save();

    // Create user type specific record
    if (userType === 'assistant') {
      const assistant = new Assistant({
        userId: user._id,
        experience,
        specializations,
        availability,
        certifications: certifications || '',
        isVerified: false, // Requires admin verification
        rating: 0,
        reviewCount: 0
      });
      await assistant.save();
    } else {
      const customer = new Customer({
        userId: user._id,
        age,
        emergencyContact,
        medicalConditions: medicalConditions || '',
        assistanceNeeded,
        preferredSchedule: preferredSchedule || '',
        healthNotes: ''
      });
      await customer.save();
    }

    // Create and return JWT token
    const payload = {
      user: {
        id: user._id,
        userType
      }
    };

    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error('Registration error:', err.message);
    res.status(500).send('Server error');
  }
}

export const loginUser = async (req, res) => {
 
  const JWT_SECRET = 'your-secret-key';
  try {
    const { email, password } = req.body;
     
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      console.log("=============");
      
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if assistant is verified (if applicable)
    if (user.userType === 'assistant') {
      const assistant = await Assistant.findOne({ userId: user._id });
      if (assistant && !assistant.isVerified) {
        return res.status(403).json({ 
          message: 'Your account is pending verification. We will notify you once your account is approved.'
        });
      }
    }

    // Create and return JWT token
    const payload = {
      user: {
        id: user._id,
        userType: user.userType
      }
    };

    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, userType: user.userType,user:user });
      }
    );
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).send('Server error');
  }
};

// Auth middleware
const auth = (req, res, next) => {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};
