import React, { useState, useEffect, useRef } from "react";
import { FaArrowLeft, FaPaperclip, FaPaperPlane, FaCheck, FaCheckDouble, FaClock, FaExclamationTriangle } from "react-icons/fa";
import { Button, Col, Container, Input, Row, Modal, ModalHeader, ModalBody, ModalFooter, Card, CardBody } from "reactstrap";
import axios from "axios";
import io from "socket.io-client";
import { useLocation } from 'react-router-dom';
import { MESSAGE_API_ENDPOINT } from "Api/Constant";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

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
  const [senderNames, setSenderNames] = useState({});
   const [initialLoading, setInitialLoading] = useState(true);
   const [isInitialLoad, setIsInitialLoad] = useState(true);
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

    const newSocket = io("https://codozap-e04e12b02929.herokuapp.com", {
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
      // Pass false to indicate this is not initial load
      fetchInitialMessages(false);
    });
  
    return () => {
      socket.off(`onmessagerecv-${businessId}`);
    };
}, [socket, businessId]);
  
const fetchInitialMessages = async (isNewLoad = true) => {
  if (!businessId) return;
  try {
    // Only show loader if it's initial load or new chat
    if (isNewLoad) {
      setInitialLoading(true);
    }
    
    const response = await axios.post(
      `${MESSAGE_API_ENDPOINT}/getMessages`,
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
      
      // Store sender names
      const names = {};
      allMessages.forEach(msg => {
        if (msg.senderName && msg.from) {
          names[msg.from] = msg.senderName;
        }
      });
      setSenderNames(names);
      
      const uniqueContacts = new Map();
      allMessages.forEach(msg => {
        if (!msg?.from || !msg?.to) return;
        
        const phoneNumber = msg.from === config.phoneNumber ? msg.to : msg.from;
        if (!phoneNumber) return;
        
        const country = countryList.find(c => phoneNumber.startsWith(c.code));
        
        uniqueContacts.set(phoneNumber, {
          phoneNumber,
          senderName: names[phoneNumber] || msg.senderName || "Unknown",
          lastMessage: msg.messageBody || "",
          timestamp: msg.currentStatusTimestamp || (Date.now() / 1000).toString(),
          flag: (country?.flag) || '🌐'
        });
      });

      const contactsArray = Array.from(uniqueContacts.values());
      setContacts(contactsArray);
      localStorage.setItem('whatsappContacts', JSON.stringify(contactsArray));
    }
  } catch (error) {
    console.error("Error fetching messages:", error);
  } finally {
    // Only hide loader if it was shown (during initial load)
    if (isNewLoad) {
      setInitialLoading(false);
    }
  }
};

