import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Helper to generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, MobileNumber, role, profilePhoto} = req.body;

    // Check if email, name, or mobile number already exists
    const existingUser = await User.findOne({ $or: [{ email }, { name }, { MobileNumber }] });
    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ message: "Email already exists" });
      }
      if (existingUser.name === name) {
        return res.status(400).json({ message: "Username already exists" });
      }
      if (existingUser.MobileNumber === MobileNumber) {
        return res.status(400).json({ message: "Mobile number already exists" });
      }
    }

    const user = new User({
      name,
      email,
      password,
      MobileNumber,
      role,
      profilePhoto, // save file name
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(user);
    res.json({ user: { id: user._id, name: user.name, email, role: user.role, MobileNumber: user.MobileNumber}, token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
