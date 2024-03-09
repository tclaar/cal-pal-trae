const { Schema, ObjectId } = require('mongoose');

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    email: { type: String, required: true },
    event_types: { type: [ObjectId], required: true }
  },
  {
    collection: 'users'
  }
);

module.exports = userSchema;