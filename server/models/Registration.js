const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); // We'll handle UUID generation in the route or here

const RegistrationSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  userEmail: { type: String, required: true },
  userName: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  ticketId: { type: String, unique: true, default: uuidv4 } 
});

module.exports = mongoose.model('Registration', RegistrationSchema);
