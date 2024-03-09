const { User } = require('../models');
const { hash } = require('../../hashing');

const authenticate = async (login) => {
  // check that we have all the fields we need.
  if (!(login && login.un && login.pw)) {
    return {
      success: false,
      error: 'bad request',
      code: 400
    };
  }

  // We return an identical error twice, so i define it here.
  const noMatchError = {
    success: false,
    error: 'login information does not match our records.',
    code: 401
  };
  
  try {
    // Find the user:
    const correctUser = await User.findOne({
      username: login.un
    });
    if (correctUser === null) {
      return noMatchError;
    }

    // Username exists in db. Does the password match?
    if (correctUser.password === hash(login.pw, correctUser.salt)) {
      return { success: true, code: 200 };
    } else {
      return noMatchError;
    }

  } catch (error) {
    return {
      success: false,
      error: error.message,
      code: 500
    };
  }
};

const getUserId = async (un) => {
  const user = await User.findOne({
    username: un
  });
  return user._id;
}

module.exports = {
  authenticate,
  getUserId
};
