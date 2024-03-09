// Import express router for HTTP requests.
const router = require("express").Router();

const { getCalendarById, createCalendar, updateCalendar, deleteCalendar } = require('../mongoose/functions/calendar_functions');

const processRequest = async (res, func, errMsg) => {
  try {
    const result = await func();
  
    return res.status(result.code).json(result)
  } catch (error) {
    console.error(`Error: ${error}`);
    return res.status(500).json({ error: errMsg });
  }
}

router.get("/:id", async (req, res) => {
  processRequest(
    res, 
    () => getCalendarById(req.params.id), 
    "Error retrieving calendar."
  );
});

router.post("/", async (req, res) => {
  processRequest(
    res,
    () => createCalendar(req.body.calendar, req.session.userId),
    "Error creating calendar."
  );
});

router.put("/", async (req, res) => {
  processRequest(
    res,
    () => updateCalendar(req.body.calendar, req.session.userId),
    "Error updating calendar."
  )
});

router.delete("/:id", async (req, res) => {
  processRequest(
    res,
    () => deleteCalendar(req.params.id, req.session.userId),
    "Error deleting calendar."
  )
});

module.exports = router;