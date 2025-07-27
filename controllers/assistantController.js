import User from '../models/User.js';

export const getAllAssistants = async (req, res) => {
  try {
    const assistants = await User.find({ role: 'assistant' }).select('-password');
    res.status(200).json(assistants);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch assistants" });
  }
};
