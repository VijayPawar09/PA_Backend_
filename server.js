// server.js
import dotenv from "dotenv";
dotenv.config();

import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import mongoose from 'mongoose';
import path from "path";
import http from "http";
import { Server } from "socket.io";

import authRoutes from './routes/authRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import assistantRoutes from './routes/assistant.js';
import User from './models/User.js';
import Assistant from './models/Assistant.js';
import Customer from './models/Customer.js';
import Message from './models/Message.js'; // ADD this to persist messages

// Initialize Express app and HTTP server
const app = express();
const server = http.createServer(app);

// ✅ FIXED: Correct Socket.io usage
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // frontend port
    methods: ["GET", "POST"]
  }
});

<<<<<<< HEAD
// ✅ Socket.io logic
let onlineUsers = {};

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("join", (userId) => {
    onlineUsers[userId] = socket.id;
    console.log("User joined:", userId);
  });

  socket.on("sendMessage", async ({ senderId, receiverId, content }) => {
    const message = new Message({ senderId, receiverId, content });
    await message.save();

    const receiverSocket = onlineUsers[receiverId];
    if (receiverSocket) {
      io.to(receiverSocket).emit("receiveMessage", {
        senderId,
        content,
        timestamp: new Date()
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    for (let userId in onlineUsers) {
      if (onlineUsers[userId] === socket.id) {
        delete onlineUsers[userId];
        break;
      }
    }
  });
});

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// ✅ Routes
app.use('/user', authRoutes);
app.use('/admin', adminRoutes);
app.use('/api/assistants', assistantRoutes);
=======
// Configure middleware
app.use(cors({
  origin: 'https://personalassistance.netlify.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true // only if you're using cookies or auth headers
}));
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect("mongodb+srv://vijayp8477:Vijay@1234@cluster0.zwwsk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));
>>>>>>> fecea6a9cf5698936d7cec4165c5e47e3ab9c487

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// ✅ Start server (IMPORTANT: use `server`, not `app`)
const PORT = process.env.PORT || 5000;
<<<<<<< HEAD
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
=======
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
>>>>>>> fecea6a9cf5698936d7cec4165c5e47e3ab9c487
