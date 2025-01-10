import React, { useState, useEffect, useRef } from "react";
import { FaArrowLeft, FaPaperclip, FaPaperPlane, FaCheck, FaCheckDouble, FaClock, FaExclamationTriangle } from "react-icons/fa";
import { Button, Col, Container, Input, Row, Modal, ModalHeader, ModalBody, ModalFooter, Card, CardBody } from "reactstrap";
import axios from "axios";
import io from "socket.io-client";
import { useLocation } from 'react-router-dom';
import { MESSAGE_API_ENDPOINT } from "Api/Constant";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import countryList from './countryList';

const WhatsAppChats = () => {
  const location = useLocation();
  const { config, companyId } = location.state || {};
  const businessId = config?.whatsappBusinessAccountId;
  
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isNewChatModal, setIsNewChatModal] = useState(false);
  const [senderNames, setSenderNames] = useState({});
  const [initialLoading, setInitialLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState(countryList[0]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  
  
  const chatEndRef = useRef(null);
  const contactListRef = useRef(null);
  const isMobileView = window.innerWidth <= 768;
  const token = localStorage.getItem('token');

  // Fetch contacts with pagination
  const fetchContacts = async (pageNum = 1, isInitial = false) => {
    if (!businessId || (!isInitial && !hasMore) || loadingMore) return;
    
    try {
      setLoadingMore(true);

      const response = await axios.post(
        `${MESSAGE_API_ENDPOINT}/getContact`,
        { 
          companyId 
        },
        {
          params: { 
            page: pageNum, 
            limit: 5 
          },
          headers: { 
            Authorization: `Bearer ${token}` 
          }
        }
      );

      if (response.data.success) {
        const newContacts = response.data.contacts.map(contact => ({
          ...contact,
          phoneNumber: contact._id,
          name: contact.senderName || contact.name || contact._id,
          latestChat: contact.latestChat
        }));

        setContacts(prev => {
          if (pageNum === 1) {
            return newContacts;
          } else {
            const existingPhoneNumbers = prev.map(c => c.phoneNumber);
            const uniqueNewContacts = newContacts.filter(
              contact => !existingPhoneNumbers.includes(contact.phoneNumber)
            );
            return [...prev, ...uniqueNewContacts];
          }
        });
        
        setHasMore(pageNum < response.data.pagination.totalPages);
        setPage(pageNum);
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setLoadingMore(false);
      if (isInitial) setInitialLoading(false);
    }
  };

  // Fetch messages for selected contact
  const fetchMessages = async (contactPhoneNumber) => {
    if (!businessId || !contactPhoneNumber) return;
    
    try {
      setLoading(true);
      const response = await axios.post(
        `${MESSAGE_API_ENDPOINT}/getMessages`,
        {
          businessId,
          contactNumber: contactPhoneNumber
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setMessages(response.data.data);
        
        // Extract sender name from messages
        const messages = response.data.data;
        if (messages.length > 0) {
          const latestMessage = messages.find(msg => msg.senderName && msg.from === contactPhoneNumber);
          if (latestMessage?.senderName) {
            setSenderNames(prev => ({
              ...prev,
              [contactPhoneNumber]: latestMessage.senderName
            }));
          }
        }

        // Update contacts with sender name
        setContacts(prevContacts => 
          prevContacts.map(contact => {
            if (contact.phoneNumber === contactPhoneNumber) {
              const latestMessage = messages.find(msg => msg.senderName && msg.from === contactPhoneNumber);
              return {
                ...contact,
                name: latestMessage?.senderName || contact.name,
                lastMessage: messages[0]?.messageBody || contact.lastMessage,
                timestamp: messages[0]?.currentStatusTimestamp || contact.timestamp
              };
            }
            return contact;
          })
        );
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (businessId) {
      fetchContacts(1, true);
    }
  }, [businessId]);

  // Handle contact selection
  useEffect(() => {
    if (selectedUser?.phoneNumber) {
      fetchMessages(selectedUser.phoneNumber);
    }
  }, [selectedUser]);

  // Infinite scroll for contacts
  const handleContactScroll = () => {
    if (contactListRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = contactListRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 50 && hasMore && !loadingMore) {
        fetchContacts(page + 1);
      }
    }
  };

  // Socket connection setup
  useEffect(() => {
    if (!businessId) return;
  
    const newSocket = io("https://codozap-e04e12b02929.herokuapp.com", {
      transports: ["websocket"],
      withCredentials: true,
      auth: {
        token: token
      }
    });
  
    newSocket.on("connect", () => {
      console.log("Connected to socket server");
      // Listen for the specific business ID event that matches backend
      newSocket.on(`onmessagerecv-${businessId}`, (data) => {
        console.log("New message event received:", data);
        // Refresh contacts and messages
        fetchContacts(1, false);
        if (selectedUser) {
          fetchMessages(selectedUser.phoneNumber);
        }
      });
    });
  
    newSocket.on("disconnect", () => {
      console.log("Disconnected from socket server");
    });
  
    // Handle connection errors with reconnection
    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      setTimeout(() => {
        newSocket.connect();
      }, 5000);
    });
  
    setSocket(newSocket);
  
    return () => {
      if (newSocket) {
        newSocket.off(`onmessagerecv-${businessId}`);
        newSocket.disconnect();
      }
    };
  }, [businessId, selectedUser]);

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

    

  

  const updateMessageInUI = (messageData) => {
    setMessages(prev => {
      const messageExists = prev.some(msg => msg.messageId === messageData.messageId);
      if (!messageExists) {
        return [...prev, messageData];
      }
      return prev.map(msg =>
        msg.messageId === messageData.messageId
          ? { ...msg, ...messageData }
          : msg
      );
    });
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
        users.set(contact.phoneNumber, {
          ...contact,
          lastMessage: contact.lastMessage || "",
          timestamp: contact.timestamp || (Date.now() / 1000).toString()
        });
      }
    });
    
    messages.forEach(msg => {
      if (!msg) return;
      
      // Get the contact number (whether sender or receiver)
      const contactNumber = msg.from === config?.phoneNumber ? msg.to : msg.from;
      
      if (!contactNumber) return;
      
      const existingUser = users.get(contactNumber);
      const messageTimestamp = parseInt(msg.currentStatusTimestamp);
      const existingTimestamp = existingUser ? parseInt(existingUser.timestamp) : 0;
      
      // Update only if this message is more recent
      if (!existingUser || messageTimestamp > existingTimestamp) {
        const country = countryList.find(c => 
          c && c.code && contactNumber.startsWith(c.code)
        );
        
        users.set(contactNumber, {
          ...(existingUser || {}),
          phoneNumber: contactNumber,
          lastMessage: msg.messageBody,
          timestamp: msg.currentStatusTimestamp,
          flag: (country?.flag) || '🌐'
        });
      }
    });
    
    // Convert to array and sort by timestamp
    return Array.from(users.values())
      .filter(user => user && user.phoneNumber)
      .sort((a, b) => {
        const timestampA = parseInt(a.timestamp) || 0;
        const timestampB = parseInt(b.timestamp) || 0;
        return timestampB - timestampA;
      });
  }, [messages, contacts, config?.phoneNumber]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUser || !config?.phoneNumber || !companyId) {
      console.warn("Missing required data for sending message");
      return;
    }
  
    const tempId = Date.now().toString();
    const currentTimestamp = (Date.now() / 1000).toString();
    
    const tempMessage = {
      messageId: tempId,
      businessId: businessId,
      from: config.phoneNumber,
      to: selectedUser.phoneNumber,
      messageBody: newMessage,
      type: "text",
      status: "sending",
      currentStatusTimestamp: currentTimestamp,
      sentTimestamp: currentTimestamp,
      senderName: config.companyName || config.phoneNumber
    };
  
    try {
      // Add temporary message to messages
      setMessages(prev => [...prev, tempMessage]);
      
      // Update contact with latest message immediately
      setContacts(prev => {
        const updatedContacts = prev.map(contact => {
          if (contact.phoneNumber === selectedUser.phoneNumber) {
            return {
              ...contact,
              lastMessage: newMessage,
              timestamp: currentTimestamp
            };
          }
          return contact;
        });
        
        // Sort contacts by timestamp
        return updatedContacts.sort((a, b) => 
          parseInt(b.timestamp) - parseInt(a.timestamp)
        );
      });
  
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
        
        // Update the message status
        setMessages(prev => prev.map(msg =>
          msg.messageId === tempId
            ? { ...msg, messageId: actualMessageId, status: 'sent' }
            : msg
        ));
  
        if (socket) {
          socket.emit('message_sent', {
            messageId: actualMessageId,
            businessId: businessId,
            from: config.phoneNumber,
            to: selectedUser.phoneNumber
          });
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      // Update message status to failed
      setMessages(prev => prev.map(msg =>
        msg.messageId === tempId
          ? { ...msg, status: "failed", failureReason: error.response?.data?.message || "Failed to send message" }
          : msg
      ));
    }
  
    setNewMessage("");
    setTimeout(() => scrollToBottom(), 100);
  };

