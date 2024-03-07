// Import external libraries.
const mongoose = require("mongoose");
// Import your own username/password for MongoDB connection string.
const mongoLogin = require("./config/login_info.json");

// Connect to MongoDB:

// Generate a connection string to the provided database.
function uri(dbName) {
  return `mongodb+srv://${mongoLogin.un}:${mongoLogin.pw}@cal-pal-cluster.qvdyrdk.mongodb.net/${dbName}?retryWrites=true&w=majority`
}

// Connections
const usersConnection = mongoose.createConnection(uri("users"));
const eventsConnection = mongoose.createConnection(uri("events"));

module.exports = {
  usersConnection,
  eventsConnection,
}
