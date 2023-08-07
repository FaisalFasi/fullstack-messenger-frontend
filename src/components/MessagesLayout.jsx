import React from "react";
import { useEffect, useState } from "react";

const MessagesLayout = () => {
  const [messages, setMessages] = useState([]);

  const [usernameInput, setUsernameInput] = useState("");
  const [contentInput, setContentInput] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [temporaryEditingContent, setTemporaryEditingContent] = useState(""); // TEMPORARY STATE FOR EDITING

  const [error, setError] = useState(null);
  useEffect(() => {
    // Get the username from local storage if available
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsernameInput(storedUsername);
    } else {
      // Prompt the user to enter their username if not available in local storage
      // You can use any logic to get the username (e.g., a login form)
    }

    // Fetch messages every 1 second
    const intervalId = setInterval(() => {
      fetch(` ${import.meta.env.VITE_MESSAGING_API}/messages`, {
        method: "GET",
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(
              `Something is wrong with polling messages request ${res.status} ${res.statusText}`
            );
          }
          return res.json();
        })
        .then((data) => {
          setMessages(data);
        })
        .catch((error) => setError(error.message));
    }, 1000);

    // Cleanup the interval on component unmount to avoid memory leaks
    return () => clearInterval(intervalId);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const message = {
      content: contentInput,
      username: usernameInput,
    };

    fetch(`${import.meta.env.VITE_MESSAGING_API}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(
            `Something is wrong with creating submit request ${res.status} ${res.statusText}`
          );
        }
        return res.json();
      })
      .then((data) => {
        console.log("new Document received from server", data);
        setMessages([...messages, data]);
      })
      .catch((error) => setError(error.message));
  };

  // PUT MESSAGE
  const startOrFinishEditing = (id) => {
    if (editingId === id) {
      finishEditingAndSaveChangesInServer();
    } else {
      startEditing(id);
    }
  };

  const startEditing = (id) => {
    setEditingId((previous) => (previous === id ? null : id));
    setTemporaryEditingContent(
      messages.find((message) => message.id === id).content
    );
  };

  const finishEditingAndSaveChangesInServer = () => {
    setEditingId(null);
    fetch(`${import.meta.env.VITE_MESSAGING_API}/messages/${editingId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: temporaryEditingContent }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(
            `Something is wrong with sending editing request ${res.status} ${res.statusText}`
          );
        }
        return res.json();
      })
      .then((updatedMessageFromBackend) => {
        setMessages(
          messages.map((message) =>
            message.id === editingId ? updatedMessageFromBackend : message
          )
        );
      })
      .catch((error) => setError(error));
  };

  // DELETE MESSAGE
  const handleDelete = (id) => {
    fetch(`${import.meta.env.VITE_MESSAGING_API}/messages/${id}`, {
      method: "DELETE",
    }).then((response) => {
      if (response.ok && response.status === 204) {
        setMessages(messages.filter((message) => message.id !== id));
      } else {
        setError(
          `Something went Wrong with deleting message ${response.status} ${response.statusText}`
        );
      }
    });
  };

  const determineJustifyMessage = (sender) => {
    const message = messages.find((message) => message.id === sender);
    return message && message.username === usernameInput
      ? "justify-end"
      : "justify-start";
  };

  const handleUsernameChange = (event) => {
    setUsernameInput(event.target.value);
  };

  const handleUsernameSubmit = (event) => {
    event.preventDefault();
    // Save the username to local storage
    localStorage.setItem("username", usernameInput);
  };

  return (
    <div className="w-full h-screen flex flex-col justify-between">
      <div className="fixed  top-0  w-full h-[20%] left-0 right-0 px-10  bg-red-500 ">
        <div className="h-full flex justify-between items-center text-center bg-green-400 ">
          {error && <h2>{error}</h2>}
          <h1 className=" w-full h-full bg-blue-300">
            editingId: {editingId ? editingId : "null"}
          </h1>
        </div>
      </div>
      <div className="top-[25%] bottom-[25%]   h-[50%] fixed inset-0 overflow-y-auto p-10">
        {messages
          .sort((a, b) => a.createdAt - b.createdAt)
          .map((message) => {
            return (
              <div key={message.id} className=" ">
                <div className=" bg-slate-500"> {message.username}: </div>
                {editingId === message.id ? (
                  <input
                    value={temporaryEditingContent}
                    onChange={(e) => setTemporaryEditingContent(e.target.value)}
                    name="content"
                    type="text"
                  />
                ) : (
                  <div
                    className={`flex ${determineJustifyMessage(
                      message.id
                    )} ml-4 text-left `}
                  >
                    <p className="bg-gray-200 px-4">{message.content}</p>
                  </div>
                )}
                <div className=" bg-orange-400">
                  <button onClick={() => handleDelete(message.id)}>🚮</button>
                  <button onClick={() => startOrFinishEditing(message.id)}>
                    🔧
                  </button>
                </div>
              </div>
            );
          })}
      </div>
      <div className="fixed  bottom-0  w-full  left-0 right-0 px-10  bg-red-500 ">
        <form
          className=" h-full flex justify-start items-center py-4 text-center bg-green-400"
          onSubmit={(e) => handleSubmit(e)}
        >
          <div className="flex flex-col pl-4  ">
            <label htmlFor="" className="w-full text-start">
              Your name
            </label>

            <input
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              placeholder="Enter Name"
              name="username"
              type="text"
              className="w-full p-2 bg-gray-300 rounded outline-2 border border-red-400 "
            />
          </div>
          <div className=" w-full flex flex-col px-4">
            <label htmlFor="" className="text-start">
              Type Message
            </label>

            <input
              value={contentInput}
              onChange={(e) => setContentInput(e.target.value)}
              name="content"
              type="text"
              placeholder="Please type your message here"
              className="p-2 bg-gray-300 rounded outline-2 border border-red-400 "
            />
          </div>

          <button
            type="submit"
            className=" px-4 py-2 bg-blue-400 rounded font-bold"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default MessagesLayout;