const formatDate = (timestamp) => {
  const date = new Date(parseInt(timestamp) * 1000);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return "Today";
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  } else {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }
};

const groupMessagesByDate = (messages) => {
  const groups = {};
  
  messages.forEach(message => {
    const date = new Date(parseInt(message.currentStatusTimestamp) * 1000).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
  });

  return Object.entries(groups).map(([date, messages]) => ({
    date,
    timestamp: parseInt(messages[0].currentStatusTimestamp),
    messages
  })).sort((a, b) => a.timestamp - b.timestamp);
};

const renderDateSeparator = (date) => (
  <div style={{
    textAlign: "center",
    padding: "8px 0",
    margin: "8px 0"
  }}>
    <span style={{
      backgroundColor: "#e2f3fb",
      padding: "4px 12px",
      borderRadius: "6px",
      fontSize: "12px",
      color: "#54656f"
    }}>
      {formatDate(date)}
    </span>
  </div>
);


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
        position: "relative"
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

      <div 
        ref={contactListRef}
        onScroll={handleContactScroll}
        style={{ overflowY: "auto", flexGrow: 1 }}
      >
        {contacts.map((contact) => {
          const latestData = uniqueUsers.find(u => u.phoneNumber === contact.phoneNumber) || contact;
          const country = countryList.find(c => contact.phoneNumber.startsWith(c.code));
          const displayName = contact.senderName || contact.name || senderNames[contact.phoneNumber] || contact.phoneNumber;
          
          return (
            <div
              key={contact.phoneNumber}
              onClick={() => setSelectedUser({
                ...contact,
                senderName: displayName,
                flag: country?.flag || '🌐'
              })}
              style={{
                display: "flex",
                alignItems: "center", 
                padding: "10px",
                borderRadius: "10px",
                backgroundColor: selectedUser?.phoneNumber === contact.phoneNumber ? "#e8e8e8" : "transparent",
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
                {country?.flag || '🌐'}
              </div>
              <div style={{ flex: 1, overflow: "hidden" }}>
                <h6 style={{ margin: 0, fontWeight: "bold", fontSize: "14px" }}>
                  {displayName}
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
                    {latestData.lastMessage}
                  </div>
                  <div style={{ fontSize: "11px", color: "#888" }}>
                    {latestData.timestamp ? new Date(parseInt(latestData.timestamp) * 1000).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    }) : ''}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {loadingMore && (
          <div style={{ textAlign: 'center', padding: '10px' }}>
            Loading more contacts...
          </div>
        )}
      </div>
    </Col>
  );

  const renderChatWindow = () => {
    const chatMessages = selectedUser ? 
      messages.filter(msg => 
        msg.from === selectedUser.phoneNumber || msg.to === selectedUser.phoneNumber
      ) : [];
  
    const groupedMessages = groupMessagesByDate(chatMessages);
  
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
            <div style={{
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
            }}>
              <h5 style={{
                margin: 0,
                display: "flex",
                alignItems: "center",
                color: "#fff",
              }}>
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
                  <div style={{ fontWeight: "600" }}>
                    {selectedUser.senderName || selectedUser.name || senderNames[selectedUser.phoneNumber] || selectedUser.phoneNumber}
                  </div>
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
                    justifyContent: "center"
                  }}
                >
                  <FaArrowLeft />
                </Button>
              )}
            </div>

            <div style={{
              flex: 1,
              padding: "20px",
              overflowY: "auto",
              backgroundColor: "#efeae2",
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='64' height='64' viewBox='0 0 64 64' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 16c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm0-2c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6zm33.414-6l5.95-5.95L45.95.636 40 6.586 34.05.636 32.636 2.05 38.586 8l-5.95 5.95 1.414 1.414L40 9.414l5.95 5.95 1.414-1.414L41.414 8zM40 48c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm0-2c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6zM9.414 40l5.95-5.95-1.414-1.414L8 38.586l-5.95-5.95L.636 34.05 6.586 40l-5.95 5.95 1.414 1.414L8 41.414l5.95 5.95 1.414-1.414L9.414 40z' fill='%239C92AC' fill-opacity='0.08' fill-rule='evenodd'/%3E%3C/svg%3E")`,
              marginBottom: isMobileView ? "60px" : 0
            }}>
              {groupedMessages.map((group) => (
                <div key={group.date}>
                  {renderDateSeparator(group.timestamp)}
                  {group.messages.map((message) => {
                    const isReceived = message.from === selectedUser.phoneNumber;
                    return (
                      <div
                        key={message.messageId}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: isReceived ? "flex-start" : "flex-end",
                          marginBottom: "12px"
                        }}
                      >
                        <div
                          style={{
                            maxWidth: "70%",
                            padding: "8px 12px",
                            backgroundColor: isReceived ? "#fff" : "#dcf8c6",
                            borderRadius: "8px",
                            position: "relative"
                          }}
                        >
                          <div style={{ fontSize: "14px", marginBottom: "4px" }}>
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
                            <span>
                              {new Date(parseInt(message.currentStatusTimestamp) * 1000)
                                .toLocaleTimeString([], { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                            </span>
                            {!isReceived && <MessageStatusIcon status={message.status} />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <div style={{ 
              padding: "12px 16px",
              backgroundColor: "#f0f0f0",
              borderTop: "1px solid rgba(0,0,0,0.08)",
              position: isMobileView ? "fixed" : "relative",
              bottom: 0,
              left: isMobileView ? 0 : "auto",
              right: isMobileView ? 0 : "auto",
              width: isMobileView ? "100%" : "auto",
              zIndex: 2,
            }}>
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
                    padding: "8px",
                    color: "#54656f"
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
                    padding: "8px",
                    flex: 1,
                    backgroundColor: "transparent"
                  }}
                />
                <Button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  style={{
                    backgroundColor: newMessage.trim() ? "#00a884" : "#e9edef",
                    border: "none",
                    padding: "8px",
                    borderRadius: "50%",
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
              backgroundColor: "#f0f2f5",
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
    <div style={{ height: "85vh", display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>
      {renderNewChatModal()}
      <Container fluid style={{ flex: 1, padding: "18px 15px 0 15px", minHeight: 0, zIndex: 1 }}>
        <Row style={{ height: "100%" }}>
          {(!selectedUser || !isMobileView) && renderUserList()}
          {(selectedUser || !isMobileView) && renderChatWindow()}
        </Row>
      </Container>
    </div>
  );
};

export default WhatsAppChats;