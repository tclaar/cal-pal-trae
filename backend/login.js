// Import external libraries.
const express = require('express');
const mongoose = require("mongoose");
const cors = require("cors");
// Import mongoose model for login info
const LoginModel = require("./models/login_model");
const PublicUserModel = require("./models/public_user_model");
// Import your own username/password for MongoDB connection string.
const mongoLogin = require("./login_info.json");

// Create an express application instance.
const app = express();

// Parse any request bodies into JSON instead of string.
app.use(express.json());

// Enable cross origin request from any origin.
app.use(cors());

// Connect to MongoDB:

// Connection string to database: users.
// NOTE: replace <username> and <password> with your own to run.
const uri = `mongodb+srv://${mongoLogin.un}:${mongoLogin.pw}@cal-pal-cluster.qvdyrdk.mongodb.net/users?retryWrites=true&w=majority`;
// Should we connect to the same port with every db? Probably not, but I'm not sure.
const users_port = 2000;

mongoose.connect(uri);

// Get the username and password from the database.
let username;
let password;

// This must be a post method!
// If it was get, the username and password would show up in the
// console - obviously horrible.
app.post("/:username/:password", async (req, res) => {
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

    // Perform a search - must be an exact match!
    const regex = new RegExp(`^${username}$`);

    // This will bring in the correct username/password combination,
    // IF the username exists in the database.
    const correctLogin = await LoginModel.find({
      username: regex 
    });
    // If the username does NOT exist in our database, return a 404 Page Not Found.
    if (correctLogin.length === 0) {
      return res.status(404).json({
        error: "That username does not exist in our records - please try again."
      });
    }

    // If we've gotten here, the username was correct! Now,
    // correctLogin stores the valid data.
    
    // Check passwords.
    const password = req.params.password;
    if (correctLogin[0].password === password) {
      // Username and password match! Success!
      return res.status(200).json({
        success: true
      });
    } else {
      // The password was incorrect.
      return res.status(404).json({
        error: "The username and password do not match. Please try again."
      });
    }
  } catch (error) {
    console.error(`Error: ${error}`);
    res.status(500).json({
      error: "There has been an error searching database."
    });
  }
});

// Route 2: Get the public user information by searching them by username.
// This is their username, name, and email, for now.
// Note: this seems trivial as far as logging in goes, BUT it has future implications: adding friends, for example.
app.get("/:username", async (req, res) => {
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
    const user = await PublicUserModel.find({
      username: regex 
    });
    if (user.length === 0) {
      return res.status(404).json({
        error: `User ${username} does not exist. Please try again.`
      });
    }

    // If we've gotten here, the username was correct! Now,
    // return the public user data.
    res.status(200).json({
      user: user[0]
    });

  } catch (error) {
    console.error(`Error: ${error}`);
    res.status(500).json({
      error: "There has been an error searching database."
    });
  }
});

app.listen(users_port, () => {
  console.log(`Server listening on port ${users_port}`)
});