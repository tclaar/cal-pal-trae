const { Thread } = require('../models');




async function createThread(threadData) {
  try {
    const thread = new Thread(threadData);
    await thread.save();
    console.log(thread);
    return thread;
  } catch (error) {
    console.error("Error creating message:", error);
    throw error;
  }
}

async function addMessageToThread(threadId, messageData) {
    try {
        // Find the thread by its ID
        const thread = await Thread.findById(threadId);

        if (!thread) {
            throw new Error("Thread not found");
        }

        // Add the message to the thread
        thread.messages.push(messageData);

        // Save the updated thread
        await thread.save();

        return thread;
    } catch (error) {
        console.error("Error adding message to thread:", error);
        throw error;
    }
}



// Function to retrieve a thread by its unique ID
async function getThread(threadId) {
  try {
    const thread = await Thread.findById(threadId);
    return thread;
  } catch (error) {
    console.error("Error retrieving thread:", error);
    throw error;
  }
}

async function getThreads(userId) {
  try {
    const threads = await Thread.find({ group: userId }); // Filter threads where the user ID is in the group array
    console.log(threads);
    return threads;
  } catch (error) {
    console.error("Error retrieving threads:", error);
    throw error;
  }
}
module.exports = {
  createThread,
  getThread,
  addMessageToThread,
  getThreads
};
