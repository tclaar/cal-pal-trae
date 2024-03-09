/**
 * This module provides functions to facilitate the processing of requests to the
 * event type web service.
 */

const mongoose = require("mongoose");

const { EventType, User } = require("../models");

/** An error to return for an invalid event type ID. */
const badEventTypeIdError = {
  error: 'A valid event type ObjectID parameter is required.',
  code: 400
}
/** An error to return when the user ID is missing. */
const noUserIdError = {
  error: "Missing user ID: are you logged in?",
  code: 401
}

/** Get an event type from the database by its ID. */
const getEventTypeById = async (id) => {
  if (!(id && mongoose.isValidObjectId(id))) {
    return badEventTypeIdError;
  }

  const eventType = await EventType.findById(id);

  if (!eventType) {
    return {
      error: `Event type with ID ${id} not found.`,
      code: 404
    }
  }

  return {
    success: true,
    code: 200,
    event_type: eventType
  };
}

/** Create a new event type document from the provided object for the specified user. */
const createEventType = async (eventType, userId) => {
  if (!(eventType && eventType.name && eventType.fields)) {
    return {
      error: "Event type object with name and fields array is required.",
      code: 400
    }
  }

  if (!userId) {
    return noUserIdError;
  }

  const newEventType = await EventType.create(eventType);

  // Add event type ID to user document
  const user = await User.findById(userId);
  user.event_types.push(newEventType._id);
  await user.save();

  return {
    success: true,
    code: 201,
    event_type: newEventType
  }
}

/** Update the provided event type in the datatbase. */
const updateEventType = async (eventType, userId) => {
  if (!(eventType && eventType._id)) {
    return {
      error: "Event type object with an _id field and updated fields is required.",
      code: 400
    }
  }

  const id = eventType._id;

  if (!(id && mongoose.isValidObjectId(id))) {
    return {
      error: 'A valid event type ObjectID field is required.',
      code: 400
    }
  }

  if (!userId) {
    return noUserIdError;
  }

  const oldEventType = await EventType.findById(id);

  if (!oldEventType) {
    return {
      error: `Event type with ID ${id} not found.`,
      code: 404
    }
  }

  // Ensure that the current user can edit this event type
  if (!(await User.exists({ _id: userId, event_types: { $elemMatch: { $eq: id } }}))) {
    return {
      error: 'Current user does not have permission to edit this event type.',
      code: 401
    }
  }

  Object.keys(eventType).forEach((field) => {
    oldEventType[field] = eventType[field];
  });

  const updatedEventType = await oldEventType.save();

  return {
    success: true,
    code: 200,
    event_type: updatedEventType
  }
}

/** Delete the event type associated with the provided ID. */
const deleteEventType = async (id, userId) => {
  if (!(id && mongoose.isValidObjectId(id))) {
    return badEventTypeIdError;
  }

  if (!userId) {
    return noUserIdError;
  }

  if (!await EventType.findById(id)) {
    return {
      error: `Event type with ID ${id} not found.`,
      code: 404
    }
  }

  const user = await User.findOne({ _id: userId, event_types: { $elemMatch: { $eq: id } }});

  // Ensure that the current user can delete this event type
  if (!user) {
    return {
      error: 'Current user does not have permission to delete this event type.',
      code: 401
    }
  }

  const deleted = await EventType.findByIdAndDelete(id);

  user.event_types.splice(user.event_types.indexOf(id), 1);
  await user.save();

  return {
    success: true,
    code: 200,
    event_type: deleted
  }
}

module.exports = {
  getEventTypeById,
  createEventType,
  updateEventType,
  deleteEventType
}