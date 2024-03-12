const {User} = require('../models'); 

const updatePreferences = async (username, changes) => {
  console.log(changes);
  if (!username) {
    return {
      success: false,
      error: 'Bad request: username required.',
      code: 400
    };
  }
  const user = await User.findOne({
    username: username
  });
  if (user === null) {
    return {
      success: false,
      error: `User ${user} not found`,
      code: 404
    };
  }
  try {
    const oldPreferences = user.preferences ?? {};
    user.preferences = {
      ...oldPreferences,
      ...changes
    };
    await user.save();
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

module.exports = { updatePreferences};