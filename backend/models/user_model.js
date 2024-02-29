const mongoose = require("mongoose");
const { usersConnection } = require("../db_connections");

const userSchema = new mongoose.Schema({
  username:   { type: String, required: true },
  password:   { type: String, required: true },
  salt:       { type: String, required: true},
  email:      { type: String, required: true },
}, {
  collection: "standard_users"
});

const UserModel = usersConnection.model("UserModel", userSchema);

module.exports = UserModel;