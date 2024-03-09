/**
 * This module utilizes the connected User model in order to do the CRUD operations on Users of CalPal.
 */

const { User } = require('../models');

const { hash, generateSalt } = require('../../hashing');
const { authenticate } = require('./auth_functions');

/** Add a new user to the database. */
const createUser = async (user) => {
  // If the salt is provided, or if we are lacking necessary fields, return error.
  if (!(user && user.password && user.username && user.email) || user.salt) {
    return {
      success: false,
      error: 'bad request',
      code: 400
    };
  }

  try {
    // Make sure there's not already a user with that username.
    const existingUser = await User.findOne({
      username: user.username
    });

    if (existingUser !== null) {
      return {
        success: false,
        error: 'user already exists',
        code: 403
      };
    }

    // Now, we must turn the password into a hash and produce a salt.
    const salt = generateSalt();
    const hashedPw = hash(user.password, salt);
    user.password = hashedPw;
    user.salt = salt;

    // Finally we create the new document.
    await User.create(user);
    return {
      success: true,
      code: 201
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      code: 500
    };
  }
};

/** Delete a user from the database. */
const deleteUser = async (login) => {
  try {
    const authentication = await authenticate(login);
    if (!authentication.success) {
      return authentication;
    }

    await User.findOneAndDelete({
      username: login.un
    });

    return {
      success: true,
      code: 200
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      code: 500
    };
  }
};

const getUserByUsername = async (un) => {
  if (!un) {
    return {
      success: false,
      error: 'search index is required',
      code: 400
    };
  }

  try {
    const user = await User.findOne({
      username: un
    })
      .select('-password')
      .select('-salt');

    if (user === null) {
      return {
        success: false,
        error: 'no matches found',
        code: 404
      };
    }

    return {
      success: true,
      code: 200,
      user: user
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      code: 500
    };
  }
};

/** Search for users by username. Can be used strictly if un is a string, or with other rules if un is a RegExp. */
const searchUsersByUsername = async (un) => {
  if (!un) {
    return {
      success: false,
      error: 'search index is required',
      code: 400
    };
  }

  try {
    const users = await User.find({
      username: new RegExp(un, 'i')
    }).select('-password').select('-salt');

    if (users.length === 0) {
      return {
        success: false,
        error: 'no matches found',
        code: 404
      };
    }

    return {
      success: true,
      code: 200,
      users: users
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      code: 500
    };
  }
};

/** Updates an existing User document in the database. Requires password if password is changed. */
const updateUser = async (login, changes) => {
  try {
    // authenticate login.
    const authentication = await authenticate(login);
    if (!authentication.success) {
      return authentication;
    }

    const chgs = changes ?? {};

    // A user cannot edit their salt.
    if (chgs.salt) {
      return { success: false, error: 'FORBIDDEN REQUEST', code: 403 };
    }

    // If they're changing their password, we need to hash it before storage.
    if (chgs.password) {
      const newSalt = generateSalt();
      const newHash = hash(chgs.password, newSalt);
      chgs.salt = newSalt;
      chgs.password = newHash;
    }

    // We know the user exists, and we've ensured the fields are proper for db storage.
    // Update it now.
    await User.findOneAndUpdate(
      {
        username: login.un
      },
      chgs
    );

    return {
      success: true,
      code: 200
    };
  } catch (error) {
    return {
      success: false,
      error: 'server error: ' + error.message,
      code: 500
    };
  }
};

module.exports = {
  createUser,
  deleteUser,
  getUserByUsername,
  searchUsersByUsername,
  updateUser
};
