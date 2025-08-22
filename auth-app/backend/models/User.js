const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  googleId: String,
  phone: String,
  isPhoneVerified: { type: Boolean, default: false },
  isGoogleVerified: { type: Boolean, default: false },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('User', UserSchema);
