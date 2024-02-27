const mongoose = require("mongoose");

const loginSchema = new mongoose.Schema({
  username:   { type: String, required: true },
  password:   { type: String, required: true }
}, {
  collection: "standard_users"
});

const LoginModel = mongoose.model("LoginModel", loginSchema);

module.exports = LoginModel;