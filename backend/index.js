// Import external libraries.
const express = require('express');
const cors = require("cors");
const session = require('express-session');

// Import your own session secret for session cookies. Ideally should be a 
// string with 32 bytes of entropy generated with a CSPRNG, but unless this 
// is production code it doesn't really matter.
const sessionInfo = require("./config/session_info.json");

// Create an express application instance.
const app = express();

// Parse any request bodies into JSON instead of string.
app.use(express.json());
// Enable cross origin request from any origin.
app.use(cors());
app.use(session({
    secret: sessionInfo.secret,
    resave: false,
    saveUninitialized: false
}));

const users_port = 2000;

app.use("/user", require("./services/user.js"));
app.use("/calendar", require("./services/calendar.js"));
app.use("/event", require("./services/event.js"));
app.use("/event/type", require("./services/event_type.js"));

app.listen(users_port, () => {
    console.log(`Server listening on port ${users_port}`)
});