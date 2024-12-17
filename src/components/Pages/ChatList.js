// src/components/ChatList.js
import React from "react";

function ChatList({ chats }) {
  return (
    <div>
      {chats.length === 0 ? (
        <p>No chats available</p>
      ) : (
        <ul>
          {chats.map((chat) => (
            <li key={chat.id}>{chat.contactNumber}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ChatList;
