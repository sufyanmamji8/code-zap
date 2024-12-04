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

const API_URL = 'http://192.168.0.106:4000/api/v1/webHooks/getMessages';
const GET_MESSAGES_BY_USER_API = 'http://192.168.0.106:4000/api/v1/webHooks/getMessagesByUser';
const GET_RECENT_MESSAGE_API = "http://192.168.0.106:4000/api/v1/webHooks/recentMessages";
const SEND_MESSAGE_API = 'http://192.168.0.106:4000/api/v1/messages/send';
const GET_MESSAGES_BY_CONTACT_API = "http://192.168.0.106:4000/api/v1/messages/getMessagesByContact";

const WhatsAppChats = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);
  const [selectedContactMessages, setSelectedContactMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
  const [showUserList, setShowUserList] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [userChats, setUserChats] = useState([]);
  const [selectedUserMessages, setSelectedUserMessages] = useState([]);
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(API_URL);
        if (response.data.success) {
          setUserChats(response.data.messages);
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

  useEffect(() => {
    const fetchMessagesForUser = async () => {
      if (selectedUser) {
        try {
          const response = await axios.get(GET_MESSAGES_BY_USER_API, {
            params: {
              senderWaId: selectedUser.senderWaId
            }
          });
          if (response.data.success) {
            setSelectedUserMessages(response.data.messages);
          }
        } catch (error) {
          console.error('Error fetching messages for selected user:', error);
        }
      }
    };

    fetchMessagesForUser();
  }, [selectedUser]);

  useEffect(() => {
    const fetchRecentMessages = async () => {
      try {
        const updatedUsers = await Promise.all(
          userChats.map(async (user) => {
            // Check if recent messages have already been fetched
            if (user.recentMessageFetched) {
              return user; // Skip fetching if already fetched
            }
  
            try {
              const response = await axios.get(GET_RECENT_MESSAGE_API, {
                params: { senderWaId: user.senderWaId },
              });
  
              return {
                ...user,
                recentMessage: response.data.success
                  ? response.data.data?.messageBody || "No messages yet"
                  : "Error fetching message",
                recentMessageFetched: true, // Mark recent message as fetched
              };
            } catch (err) {
              console.error(`Error fetching recent message for ${user.senderWaId}:`, err);
              return { ...user, recentMessage: "Error fetching message", recentMessageFetched: true };
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

  const fetchMessagesForContact = async () => {
    try {
      if (selectedContact && selectedUser) {
        const contactNumber = selectedUser.contactNumber || selectedUser.senderWaId;
        if (!contactNumber) {
          console.error("Contact number is missing.");
          return;
        }

        const response = await axios.get(GET_MESSAGES_BY_CONTACT_API, {
          params: { contactNumber }
        });

        if (response.data.success) {
          const messages = response.data.data;
          setSelectedContactMessages(messages);
        } else {
          console.error("API Error:", response.data.message);
          setSelectedContactMessages([]);
        }
      }
    } catch (error) {
      console.error("Error fetching messages for contact:", error);
      setSelectedContactMessages([]);
    }
  };

  useEffect(() => {
    fetchMessagesForContact();
  }, [selectedContact]);

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
    setSelectedContact(user.contactNumber || user.senderWaId);
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
        to: selectedUser.senderWaId,
        body: message,
      };

      try {
        const response = await axios.post(SEND_MESSAGE_API, newMessage);
        if (response.data.success) {
          const sentMessage = {
            messageBody: message,
            timestamp: Math.floor(Date.now() / 1000),
            from: 'me'
          };
          
          setSelectedContactMessages(prev => [...prev, sentMessage]);
          setMessage('');
          scrollToBottom();
          
          // Refresh messages after sending
          fetchMessagesForContact();
        }
      } catch (error) {
        console.error('Error while sending message:', error);
        alert('Failed to send message.');
      }
    }
  };

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

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

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
      <div style={{ overflowY: 'auto', flexGrow: 1 }}>
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
              <h6 style={{
                margin: 0,
                fontWeight: 'bold',
                fontSize: '14px',
                color: selectedUser?.senderWaId === user.senderWaId ? '#00796B' : '#000',
              }}>
                {user.senderName}
              </h6>
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
        flexDirection: 'column', // Normal column order (top to bottom)
        overflow: 'hidden',
        backgroundColor: selectedUser ? '#f4f8fb' : '#fff',
      }}
    >
      <div style={{ 
        padding: '15px', 
        backgroundColor: selectedUser ? '#00796B' : '#f0f4f8',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: '10px 10px 0 0',
      }}>
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
  
      <div style={{ 
  flexGrow: 1, 
  padding: '20px', 
  overflowY: 'auto',
  marginTop: '20px',
  display: 'flex', 
  flexDirection: 'column', // Normal column order (top to bottom)
}}>


  {selectedUserMessages.concat(selectedContactMessages).sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0)).map((message, index) => {
    const isSentMessage = message.from === 'me' || message.to === selectedUser?.senderWaId;
    return (
      <div
        key={index}
        style={{
          display: 'flex',
          flexDirection: 'column', 
          alignItems: isSentMessage ? 'flex-start' : 'flex-end', // Sent messages on the left, received on the right
          marginBottom: '10px',
        }}
      >
        <div
          style={{
            maxWidth: '70%',
            padding: '10px',
            backgroundColor: isSentMessage ? '#00796B' : '#e9ecef',
            borderRadius: '10px',
            color: isSentMessage ? '#fff' : '#000',
            fontSize: '14px',
            marginLeft: isSentMessage ? 'auto' : '0', // Sent messages left
            marginRight: isSentMessage ? '0' : 'auto', // Received messages right
          }}
        >
          {message.messageBody}
          <div
            style={{
              fontSize: '12px',
              color: isSentMessage ? '#e0e0e0' : '#6c757d',
              textAlign: isSentMessage ? 'left' : 'right', // Time on the left for sent, right for received
            }}
          >
            {formatTime(message.timestamp || message.sentTimestamp)}
          </div>
        </div>
      </div>
    );
  })}
  
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