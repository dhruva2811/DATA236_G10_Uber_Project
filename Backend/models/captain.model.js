const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const captainSchema = new mongoose.Schema({
  driverId: {
    type: String,
    required: true,
    unique: true,
    match: /^\d{3}-\d{2}-\d{4}$/, // SSN format
  },
  fullname: {
    firstname: {
      type: String,
      required: true,
      minlength: [3, 'Firstname must be at least 3 characters long'],
    },
    lastname: {
      type: String,
      required: true,
      minlength: [3, 'Lastname must be at least 3 characters long'],
    }
  },
  address: { type: String },
  city: { type: String },
  state: { type: String },
  zipCode: { type: String },
  phone: {
    type: String,
    match: /^[0-9]{10}$/, // 10-digit phone
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  vehicle: {
    color: {
      type: String,
      required: true
    },
    plate: {
      type: String,
      required: true
    },
    capacity: {
      type: Number,
      required: true
    },
    vehicleType: {
      type: String,
      enum: ['UberX', 'UberXX', 'UberXXL'],
      required: true
    }
  },
  location: {
    ltd: Number,
    lng: Number
  },
  rating: {
    type: Number,
    default: 0
  },
  reviews: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
      comment: String,
      rating: Number
    }
  ],
  media: [
    {
      type: String // Image/video URLs
    }
  ],
  rides: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ride'
    }
  ],
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'inactive'
  },
  socketId: {
    type: String
  }
});

captainSchema.methods.generateAuthToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

captainSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

captainSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

const captainModel = mongoose.model('captain', captainSchema);
module.exports = captainModel;
