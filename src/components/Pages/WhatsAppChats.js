 import Header from "components/Headers/Header";
import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Input, Button } from "reactstrap";
import { 
  FaSearch, 
  FaPaperPlane, 
  FaArrowLeft, 
  FaSmile, 
  FaPaperclip, 
} from 'react-icons/fa';
import axios from "axios";
import Avatar from 'react-avatar';

const API_URL = 'http://192.168.0.106:4000/api/v1/webHooks/getMessages'; // Your API for messages
const GET_MESSAGES_BY_USER_API = 'http://192.168.0.106:4000/api/v1/webHooks/getMessagesByUser';
const GET_RECENT_MESSAGE_API = "http://192.168.0.106:4000/api/v1/webHooks/recentMessages";
const SEND_MESSAGE_API = 'http://192.168.0.106:4000/api/v1/messages/send';
 const GET_MESSAGES_BY_CONTACT_API ='http://192.168.0.106:4000/api/v1/messages/getMessagesByContact';


const WhatsAppChats = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContact, setSelectedContact] = useState(null); // Newly added state for selected contact
  const [selectedContactMessages, setSelectedContactMessages] = useState([]); 
  const [message, setMessage] = useState("");
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
  const [showUserList, setShowUserList] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [userChats, setUserChats] = useState([]); // All users and their messages
  const [selectedUserMessages, setSelectedUserMessages] = useState([]); // Messages of selected user
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);

  // Fetch all users and their messages on component load
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(API_URL); // Fetch all messages
        if (response.data.success) {
          setUserChats(response.data.messages); // Set all users and their messages to state
          setLoading(false);
        } else {
          console.error("Error fetching messages:", response.data.message);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching data from backend:', error);
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  // Fetch messages when a contact is selected
  useEffect(() => {
    if (selectedContact) {
      console.log("Fetching messages for contact:", selectedContact);
      const fetchMessagesByContact = async () => {
        try {
          const response = await axios.get(GET_MESSAGES_BY_CONTACT_API, {
            params: {
              contactNumber: selectedContact, // Selected contact number
            },
          });
  
          if (response.data.success) {
            setSelectedContactMessages(response.data.messages);
            console.log(response.data.messages) // Store messages in state
          } else {
            console.error("Error fetching messages");
          }
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      };
  
      fetchMessagesByContact();
    }
  }, [selectedContact]); // Trigger this useEffect when selectedContact changes
   // Only trigger this when the selected contact changes


  // Fetch messages for the selected user
  useEffect(() => {
    if (selectedUser) {
      const fetchMessagesForUser = async () => {
        try {
          const response = await axios.get(GET_MESSAGES_BY_USER_API, {
            params: {
              senderWaId: selectedUser.senderWaId // Pass the senderWaId as query param
            }
          });
          if (response.data.success) {
            setSelectedUserMessages(response.data.messages); // Set messages of the selected user
          } else {
            console.error("Error fetching messages for selected user:", response.data.message);
          }
        } catch (error) {
          console.error('Error fetching messages for selected user:', error);
        }
      };

      fetchMessagesForUser();
    }
  }, [selectedUser]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobileView(mobile);
      if (mobile) {
        setShowUserList(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    // setSelectedContact(user.senderWaId);
    if (isMobileView) {
      setShowUserList(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (message.trim() && selectedUser) {
      const newMessage = {
        to: selectedUser.senderWaId, // ID of the user you're chatting with
        body: message, // The message text
      };
  
      try {
        const response = await axios.post(SEND_MESSAGE_API, newMessage, {
          headers: {
            Authorization: 'Bearer EAAGKLL1270UBO8Xr3L8WqH8hTKHpCuI36k75kfqNlCAmaZAhYgJj8wtYLykxh761zgaPOwTYTyIZAacEcwEXy2b6zvdCYixixOXRvwnZBEEhQ2ZBOif7e7uwgvMwPXiC4b9WK7UMAIrVKf2mbElJIYN4xfnduyfZA2cN0aYsYhL5lA7WMb8CtSV7ZCB1sHp5hO1QZDZD', 
            'Content-Type': 'application/json',
          },
        });
  
        if (response.data.success) {
          const updatedMessage = {
            id: Date.now(),
            sender: 'me',
            messageBody: message,
            timestamp: Date.now() / 1000,
          };
  
          // Update the message history
          setSelectedUserMessages((prevMessages) => [...prevMessages, updatedMessage]);
          setSelectedContactMessages((prevMessages) => [...prevMessages, updatedMessage]);
  
          setMessage(""); // Clear the message input
          setIsTyping(false);
          scrollToBottom(); // Scroll to the bottom of the chat window
        } else {
          console.error("Error response from API:", response.data);
          alert("Failed to send message. Please try again.");
        }
      } catch (error) {
        console.error("Axios error details:", error);
        alert("An error occurred while sending the message. Please try again.");
      }
    }
  };
  
  

  useEffect(() => {
    const fetchRecentMessages = async () => {
      try {
        const updatedUsers = await Promise.all(
          userChats.map(async (user) => {
            try {
              const response = await axios.get(GET_RECENT_MESSAGE_API, {
                params: { senderWaId: user.senderWaId },
              });
  
              // Attach the recent message to the user
              return {
                ...user,
                recentMessage: response.data.success
                  ? response.data.data?.messageBody || "No messages yet"
                  : "Error fetching message",
              };
            } catch (err) {
              console.error(`Error fetching recent message for ${user.senderWaId}:`, err);
              return { ...user, recentMessage: "Error fetching message" };
            }
          })
        );
  
        setUserChats(updatedUsers); // Update state
      } catch (error) {
        console.error("Error in fetching recent messages:", error);
      }
    };
  
    if (userChats.length > 0) fetchRecentMessages(); // Trigger only when users are loaded
  }, [userChats]);
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleMessageChange = (e) => {
    const inputValue = e.target.value;
    setMessage(inputValue);
    setIsTyping(inputValue.trim().length > 0);
  };

  const filteredUsers = userChats.filter(user => 
    user.senderName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const uniqueUsers = Array.from(
    new Map(filteredUsers.map(user => [user.senderWaId, user])).values()
  );

  // Display messages for the selected user
  const filteredMessages = selectedUserMessages.filter((msg) =>
    msg.messageBody.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000); // Convert from Unix timestamp (seconds)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Render User List
const renderUserList = () => (
  <Col
    xs="12"
    md="4"
    style={{
      backgroundColor: '#f0f4f8',
      height: 'calc(100vh - 100px)',
      display: isMobileView && !showUserList ? 'none' : 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      borderRight: '1px solid #e0e0e0',
      padding: '10px',
    }}
  >
    <div
      style={{
        overflowY: 'auto',
        flexGrow: 1,
      }}
    >
      {/* Ensure only unique users are shown */}
      {uniqueUsers.map(user => (
        <div
          key={user.senderWaId}
          onClick={() => handleUserSelect(user)}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '10px',
            borderRadius: '10px',
            marginBottom: '10px',
            backgroundColor: selectedUser?.senderWaId === user.senderWaId ? '#E0F7FA' : 'transparent',
            color: selectedUser?.senderWaId === user.senderWaId ? '#00796B' : '#000',
            cursor: 'pointer',
            boxShadow: selectedUser?.senderWaId === user.senderWaId ? '0 4px 8px rgba(0, 120, 212, 0.2)' : 'none',
            transition: 'background-color 0.3s ease',
          }}
        >
          <Avatar
            name={user.senderName}
            size="40"
            round={true}
            style={{ marginRight: '10px' }}
          />
          <div>
            <h6
              style={{
                margin: 0,
                fontWeight: 'bold',
                fontSize: '14px',
                color: selectedUser?.senderWaId === user.senderWaId ? '#00796B' : '#000',
              }}
            >
              {user.senderName}
            </h6>
            {/* Recent Message Display */}
            <small className="text-muted" style={{ fontSize: '12px' }}>
              {user.recentMessage || 'No messages yet'}
            </small>
          </div>
        </div>
      ))}
    </div>
  </Col>
);


  const renderChatWindow = () => (
    <Col 
      xs="12" 
      md="8" 
      style={{ 
        height: 'calc(100vh - 100px)', 
        display: isMobileView && showUserList ? 'none' : 'flex', 
        flexDirection: 'column', 
        justifyContent: 'flex-end', 
        overflow: 'hidden',
        backgroundColor: selectedUser ? '#f4f8fb' : '#fff', // White background
      }}
    >
      <div 
        style={{ 
          padding: '15px', 
          backgroundColor: selectedUser ? '#00796B' : '#f0f4f8', // Header color based on selected user
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderRadius: '10px 10px 0 0',
        }}
      >
        {/* Title with selected user name */}
        {selectedUser ? (
          <h5 style={{ margin: 0, display: 'flex', alignItems: 'center', color: '#fff' }}>
            <Avatar name={selectedUser.senderName} size="30" round={true} style={{ marginRight: '10px' }} />
            {selectedUser.senderName}
          </h5>
        ) : (
          <h5 style={{ margin: 0, color: '#ddd' }}>Select a user</h5>
        )}
        <Button onClick={() => setShowUserList(true)} style={{ backgroundColor: 'transparent', border: 'none', color: '#fff' }}>
          <FaArrowLeft />
        </Button>
      </div>

      <div style={{ flexGrow: 1, padding: '20px', overflowY: 'auto', marginTop: '20px' }}>
  {/* Display messages */}
  {(selectedContactMessages.length > 0 ? selectedContactMessages : selectedUserMessages).map((message, index) => (
    <div 
      key={index}
      style={{
        display: 'flex',
        justifyContent: message.sender === 'me' ? 'flex-end' : 'flex-start',
        marginBottom: '10px',
      }}
    >
      <div 
        style={{
          maxWidth: '70%',
          padding: '10px',
          backgroundColor: message.sender === 'me' ? '#00796B' : '#e9ecef',
          borderRadius: '10px',
          color: message.sender === 'me' ? '#fff' : '#000',
          fontSize: '14px'
        }}
      >
        {message.messageBody}
        <div 
          style={{
            display: 'flex',
            justifyContent: message.sender === 'me' ? 'flex-end' : 'flex-start',
            fontSize: '12px',
            color: '#6c757d'
          }}
        >
          <span>{formatTime(message.timestamp)}</span>
        </div>
      </div>
    </div>
  ))}
  <div ref={messagesEndRef} />
</div>


      <div style={{ padding: '10px', borderTop: '1px solid #e0e0e0' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button
            style={{ background: '#f1f1f1', border: 'none', marginRight: '10px' }}
            onClick={() => setShowAttachmentOptions(!showAttachmentOptions)}
          >
            <FaPaperclip />
          </Button>

          <Input
            type="text"
            value={message}
            onChange={handleMessageChange}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            style={{
              borderRadius: '20px',
              height: '40px',
              fontSize: '14px',
              paddingLeft: '15px',
              flexGrow: 1,
              marginRight: '10px'
            }}
          />

          <Button 
            style={{
              backgroundColor: '#00796B', 
              borderRadius: '50%', 
              padding: '10px', 
              border: 'none'
            }}
            onClick={handleSendMessage}
          >
            <FaPaperPlane color="#fff" />
          </Button>
        </div>
      </div>
    </Col>
  );

  return (
    <div>
      <Header />
      <Container fluid style={{ marginTop: '20px' }}>
        <Row>
          {renderUserList()}
          {renderChatWindow()}
        </Row>
      </Container>
    </div>

  );
};

export default WhatsAppChats;