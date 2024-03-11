
import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import "../css/Messages.css";
import {UserContext} from "../../App";

function Messages() {
  const {userState, setUserState} = useContext(UserContext)
  const [threads, setThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState();
  const [messages, setMessages] = useState([]); // Corrected state variable name

  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false); // State for showing the modal
  const [threadName, setThreadName] = useState(""); // State for thread name input field
  const [userName, setUserName] = useState(""); // State for user ID input field
  const [addedUsers, setAddedUsers] = useState([]); // State for added users
  const messagesEndRef = useRef(null);

  ///////////////
  //const currentUserId = "65eca673a0b41b8900fe4862";
    //const currentUserName = "abdel";

  const currentUserId = userState.user._id;
  const currentUserName = userState.user.username;


  // this retrievs the threads that the current user is part of
  useEffect(() => {
    const getThreads = async () => {
      try {
        const response = await axios.get(
          `http://localhost:2000/message/thread/userThreads/${currentUserId}`
        );
        setThreads(response.data);
      } catch (err) {
        console.log("Error: " + err);
      }
    };
    getThreads();
  }, []);

  const handleThreadClick = (thread) => {
    setSelectedThread(thread);
    setMessage("");
    displayThread(thread._id); // Fetch the selected thread and display the messages it contains
  };

  // Function to display messages of a selected thread
  const displayThread = async (threadId) => {
    try {
      const response = await axios.get(
        `http://localhost:2000/message/thread/${threadId}`
      );
      setMessages(response.data.messages); // Update the messages state variable

      console.log("Thread messages:", response.data);
    } catch (err) {
      console.log("Error: " + err);
    }
  };

  // Function to add user to the list of added users
  const addUser = async () => {
    try {
      const response = await axios.get(
        `http://localhost:2000/user/${userName}`
      );

      if (response.data.success) {
        console.log(response.data.users[0]._id);

        setAddedUsers([...addedUsers, response.data.users[0]._id]);
        console.log(response);
        console.log(addedUsers);
        setUserName(""); // Clear the user ID input field after adding
      } else {
        alert("User does not exist");
      }
    } catch (err) {
      console.log("Error: " + err);
    }
  };

  // Function to create a new thread with selected users
  const createNewThread = async () => {
    try {
      // Add the current user ID to the list of added users
      const updatedAddedUsers = [...addedUsers, currentUserId];

      const response = await axios.post(
        "http://localhost:2000/message/thread",
        {
          name: threadName,
          group: updatedAddedUsers,
          messages: [],
        }
      );
      setThreads([...threads, response.data]);

      console.log("Thread created:", response.data);
      setShowModal(false); // Close the modal after creating the thread
    } catch (err) {
      console.log("Error: " + err);
    }
  };

  const createNewMessage = async () => {
    try {
      const response = await axios.post(
        `http://localhost:2000/message/thread/${selectedThread._id}`,
        {
          sender: currentUserName,
          text: message,
        }
      );
      setMessage('');
      console.log("message created:", response.data);
    } catch (err) {
      console.log("Error: " + err);
    }
  };

  return (
    <div>
      <div id="sidebar">
        <p id="a">
          <b>friends</b>
        </p>
        <div id="users">
          {threads.map((thread, index) => (
            <div
              key={index}
              onClick={() => handleThreadClick(thread)}
              id="users"
            >
              {thread.name}
            </div>
          ))}
        </div>
        {/* Button to open the modal */}
        <button onClick={() => setShowModal(true)}>Create Thread</button>
      </div>
      {/* Modal */}
      {showModal && (
        <div className="modal" style={{ display: "block" }}>
          <div className="modal-content">
            <span className="close" onClick={() => setShowModal(false)}>
              &times;
            </span>
            <h2>Create New Thread</h2>
            {/* Input field for thread name */}
            <div>
              <label htmlFor="threadName">Thread Name:</label>
              <input
                type="text"
                id="threadName"
                value={threadName}
                onChange={(e) => setThreadName(e.target.value)}
              />
            </div>
            {/* Input field for adding user ID */}
            <div>
              <label htmlFor="userName">Usernames:</label>
              <input
                type="text"
                id="userName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
              {/* Button to add user */}
              <button onClick={addUser}>Add User</button>
            </div>
            {/* List of added users */}
            <div>
              <h3>Added Users</h3>
              {addedUsers.map((user, index) => (
                <div key={index}>{user}</div>
              ))}
            </div>
            {/* Button to create thread */}
            <button onClick={createNewThread}>Create Thread</button>
          </div>
        </div>
      )}
      <div id="content" style={{ flex: 1, overflowY: "auto" }}>
        <div className="container">
          {/* Display messages */}
          <div>
            {/* Display messages of the selected thread */}
            {messages.map((threadMessage, index) => (
              <div
                key={index}
                style={{
                  textAlign:
                    threadMessage.sender === currentUserName ? "right" : "left",
                  marginBottom: "10px",
                }}
              >
                <span style={{ color: "red" }}>
                  {new Date(threadMessage.createdAt).toLocaleString(undefined, {
                    hour12: true,
                    hour: "numeric",
                    minute: "numeric",
                  })}
                </span>
                <span style={{ color: "blue" }}> {threadMessage.sender} </span>:{" "}
                {threadMessage.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Send message section */}
      <div style={{ textAlign: "center", padding: "10px" }}>
        <input
          id="message-input"
          style={{ width: "35%", height: "40px", fontSize: "16px" }}
          placeholder="Send a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={!selectedThread}
        />

        <button
          id="send-button"
          style={{
            width: "20%",
            height: "40px",
            fontSize: "16px",
            marginLeft: "10px",
          }}
          onClick={createNewMessage}
          disabled={!selectedThread || !message.trim()} // Disable button if no thread selected or message is empty
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Messages;
