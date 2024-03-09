const { Schema, ObjectId } = require('mongoose');
const eventSchema = require('./event_schema');

const calendarSchema = new Schema({
    name:           { type: String, required: true },
    userId:         { type: ObjectId, required: true},
    events:         { type: [eventSchema], required: true},
    event_types:    { type: [ObjectId], required: true },
}, {
  collection: "calendars"
});

module.exports = calendarSchema;