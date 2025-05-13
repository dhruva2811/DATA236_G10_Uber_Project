// ✅ Call support.controller.js
const supportModel = require('../models/support.model');

// POST /support
module.exports.createTicket = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user._id;

    if (!message) return res.status(400).json({ message: 'Message is required' });

    const ticket = await supportModel.create({ userId, message });
    res.status(201).json(ticket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /support/user/:userId
module.exports.getTicketsByUser = async (req, res) => {
  try {
    const tickets = await supportModel.find({ userId: req.params.userId });
    res.status(200).json(tickets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// (Optional) GET /support → admin view
module.exports.getAllTickets = async (req, res) => {
  try {
    const tickets = await supportModel.find().populate('userId', 'fullname email');
    res.status(200).json(tickets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.updateTicketStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const ticket = await supportModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('userId'); // 🔁 optional if you want user details returned

    res.status(200).json(ticket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

