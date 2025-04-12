const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  specialization: {
    type: String,
    required: true
  },
  experience: {
    type: Number,
    required: true
  },
  fee: {
    type: Number,
    required: true
  },
  availableSlots: [
    {
      day: {
        type: String,
        required: true
      },
      slots: [
        {
          startTime: String,
          endTime: String
        }
      ]
    }
  ],
  description: {
    type: String
  }
});

module.exports = mongoose.model('Doctor', DoctorSchema);