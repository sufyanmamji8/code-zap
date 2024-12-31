import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const SocketIOTest = () => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    return () => {
      // Clean up the socket connection on component unmount
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);

  const connectToServer = () => {
    if (!socket || !socket.connected) {
      const newSocket = io('http://localhost:25483', {
        transports: ['websocket'],
      });

      newSocket.on('connect', () => {
        setIsConnected(true);
        setMessages((prevMessages) => [...prevMessages, 'Connected to server!']);
      });

      newSocket.on('connect_error', (error) => {
        setMessages((prevMessages) => [...prevMessages, `Connection error: ${error.message}`]);
      });

      newSocket.on('response', (data) => {
        setMessages((prevMessages) => [...prevMessages, `Server: ${data.message}`]);
      });

      newSocket.on('disconnect', () => {
        setIsConnected(false);
        setMessages((prevMessages) => [...prevMessages, 'Disconnected from server.']);
      });

      setSocket(newSocket);
    }
  };

  const disconnectFromServer = () => {
    if (socket && socket.connected) {
      socket.disconnect();
      setIsConnected(false);
    }
  };

  const sendMessage = () => {
    if (messageInput.trim() !== '' && socket && socket.connected) {
      socket.emit('message', { text: messageInput });
      setMessages((prevMessages) => [...prevMessages, `You: ${messageInput}`]);
      setMessageInput('');
    }
  };

  return (
    <div>
      <h1>Socket.IO Test Client</h1>

      {/* Connection Control */}
      <div>
        <button onClick={connectToServer} disabled={isConnected}>
          Connect
        </button>
        <button onClick={disconnectFromServer} disabled={!isConnected}>
          Disconnect
        </button>
      </div>

      {/* Messages Display */}
      <div id="messages">
        <h2>Messages</h2>
        <ul id="messageList">
          {messages.map((msg, index) => (
            <li key={index}>{msg}</li>
          ))}
        </ul>
      </div>

      {/* Message Input */}
      <div>
        <input
          type="text"
          id="messageInput"
          placeholder="Type a message"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
        />
        <button onClick={sendMessage} disabled={!isConnected}>
          Send Message
        </button>
      </div>
    </div>
  );
};

export default SocketIOTest;
