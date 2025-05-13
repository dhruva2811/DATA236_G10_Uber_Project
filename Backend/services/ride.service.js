const rideModel = require('../models/ride.model');
const mapService = require('./maps.service');
const crypto = require('crypto');
const axios = require('axios');
const billingModel = require('../models/billing.model');

// Dynamic fare using ML model + surge + fallback
async function getDynamicFare(distanceInMiles, passenger_count, hour) {
  try {
    const response = await axios.post('http://localhost:5001/predict', {
      distance: distanceInMiles,
      passenger_count,
      hour
    });

    let fare = response.data.fare;

    if (hour >= 18 && hour <= 22) {
      fare *= 1.5; // Evening peak
    } else if (hour >= 0 && hour <= 5) {
      fare *= 1.3; // Late night
    }

    return parseFloat(fare.toFixed(2));
  } catch (err) {
    console.error("❌ ML API Error:", err.message);

    const baseFare = 2;
    const perMile = 1.5;
    let fallbackFare = baseFare + (distanceInMiles * perMile);

    if (hour >= 18 && hour <= 22) {
      fallbackFare *= 1.5;
    } else if (hour >= 0 && hour <= 5) {
      fallbackFare *= 1.3;
    }

    return parseFloat(fallbackFare.toFixed(2));
  }
}

// Generate OTP
function getOtp(num) {
  return crypto.randomInt(Math.pow(10, num - 1), Math.pow(10, num)).toString();
}

// Create a new ride
module.exports.createRide = async ({ user, pickup, destination, vehicleType, passenger_count }) => {
  console.log("📥 createRide called with:", { user, pickup, destination, vehicleType, passenger_count });

  if (!user || !pickup || !destination || !vehicleType || !passenger_count) {
    console.log("❌ Missing field:", { user, pickup, destination, vehicleType, passenger_count });
    throw new Error('All fields are required');
  }

  const allowedCapacities = {
    UberX: 4,
    UberXX: 6,
    UberXXL: 8
  };

  if (!allowedCapacities[vehicleType]) {
    throw new Error('Invalid vehicle type');
  }

  if (passenger_count > allowedCapacities[vehicleType]) {
    throw new Error(`Too many passengers. Max allowed for ${vehicleType} is ${allowedCapacities[vehicleType]}`);
  }

  const distanceTime = await mapService.getDistanceTime(pickup, destination);
  const distanceInMiles = distanceTime.distance.value / 1609.34;
  const hour = new Date().getHours();

  const fare = await getDynamicFare(distanceInMiles, passenger_count, hour);
  const otp = getOtp(6);

  const newRide = await rideModel.create({
    user,
    pickup,
    destination,
    otp,
    fare,
    vehicleType,
    status: 'pending'
  });

  return await rideModel.findById(newRide._id).select('+otp');
};

// Confirm ride
module.exports.confirmRide = async ({ rideId, captain }) => {
  if (!rideId) throw new Error('Ride id is required');

  await rideModel.findOneAndUpdate(
    { _id: rideId },
    { status: 'accepted', captain: captain._id }
  );

  const ride = await rideModel.findOne({ _id: rideId })
    .populate('user')
    .populate('captain')
    .select('+otp');

  if (!ride) throw new Error('Ride not found');

  console.log("Ride confirmed:", ride._id, "by captain:", captain._id);
  return ride;
};

// Start ride after verifying OTP
module.exports.startRide = async ({ rideId, otp, captain }) => {
  if (!rideId || !otp) throw new Error('Ride id and OTP are required');

  const ride = await rideModel.findOne({ _id: rideId })
    .populate('user')
    .populate('captain')
    .select('+otp');

  if (!ride) throw new Error('Ride not found');
  if (ride.status !== 'accepted') throw new Error('Ride not accepted');
  if (ride.otp !== otp) throw new Error('Invalid OTP');

  await rideModel.findOneAndUpdate({ _id: rideId }, { status: 'ongoing' });

  console.log("Ride started:", ride._id, "with OTP:", otp);
  return ride;
};

module.exports.endRide = async ({ rideId, captain }) => {
  if (!rideId) throw new Error('Ride id is required');

  console.log(" End ride attempt:", rideId, "by captain:", captain._id);

  const ride = await rideModel.findOne({ _id: rideId })
    .populate('user')
    .populate('captain')
    .select('+otp');

  if (!ride) {
    console.log("❌ Ride not found");
    throw new Error('Ride not found');
  }

  if (!ride.captain || ride.captain._id.toString() !== captain._id.toString()) {
    console.log("❌ Captain not authorized to end this ride");
    throw new Error('Unauthorized: This ride does not belong to you');
  }

  if (ride.status !== 'ongoing') {
    console.log("❌ Cannot end ride. Status is:", ride.status);
    throw new Error('Ride not ongoing');
  }

  await rideModel.findOneAndUpdate({ _id: rideId }, { status: 'completed' });

  await billingModel.create({
    rideId: ride._id,
    customerId: ride.user._id,
    driverId: ride.captain._id,
    farePredicted: ride.fare,
    fareFinal: ride.fare,
    distance: ride.distance || 0,
    surgeMultiplier: ride.surgeMultiplier || 1.0,
    paymentMode: 'cash',
    pickupTime: ride.createdAt || new Date(),
// ✅ fallback
    dropoffTime: new Date()
  });

  console.log("✅ Ride completed and billing created:", rideId);
  return ride;
};

