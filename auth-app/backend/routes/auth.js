const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwtUtil = require('../utils/jwt');
const otpStore = require('../utils/otpStore');
const { verifyGoogleToken } = require('../controllers/authController');

// OTP Login
router.post('/login/otp', async (req, res) => {
  const { phone, otp, name, email } = req.body;
  if (!otp) {
    // Generate OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.setOTP(phone, generatedOtp);
    // Send OTP via SMS provider here
    return res.send({ message: 'OTP sent' });
  }
  if (otpStore.getOTP(phone) !== otp) return res.status(400).send('Invalid OTP');
  let user = await User.findOne({ phone });
  if (!user) user = await User.create({ phone, name, email, isPhoneVerified: true });
  const token = jwtUtil.generateToken(user);
  res.cookie('token', token, { httpOnly: true, secure: true });
  res.send({ user });
});

// Google Login
router.post('/login/google', async (req, res) => {
  const { token, phone } = req.body;
  const payload = await verifyGoogleToken(token);
  let user = await User.findOne({ email: payload.email });
  if (!user) user = await User.create({ email: payload.email, name: payload.name, googleId: payload.sub, isGoogleVerified: true });
  if (phone && !user.phone) user.phone = phone; // Link phone if provided
  await user.save();
  const jwtToken = jwtUtil.generateToken(user);
  res.cookie('token', jwtToken, { httpOnly: true, secure: true });
  res.send({ user });
});

// Refresh JWT
router.post('/refresh-token', async (req, res) => {
  const token = req.cookies.token;
  try {
    const payload = jwtUtil.verifyToken(token);
    const user = await User.findById(payload.id);
    const newToken = jwtUtil.generateToken(user);
    res.cookie('token', newToken, { httpOnly: true, secure: true });
    res.send({ user });
  } catch {
    res.status(401).send('Invalid token');
  }
});

// Protect /admin
router.get('/admin', require('../middleware/auth')(['admin']), (req, res) => {
  res.send('Welcome, admin!');
});

module.exports = router;
