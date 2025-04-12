const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const User = require('../models/User');

// @desc    Get all appointments
// @route   GET /api/admin/appointments
// @access  Private/Admin
router.get('/appointments', protect, admin, async (req, res) => {
  try {
    const appointments = await Appointment.find({})
      .populate('patientId', 'name email')
      .populate({
        path: 'doctorId',
        populate: {
          path: 'userId',
          select: 'name'
        }
      })
      .sort({ date: -1 });
    
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get appointment statistics
// @route   GET /api/admin/statistics
// @access  Private/Admin
router.get('/statistics', protect, admin, async (req, res) => {
  try {
    const totalAppointments = await Appointment.countDocuments();
    const pendingAppointments = await Appointment.countDocuments({ status: 'pending' });
    const confirmedAppointments = await Appointment.countDocuments({ status: 'confirmed' });
    const cancelledAppointments = await Appointment.countDocuments({ status: 'cancelled' });
    const completedAppointments = await Appointment.countDocuments({ status: 'completed' });
    
    const totalDoctors = await Doctor.countDocuments();
    const totalPatients = await User.countDocuments({ role: 'patient' });
    
    res.json({
      appointments: {
        total: totalAppointments,
        pending: pendingAppointments,
        confirmed: confirmedAppointments,
        cancelled: cancelledAppointments,
        completed: completedAppointments
      },
      doctors: totalDoctors,
      patients: totalPatients
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all doctors
// @route   GET /api/admin/doctors
// @access  Private/Admin
router.get('/doctors', protect, admin, async (req, res) => {
  try {
    const doctors = await Doctor.find({}).populate('userId', 'name email');
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all patients
// @route   GET /api/admin/patients
// @access  Private/Admin
router.get('/patients', protect, admin, async (req, res) => {
  try {
    const patients = await User.find({ role: 'patient' }).select('-password');
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
