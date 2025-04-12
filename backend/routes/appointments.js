const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Notification = require('../models/Notification');

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { doctorId, date, timeSlot, issue } = req.body;
    
    // Check if doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    // Create appointment
    const appointment = await Appointment.create({
      patientId: req.user._id,
      doctorId,
      date,
      timeSlot,
      issue
    });
    
    // Create notification for doctor
    await Notification.create({
      userId: doctor.userId,
      title: 'New Appointment Request',
      message: `You have a new appointment request on ${new Date(date).toLocaleDateString()}`,
      regarding: 'appointment_confirmation',
      appointmentId: appointment._id
    });
    
    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get user appointments
// @route   GET /api/appointments
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let appointments;
    
    // If user is a doctor, get appointments for the doctor
    if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ userId: req.user._id });
      if (!doctor) {
        return res.status(404).json({ message: 'Doctor profile not found' });
      }
      appointments = await Appointment.find({ doctorId: doctor._id })
        .populate('patientId', 'name email')
        .sort({ date: 1 });
    } 
    // If user is a patient, get their appointments
    else {
      appointments = await Appointment.find({ patientId: req.user._id })
        .populate({
          path: 'doctorId',
          populate: {
            path: 'userId',
            select: 'name'
          }
        })
        .sort({ date: 1 });
    }
    
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get appointment by ID
// @route   GET /api/appointments/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patientId', 'name email')
      .populate({
        path: 'doctorId',
        populate: {
          path: 'userId',
          select: 'name'
        }
      });
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    // Check if user is authorized to view this appointment
    if (
      req.user.role !== 'admin' && 
      appointment.patientId._id.toString() !== req.user._id.toString() && 
      appointment.doctorId.userId._id.toString() !== req.user._id.toString()
    ) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update appointment status
// @route   PUT /api/appointments/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    // If user is patient, they can only cancel their own appointment
    if (
      req.user.role === 'patient' && 
      appointment.patientId.toString() === req.user._id.toString() &&
      req.body.status === 'cancelled'
    ) {
      appointment.status = 'cancelled';
      const updatedAppointment = await appointment.save();
      
      // Create notification for doctor
      const doctor = await Doctor.findById(appointment.doctorId);
      await Notification.create({
        userId: doctor.userId,
        title: 'Appointment Cancelled',
        message: `An appointment for ${new Date(appointment.date).toLocaleDateString()} has been cancelled by the patient`,
        regarding: 'appointment_cancellation',
        appointmentId: appointment._id
      });
      
      res.json(updatedAppointment);
    } 
    // If user is doctor, they can update status and add notes
    else if (
      req.user.role === 'doctor' || 
      req.user.role === 'admin'
    ) {
      if (req.body.status) appointment.status = req.body.status;
      if (req.body.notes) appointment.notes = req.body.notes;
      
      const updatedAppointment = await appointment.save();
      
      // Create notification for patient
      await Notification.create({
        userId: appointment.patientId,
        title: `Appointment ${appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}`,
        message: `Your appointment for ${new Date(appointment.date).toLocaleDateString()} has been ${appointment.status}`,
        regarding: `appointment_${appointment.status}`,
        appointmentId: appointment._id
      });
      
      res.json(updatedAppointment);
    } else {
      res.status(401).json({ message: 'Not authorized' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;