const captainModel = require('../models/captain.model');
const captainService = require('../services/captain.service');
const blackListTokenModel = require('../models/blackListToken.model');
const { validationResult } = require('express-validator');


module.exports.registerCaptain = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Validation failed:", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }
  
    const {
      driverId,
      fullname,
      email,
      password,
      phone,
      address,
      city,
      state,
      zipCode,
      vehicle
    } = req.body;
  
    const isCaptainAlreadyExist = await captainModel.findOne({ email });
  
    if (isCaptainAlreadyExist) {
      return res.status(400).json({ message: 'Captain already exists' });
    }
  
    const hashedPassword = await captainModel.hashPassword(password);
  
    const captain = await captainService.createCaptain({
      driverId,
      firstname: fullname.firstname,
      lastname: fullname.lastname,
      email,
      password: hashedPassword,
      phone,
      address,
      city,
      state,
      zipCode,
      color: vehicle.color,
      plate: vehicle.plate,
      capacity: vehicle.capacity,
      vehicleType: vehicle.vehicleType
    });
  
    const token = captain.generateAuthToken();
  
    res.status(201).json({ token, captain });
  };
  

module.exports.loginCaptain = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const captain = await captainModel.findOne({ email }).select('+password');

    if (!captain) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await captain.comparePassword(password);

    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = captain.generateAuthToken();

    res.cookie('token', token);

    res.status(200).json({ token, captain });
}

module.exports.getCaptainProfile = async (req, res, next) => {
  try {
    // ✅ Send captain data as { captain: ... }
    res.status(200).json({ captain: req.captain });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load captain profile' });
  }
};



module.exports.logoutCaptain = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[ 1 ];

    await blackListTokenModel.create({ token });

    res.clearCookie('token');

    res.status(200).json({ message: 'Logout successfully' });
}

// ❌ Delete captain
module.exports.deleteCaptain = async (req, res) => {
    try {
        const { id } = req.params;
        await captainModel.findByIdAndDelete(id);
        res.status(200).json({ message: "Captain deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ❌ List all captains
module.exports.listCaptains = async (req, res) => {
    try {
        const captains = await captainModel.find();
        res.status(200).json(captains);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ❌ Update captain info (ALL attributes)
module.exports.updateCaptain = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const updatedCaptain = await captainModel.findByIdAndUpdate(id, updateData, { new: true });
        res.status(200).json(updatedCaptain);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ❌ Search for captains by attributes
module.exports.searchCaptains = async (req, res) => {
    try {
        const query = {};

        if (req.query.firstname) {
            query['fullname.firstname'] = { $regex: req.query.firstname, $options: 'i' };
        }
        if (req.query.lastname) {
            query['fullname.lastname'] = { $regex: req.query.lastname, $options: 'i' };
        }
        if (req.query.city) {
            query.city = { $regex: req.query.city, $options: 'i' };
        }
        if (req.query.vehicleType) {
            query['vehicle.vehicleType'] = req.query.vehicleType;
        }

        const captains = await captainModel.find(query);
        res.status(200).json(captains);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ❌ Upload or update introduction video link
module.exports.uploadIntroVideo = async (req, res) => {
    try {
        const { id } = req.params;
        const { videoUrl } = req.body;

        if (!videoUrl) return res.status(400).json({ message: 'Video URL required' });

        const captain = await captainModel.findById(id);
        if (!captain) return res.status(404).json({ message: 'Captain not found' });

        captain.media.push(videoUrl);
        await captain.save();

        res.status(200).json({ message: 'Intro video added', media: captain.media });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports.getCaptainById = async (req, res) => {
  try {
    const captain = await captainModel.findById(req.params.id);
    if (!captain) return res.status(404).json({ message: "Captain not found" });
    res.status(200).json(captain);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.listCaptains = async (req, res) => {
  try {
    const captains = await captainModel.find(); // Optionally add `.select()` or `.limit()`
    res.status(200).json(captains);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.addReview = async (req, res) => {
  try {
    const { comment, rating } = req.body;
    const captain = await captainModel.findById(req.params.id);
    if (!captain) return res.status(404).json({ message: 'Captain not found' });

    captain.reviews.push({
      user: req.user._id,
      comment,
      rating: Number(rating)
    });

    // Optional: recalculate average rating
    const avg = captain.reviews.reduce((sum, r) => sum + r.rating, 0) / captain.reviews.length;
    captain.rating = avg;

    await captain.save();
    res.status(200).json({ message: 'Review added', rating: avg });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
