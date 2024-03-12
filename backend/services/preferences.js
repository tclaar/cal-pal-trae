const express = require('express');
const router = express.Router();
const { updatePreferences } = require('../mongoose/functions/preference_functions');

// PUT request to update preferences
router.put("/:username", async (req, res) => {
  const username = req.params.username ?? "";
  const changes = req.body.changes ?? {};

  try {
    const update = await updatePreferences(username, changes);
    res.status(update.code).json(update);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});




module.exports = router;