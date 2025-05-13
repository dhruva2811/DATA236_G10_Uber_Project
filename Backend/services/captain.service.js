//updated
const captainModel = require('../models/captain.model');

module.exports.createCaptain = async ({
  driverId,
  firstname,
  lastname,
  email,
  password,
  phone,
  address,
  city,
  state,
  zipCode,
  color,
  plate,
  capacity,
  vehicleType
}) => {
  if (
    !driverId || !firstname || !lastname || !email || !password || !phone ||
    !address || !city || !state || !zipCode ||
    !color || !plate || !capacity || !vehicleType
  ) {
    throw new Error('All fields are required');
  }

  const captain = await captainModel.create({
    driverId,
    fullname: {
      firstname,
      lastname
    },
    email,
    password,
    phone,
    address,
    city,
    state,
    zipCode,
    vehicle: {
      color,
      plate,
      capacity,
      vehicleType
    }
  });

  return captain;
};
