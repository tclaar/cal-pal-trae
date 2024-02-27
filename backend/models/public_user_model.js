// Note: this doesn't work how i wanted it to: still returns the password.

const mongoose = require("mongoose");

const publicUserSchema = new mongoose.Schema({
  username:   { type: String, required: true },
  name:       { type: String, required: true },
  email:      { type: String, required: true }
}, {
  collection: "standard_users"
});

const PublicUserModel = mongoose.model("PublicUserModel", publicUserSchema);

module.exports = PublicUserModel;