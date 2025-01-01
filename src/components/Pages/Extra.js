import React, { useState, useEffect, useRef } from "react";
import { FaArrowLeft, FaPaperclip, FaPaperPlane, FaCheck, FaCheckDouble, FaClock, FaExclamationTriangle, FaBuilding, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import { Button, Col, Container, Input, Row, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import axios from "axios";
import io from "socket.io-client";
import Header from "components/Headers/Header";
import { useLocation } from 'react-router-dom';

const countryList = [
  { code: '92', country: 'Pakistan', flag: '🇵🇰' },
  { code: '91', country: 'India', flag: '🇮🇳' },
  { code: '971', country: 'UAE', flag: '🇦🇪' },
  { code: '1', country: 'USA', flag: '🇺🇸' },
  { code: '44', country: 'UK', flag: '🇬🇧' },
  { code: '966', country: 'Saudi Arabia', flag: '🇸🇦' },
];

const WhatsAppChats = () => {
  const location = useLocation();
  const { config, companyId } = location.state || {};

  const businessId = config?.whatsappBusinessAccountId;
  
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [contacts, setContacts] = useState(() => {
    const savedContacts = localStorage.getItem('whatsappContacts');
    return savedContacts ? JSON.parse(savedContacts) : [];
  });
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isNewChatModal, setIsNewChatModal] = useState(false);
  
  const [selectedCountry, setSelectedCountry] = useState(countryList[0]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const chatEndRef = useRef(null);
  const isMobileView = window.innerWidth <= 768;
  const token = localStorage.getItem('token');
  

  useEffect(() => {
    if (!businessId) {
      console.error("Business ID not found in config");
      return;
    }
    fetchInitialMessages();
  }, [businessId]);
  
  useEffect(() => {
    if (!businessId) return;

    const newSocket = io("http://192.168.0.109:25483", {
      transports: ["websocket"],
      withCredentials: true,
    });
  
    newSocket.on("connect", () => {
      console.log("Connected to socket server");
      newSocket.emit('join_room', `business_${businessId}`);
    });
  
    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });
  
    setSocket(newSocket);
  
    return () => {
      if (newSocket) newSocket.disconnect();
    };
  }, [businessId]);
  
  useEffect(() => {
    if (!socket || !businessId) return;
  
    socket.on(`onmessagerecv-${businessId}`, (data) => {
      console.log(`Message from server:${businessId}`, data);
      fetchInitialMessages();
    });
  
    return () => {
      socket.off(`onmessagerecv-${businessId}`);
    };
  }, [socket, businessId]);
  
  const fetchInitialMessages = async () => {
    if (!businessId) return;

    try {
      setLoading(false);
      const response = await axios.post(
        'http://192.168.0.109:25483/api/v1/messages/getMessages',
        {
          businessId: businessId,
          lastTimestamp: null
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
  
      if (response.data.success) {
        const allMessages = response.data.data;
        setMessages(allMessages);
        
        const uniqueContacts = new Map();
        
        allMessages.forEach(msg => {
          if (!msg || !msg.from || !msg.to) return;
          
          const phoneNumber = msg.from === config.phoneNumber ? msg.to : msg.from;
          if (!phoneNumber) return;
          
          const country = countryList.find(c => 
            phoneNumber && c && c.code && phoneNumber.startsWith(c.code)
          );
          
          uniqueContacts.set(phoneNumber, {
            phoneNumber,
            lastMessage: msg.messageBody || "",
            timestamp: msg.currentStatusTimestamp || (Date.now() / 1000).toString(),
            flag: (country?.flag) || '🌐'
          });
        });
  
        const contactsArray = Array.from(uniqueContacts.values());
        setContacts(contactsArray);
        localStorage.setItem('whatsappContacts', JSON.stringify(contactsArray));
  
        setTimeout(() => {
          scrollToBottom();
        }, 100);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };
  const MessageStatusIcon = ({ status }) => {
    const getIconStyle = (status) => ({
      transition: 'all 0.3s ease',
      animation: status === 'sending' ? 'spin 1s linear infinite' : 'none',
    });

    switch(status?.toLowerCase()) {
      case 'sent':
        return <FaCheck size={12} color="#667781" style={getIconStyle(status)} />;
      case 'delivered':
        return <FaCheckDouble size={12} color="#667781" style={getIconStyle(status)} />;
      case 'read':
        return <FaCheckDouble size={12} color="#53bdeb" style={getIconStyle(status)} />;
      case 'failed':
        return <FaExclamationTriangle size={12} color="#ef5350" style={getIconStyle(status)} />;
      case 'sending':
        return <FaClock size={12} color="#667781" style={getIconStyle(status)} />;
      default:
        return <FaCheck size={12} color="#667781" style={getIconStyle('sent')} />;
    }
  };

  const updateContactsWithMessages = (newMessages) => {
    const updatedContacts = [...contacts];
    const messagesByUser = new Map();

    newMessages.forEach(msg => {
      const userNumber = msg.from === "923030307660" ? msg.to : msg.from;
      if (!messagesByUser.has(userNumber) || 
          parseInt(msg.currentStatusTimestamp) > parseInt(messagesByUser.get(userNumber).currentStatusTimestamp)) {
        messagesByUser.set(userNumber, msg);
      }
    });

    messagesByUser.forEach((latestMsg, userNumber) => {
      const contactIndex = updatedContacts.findIndex(c => c.phoneNumber === userNumber);
      if (contactIndex !== -1) {
        updatedContacts[contactIndex] = {
          ...updatedContacts[contactIndex],
          lastMessage: latestMsg.messageBody,
          timestamp: latestMsg.currentStatusTimestamp
        };
      }
    });

    setContacts(updatedContacts);
  };

  const startNewChat = () => {
    const fullNumber = selectedCountry.code + phoneNumber;
    const existingContact = contacts.find(c => c.phoneNumber === fullNumber);
    
    if (!existingContact) {
      const newUser = {
        phoneNumber: fullNumber,
        lastMessage: "",
        timestamp: (Date.now() / 1000).toString(),
        flag: selectedCountry.flag
      };
      setContacts(prev => [...prev, newUser]);
      setSelectedUser(newUser);
    } else {
      setSelectedUser(existingContact);
    }
    
    setPhoneNumber("");
    setIsNewChatModal(false);
  };

    

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUser || !config?.phoneNumber || !companyId) return;
  
    const tempId = Date.now().toString();
    const tempMessage = {
      messageId: tempId,
      businessId: businessId, // Keeping this as businessId for message object
      from: config.phoneNumber,
      to: selectedUser.phoneNumber,
      messageBody: newMessage,
      type: "text",
      status: "sending",
      currentStatusTimestamp: (Date.now() / 1000).toString(),
      sentTimestamp: (Date.now() / 1000).toString()
    }
  
    setMessages(prev => [...prev, tempMessage]);
    
    const existingContact = contacts.find(c => c.phoneNumber === selectedUser.phoneNumber);
    if (!existingContact) {
      const country = countryList.find(c => selectedUser.phoneNumber.startsWith(c.code));
      const newContact = {
        phoneNumber: selectedUser.phoneNumber,
        lastMessage: newMessage,
        timestamp: tempMessage.currentStatusTimestamp,
        flag: country?.flag || '🌐'
      };
      setContacts(prev => [...prev, newContact]);
    }
  
    setNewMessage("");
  
    setTimeout(() => {
      scrollToBottom();
    }, 100);
  
    try {
      const response = await axios.post(
        'http://192.168.0.109:25483/api/v1/messages/send',
        {
          to: selectedUser.phoneNumber,
          body: newMessage,
          companyId: companyId
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
  
      if (response.data.success && response.data.data.messages) {
        const actualMessageId = response.data.data.messages[0].id;
        setMessages(prev => prev.map(msg =>
          msg.messageId === tempId
            ? { ...msg, messageId: actualMessageId, status: 'sent' }
            : msg
        ));
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => prev.map(msg =>
        msg.messageId === tempId
          ? { ...msg, status: "failed", failureReason: error.response?.data?.message || "Failed to send message" }
          : msg
      ));
    }
  };

  useEffect(() => {
    if (selectedUser) {
      scrollToBottom();
    }
  }, [messages]);

  const scrollToBottom = () => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  };

const uniqueUsers = React.useMemo(() => {
  const users = new Map();
  
  contacts.forEach(contact => {
    if (contact && contact.phoneNumber) {
      users.set(contact.phoneNumber, contact);
    }
  });
  
  messages.forEach(msg => {
    if (!msg) return;
    
    const number = msg.from === "923030307660" ? msg.to : msg.from;
    if (!number) return;
    
    if (!users.has(number)) {
      const country = countryList.find(c => 
        c && c.code && number.startsWith(c.code)
      );
      
      const newContact = {
        phoneNumber: number,
        lastMessage: msg.messageBody || "",
        timestamp: msg.currentStatusTimestamp || (Date.now() / 1000).toString(),
        flag: (country?.flag) || '🌐'
      };
      
      users.set(number, newContact);
      
      if (!contacts.some(c => c?.phoneNumber === number)) {
        setContacts(prev => [...prev, newContact]);
      }
    }
  });
  
  return Array.from(users.values())
    .filter(user => user && user.phoneNumber && user.timestamp) 
    .sort((a, b) => {
      const timestampA = parseInt(a.timestamp) || 0;
      const timestampB = parseInt(b.timestamp) || 0;
      return timestampB - timestampA;
    });
}, [messages, contacts]);

const filteredUsers = React.useMemo(() => {
  return uniqueUsers.filter(user =>
    user.phoneNumber && searchTerm 
      ? user.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase())
      : true
  );
}, [uniqueUsers, searchTerm]);

  const renderNewChatModal = () => (
    <Modal isOpen={isNewChatModal} toggle={() => setIsNewChatModal(false)}>
      <ModalHeader toggle={() => setIsNewChatModal(false)}>New Chat</ModalHeader>
      <ModalBody>
        <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
          <select
            value={selectedCountry.code}
            onChange={(e) => {
              const country = countryList.find(c => c.code === e.target.value);
              setSelectedCountry(country);
            }}
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ddd",
              width: "120px"
            }}
          >
            {countryList.map(country => (
              <option key={country.code} value={country.code}>
                {country.flag} +{country.code}
              </option>
            ))}
          </select>
          
          <Input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
            placeholder="Phone number"
            style={{ flex: 1 }}
          />
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={() => setIsNewChatModal(false)}>
          Cancel
        </Button>
        <Button
          color="primary"
          onClick={startNewChat}
          disabled={!phoneNumber.length}
          style={{ backgroundColor: "#00a884", border: "none" }}
        >
          Start Chat
        </Button>
      </ModalFooter>
    </Modal>
  );

  const renderUserList = () => (
    <Col
      xs="12"
      md="4"
      style={{
        backgroundColor: "#f0f4f8",
        height: "calc(100vh - 100px)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        borderRight: "1px solid #e0e0e0",
        padding: "10px",
      }}
    >
      <div style={{ 
        padding: "10px 0",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "10px"
      }}>
        <Button
          onClick={() => setIsNewChatModal(true)}
          style={{
            backgroundColor: "#00a884",
            border: "none",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            padding: "0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <i className="fas fa-plus" style={{ color: "#fff" }}></i>
        </Button>
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search users..."
          style={{
            borderRadius: "20px",
            backgroundColor: "#fff",
            border: "1px solid #e0e0e0",
            padding: "8px 15px",
            flex: 1,
          }}
        />
      </div>

      <div style={{ overflowY: "auto", flexGrow: 1 }}>
        {filteredUsers.map((user) => (
          <div
            key={user.phoneNumber}
            onClick={() => setSelectedUser(user)}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px",
              borderRadius: "10px",
              backgroundColor: selectedUser?.phoneNumber === user.phoneNumber ? "#e8e8e8" : "transparent",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
              marginBottom: "5px",
            }}
          >
            <div style={{ 
              width: "40px", 
              height: "40px", 
              borderRadius: "50%", 
              backgroundColor: "#e0e0e0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: "10px",
              fontSize: "20px"
            }}>
              {user.flag}
            </div>
            <div style={{ flex: 1, overflow: "hidden" }}>
              <h6 style={{ margin: 0, fontWeight: "bold", fontSize: "14px" }}>
                {user.phoneNumber}
              </h6>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#666",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "70%",
                  }}
                >
                  {user.lastMessage}
                </div>
                <div style={{ fontSize: "11px", color: "#888" }}>
                  {new Date(parseInt(user.timestamp) * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Col>
  );

  const renderCompanyHeader = () => (
    <div style={{ 
      backgroundColor: "#f8f9fa",
      padding: "10px 20px",
      borderBottom: "1px solid #e0e0e0",
      height: "auto",
    }}>
      <Row className="align-items-center">
        <Col xs="12" md="6">
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "15px" 
          }}>
            <div style={{
              width: "45px",
              height: "45px",
              backgroundColor: "#25D366",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <FaBuilding size={24} color="#fff" />
            </div>
            <div>
              <h3 style={{ 
                margin: "0",
                color: "#1a1a1a",
                fontSize: "20px",
                fontWeight: "600"
              }}>
                {location.state?.config?.businessName || "Business Account"}
              </h3>
              <p style={{ 
                margin: "2px 0 0 0",
                color: "#666",
                fontSize: "13px"
              }}>
                WhatsApp Business Account
              </p>
            </div>
          </div>
        </Col>
        <Col xs="12" md="6">
          <div style={{ 
            display: "flex", 
            flexWrap: "wrap",
            gap: "10px",
            justifyContent: "flex-end",
            marginTop: isMobileView ? "10px" : "0"
          }}>
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "8px",
              backgroundColor: "#fff",
              padding: "6px 12px",
              borderRadius: "8px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              fontSize: "13px"
            }}>
              <FaPhoneAlt size={12} color="#25D366" />
              <span style={{ color: "#666" }}>{config?.phoneNumber || "N/A"}</span>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );

  const renderChatWindow = () => {
    const chatMessages = selectedUser ? 
      messages.filter(msg => 
        msg.from === selectedUser.phoneNumber || msg.to === selectedUser.phoneNumber
      ) : [];

    return (
      <Col
        xs="12"
        md="8"
        style={{
          height: "calc(100vh - 100px)",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#f4f8fb",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {selectedUser ? (
          <>
            <div
              style={{
                padding: "15px",
                backgroundColor: "#00796B",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderRadius: "10px 10px 0 0",
                position: "sticky",
                top: 0,
                zIndex: 1,
              }}
            >
              <h5
                style={{
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  color: "#fff",
                }}
              >
                <div style={{ 
                  width: "30px", 
                  height: "30px",
                  borderRadius: "50%", 
                  backgroundColor: "#e0e0e0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "10px",
                  fontSize: "16px"
                }}>
                  {selectedUser.flag}
                </div>
                {selectedUser.phoneNumber}
              </h5>
              {isMobileView && (
                <Button
                  onClick={() => setSelectedUser(null)}
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    color: "#fff",
                  }}
                >
                  <FaArrowLeft />
                </Button>
              )}
            </div>

            <div
              style={{
                flex: 1,
                padding: "20px",
                overflowY: "auto",
                backgroundColor: "#efeae2",
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='64' height='64' viewBox='0 0 64 64' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 16c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm0-2c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6zm33.414-6l5.95-5.95L45.95.636 40 6.586 34.05.636 32.636 2.05 38.586 8l-5.95 5.95 1.414 1.414L40 9.414l5.95 5.95 1.414-1.414L41.414 8zM40 48c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm0-2c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6zM9.414 40l5.95-5.95-1.414-1.414L8 38.586l-5.95-5.95L.636 34.05 6.586 40l-5.95 5.95 1.414 1.414L8 41.414l5.95 5.95 1.414-1.414L9.414 40z' fill='%239C92AC' fill-opacity='0.08' fill-rule='evenodd'/%3E%3C/svg%3E")`,
              }}
            >
              {chatMessages.map((message) => (
                <div
                  key={message.messageId}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: message.from === selectedUser.phoneNumber ? "flex-start" : "flex-end",
                    marginBottom: "10px",
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      maxWidth: "70%",
                      padding: "8px 12px",
                      backgroundColor: message.from === selectedUser.phoneNumber ? "#fff" : "#dcf8c6",
                      borderRadius: "7.5px",
                      boxShadow: "0 1px 0.5px rgba(0, 0, 0, 0.13)",
                      marginBottom: "2px",
                    }}
                  >
                    <div style={{ fontSize: "14px", color: "#303030", marginRight: "15px" }}>
                      {message.messageBody}
                    </div>
                    <div style={{ 
                      fontSize: "11px", 
                      color: "#667781", 
                      textAlign: "right",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      gap: "4px"
                    }}>
                      {new Date(parseInt(message.currentStatusTimestamp) * 1000).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                      {message.from !== selectedUser.phoneNumber && (
                        <MessageStatusIcon status={message.status} />
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <div 
              style={{ 
                padding: "10px", 
                backgroundColor: "#f0f0f0",
                borderTop: "1px solid #e0e0e0" 
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Button
                  style={{
                    background: "#fff",
                    border: "none",
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                    padding: "0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FaPaperclip size={20} color="#54656f" />
                </Button>

                <Input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message..."
                  style={{
                    borderRadius: "20px",
                    height: "40px",
                    fontSize: "14px",
                    paddingLeft: "15px",
                    paddingRight: "15px",
                    flexGrow: 1,
                    border: "1px solid #e0e0e0",
                    backgroundColor: "#fff",
                  }}
                />

                <Button
                  onClick={sendMessage}
                  style={{
                    backgroundColor: "#00a884",
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                    padding: "0",
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FaPaperPlane size={20} color="#fff" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            color: "#666"
          }}>
            Select a chat to start messaging
          </div>
        )}
      </Col>
    );
  };


  return (
    <div style={{ 
      height: "calc(100vh - 20px)", 
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      position: "relative",
      margin: "10px",
    }}>
      <div style={{ flexShrink: 0 }}>
        <Header />
        {renderCompanyHeader()}
      </div>
      {renderNewChatModal()}
      <Container 
        fluid 
        style={{ 
          flex: 1,
          padding: "0",
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
        }}
      >
        <Row style={{ 
          flex: 1,
          margin: 0,
          minHeight: 0
        }}>
          {(!selectedUser || !isMobileView) && renderUserList()}
          {(selectedUser || !isMobileView) && renderChatWindow()}
        </Row>
      </Container>
  
      {loading && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div>Loading...</div>
        </div>
      )}
    </div>
  );
};


export default WhatsAppChats;