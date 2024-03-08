const { createUser, deleteUser, updateUser, searchUsersByUsername, getUserByUsername } = require('../mongoose/functions/user_functions');

// Import express router for HTTP requests.
const router = require('express').Router();

// This is the default error when something unexpected happens.
const serverError = (error) => {
  return {
    success: false,
    error: error.message
  };
};

// createUser
router.post('/', async (req, res) => {
  try {
    // req check
    const user = req.body.user ?? {};
    // attempt creation
    const creation = await createUser(user);
    // configure res
    return res.status(creation.code).json(creation);
  } catch (error) {
    // This shouldn't happen.
    return res.status(500).json(serverError(error));
  }
});

// deleteUser
router.delete('/', async (req, res) => {
  try {
    // req check
    const login = req.body.login ?? {};
    // attempt deletion
    const deletion = await deleteUser(login);
    // configure res
    return res.status(deletion.code).json(deletion);
  } catch (error) {
    return res.status(500).json(serverError(error));
  }
});

// updateUser
router.put('/', async (req, res) => {
  try {
    // req check
    const login = req.body.login ?? {};
    const changes = req.body.changes ?? {};
    // attempt update
    const update = await updateUser(login, changes);
    // configure res
    return res.status(update.code).json(update);
  } catch (error) {
    return res.status(500).json(serverError(error));
  }
})

router.get('/s/:un', async (req, res) => {
  try {
    // req check
    const un = req.params.un ?? '';
    // attempt search
    const search = await getUserByUsername(un);
    // configure res
    return res.status(search.code).json(search);
  } catch (error) {
    return res.status(500).json(serverError(error));
  }
});

// searchUsersByUsername
router.get('/:un', async (req, res) => {
  try {
    // req check
    const un = req.params.un ?? '';
    // attempt search
    const search = await searchUsersByUsername(un);
    // configure res
    return res.status(search.code).json(search);
  } catch (error) {
    return res.status(500).json(serverError(error));
  }
});

module.exports = router;
