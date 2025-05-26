import express from "express";
import { getUserProfile, updateUser } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/profile", protect, getUserProfile);
router.get("/update-profile", protect, updateUser);

export default router;
