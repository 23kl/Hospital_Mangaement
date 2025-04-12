// server/controllers/authController.js
const User = require("../models/User");
const Doctor = require('../models/Doctor');
const jwt = require('jsonwebtoken');

// Helper function to generate token
const generateToken = (id) => {
  return jwt.sign({ id }, "bharatmahan", {
    expiresIn: '30d'
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone,
      role
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Register a doctor (creates both user and doctor profile)
// @route   POST /api/auth/register-doctor
// @access  Public
exports.registerDoctor = async (req, res) => {
  try {
    const { name, email, password, phone, specialization, experience, fee, description } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user with doctor role
    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: 'doctor'
    });

    // Create doctor profile
    const doctor = await Doctor.create({
      userId: user._id,
      specialization,
      experience,
      fee,
      description,
      availableSlots: []
    });

    if (user && doctor) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        doctorId: doctor._id,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid doctor data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    
    if (user && (await user.matchPassword(password))) {
      let responseData = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      };

      // If user is a doctor, get doctor details
      if (user.role === 'doctor') {
        const doctor = await Doctor.findOne({ userId: user._id });
        if (doctor) {
          responseData.doctorId = doctor._id;
        }
      }

      res.json(responseData);
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
