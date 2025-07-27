import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // assistant
  message: String,
  read: { type: Boolean, default: false },
  link: String // optional: to direct to booking
}, { timestamps: true });

export default mongoose.model('Notification', notificationSchema);
