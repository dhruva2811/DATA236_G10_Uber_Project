const mongoose = require('mongoose');

const rideMediaSchema = new mongoose.Schema({
  rideId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ride',
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('rideMedia', rideMediaSchema);
