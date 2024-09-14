// routes/eventRoutes.js
const express = require("express");
const Event = require("../models/Event");
const User = require("../models/User");
const router = express.Router();

// Create event
router.post("/", async (req, res) => {
  const { title, description, date } = req.body;
  try {
    const event = new Event({ title, description, date });
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: "Error creating event" });
  }
});

// List events
router.get("/", async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: "Error fetching events" });
  }
});

// RSVP to event
router.post("/:id/rsvp", async (req, res) => {
  const { userId } = req.body;
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    event.attendees.push(userId);
    await event.save();

    res.status(200).json({ message: "RSVP successful" });
  } catch (error) {
    res.status(500).json({ error: "Error RSVPing to event" });
  }
});

// Send reminder
router.post("/:id/reminder", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("attendees");
    if (!event) return res.status(404).json({ error: "Event not found" });

    event.attendees.forEach(async (user) => {
      // Here you'd integrate a service like NodeMailer to send an email
      console.log(`Sending reminder to ${user.email}`);
    });

    res.status(200).json({ message: "Reminders sent" });
  } catch (error) {
    res.status(500).json({ error: "Error sending reminders" });
  }
});

module.exports = router;
