const {User} = require('../models'); 

const updatePreferences = async (userName, changes) => {
  try {
    const user = await User.findOne({username:userName});
   if (user == null) {
    return {
        error: `Error: User not found`,
        code: 404
      }
    }

    // Update user preferences
    user.preferences = { ...user.preferences, ...changes };

    // Save the updated user
    await user.save();
    return {success:true,
            code:200 
        }
  } catch(error) {
    return {error:error.message,
            code:500
         }
  }
};

module.exports = { updatePreferences};