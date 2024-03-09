const { authenticate, getUserId } = require('../mongoose/functions/auth_functions');
const router = require('express').Router();

router.post('/', async (req, res) => {
  const login = req.body.login ?? {};
  // Try the authentication.
  try {
    const authentication = await authenticate(login);

    // Before returning, if authentication passed, we want to update the session!
    if (authentication.success) {
      req.session.userId = await getUserId(req.body.login.un);
    }

    return res.status(authentication.code).json(authentication);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: `Backend error: ${error.message}`
    });
  }
});

router.post('/x/', async (req, res) => {
  if (req.session) {
    req.session.destroy();
  }
  return res.status(200).json({ success: true, code: 200 });
});

module.exports = router;