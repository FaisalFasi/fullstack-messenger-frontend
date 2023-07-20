import React from "react";
import { useEffect, useState } from "react";

function App() {
  const [messages, setMessages] = useState([]);

  const [usernameInput, setUsernameInput] = useState("");
  const [contentInput, setContentInput] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [temporaryEditingContent, setTemporaryEditingContent] = useState(""); // TEMPORARY STATE FOR EDITING

  const [error, setError] = useState(null);

  useEffect(() => {
    setInterval(() => {
      fetch(`${import.meta.process.env.VITE_MESSAGING_API}/messages`, {
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
        .then((data) => setMessages(data))
        .catch((error) => setError(error.message));
    }, 1000);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const message = {
      content: contentInput,
      username: usernameInput,
    };

    fetch(`${import.meta.process.env.VITE_MESSAGING_API}/messages`, {
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
    fetch(
      `${import.meta.process.env.VITE_MESSAGING_API}/messages/${editingId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: temporaryEditingContent }),
      }
    )
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
    fetch(`${import.meta.process.env.VITE_MESSAGING_API}/messages/${id}`, {
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
  return (
    <>
      {error && <h2>{error}</h2>}
      <h1>editingId: {editingId ? editingId : "null"}</h1>
      {messages
        .sort((a, b) => a.created_at - b.created_at)
        .map((message) => {
          return (
            <div key={message.id}>
              {message.username}:{" "}
              {editingId === message.id ? (
                <input
                  value={temporaryEditingContent}
                  onChange={(e) => setTemporaryEditingContent(e.target.value)}
                  name="content"
                  type="text"
                />
              ) : (
                <div>{message.content}</div>
              )}
              <button onClick={() => handleDelete(message.id)}>🚮</button>
              <button onClick={() => startOrFinishEditing(message.id)}>
                🔧
              </button>
            </div>
          );
        })}

      <form onSubmit={(e) => handleSubmit(e)}>
        <input
          value={usernameInput}
          onChange={(e) => setUsernameInput(e.target.value)}
          name="username"
          type="text"
        />
        <input
          value={contentInput}
          onChange={(e) => setContentInput(e.target.value)}
          name="content"
          type="text"
        />
        <button type="submit">Submit</button>
      </form>
    </>
  );
}

export default App;
