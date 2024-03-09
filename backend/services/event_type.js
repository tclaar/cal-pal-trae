// Import express router for HTTP requests.
const router = require("express").Router();

const { getEventTypeById, createEventType, updateEventType, deleteEventType } = require('../mongoose/functions/event_type_functions');
const { processRequest } = require('../service_functions');

router.get("/:id", async (req, res) => {
  processRequest(
    res, 
    () => getEventTypeById(req.params.id), 
    "Error retrieving event type."
  );
});

router.post("/", async (req, res) => {
  processRequest(
    res, 
    () => createEventType(req.body.event_type, req.session.userId), 
    "Error creating event type."
  );
});

router.put("/", async (req, res) => {
  processRequest(
    res, 
    () => updateEventType(req.body.event_type, req.session.userId), 
    "Error modifying event type."
  );
});

router.delete("/:id", async (req, res) => {
  processRequest(
    res, 
    () => deleteEventType(req.params.id, req.session.userId), 
    "Error deleting event type."
  );
});


module.exports = router;