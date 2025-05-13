const adminModel = require('../models/admin.model');
const billingModel = require('../models/billing.model');

module.exports.registerAdmin = async (req, res) => {
  const { adminId, firstname, lastname, email, phone, address, city, state, zipCode, password } = req.body;

  try {
    const existing = await adminModel.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Admin already exists' });

    const admin = await adminModel.create({
      adminId, firstname, lastname, email, phone, address, city, state, zipCode, password
    });

    const token = admin.generateAuthToken();
    res.status(201).json({ token, admin });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await adminModel.findOne({ email }).select('+password');
    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = admin.generateAuthToken();
    res.status(200).json({ token, admin });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.getAnalyticsOverview = async (req, res) => {
  try {
    const revenueAgg = await billingModel.aggregate([
      { $group: { _id: null, total: { $sum: "$fareFinal" } } }
    ]);
    const totalRevenue = revenueAgg[0]?.total || 0;

    const totalRides = await billingModel.countDocuments();

    const revenuePerDay = await billingModel.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$fareFinal" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const ridesPerDay = await billingModel.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      totalRides,
      totalRevenue,
      revenuePerDay,
      ridesPerDay
    });
  } catch (err) {
    console.error("Analytics fetch error:", err);
    res.status(500).json({ error: err.message });
  }
};
module.exports.getTodayRevenue = async (req, res) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const result = await billingModel.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      { $group: { _id: null, total: { $sum: "$fareFinal" } } }
    ]);

    res.json({ totalRevenue: result[0]?.total || 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
