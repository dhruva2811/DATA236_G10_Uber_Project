const rideMediaModel = require('../models/RideMedia.model');

exports.uploadMedia = async (req, res) => {
  const { rideId, imageUrl } = req.body;

  if (!rideId || !imageUrl) {
    return res.status(400).json({ message: 'Missing rideId or imageUrl' });
  }

  const media = await rideMediaModel.create({ rideId, imageUrl });
  res.status(201).json(media);
};

exports.getMediaByRide = async (req, res) => {
  const { rideId } = req.params;
  const media = await rideMediaModel.find({ rideId });
  res.status(200).json(media);
};
