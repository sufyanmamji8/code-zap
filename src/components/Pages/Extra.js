import React, { useState, useEffect, useRef } from "react";
import { FaArrowLeft, FaPaperclip, FaPaperPlane } from "react-icons/fa";
import { Button, Col, Container, Input, Row, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import axios from "axios";
import Header from "components/Headers/Header";

const countryList = [
  { code: '92', country: 'Pakistan', flag: '🇵🇰' },
  { code: '91', country: 'India', flag: '🇮🇳' },
  { code: '971', country: 'UAE', flag: '🇦🇪' },
  { code: '1', country: 'USA', flag: '🇺🇸' },
  { code: '44', country: 'UK', flag: '🇬🇧' },
  { code: '966', country: 'Saudi Arabia', flag: '🇸🇦' },
];

const WhatsAppChats = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isNewChatModal, setIsNewChatModal] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countryList[0]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const chatEndRef = useRef(null);
  const [lastMessageTimestamp, setLastMessageTimestamp] = useState(null);

  const isMobileView = window.innerWidth <= 768;
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        'http://192.168.0.107:25483/api/v1/messages/getMessages',
        {
          businessId: "102953305799075",
          lastTimestamp: null
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      if (response.data.success) {
        setMessages(response.data.data);
        if (response.data.data.length) {
          const latestTimestamp = Math.max(
            ...response.data.data.map(msg => parseInt(msg.currentStatusTimestamp))
          );
          setLastMessageTimestamp(latestTimestamp);
        }
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const startNewChat = () => {
    const fullNumber = selectedCountry.code + phoneNumber;
    const newUser = {
      phoneNumber: fullNumber,
      lastMessage: "",
      timestamp: (Date.now() / 1000).toString(),
      flag: selectedCountry.flag
    };
    setSelectedUser(newUser);
    setPhoneNumber("");
    setIsNewChatModal(false);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return;

    const tempId = Date.now().toString();
    const tempMessage = {
      messageId: tempId,
      businessId: "102953305799075",
      from: "923030307660",
      to: selectedUser.phoneNumber,
      messageBody: newMessage,
      type: "text",
      status: "sending",
      currentStatusTimestamp: (Date.now() / 1000).toString(),
      sentTimestamp: (Date.now() / 1000).toString()
    };

    setMessages(prev => [...prev, tempMessage]);
    setNewMessage("");
    scrollToBottom();

    try {
      const response = await axios.post(
        'http://192.168.0.107:25483/api/v1/messages/send',
        {
          to: selectedUser.phoneNumber,
          body: newMessage
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setMessages(prev => prev.map(msg => 
          msg.messageId === tempId ? {
            ...msg,
            messageId: response.data.data.messages[0].id,
            status: "sent"
          } : msg
        ));
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => prev.filter(msg => msg.messageId !== tempId));
    }
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const uniqueUsers = React.useMemo(() => {
    const users = new Map();
    const receivedMessages = messages.filter(msg => 
      msg.from !== "923030307660"
    );
    
    receivedMessages.forEach(msg => {
      const number = msg.from;
      if (!users.has(number)) {
        users.set(number, {
          phoneNumber: number,
          lastMessage: msg.messageBody,
          timestamp: msg.currentStatusTimestamp,
          flag: countryList.find(c => number && number.startsWith(c.code))?.flag || ''
        });
      }
    });
    return Array.from(users.values());
  }, [messages]);

  const filteredUsers = uniqueUsers.filter(user =>
    user.phoneNumber && searchTerm 
      ? user.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase())
      : true
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
                    <div style={{ fontSize: "11px", color: "#667781", textAlign: "right" }}>
                      {new Date(parseInt(message.currentStatusTimestamp) * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {message.from !== selectedUser.phoneNumber && (
                        <span style={{ marginLeft: "5px" }}>
                          {message.status === "delivered" ? "✓✓" : "✓"}
                        </span>
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
      height: "100vh", 
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      position: "relative",
    }}>
      <div>
        <Header />
      </div>
      {renderNewChatModal()}
      <Container 
        fluid 
        style={{ 
          flex: 1,
          padding: "20px 15px 0 15px",
          minHeight: 0,
          zIndex: 1,
        }}
      >
        <Row style={{ height: "100%" }}>
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

const formatMessageTime = (timestamp) => {
  const date = new Date(parseInt(timestamp) * 1000);
  const now = new Date();
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return date.toLocaleDateString([], { weekday: 'long' });
  } else {
    return date.toLocaleDateString([], { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }
};

const groupMessagesByDate = (messages) => {
  const groups = {};
  messages.forEach(message => {
    const date = new Date(parseInt(message.currentStatusTimestamp) * 1000)
      .toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
  });
  return groups;
};

const getCountryFlag = (phoneNumber) => {
  for (const country of countryList) {
    if (phoneNumber.startsWith(country.code)) {
      return country.flag;
    }
  }
  return '🌐';
};

export default WhatsAppChats;