const billingModel = require('../models/billing.model');
const rideModel = require('../models/ride.model');

// ✅ Get all billing records (admin view)
module.exports.getAllBillings = async (req, res) => {
    try {
        const billings = await billingModel.find().populate('rideId customerId driverId');
        res.status(200).json(billings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ✅ Get billing by ride ID
module.exports.getBillingByRide = async (req, res) => {
    try {
        const billing = await billingModel.findOne({ rideId: req.params.rideId })
            .populate('rideId customerId driverId');
        if (!billing) return res.status(404).json({ message: 'Billing not found' });
        res.status(200).json(billing);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ✅ Get billing records for a specific user
module.exports.getBillingByUser = async (req, res) => {
    try {
        const billings = await billingModel.find({ customerId: req.params.userId })
            .populate('rideId driverId');
        res.status(200).json(billings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports.getBillingByDriver = async (req, res) => {
  try {
    const billings = await billingModel.find({ driverId: req.params.driverId });
    res.status(200).json(billings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.createBilling = async (req, res) => {
  try {
    const { rideId } = req.body;

    const ride = await rideModel.findById(rideId).populate('user captain');
    if (!ride) return res.status(404).json({ message: 'Ride not found' });

    const billing = await billingModel.create({
      rideId,
      customerId: ride.user._id,
      driverId: ride.captain._id,
      farePredicted: ride.fare,
      fareFinal: ride.fare,
      distance: ride.distance || 5, // set defaults if missing
      surgeMultiplier: 1,
      paymentMode: 'cash',
      pickupTime: new Date(),
      dropoffTime: new Date()
    });

    res.status(201).json(billing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.updateBilling = async (req, res) => {
  try {
    const billing = await billingModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!billing) return res.status(404).json({ message: 'Billing not found' });
    res.status(200).json(billing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
module.exports.deleteBilling = async (req, res) => {
  try {
    const deleted = await billingModel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Bill not found' });
    res.status(200).json({ message: 'Bill deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
module.exports.searchBilling = async (req, res) => {
  try {
    const query = {};

    if (req.query.customerId) {
  query.customerId = req.query.customerId;
}

    if (req.query.driverId) {
  query.driverId = req.query.driverId;
}

    if (req.query.minFare) {
      query.fareFinal = { $gte: Number(req.query.minFare) };
    }
    if (req.query.date) {
      const start = new Date(req.query.date);
      const end = new Date(req.query.date);
      end.setHours(23, 59, 59);
      query.createdAt = { $gte: start, $lte: end };
    }

    const results = await billingModel.find(query).populate('rideId customerId driverId');
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
