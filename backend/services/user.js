// Import express router for HTTP requests.
const router = require("express").Router();
// Import mongoose model for user info
const UserModel = require("../models/user_model");

const { hash, generateSalt } = require("../hashing");

// This must be a post method!
// If it was get, the username and password would show up in the
// console - obviously horrible.
router.post("/auth", async (req, res) => {
  try {
    // We're gonna search by username, as a username is unique -
    // Passwords could potentially be the same.

    // Make sure there is a body containing a username and password.
    if (!(req.body && req.body.un && req.body.pw)) {
      return res.status(400).json({
        error: "Body containing username and password is required."
      });
    }
    const username = req.body.un;

    // Perform a search - must be an exact match!
    const regex = new RegExp(`^${username}$`);

    // This will bring in the correct username/password combination,
    // IF the username exists in the database.
    const correctLogin = await UserModel.findOne({
      username: regex 
    });
    // If the username does NOT exist in our database, return a 404 Page Not Found.
    // A generic error message is used to avoid leaking the existence of a valid username.
    if (!correctLogin) {
      return res.status(404).json({
        error: "That username or password is incorrect."
      });
    }

    // If we've gotten here, the username was correct! Now,
    // correctLogin stores the valid data.
    
    // Check passwords.
    const password = req.body.pw;
    if (correctLogin.password === hash(password, correctLogin.salt)) {
      // Username and password match! Success!

      req.session.userID = correctLogin._id;

      return res.status(200).json({
        success: true
      });
    } else {
      // The password was incorrect.
      // A generic error message is used to avoid leaking the existence of a valid username.
      return res.status(404).json({
        error: "That username or password is incorrect."
      });
    }
  } catch (error) {
    console.error(`Error: ${error}`);
    res.status(500).json({
      error: "There has been an error searching database."
    });
  }
});

router.post("/new", async (req, res) => {
  try {
    // Make sure there is a body containing the required fields.
    if (!(req.body && req.body.username && req.body.password && req.body.email)) {
      return res.status(400).json({
        error: "Body containing username, password, and email is required."
      });
    }

    if (await UserModel.exists({ username: req.body.username })) {
      return res.status(409).json({ error: "Username " + req.body.username + " is already taken." });
    }

    const salt = generateSalt();
    req.body.password = hash(req.body.password, salt);
    req.body.salt = salt;

    const user = new UserModel(req.body);
    await user.save();

    req.session.userID = user._id;

    return res.status(201);

  } catch (error) {
    console.error(`Error: ${error}`);
    res.status(500).json({
      error: "There has been an error creating the account."
    });
  }
});

// Route 3: Get the public user information by searching them by username.
// This is their username, name, and email, for now.
// Note: this seems trivial as far as logging in goes, BUT it has future implications: adding friends, for example.
router.get("/:username", async (req, res) => {
  try {
    // We're gonna search by username, as a username is unique -
    // Passwords could potentially be the same.

    // Make sure there is a username to search for.
    const username = req.params.username;
    if (!username) {
      return res.status(400).json({
        error: "Username is a required field! Please try again."
      });
    }

    // Perform a search - case insensitive.
    const regex = new RegExp(`^${username}$`, 'i');

    // This will bring in the correct username/password combination,
    // IF the username exists in the database.
    const user = await UserModel.findOne({
      username: regex 
    });
    if (!user) {
      return res.status(404).json({
        error: `User ${username} does not exist. Please try again.`
      });
    }

    // If we've gotten here, the username was correct! Now,
    // return the public user data.
    res.status(200).json({
      id: user._id,
      username: user.username,
      email: user.email
    });

  } catch (error) {
    console.error(`Error: ${error}`);
    res.status(500).json({
      error: "There has been an error searching database."
    });
  }
});

module.exports = router;