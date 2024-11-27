import Header from "components/Headers/Header";
import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Input, Button } from "reactstrap";
import { 
  FaSearch, 
  FaPaperPlane, 
  FaArrowLeft, 
  FaSmile, 
  FaPaperclip, 
  FaCheck, 
  FaCheckDouble,
  FaMicrophone 
} from 'react-icons/fa';
import AttachmentOptions from './AttachmentOptions';

const WhatsAppChats = () => {
  const users = [
    { id: 1, name: "John Doe", phone: "+1234567890", avatar: "https://randomuser.me/api/portraits/men/1.jpg" },
    { id: 2, name: "Jane Smith", phone: "+0987654321", avatar: "https://randomuser.me/api/portraits/women/1.jpg" },
    { id: 3, name: "Mike Johnson", phone: "+1122334455", avatar: "https://randomuser.me/api/portraits/men/2.jpg" },
    { id: 1, name: "Hamza Mamji", phone: "+1234567890", avatar: "https://randomuser.me/api/portraits/men/1.jpg" },
    { id: 2, name: "Jane Smith", phone: "+0987654321", avatar: "https://randomuser.me/api/portraits/women/1.jpg" },
    { id: 3, name: "Mike Johnson", phone: "+1122334455", avatar: "https://randomuser.me/api/portraits/men/2.jpg" },
    { id: 1, name: "John Doe", phone: "+1234567890", avatar: "https://randomuser.me/api/portraits/men/1.jpg" },
    { id: 2, name: "Jane Smith", phone: "+0987654321", avatar: "https://randomuser.me/api/portraits/women/1.jpg" },
    { id: 3, name: "Mike Johnson", phone: "+1122334455", avatar: "https://randomuser.me/api/portraits/men/2.jpg" },
  ];

  const [selectedUser, setSelectedUser] = useState(users[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
  const [showUserList, setShowUserList] = useState(true);
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);


  

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
    scrollToBottom();
  }, [selectedUser, userChats]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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
      setIsTyping(false);
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
      case 'sent': return <FaCheck color="gray" size={10} />;
      case 'delivered': return <FaCheckDouble color="blue" size={10} />;
      case 'read': return <FaCheckDouble color="green" size={10} />;
      default: return null;
    }
  };

  const renderUserList = () => (
    <Col 
      xs="12" 
      md="4" 
      style={{ 
        backgroundColor: '#f7f7f7', 
        height: 'calc(100vh - 100px)', 
        display: isMobileView && !showUserList ? 'none' : 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        borderRight: '1px solid #e0e0e0'
      }}
    >
      <div className="mb-2 position-relative" style={{ padding: '10px', paddingBottom: 0 }}>
        <Input 
          type="text" 
          placeholder="Search users" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ 
            paddingLeft: '35px', 
            borderRadius: '20px', 
            backgroundColor: '#e9ecef',
            height: '35px'
          }}
        />
        <FaSearch 
          style={{ 
            position: 'absolute', 
            left: '20px', 
            top: '20px', 
            color: '#6c757d',
            fontSize: '14px' 
          }} 
        />
      </div>

      <div 
        style={{ 
          overflowY: 'auto', 
          flexGrow: 1,
          padding: '10px',
          paddingTop: 0 
        }}
      >
        {filteredUsers.map(user => (
          <div 
            key={user.id} 
            onClick={() => handleUserSelect(user)}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              padding: '8px', 
              borderRadius: '10px', 
              marginBottom: '8px',
              backgroundColor: selectedUser.id === user.id ? '#e9ecef' : 'transparent',
              cursor: 'pointer'
            }}
          >
            <img 
              src={user.avatar} 
              alt={user.name} 
              style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '50%', 
                marginRight: '10px' 
              }} 
            />
            <div>
              <h6 style={{ margin: 0, fontWeight: 'bold', fontSize: '14px' }}>{user.name}</h6>
              <small className="text-muted" style={{ fontSize: '12px' }}>{user.phone}</small>
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
        backgroundColor: '#ffffff',
        position: 'relative'
      }}
    >
      {isMobileView && (
        <div 
          onClick={() => setShowUserList(true)}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            padding: '10px', 
            backgroundColor: '#f7f7f7',
            borderBottom: '1px solid #e0e0e0'
          }}
        >
          <FaArrowLeft style={{ marginRight: '10px', fontSize: '16px' }} />
          <img 
            src={selectedUser.avatar} 
            alt={selectedUser.name} 
            style={{ 
              width: '35px', 
              height: '35px', 
              borderRadius: '50%', 
              marginRight: '10px' 
            }} 
          />
          <div>
            <h6 style={{ margin: 0, fontWeight: 'bold', fontSize: '14px' }}>{selectedUser.name}</h6>
            <small className="text-muted" style={{ fontSize: '12px' }}>Online</small>
          </div>
        </div>
      )}

      {!isMobileView && (
        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            padding: '10px', 
            backgroundColor: '#f7f7f7',
            borderBottom: '1px solid #e0e0e0'
          }}
        >
          <img 
            src={selectedUser.avatar} 
            alt={selectedUser.name} 
            style={{ 
              width: '35px', 
              height: '35px', 
              borderRadius: '50%', 
              marginRight: '10px' 
            }} 
          />
          <div>
            <h6 style={{ margin: 0, fontWeight: 'bold', fontSize: '14px' }}>{selectedUser.name}</h6>
            <small className="text-muted" style={{ fontSize: '12px' }}>Online</small>
          </div>
        </div>
      )}

      <div 
        style={{ 
          flexGrow: 1, 
          overflowY: 'auto', 
          padding: '10px', 
          backgroundColor: '#f5f5f5',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {filteredMessages.map(msg => (
          <div 
            key={msg.id}
            style={{ 
              display: 'flex', 
              justifyContent: msg.sender === 'me' ? 'flex-end' : 'flex-start',
              marginBottom: '8px' 
            }}
          >
            <div 
              style={{ 
                maxWidth: '70%', 
                backgroundColor: msg.sender === 'me' ? '#dcf8c6' : '#ffffff',
                padding: '6px 10px', 
                borderRadius: '12px',
                fontSize: '13px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
              }}
            >
              {msg.text}
              <div 
                style={{ 
                  fontSize: '9px', 
                  color: '#888', 
                  marginTop: '4px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'flex-end' 
                }}
              >
                {formatTime(msg.timestamp)}
                {msg.sender === 'me' && (
                  <span style={{ marginLeft: '4px' }}>
                    {renderMessageStatus(msg.status)}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div 
        style={{ 
          display: 'flex', 
          padding: '10px', 
          backgroundColor: '#f7f7f7',
          alignItems: 'center',
          position: 'relative'
        }}
      >
        <Button 
          color="link" 
          style={{ padding: '0 8px', color: '#6c757d' }}
        >
          <FaSmile size={16} />
        </Button>
        <Button 
          color="link" 
          style={{ padding: '0 8px', color: '#6c757d' }}
          onClick={() => setShowAttachmentOptions(!showAttachmentOptions)}
        >
          <FaPaperclip size={16} />
        </Button>
        
        <AttachmentOptions 
          isOpen={showAttachmentOptions} 
          onClose={() => setShowAttachmentOptions(false)} 
        />

        <Input 
          type="text" 
          placeholder="Type a message..." 
          value={message}
          onChange={handleMessageChange}
          onKeyPress={handleKeyPress}
          style={{ 
            borderRadius: '20px', 
            marginRight: '8px',
            marginLeft: '8px',
            height: '35px',
            fontSize: '13px'
          }}
        />
        <Button 
          color="primary" 
          onClick={handleSendMessage}
          style={{ 
            borderRadius: '50%', 
            padding: '8px 10px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          {isTyping ? (
            <FaPaperPlane size={16} />
          ) : (
            <FaMicrophone size={16} />
          )}
        </Button>
      </div>
    </Col>
    
  );

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header style={{ zIndex: "10", position: "relative", flexShrink: 0 }} />
      <Container fluid style={{ flexGrow: 1, overflow: 'hidden', padding: 0 }}>
        <Row noGutters style={{ height: '100%' }}>
          {renderUserList()}
          {renderChatWindow()}
        </Row>
      </Container>
    </div>
  );
};

export default WhatsAppChats;