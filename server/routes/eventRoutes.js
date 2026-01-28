const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Event = require('../models/Event');

// @route   POST api/events
// @desc    Create a new event
// @access  Private
router.post('/', auth, async (req, res) => {
  const { title, description, date, venue, totalTickets, approvalMode } = req.body;

  try {
    const newEvent = new Event({
      title,
      description,
      date,
      venue,
      totalTickets,
      approvalMode,
      organizerId: req.user.id
    });

    const event = await newEvent.save();
    res.json(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/events/my-events
// @desc    Get all events for the logged in organizer
// @access  Private
router.get('/my-events', auth, async (req, res) => {
  try {
    const events = await Event.find({ organizerId: req.user.id }).sort({ date: -1 });
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/events/public
// @desc    Get all upcoming events (Public)
// @access  Public
router.get('/public', async (req, res) => {
  try {
    const events = await Event.find({ date: { $gte: new Date() } })
      .sort({ date: 1 })
      .limit(20);
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/events/:id
// @desc    Get event by ID (Public for registration page)
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ msg: 'Event not found' });
    res.json(event);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Event not found' });
    res.status(500).send('Server Error');
  }
});

module.exports = router;
