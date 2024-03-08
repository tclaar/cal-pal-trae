const { authenticate } = require('../mongoose/functions/auth_functions');
const router = require('express').Router();

router.post('/', async (req, res) => {
  const login = req.body.login ?? {};
  // Try the authentication.
  try {
    const authentication = await authenticate(login);
    return res.status(authentication.code).json(authentication);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `Backend error: ${error.message}`
    });
  }
});

module.exports = router;