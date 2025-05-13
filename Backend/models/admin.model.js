const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const adminSchema = new mongoose.Schema({
  adminId: {
    type: String,
    required: true,
    unique: true,
    match: /^\d{3}-\d{2}-\d{4}$/ // SSN format
  },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  phone: {
    type: String,
    match: /^[0-9]{10}$/
  },
  address: String,
  city: String,
  state: String,
  zipCode: String,
  password: {
    type: String,
    required: true,
    select: false
  }
});

// 🔐 Password handling
adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

adminSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

adminSchema.methods.generateAuthToken = function () {
  return jwt.sign({ _id: this._id, role: 'admin' }, process.env.JWT_SECRET, {
    expiresIn: '24h'
  });
};

module.exports = mongoose.model('admin', adminSchema);
