const express = require('express');
const router = express.Router();
const { updatePreferences, getPreferences } = require('../mongoose/functions/preference_functions');

// PUT request to update preferences
router.put("/:userName", async (req, res) => {
  const userName = req.params.userName;
  const changes = req.body.changes;

  try {
    const updatedPreferences = await updatePreferences(userName, changes);
    res.json(updatedPreferences);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});




module.exports = router;