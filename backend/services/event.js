// Import express router for HTTP requests.
const router = require("express").Router();
// Import external libraries
const mongoose = require("mongoose");
// Import mongoose model for event info
const { Calendar, Event } = require("../mongoose/models");

// ObjectID type for searching by ID in database
const ObjectId = mongoose.Types.ObjectId;

// TODO: create GET method endpoint. Not currently needed by front end but would be good to have

router.post("/", async (req, res) => {
  try {
    if (!req.body || !req.body.event || !req.body.calendarId) {
      return res.status(400).json({ error: "Request must have a body containing an event object "
        + "and calendar ID."});
    }

    const event = req.body.event;

    if (!event.name || !event.start || !event.start.date) {
      return res.status(400).json({ error: "Event must have a name and start date." });
    }

    const name = event.name;
    const calendarId = req.body.calendarId;

    if (await Calendar.exists({ _id: calendarId, events: { $elemMatch: { name: name } }})) {
      return res.status(409).json({ error: "An event with this name already exists in the calendar." });
    }
    const calendar = await Calendar.findOne({ _id: calendarId });

    // TODO: ensure that the current user has permission to create events on the new event's calendar

    const newEvent = new Event(event);
    calendar.events.push(newEvent);
    await calendar.save();
    
    return res.status(201).json({ success: true, event: newEvent });

  } catch (error) {
    console.log(`Error: ${error}`);
    return res.status(500).json({ error: "Error creating event." });
  }
});

router.put("/", async (req, res) => {
  try {
    if (!req.body || !req.body.event || !req.body.calendarId) {
      return res.status(400).json({ error: "Request must have a body containing an event object "
        + "and calendar ID."});
    }

    const updatedEvent = req.body.event;

    if (!updatedEvent._id) {
      return res.status(400).json({ error: "Event must have an ID." });
    }

    const calendarId = req.body.calendarId;

    if (!await Calendar.exists({ _id: calendarId, events: { $elemMatch: { _id: updatedEvent._id } }})) {
      return res.status(409).json({ error: "An event with this ID does not exist in this calendar." });
    }

    // TODO: ensure that the current user has permission to edit events on the calendar

    const calendar = await Calendar.findOne({ _id: calendarId });
    const event = calendar.events.id(updatedEvent._id);
    Object.keys(updatedEvent).forEach((field) => {
      event[field] = updatedEvent[field];
    });

    await calendar.save();

    return res.status(200).json({ success: true, event: event });

  } catch (error) {
    console.log(`Error: ${error}`);
    return res.status(500).json({ error: "Error updating event." });
  }
});

router.delete("/", async (req, res) => {
  try {
    if (!req.body || !req.body.eventId || !req.body.calendarId) {
      return res.status(400).json({ error: "Request must have a body containing an event and "
        + "and calendar ID."});
    }

    const eventId = req.body.eventId;

    const calendarId = req.body.calendarId;

    if (!await Calendar.exists({ _id: calendarId, events: { $elemMatch: { _id: eventId } }})) {
      return res.status(400).json({ error: "An event with this ID does not exist in this calendar." });
    }

    const calendar = await Calendar.findOne({ _id: calendarId });

    // TODO: ensure that the current user has permission to delete events on the calendar

    calendar.events.id(eventId).deleteOne();
    await calendar.save();

    return res.status(200).json({ success: true });
  } catch (error) {
    console.log(`Error: ${error}`);
    return res.status(500).json({ error: "Error deleting event." });
  }
});

module.exports = router;