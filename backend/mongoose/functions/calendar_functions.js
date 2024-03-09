/**
 * This module provides functions to facilitate the processing of requests to the
 * Calendar web service.
 */

const mongoose = require("mongoose");

const { Calendar } = require("../models");

/** An error to return for an invalid calendar ID. */
const badCalendarIdError = {
  error: 'A valid calendar ObjectID parameter is required.',
  code: 400
}
/** An error to return when the user ID is missing. */
const noUserIdError = {
  error: "Missing user ID: are you logged in?",
  code: 401
}

/** Get a calendar from the database by its ID. */
const getCalendarById = async (id) => {
  if (!(id && mongoose.isValidObjectId(id))) {
    return badCalendarIdError;
  }

  const calendar = await Calendar.findById(id);

  if (!calendar) {
    return {
      error: `Calendar with ID ${id} not found.`,
      code: 404
    }
  }

  return {
    success: true,
    code: 200,
    calendar: calendar
  };
}

/** Create a calendar using the provided object for the user with the provided ID. */
const createCalendar = async (calendar, userId) => {
  if (!(calendar && calendar.name && calendar.events && calendar.event_types)) {
    return {
      error: "Calendar object with name, events, and event_types fields is required.",
      code: 400
    }
  }

  if (!userId) {
    return noUserIdError;
  }

  calendar.userId = userId;

  if (await Calendar.exists({ name: calendar.name, userId: userId})) {
    return {
      error: "A calendar with this name already exists for this user.",
      code: 409
    }
  }

  const newCalendar = await Calendar.create(calendar);
  return {
    success: true,
    code: 201,
    calendar: newCalendar
  }
}

/** Update the provided calendar in the datatbase. */
const updateCalendar = async (calendar, userId) => {
  if (!(calendar && calendar._id)) {
    return {
      error: "Calendar object with an _id field and updated fields is required.",
      code: 400
    }
  }

  const id = calendar._id;

  if (!(id && mongoose.isValidObjectId(id))) {
    return {
      error: 'A valid calendar ObjectID field is required.',
      code: 400
    }
  }

  if (!userId) {
    return noUserIdError;
  }

  const oldCalendar = await Calendar.findById(id);

  if (!oldCalendar) {
    return {
      error: `Calendar with ID ${id} not found.`,
      code: 404
    }
  }

  if (oldCalendar.userId != userId) {
    return {
      error: "Current user does not have permission to edit this calendar.",
      code: 401
    }
  }

  Object.keys(calendar).forEach((field) => {
    oldCalendar[field] = calendar[field];
  });

  const updatedCalendar = await oldCalendar.save();

  return {
    success: true,
    code: 200,
    calendar: updatedCalendar
  }
}

/** Delete the calendar associated with the provided ID. */
const deleteCalendar = async (id, userId) => {
  if (!(id && mongoose.isValidObjectId(id))) {
    return badCalendarIdError;
  }

  if (!userId) {
    return noUserIdError;
  }

  const calendar = await Calendar.findById(id);

  if (calendar.userId != userId) {
    return {
      error: "Current user does not have permission to delete this calendar.",
      code: 401
    }
  }

  const deleted = await Calendar.findByIdAndDelete(id);

  return {
    success: true,
    code: 200,
    calendar: deleted
  }
}

module.exports = {
  getCalendarById,
  createCalendar,
  updateCalendar,
  deleteCalendar
}