// const rideModel = require('../models/ride.model');
// const mapService = require('./maps.service');
// const crypto = require('crypto');
// const axios = require('axios');
// const billingModel = require('../models/billing.model');

// // ✅ Dynamic fare using ML model + surge + fallback
// async function getDynamicFare(distanceInMiles, passenger_count, hour) {
//     try {
//         const response = await axios.post('http://localhost:5001/predict', {
//             distance: distanceInMiles,
//             passenger_count,
//             hour
//         });

//         let fare = response.data.fare;

//         // 🔥 Surge pricing logic
//         if (hour >= 18 && hour <= 22) {
//             fare *= 1.5; // Evening peak
//         } else if (hour >= 0 && hour <= 5) {
//             fare *= 1.3; // Late night
//         }

//         return parseFloat(fare.toFixed(2));

//     } catch (err) {
//         console.error("❌ ML API Error:", err.message);

//         // ⛑️ Static fallback fare
//         const baseFare = 2;
//         const perMile = 1.5;
//         let fallbackFare = baseFare + (distanceInMiles * perMile);

//         // Apply surge to fallback too
//         if (hour >= 18 && hour <= 22) {
//             fallbackFare *= 1.5;
//         } else if (hour >= 0 && hour <= 5) {
//             fallbackFare *= 1.3;
//         }

//         return parseFloat(fallbackFare.toFixed(2));
//     }
// }

// // ✅ Generate OTP
// function getOtp(num) {
//     return crypto.randomInt(Math.pow(10, num - 1), Math.pow(10, num)).toString();
// }

// // ✅ Create a new ride
// module.exports.createRide = async ({ user, pickup, destination, vehicleType, passenger_count }) => {
//     if (!user || !pickup || !destination || !vehicleType || !passenger_count) {
//         throw new Error('All fields are required');
//     }

//     // ✅ Validate passenger count per vehicle type
//     const allowedCapacities = {
//         UberX: 4,
//         UberXX: 6,
//         UberXXL: 8
//     };

//     if (!allowedCapacities[vehicleType]) {
//         throw new Error('Invalid vehicle type');
//     }

//     if (passenger_count > allowedCapacities[vehicleType]) {
//         throw new Error(`Too many passengers. Max allowed for ${vehicleType} is ${allowedCapacities[vehicleType]}`);
//     }

//     const distanceTime = await mapService.getDistanceTime(pickup, destination);
//     const distanceInMiles = distanceTime.distance.value / 1609.34;
//     const hour = new Date().getHours();

//     const fare = await getDynamicFare(distanceInMiles, passenger_count, hour);
//     const otp = getOtp(6);

//     const newRide = await rideModel.create({
//         user,
//         pickup,
//         destination,
//         otp,
//         fare,
//         vehicleType,
//         status: 'pending'
//     });

//     return await rideModel.findById(newRide._id).select('+otp');
// };

// // ✅ Confirm ride
// module.exports.confirmRide = async ({ rideId, captain }) => {
//     if (!rideId) throw new Error('Ride id is required');

//     await rideModel.findOneAndUpdate(
//         { _id: rideId },
//         { status: 'accepted', captain: captain._id }
//     );

//     const ride = await rideModel.findOne({ _id: rideId })
//         .populate('user')
//         .populate('captain')
//         .select('+otp');

//     if (!ride) throw new Error('Ride not found');

//     return ride;
// };

// // ✅ Start ride after verifying OTP
// module.exports.startRide = async ({ rideId, otp, captain }) => {
//     if (!rideId || !otp) throw new Error('Ride id and OTP are required');

//     const ride = await rideModel.findOne({ _id: rideId })
//         .populate('user')
//         .populate('captain')
//         .select('+otp');

//     if (!ride) throw new Error('Ride not found');
//     if (ride.status !== 'accepted') throw new Error('Ride not accepted');
//     if (ride.otp !== otp) throw new Error('Invalid OTP');

//     await rideModel.findOneAndUpdate({ _id: rideId }, { status: 'ongoing' });

//     return ride;
// };


