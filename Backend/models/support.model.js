const mongoose = require('mongoose');

const supportTicketSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  category: {
    type: String,
    enum: ['Ride Cancelled', 'Fare Dispute', 'Driver Behavior', 'Technical Issue', 'Other'],
    required: true
  },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  status: {
  type: String,
  enum: ['Pending', 'Resolved'],
  default: 'Pending'
}

});

module.exports = mongoose.model('supportTicket', supportTicketSchema);
