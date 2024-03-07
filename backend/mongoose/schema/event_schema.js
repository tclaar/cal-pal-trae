const { Schema, ObjectId } = require('mongoose');

// TODO: these could be improved to check that the actual numbers are valid (e.g. reject Feb. 30)
function validateDate(date) {
    return !date || date.match(/^\d{4}-\d{2}-\d{2}$/);
}
function validateTime(time) {
    return !time || time.match(/^\d\d:\d\d/);
}

const eventSchema = new Schema({
    name: { type: String, required: true },
    type: { type: ObjectId, required: false },
    start: {
        date: { type: String, required: true, validate: validateDate },
        time: { type: String, required: false, validate: validateTime },
    },
    end: {
        date: { type: String, required: false, validate: validateDate },
        time: { type: String, required: false, validate: validateTime },
    },
    location: { type: String, required: false },
    custom_fields: { type: Object, required: true },
});

module.exports = eventSchema;