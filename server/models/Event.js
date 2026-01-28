const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  venue: { type: String, required: true },
  totalTickets: { type: Number, required: true },
  bookedTickets: { type: Number, default: 0 },
  approvalMode: {
    type: String,
    enum: ['auto', 'manual'],
    default: 'auto'
  },
  organizerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organizer', required: true }
});

module.exports = mongoose.model('Event', EventSchema);
