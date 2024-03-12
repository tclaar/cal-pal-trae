const { getAllStats } = require('../mongoose/functions/usage_functions');

// Import express router for HTTP requests.
const router = require('express').Router();

// This is the default error when something unexpected happens.
const serverError = (error) => {
  return {
    success: false,
    error: error.message
  };
};

// getAllStats
router.get('/', async (req, res) => {
  try {
    const stats = await getAllStats();
    // configure res
    return res.status(stats.code).json(stats);
  } catch (error) {
    // This shouldn't happen.
    return res.status(500).json(serverError(error));
  }
});

module.exports = router;