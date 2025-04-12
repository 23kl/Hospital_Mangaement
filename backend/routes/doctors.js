const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Doctor = require('../models/Doctor');
const User = require('../models/User');

// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Public
router.get('/', async (req, res) => {
  try {
    const doctors = await Doctor.find({}).populate({
      path: 'userId',
      select: 'name email'
    });
    
    const formattedDoctors = doctors.map(doctor => ({
      _id: doctor._id,
      name: doctor.userId.name,
      email: doctor.userId.email,
      specialization: doctor.specialization,
      experience: doctor.experience,
      fee: doctor.fee,
      availableSlots: doctor.availableSlots,
      description: doctor.description
    }));
    
    res.json(formattedDoctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get doctor by ID
// @route   GET /api/doctors/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate({
      path: 'userId',
      select: 'name email'
    });
    
    if (doctor) {
      res.json({
        _id: doctor._id,
        name: doctor.userId.name,
        email: doctor.userId.email,
        specialization: doctor.specialization,
        experience: doctor.experience,
        fee: doctor.fee,
        availableSlots: doctor.availableSlots,
        description: doctor.description
      });
    } else {
      res.status(404).json({ message: 'Doctor not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update doctor availability
// @route   PUT /api/doctors/:id/availability
// @access  Private/Doctor
router.put('/:id/availability', protect, async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    // Check if the logged-in user is the doctor or an admin
    const user = await User.findById(req.user._id);
    if (user.role !== 'admin' && doctor.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    doctor.availableSlots = req.body.availableSlots;
    const updatedDoctor = await doctor.save();
    
    res.json({
      _id: updatedDoctor._id,
      availableSlots: updatedDoctor.availableSlots
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
