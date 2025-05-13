const mongoose = require('mongoose');

const billingSchema = new mongoose.Schema({
    rideId: { type: mongoose.Schema.Types.ObjectId, ref: 'ride', required: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'captain', required: true },
    farePredicted: Number,
    fareFinal: Number,
    distance: Number, // miles
    surgeMultiplier: Number,
    paymentMode: { type: String, enum: ['cash', 'card'], default: 'cash' },
    pickupTime: Date,
    dropoffTime: Date
}, { timestamps: true });

module.exports = mongoose.model('billing', billingSchema);
