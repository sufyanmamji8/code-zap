import Header from "components/Headers/Header";
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Input, Button } from "reactstrap";
import { 
  FaSearch, 
  FaPaperPlane, 
  FaArrowLeft, 
  FaSmile, 
  FaPaperclip, 
  FaCheck, 
  FaCheckDouble 
} from 'react-icons/fa';

const WhatsAppChats = () => {
  const users = [
    { id: 1, name: "John Doe", phone: "+1234567890", avatar: "https://randomuser.me/api/portraits/men/1.jpg" },
    { id: 2, name: "Jane Smith", phone: "+0987654321", avatar: "https://randomuser.me/api/portraits/women/1.jpg" },
    { id: 3, name: "Mike Johnson", phone: "+1122334455", avatar: "https://randomuser.me/api/portraits/men/2.jpg" }
  ];

  const [selectedUser, setSelectedUser] = useState(users[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
  const [showUserList, setShowUserList] = useState(true);
  const [userChats, setUserChats] = useState({
    1: [
      { id: 1, sender: 'other', text: "Hello John, how are you?", timestamp: new Date(), status: 'read' },
      { id: 2, sender: 'me', text: "I'm good, thanks!", timestamp: new Date(), status: 'read' }
    ],
    2: [
      { id: 1, sender: 'other', text: "Hey Jane, what's up?", timestamp: new Date(), status: 'read' },
      { id: 2, sender: 'me', text: "Not much, working on a project", timestamp: new Date(), status: 'delivered' }
    ],
    3: [
      { id: 1, sender: 'other', text: "Hi Mike, need any help?", timestamp: new Date(), status: 'read' },
      { id: 2, sender: 'me', text: "Just checking in", timestamp: new Date(), status: 'sent' }
    ]
  });

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
    if (isMobileView) {
      setShowUserList(false);
    }
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = { 
        id: userChats[selectedUser.id].length + 1, 
        sender: 'me', 
        text: message,
        timestamp: new Date(),
        status: 'sent'
      };
      
      setUserChats(prev => ({
        ...prev,
        [selectedUser.id]: [...prev[selectedUser.id], newMessage]
      }));
      
      setMessage("");
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMessages = userChats[selectedUser.id].filter((msg) =>
    msg.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessageStatus = (status) => {
    switch(status) {
      case 'sent': return <FaCheck color="gray" />;
      case 'delivered': return <FaCheckDouble color="blue" />;
      case 'read': return <FaCheckDouble color="green" />;
      default: return null;
    }
  };

  const renderUserList = () => (
    <Col 
      xs="12" 
      md="4" 
      style={{ 
        backgroundColor: '#f7f7f7', 
        height: '100vh', 
        overflowY: 'auto', 
        display: isMobileView && !showUserList ? 'none' : 'block',
        padding: '15px'
      }}
    >
      <div className="mb-3 position-relative">
        <Input 
          type="text" 
          placeholder="Search users or messages..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ 
            paddingLeft: '40px', 
            borderRadius: '20px', 
            backgroundColor: '#e9ecef'
          }}
        />
        <FaSearch 
          style={{ 
            position: 'absolute', 
            left: '15px', 
            top: '12px', 
            color: '#6c757d' 
          }} 
        />
      </div>

      {filteredUsers.map(user => (
        <div 
          key={user.id} 
          onClick={() => handleUserSelect(user)}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            padding: '10px', 
            borderRadius: '10px', 
            marginBottom: '10px',
            backgroundColor: selectedUser.id === user.id ? '#e9ecef' : 'transparent',
            cursor: 'pointer'
          }}
        >
          <img 
            src={user.avatar} 
            alt={user.name} 
            style={{ 
              width: '50px', 
              height: '50px', 
              borderRadius: '50%', 
              marginRight: '15px' 
            }} 
          />
          <div>
            <h6 style={{ margin: 0, fontWeight: 'bold' }}>{user.name}</h6>
            <small className="text-muted">{user.phone}</small>
          </div>
        </div>
      ))}
    </Col>
  );

  const renderChatWindow = () => (
    <Col 
      xs="12" 
      md="8" 
      style={{ 
        height: '100vh', 
        display: isMobileView && showUserList ? 'none' : 'flex', 
        flexDirection: 'column', 
        backgroundColor: '#ffffff'
      }}
    >
      {/* User Header */}
      {isMobileView && (
        <div 
          onClick={() => setShowUserList(true)}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            padding: '15px', 
            backgroundColor: '#f7f7f7',
            borderBottom: '1px solid #e0e0e0'
          }}
        >
          <FaArrowLeft style={{ marginRight: '15px' }} />
          <img 
            src={selectedUser.avatar} 
            alt={selectedUser.name} 
            style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%', 
              marginRight: '15px' 
            }} 
          />
          <div>
            <h6 style={{ margin: 0, fontWeight: 'bold' }}>{selectedUser.name}</h6>
            <small className="text-muted">Online</small>
          </div>
        </div>
      )}

      {/* Messages Container */}
      <div 
        style={{ 
          flexGrow: 1, 
          overflowY: 'auto', 
          padding: '15px', 
          backgroundColor: '#f5f5f5' 
        }}
      >
        {filteredMessages.map(msg => (
          <div 
            key={msg.id}
            style={{ 
              display: 'flex', 
              justifyContent: msg.sender === 'me' ? 'flex-end' : 'flex-start',
              marginBottom: '10px' 
            }}
          >
            <div 
              style={{ 
                maxWidth: '70%', 
                backgroundColor: msg.sender === 'me' ? '#dcf8c6' : '#ffffff',
                padding: '10px 15px', 
                borderRadius: '15px',
                position: 'relative'
              }}
            >
              {msg.text}
              <div 
                style={{ 
                  fontSize: '10px', 
                  color: '#888', 
                  marginTop: '5px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'flex-end' 
                }}
              >
                {formatTime(msg.timestamp)}
                {msg.sender === 'me' && (
                  <span style={{ marginLeft: '5px' }}>
                    {renderMessageStatus(msg.status)}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div 
        style={{ 
          display: 'flex', 
          padding: '15px', 
          backgroundColor: '#f7f7f7',
          alignItems: 'center'
        }}
      >
        <Button 
          color="link" 
          style={{ padding: '0 10px', color: '#6c757d' }}
        >
          <FaSmile size={20} />
        </Button>
        <Button 
          color="link" 
          style={{ padding: '0 10px', color: '#6c757d' }}
        >
          <FaPaperclip size={20} />
        </Button>
        <Input 
          type="text" 
          placeholder="Type a message..." 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ 
            borderRadius: '20px', 
            marginRight: '10px',
            marginLeft: '10px'
          }}
        />
        <Button 
          color="primary" 
          onClick={handleSendMessage}
          style={{ borderRadius: '50%', padding: '10px 12px' }}
        >
          <FaPaperPlane />
        </Button>
      </div>
    </Col>
  );

  return (
    <>
      <Header style={{ zIndex: "10", position: "relative" }} />
      <Container fluid className="p-0">
        <Row noGutters>
          {renderUserList()}
          {renderChatWindow()}
        </Row>
      </Container>
    </>
  );
};

export default WhatsAppChats;