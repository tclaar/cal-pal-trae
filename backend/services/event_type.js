// Import express router for HTTP requests.
const router = require("express").Router();
// Import external libraries
const mongoose = require("mongoose");
// Import mongoose model for event info
const { EventType } = require("../mongoose/models");

// ObjectID type for searching by ID in database
const ObjectId = mongoose.Types.ObjectId;

router.get("/:id", async (req, res) => {
    try {
      if (!req.params.id) {
        return res.status(400).json({ error: "Event type ID parameter is required."});
      }
  
      const eventType = await EventType.findOne({ _id: new ObjectId(req.params.id) });
      
      if (!eventType) {
        return res.status(404).json({ error: `Event type with ID ${req.params.id} not found.`});
      }
  
      return res.status(200).json({ success: true, event_type: eventType });
    } catch (error) {
      console.log(`Error: ${error}`);
      return res.status(500).json({ error: "Error retrieving event type." });
    }
});

module.exports = router;