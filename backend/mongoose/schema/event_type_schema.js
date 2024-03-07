const { Schema } = require('mongoose');

const eventTypeSchema = new Schema({
    name: { type: String, required: true },
    fields: { type: Object, required: true },
}, {
    collection: "custom_event_types"
});

module.exports = eventTypeSchema