// // ✅ Dynamic fare using ML model + surge + fallback
// async function getDynamicFare(distanceInMiles, passenger_count, hour) {
//     try {
//         const response = await axios.post('http://localhost:5001/predict', {
//             distance: distanceInMiles,
//             passenger_count,
//             hour
//         });

//         let fare = response.data.fare;

//         // 🔥 Surge pricing logic
//         if (hour >= 18 && hour <= 22) {
//             fare *= 1.5; // Evening peak
//         } else if (hour >= 0 && hour <= 5) {
//             fare *= 1.3; // Late night
//         }

//         return parseFloat(fare.toFixed(2));

//     } catch (err) {
//         console.error("❌ ML API Error:", err.message);

//         // ⛑️ Static fallback fare
//         const baseFare = 2;
//         const perMile = 1.5;
//         let fallbackFare = baseFare + (distanceInMiles * perMile);

//         // Apply surge to fallback too
//         if (hour >= 18 && hour <= 22) {
//             fallbackFare *= 1.5;
//         } else if (hour >= 0 && hour <= 5) {
//             fallbackFare *= 1.3;
//         }

//         return parseFloat(fallbackFare.toFixed(2));
//     }
// }

// // ✅ Generate OTP
// function getOtp(num) {
//     return crypto.randomInt(Math.pow(10, num - 1), Math.pow(10, num)).toString();
// }

// // ✅ Create a new ride
// module.exports.createRide = async ({ user, pickup, destination, vehicleType, passenger_count }) => {
//     if (!user || !pickup || !destination || !vehicleType || !passenger_count) {
//         throw new Error('All fields are required');
//     }

//     // ✅ Validate passenger count per vehicle type
//     const allowedCapacities = {
//         UberX: 4,
//         UberXX: 6,
//         UberXXL: 8
//     };

//     if (!allowedCapacities[vehicleType]) {
//         throw new Error('Invalid vehicle type');
//     }

//     if (passenger_count > allowedCapacities[vehicleType]) {
//         throw new Error(`Too many passengers. Max allowed for ${vehicleType} is ${allowedCapacities[vehicleType]}`);
//     }

//     const distanceTime = await mapService.getDistanceTime(pickup, destination);
//     const distanceInMiles = distanceTime.distance.value / 1609.34;
//     const hour = new Date().getHours();

//     const fare = await getDynamicFare(distanceInMiles, passenger_count, hour);
//     const otp = getOtp(6);

//     const newRide = await rideModel.create({
//         user,
//         pickup,
//         destination,
//         otp,
//         fare,
//         vehicleType,
//         status: 'pending'
//     });

//     return await rideModel.findById(newRide._id).select('+otp');
// };

// // ✅ Confirm ride
// module.exports.confirmRide = async ({ rideId, captain }) => {
//     if (!rideId) throw new Error('Ride id is required');

//     await rideModel.findOneAndUpdate(
//         { _id: rideId },
//         { status: 'accepted', captain: captain._id }
//     );

//     const ride = await rideModel.findOne({ _id: rideId })
//         .populate('user')
//         .populate('captain')
//         .select('+otp');

//     if (!ride) throw new Error('Ride not found');

//     return ride;
// };

// // ✅ Start ride after verifying OTP
// module.exports.startRide = async ({ rideId, otp, captain }) => {
//     if (!rideId || !otp) throw new Error('Ride id and OTP are required');

//     const ride = await rideModel.findOne({ _id: rideId })
//         .populate('user')
//         .populate('captain')
//         .select('+otp');

//     if (!ride) throw new Error('Ride not found');
//     if (ride.status !== 'accepted') throw new Error('Ride not accepted');
//     if (ride.otp !== otp) throw new Error('Invalid OTP');

//     await rideModel.findOneAndUpdate({ _id: rideId }, { status: 'ongoing' });

//     return ride;
// };

// // ✅ End ride
// module.exports.endRide = async ({ rideId, captain }) => {
//     if (!rideId) throw new Error('Ride id is required');

//     const ride = await rideModel.findOne({ _id: rideId, captain: captain._id })
//         .populate('user')
//         .populate('captain')
//         .select('+otp');

//     if (!ride) throw new Error('Ride not found');
//     if (ride.status !== 'ongoing') throw new Error('Ride not ongoing');

//     await rideModel.findOneAndUpdate({ _id: rideId }, { status: 'completed' });

    
//     await billingModel.create({
//         rideId: ride._id,
//         customerId: ride.user._id,
//         driverId: ride.captain._id,
//         farePredicted: ride.fare,
//         fareFinal: ride.fare, // or apply any adjustment
//         distance: ride.distance || 0, // save from ride if available
//         surgeMultiplier: ride.surgeMultiplier || 1.0, // optional
//         paymentMode: 'cash',
//         pickupTime: ride.createdAt,
//         dropoffTime: new Date()
//     });    

//     return ride;
// };
