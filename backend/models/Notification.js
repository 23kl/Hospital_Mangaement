const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  regarding: {
    type: String,
    regarding: {
      type: String,
      enum: [
        'appointment_confirmation',
        'appointment_confirmed',
        'appointment_cancelled',
        'appointment_cancellation',
        'appointment_pending',
        'appointment_completed',
        'appointment_reminder',
        'general'
      ]
    }
    
  },
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Notification', NotificationSchema);