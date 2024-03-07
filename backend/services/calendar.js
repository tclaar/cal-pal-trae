// Import express router for HTTP requests.
const router = require("express").Router();
// Import external libraries
const mongoose = require("mongoose");
// Import mongoose model for event info
const { Calendar } = require("../mongoose/models");

// ObjectID type for searching by ID in database
const ObjectId = mongoose.Types.ObjectId;

router.get("/:id", async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ error: "Calendar ID parameter is required."});
    }

    const calendar = await Calendar.findOne({ _id: new ObjectId(req.params.id) });
    
    if (!calendar) {
      return res.status(404).json({ error: `Calendar with ID ${req.params.id} not found.`});
    }

    return res.status(200).json({ success: true, calendar: calendar });
  } catch (error) {
    console.log(`Error: ${error}`);
    return res.status(500).json({ error: "Error retrieving calendar." });
  }
});

module.exports = router;