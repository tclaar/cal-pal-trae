const express = require("express");
const router = express.Router();
const {  createThread, getThread,addMessageToThread,getThreads } = require("../mongoose/functions/mess_functions");



//create a thread with name and users with no messages  
router.post("/thread", async (req, res) => {
  try {
    const threadData = req.body;
    const thread = await createThread(threadData);
    console.log(thread);
    res.status(201).json(thread);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//add a message to an existing thread by finding this thread by it's id  

router.post("/thread/:id", async (req, res) => {
  try {
      const threadId = req.params.id; // Get the thread ID from the request parameters
      const { text, sender } = req.body; // Get message data from the request body

      // Call the function to add message to the thread
      const thread = await addMessageToThread(threadId, { text, sender });

      res.status(200).json(thread); // Return the updated thread
  } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal server error" });
  }
});


router.get("/thread/:id", async (req, res) => {
  try {
    const threadId = req.params.id;

    // Check if threadId is provided
    if (!threadId) {
      return res.status(400).json({ error: "Thread ID is required" });
    }

    // Retrieve the thread by its ID
    const thread = await getThread(threadId);

    // Check if the thread exists
    if (!thread) {
      return res.status(404).json({ error: "Thread not found" });
    }

    // Include the _id field in the response data
    const responseData = { _id: thread._id, ...thread.toObject() };

    // Send the response with the thread data
    res.status(200).json(responseData);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/thread/userThreads/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    // Retrieve all threads that have this user ID in their group array
    console.log(userId);
    const threads = await getThreads(userId);

    // Check if any threads were found
    if (!threads || threads.length === 0) {
      return res.status(404).json({ error: "No threads found" });
    }

    // Transform each thread object to include the _id field
    const responseData = threads.map(thread => ({ _id: thread._id, ...thread.toObject() }));

    // Send the response with the transformed thread data
    res.status(200).json(responseData);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});  

module.exports = router;
