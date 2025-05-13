const sendMessage = require('../kafka/producer');
const redisClient = require('../redis/client');
const rideService = require('../services/ride.service');
const { validationResult } = require('express-validator');
const mapService = require('../services/maps.service');
const { sendMessageToSocketId } = require('../socket');
const rideModel = require('../models/ride.model');
const captainModel = require('../models/captain.model');

module.exports.createRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // ✅ Protect against missing user
  if (!req.user || !req.user._id) {
    return res.status(401).json({ message: 'Unauthorized user' });
  }

  const { pickup, destination, vehicleType, passenger_count } = req.body;

  try {
    const ride = await rideService.createRide({
      user: req.user._id,
      pickup,
      destination,
      vehicleType,
      passenger_count
    });

    // 🔁 Kafka integration
    sendMessage('ride-requested', {
      userId: req.user._id,
      pickup,
      destination,
      vehicleType,
      rideId: ride._id.toString()
    });

    // 💾 Redis caching
    await redisClient.set(`ride:${ride._id}`, JSON.stringify(ride));

    // 📍 Get coordinates for filtering captains
    const pickupCoordinates = await mapService.getAddressCoordinate(pickup); // { ltd, lng }

    // ✅ 10-mile radius filter using MongoDB geospatial query
    const captainsInRadius = await captainModel.find({
      socketId: { $ne: null },
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [pickupCoordinates.lng, pickupCoordinates.ltd]
          },
          $maxDistance: 16093 // 10 miles in meters
        }
      }
    });

    console.log("📍 Captains found within 10 miles:", captainsInRadius.length);

    // Clear OTP from response before sending to captain
    ride.otp = "";

    const rideWithUser = await rideModel.findOne({ _id: ride._id }).populate('user');

    // 🔁 Send ride request to nearby captains via socket
    captainsInRadius.forEach(captain => {
      sendMessageToSocketId(captain.socketId, {
        event: 'new-ride',
        data: rideWithUser
      });
    });

    // ✅ Send matched captains back to frontend
    res.status(201).json({
      ride,
      captains: captainsInRadius.map(c => ({
        name: `${c.fullname.firstname} ${c.fullname.lastname}`,
        location: c.location.coordinates
      }))
    });

  } catch (err) {
    console.log("❌ Error creating ride:", err.message);
    return res.status(500).json({ message: 'Error creating ride', error: err.message });
  }
};

module.exports.getRide = async (req, res) => {
    const { rideId } = req.params;

    try {
        const cached = await redisClient.get(`ride:${rideId}`);
        if (cached) {
            return res.status(200).json(JSON.parse(cached));
        }

        const ride = await rideModel.findById(rideId).populate('user captain');
        if (!ride) {
            return res.status(404).json({ message: "Ride not found" });
        }

        await redisClient.set(`ride:${rideId}`, JSON.stringify(ride));
        return res.status(200).json(ride);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

module.exports.getFare = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { pickup, destination } = req.query;

    try {
        const fare = await rideService.getFare(pickup, destination);
        return res.status(200).json(fare);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

module.exports.confirmRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;

    try {
        const ride = await rideService.confirmRide({ rideId, captain: req.captain });

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-confirmed',
            data: ride
        });

        return res.status(200).json(ride);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.message });
    }
};

module.exports.startRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId, otp } = req.query;

    try {
        const ride = await rideService.startRide({ rideId, otp, captain: req.captain });

        console.log("✅ Ride started:", ride._id);

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-started',
            data: ride
        });

        return res.status(200).json(ride);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

module.exports.endRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;

    try {
        const ride = await rideService.endRide({ rideId, captain: req.captain });

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-ended',
            data: ride
        });

        return res.status(200).json(ride);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

module.exports.getRidesByCaptain = async (req, res) => {
  try {
    const rides = await rideModel.find({ captain: req.params.captainId }).populate('user');
    res.status(200).json(rides);
  } catch (err) {
    console.error('Error fetching rides by captain:', err);
    res.status(500).json({ message: 'Failed to fetch rides' });
  }
};

// getRidesByUser
module.exports.getRidesByUser = async (req, res) => {
  try {
    const rides = await rideModel.find({ user: req.params.userId }).populate('captain');
    res.status(200).json(rides);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.getRideStatsByArea = async (req, res) => {
  try {
    const stats = await rideModel.aggregate([
      {
        $group: {
          _id: "$pickup", // group by pickup address
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);
    res.status(200).json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.getTotalRides = async (req, res) => {
  try {
    const total = await rideModel.countDocuments();
    res.status(200).json({ total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
