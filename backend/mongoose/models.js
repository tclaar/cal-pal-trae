const mongoose = require('mongoose');

// Generate a connection string to the provided database.
function uri(dbName) {
  const mongoLogin = require('../config/login_info.json');
  return `mongodb+srv://${mongoLogin.un}:${mongoLogin.pw}@cal-pal-cluster.qvdyrdk.mongodb.net/${dbName}?retryWrites=true&w=majority`;
};

const userConnection = mongoose.createConnection(uri('cal-pal'));
const User = userConnection.model('User', require('./schema/user_schema'));

const dbConnection = mongoose.createConnection(uri('cal-pal'));
const Calendar = dbConnection.model('Calendar', require('./schema/calendar_schema'));
const Event = dbConnection.model('Event', require('./schema/event_schema'));
const EventType = dbConnection.model('EventType', require('./schema/event_type_schema'));
const Thread = dbConnection.model('Thread', require('./schema/thread'));

module.exports = {
  Calendar,
  Event,
  EventType,
  User,
  Thread

};
