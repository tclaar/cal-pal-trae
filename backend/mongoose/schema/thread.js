const { Schema, ObjectId } = require('mongoose');


const messageSchema = new Schema({
    text: {
      type: String,
      required: true
    },
    sender: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  });



  const threadSchema = new Schema({
    group: [ObjectId],
    messages: [messageSchema],
    name: {
        type: String,
        required: true
      }


  }, { collection: "threads" });
  



module.exports = threadSchema;



