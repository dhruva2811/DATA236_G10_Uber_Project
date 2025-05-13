require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user.model');
const Captain = require('./models/captain.model');

const connectAndSeed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB for seeding.");

    await User.deleteMany();
    await Captain.deleteMany();

    const users = [
      {
        fullname: { firstname: "John", lastname: "Doe" },
        email: "john@example.com",
        password: "123456",
      }
    ];

    const captains = [
      {
        fullname: { firstname: "Jane", lastname: "Smith" },
        email: "jane@example.com",
        password: "123456",
        vehicle: {
          color: "Red",
          plate: "ABC1234",
          capacity: 4,
          vehicleType: "car"
        }
      }
    ];

    await User.insertMany(users);
    await Captain.insertMany(captains);

    console.log("Sample users and captains inserted.");
    mongoose.disconnect();
  } catch (err) {
    console.error("Seeding failed:", err);
  }
};

connectAndSeed();
