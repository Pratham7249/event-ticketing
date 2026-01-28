const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Registration = require('../models/Registration');
const Event = require('../models/Event');

// @route   POST api/registrations
// @desc    Register for an event
// @access  Public
router.post('/', async (req, res) => {
  const { eventId, userEmail, userName } = req.body;

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    if (event.bookedTickets >= event.totalTickets) {
      return res.status(400).json({ msg: 'Event is fully booked' });
    }

    // Check if user already registered? (Optional but good practice)
    // For now, simplicity as per requirements.

    let status = 'pending';
    if (event.approvalMode === 'auto') {
      status = 'approved';
    }

    const newRegistration = new Registration({
      eventId,
      userEmail,
      userName,
      status
    });

    await newRegistration.save();

    if (status === 'approved') {
      event.bookedTickets = event.bookedTickets + 1;
      await event.save();
    }

    res.json(newRegistration);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/registrations/event/:eventId
// @desc    Get registrations for a specific event (Organizer only)
// @access  Private
router.get('/event/:eventId', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ msg: 'Event not found' });

    // Ensure the organizer owns this event
    if (event.organizerId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    const registrations = await Registration.find({ eventId: req.params.eventId });
    res.json(registrations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PATCH api/registrations/:id
// @desc    Approve or Reject registration
// @access  Private
router.patch('/:id', auth, async (req, res) => {
  const { status } = req.body; // 'approved' or 'rejected'

  try {
    const registration = await Registration.findById(req.params.id);
    if (!registration) return res.status(404).json({ msg: 'Registration not found' });

    const event = await Event.findById(registration.eventId);
    if (event.organizerId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    if (status === 'approved') {
      if (registration.status === 'approved') {
        return res.status(400).json({ msg: 'Already approved' });
      }
      if (event.bookedTickets >= event.totalTickets) {
        return res.status(400).json({ msg: 'Event is fully booked' });
      }
      
      event.bookedTickets += 1;
      await event.save();
    } else if (status === 'rejected') {
        // If it was previously approved (unlikely based on flow, but safe to handle), we might want to decrement bookedTickets
        // But the requirement says "Show Approve/Reject buttons only if status is pending".
        // Use case: Changing from pending to rejected. No specific logic needed for bookedTickets.
    }

    registration.status = status;
    await registration.save();
    res.json(registration);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/registrations/ticket/:ticketId
// @desc    Get ticket details
// @access  Public
router.get('/ticket/:ticketId', async (req, res) => {
  try {
    const registration = await Registration.findOne({ ticketId: req.params.ticketId }).populate('eventId', 'title date venue description');
    
    if (!registration) return res.status(404).json({ msg: 'Ticket not found' });

    if (registration.status !== 'approved') {
      return res.status(403).json({ msg: 'Access Denied: Ticket not approved' });
    }

    res.json(registration);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
