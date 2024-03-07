const mongoose = require('mongoose');

// Generate a connection string to the provided database.
function uri(dbName) {
  const mongoLogin = require('../config/login_info.json');
  return `mongodb+srv://${mongoLogin.un}:${mongoLogin.pw}@cal-pal-cluster.qvdyrdk.mongodb.net/${dbName}?retryWrites=true&w=majority`;
};

const userConnection = mongoose.createConnection(uri('users'));
const User = userConnection.model('User', require('./schema/user_schema'));

module.exports = {
  User
};
