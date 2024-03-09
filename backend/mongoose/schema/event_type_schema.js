const { Schema } = require('mongoose');

const eventTypeSchema = new Schema({
    name: { type: String, required: true },
    fields: { type: Map, required: true },
}, {
    collection: "event_types"
});

module.exports = eventTypeSchema