// When component mounts or businessId changes
useEffect(() => {
  if (businessId) {
      // Pass true to indicate this is initial load
      fetchInitialMessages(true);
  }
  
  return () => {
      setIsInitialLoad(false);
  };
}, [businessId]);

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
        return <FaCheck size={12} color="#667781" style={getIconStyle('')} />;
    }
  };

  const updateContactsWithMessages = (newMessages) => {
    const updatedContacts = [...contacts];
    const messagesByUser = new Map();

    newMessages.forEach(msg => {
      const userNumber = msg.from === config.phoneNumber ? msg.to : msg.from;
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
      businessId: businessId,
      from: config.phoneNumber,
      to: selectedUser.phoneNumber,
      messageBody: newMessage,
      type: "text",
      status: "sending",
      currentStatusTimestamp: (Date.now() / 1000).toString(),
      sentTimestamp: (Date.now() / 1000).toString(),
      senderName: senderNames[selectedUser.phoneNumber] || selectedUser.senderName
    }

    setMessages(prev => [...prev, tempMessage]);

    const existingContact = contacts.find(c => c.phoneNumber === selectedUser.phoneNumber);
    if (!existingContact) {
      const country = countryList.find(c => selectedUser.phoneNumber.startsWith(c.code));
      const newContact = {
        phoneNumber: selectedUser.phoneNumber,
        senderName: senderNames[selectedUser.phoneNumber] || selectedUser.senderName,
        lastMessage: newMessage,
        timestamp: tempMessage.currentStatusTimestamp,
        flag: country?.flag || '🌐'
      };
      setContacts(prev => [...prev, newContact]);
    }

    setNewMessage("");
    setTimeout(() => scrollToBottom(), 100);

    try {
      const response = await axios.post(
        `${MESSAGE_API_ENDPOINT}/send`,
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
            ? { ...msg, messageId: actualMessageId, status: '' }
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
      
      const number = msg.from === config.phoneNumber ? msg.to : msg.from;
      if (!number) return;
      
      if (!users.has(number)) {
        const country = countryList.find(c => 
          c && c.code && number.startsWith(c.code)
        );
        
        const newContact = {
          phoneNumber: number,
          senderName: msg.senderName || "Unknown",
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
        position: "relative" // Add this for loader positioning
      }}
    >
      {initialLoading && <LoaderOverlay />}
      <Card className="mb-2">
        <CardBody className="p-3">
          <div className="d-flex align-items-center">
            <div className="me-3 rounded-circle d-flex align-items-center justify-content-center" 
              style={{ width: 45, height: 45, background: "#00a884" }}>
              <i className="fab fa-whatsapp fa-lg text-white"></i>
            </div>
            <div>
              <small className="font-weight-bold" style={{marginLeft: '10px'}}>{config?.companyName}</small>
              <h5 className="mb-1 font-weight-bold" style={{ marginLeft: '10px' }}>{config?.phoneNumber}</h5>
            </div>
          </div>
        </CardBody>
      </Card>

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
                {user.senderName || user.phoneNumber}
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
        {initialLoading && <LoaderOverlay />}
        {selectedUser ? (
          <>
            <div
              style={{
                padding: "15px",
                background: "linear-gradient(135deg, #00a884 0%, #008c70 100%)",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderRadius: "10px 10px 0 0",
                position: "sticky",
                top: 0,
                zIndex: 1,
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
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
                  width: "40px", 
                  height: "40px",
                  borderRadius: "50%", 
                  backgroundColor: "rgba(255,255,255,0.2)",
                  backdropFilter: "blur(4px)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "12px",
                  fontSize: "18px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                }}>
                  {selectedUser.flag}
                </div>
                <div>
                  <div style={{ fontWeight: "600" }}>{selectedUser.senderName || "Unknown"}</div>
                  <div style={{ fontSize: "12px", opacity: 0.9 }}>{selectedUser.phoneNumber}</div>
                </div>
              </h5>
              {isMobileView && (
                <Button
                  onClick={() => setSelectedUser(null)}
                  style={{
                    backgroundColor: "rgba(255,255,255,0.1)",
                    border: "none",
                    color: "#fff",
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "background-color 0.2s"
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
                marginBottom: isMobileView ? "60px" : 0,
              }}
            >
              {chatMessages.map((message) => {
                const isReceived = message.from === selectedUser.phoneNumber;
                return (
                  <div
                    key={message.messageId}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: isReceived ? "flex-start" : "flex-end",
                      marginBottom: "12px",
                      position: "relative"
                    }}
                  >
                    <div
                      style={{
                        position: "relative",
                        maxWidth: "70%",
                        padding: "10px 14px",
                        backgroundColor: isReceived ? "#fff" : "#dcf8c6",
                        borderRadius: "12px",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
                        borderTopLeftRadius: isReceived ? "0" : "12px",
                        borderTopRightRadius: isReceived ? "12px" : "0",
                      }}
                    >
                      {/* Message Triangle */}
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          [isReceived ? "left" : "right"]: -8,
                          width: "8px",
                          height: "16px",
                          backgroundColor: isReceived ? "#fff" : "#dcf8c6",
                          clipPath: isReceived ? 
                            "polygon(100% 0, 0 0, 100% 100%)" : 
                            "polygon(0 0, 100% 0, 0 100%)"
                        }}
                      />
                      
                      {/* Message Content */}
                      <div style={{ 
                        fontSize: "14px", 
                        color: "#303030",
                        marginRight: "24px",
                        lineHeight: "1.4",
                        wordBreak: "break-word"
                      }}>
                        {message.messageBody}
                      </div>
                      
                      {/* Time and Status */}
                      <div style={{ 
                        fontSize: "11px", 
                        color: "#667781", 
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        gap: "4px",
                        marginTop: "4px"
                      }}>
                        <span>
                          {new Date(parseInt(message.currentStatusTimestamp) * 1000)
                            .toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                        </span>
                        {!isReceived && (
                          <MessageStatusIcon status={message.status} />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>
  
            <div 
              style={{ 
                padding: "12px 16px",
                backgroundColor: "#f0f0f0",
                borderTop: "1px solid rgba(0,0,0,0.08)",
                position: isMobileView ? "fixed" : "relative",
                bottom: 0,
                left: isMobileView ? 0 : "auto",
                right: isMobileView ? 0 : "auto",
                width: isMobileView ? "100%" : "auto",
                zIndex: 2,
              }}
            >
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "10px",
                backgroundColor: "#fff",
                padding: "6px 12px",
                borderRadius: "24px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)"
              }}>
                <Button
                  style={{
                    background: "transparent",
                    border: "none",
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                    padding: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#54656f",
                    transition: "background-color 0.2s"
                  }}
                >
                  <FaPaperclip size={20} />
                </Button>
  
                <Input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message..."
                  style={{
                    border: "none",
                    height: "40px",
                    fontSize: "15px",
                    padding: "8px 12px",
                    flexGrow: 1,
                    backgroundColor: "transparent",
                    boxShadow: "none"
                  }}
                />
  
                <Button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  style={{
                    backgroundColor: newMessage.trim() ? "#00a884" : "#e9edef",
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                    padding: 0,
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "background-color 0.2s",
                    color: newMessage.trim() ? "#fff" : "#8696a0"
                  }}
                >
                  <FaPaperPlane size={18} />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            color: "#667781",
            gap: "16px"
          }}>
            <div style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              backgroundColor: "#f0f2f",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <FaPaperPlane size={24} style={{ color: "#8696a0" }} />
            </div>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: "18px", fontWeight: "500", margin: "0 0 8px 0" }}>
                Select a chat to start messaging
              </p>
              <p style={{ fontSize: "14px", color: "#8696a0", margin: 0 }}>
                Send and receive messages in real-time
              </p>
            </div>
          </div>
        )}
      </Col>
    );
  };


  const LoaderOverlay = () => (
    <div style={{
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "#fff",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000
    }}>
      <DotLottieReact
        src="https://lottie.host/fe6880d6-bf83-42f4-87cf-06835aa1a376/Blq1yF0rqk.lottie"
        loop
        autoplay
        style={{ width: "200px", height: "200px" }}
      />
      <p style={{ 
        marginTop: "20px", 
        color: "#667781", 
        fontSize: "16px",
        fontWeight: "500"
      }}>
        Loading messages...
      </p>
    </div>
  );

  return (
    <div style={{ 
      height: "85vh", 
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      position: "relative",
    }}>
      {renderNewChatModal()}
      <Container 
        fluid 
        style={{ 
          flex: 1,
          padding: "18px 15px 0 15px",
          minHeight: 0,
          zIndex: 1,
        }}
      >
        <Row style={{ height: "100%" }}>
          {(!selectedUser || !isMobileView) && renderUserList()}
          {(selectedUser || !isMobileView) && renderChatWindow()}
        </Row>
      </Container>
    </div>
  );
};

export default WhatsAppChats;