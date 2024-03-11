const { Schema } = require('mongoose');

const statSchema = new Schema({
  key: { type: String, required: true, unique: true },
  counter: { type: Number, required: true }
}, {
  collection: 'usage'
});

module.exports = statSchema;