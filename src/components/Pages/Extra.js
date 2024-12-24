import React, { useState, useEffect, useRef } from "react";
import Header from "components/Headers/Header";
import Avatar from "react-avatar";
import { FaArrowLeft, FaPaperclip, FaPaperPlane, FaCheck, FaCheckDouble } from "react-icons/fa";
import { Button, Col, Container, Input, Row } from "reactstrap";
import axios from "axios";

const BUSINESS_PHONE = '923030307660';
const baseURL = 'https://codozap-e04e12b02929.herokuapp.com/api/v1/messages';
const token = localStorage.getItem('token');

const WhatsAppChats = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [chats, setChats] = useState([]);
  const [error, setError] = useState(null);
  const [isTyping, setIsTyping] = useState(false);

  const isMobileView = window.innerWidth <= 768;
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getStatusIcon = (status) => {
    switch(status?.toLowerCase()) {
      case 'sent':
        return <FaCheck size={12} />;
      case 'delivered':
        return <FaCheckDouble size={12} />;
      case 'read':
        return <FaCheckDouble size={12} color="#34B7F1" />;
      default:
        return null;
    }
  };

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const isYesterday = new Date(now - 86400000).toDateString() === date.toDateString();

    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (isYesterday) {
      return 'Yesterday ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { 
        month: 'short', 
        day: 'numeric' 
      }) + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://codozap-e04e12b02929.herokuapp.com/test');
      const parser = new DOMParser();
      const doc = parser.parseFromString(response.data, 'text/html');
      const scriptContent = doc.querySelector('script');
      
      if (scriptContent) {
        const chatDataMatch = scriptContent.textContent.match(/const chatData = (.*?);/);
        if (chatDataMatch) {
          const chatData = JSON.parse(chatDataMatch[1]);
          
          const allMessages = [];
          Object.entries(chatData).forEach(([chatId, msgs]) => {
            msgs.forEach(msg => allMessages.push({ ...msg, chatId }));
          });
          
          setMessages(allMessages);
          
          const groupedChats = allMessages.reduce((acc, msg) => {
            const chatId = msg.from === BUSINESS_PHONE ? msg.to : msg.from;
            if (!acc[chatId]) acc[chatId] = [];
            acc[chatId].push(msg);
            return acc;
          }, {});
          
          const sortedChats = Object.entries(groupedChats).sort((a, b) => {
            const lastMsgA = a[1][a[1].length - 1].currentStatusTimestamp;
            const lastMsgB = b[1][b[1].length - 1].currentStatusTimestamp;
            return lastMsgB - lastMsgA;
          });
          
          setChats(sortedChats);
        }
      }
    } catch (err) {
      setError('Failed to fetch messages: ' + (err.response?.status || err.message));
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    try {
      setLoading(true);
      await axios.post(`${baseURL}/send`, {
        to: selectedUser.id,
        body: newMessage
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const newMsg = {
        messageId: Date.now().toString(),
        from: BUSINESS_PHONE,
        to: selectedUser.id,
        messageBody: newMessage,
        currentStatusTimestamp: Math.floor(Date.now() / 1000),
        status: 'sent'
      };
      
      setMessages(prev => [...prev, newMsg]);
      setNewMessage('');
      await fetchMessages();
    } catch (err) {
      setError('Failed to send message: ' + (err.response?.status || err.message));
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const filteredUsers = chats.filter(([chatId]) =>
    chatId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderUserList = () => (
    <Col
      xs="12"
      md="4"
      style={{
        backgroundColor: "#f0f4f8",
        height: "calc(100vh - 100px)",
        display: selectedUser && isMobileView ? "none" : "flex",
        flexDirection: "column",
        overflow: "hidden",
        borderRight: "1px solid #e0e0e0",
        padding: "10px",
      }}
    >
      <div style={{ padding: "10px 0" }}>
        <Input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            borderRadius: "20px",
            backgroundColor: "#fff",
            border: "1px solid #e0e0e0",
            padding: "8px 15px",
          }}
        />
      </div>

      <div style={{ overflowY: "auto", flexGrow: 1 }}>
        {filteredUsers.map(([chatId, chatMessages]) => {
          const lastMessage = chatMessages[chatMessages.length - 1];
          
          return (
            <div
              key={chatId}
              onClick={() => {
                setSelectedUser({ id: chatId });
                scrollToBottom();
              }}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px",
                borderRadius: "10px",
                backgroundColor: selectedUser?.id === chatId ? "#e3e3e3" : "transparent",
                cursor: "pointer",
                transition: "background-color 0.3s ease",
                marginBottom: "5px",
              }}
            >
              <Avatar
                name={chatId}
                size="40"
                round={true}
                style={{ marginRight: "10px" }}
              />
              <div style={{ flex: 1, overflow: "hidden" }}>
                <h6 style={{ margin: 0, fontWeight: "bold", fontSize: "14px" }}>
                  {chatId}
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
                    {lastMessage?.messageBody || "No messages"}
                  </div>
                  <div style={{ fontSize: "11px", color: "#888" }}>
                    {lastMessage && formatMessageTime(lastMessage.currentStatusTimestamp)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {filteredUsers.length === 0 && (
          <p style={{ textAlign: "center", color: "#888" }}>No users found</p>
        )}
      </div>
    </Col>
  );

  const renderChatWindow = () => (
    <Col
      xs="12"
      md="8"
      style={{
        height: "calc(100vh - 100px)", // Fixed height
        display: selectedUser ? "flex" : isMobileView ? "none" : "flex",
        flexDirection: "column",
        backgroundColor: "#f4f8fb",
        position: "relative", // Add position relative
        overflow: "hidden", // Prevent outer scroll
      }}
    >
  
  <div
      style={{
        padding: "15px",
        backgroundColor: "#00796B",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: "10px 10px 0 0",
        position: "sticky", // Make header stick to top
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
          <Avatar
            name={selectedUser?.id || "No User"}
            size="30"
            round={true}
            style={{ marginRight: "10px" }}
          />
          {selectedUser?.id || "No User"}
        </h5>
        {isMobileView && (
          <Button
            style={{
              backgroundColor: "transparent",
              border: "none",
              color: "#fff",
            }}
            onClick={() => setSelectedUser(null)}
          >
            <FaArrowLeft />
          </Button>
        )}
      </div>

      <div
      style={{
        flex: 1,
        padding: "20px",
        overflowY: "auto", // Only messages container scrolls
        backgroundColor: "#efeae2",
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='64' height='64' viewBox='0 0 64 64' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 16c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm0-2c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6zm33.414-6l5.95-5.95L45.95.636 40 6.586 34.05.636 32.636 2.05 38.586 8l-5.95 5.95 1.414 1.414L40 9.414l5.95 5.95 1.414-1.414L41.414 8zM40 48c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm0-2c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6zM9.414 40l5.95-5.95-1.414-1.414L8 38.586l-5.95-5.95L.636 34.05 6.586 40l-5.95 5.95 1.414 1.414L8 41.414l5.95 5.95 1.414-1.414L9.414 40z' fill='%239C92AC' fill-opacity='0.08' fill-rule='evenodd'/%3E%3C/svg%3E")`,
      }}
    >
        {messages
          .filter(msg => msg.from === selectedUser?.id || msg.to === selectedUser?.id)
          .map((message, index, filteredMessages) => {
            const showDateHeader = index === 0 || 
              new Date(message.currentStatusTimestamp * 1000).toDateString() !== 
              new Date(filteredMessages[index - 1].currentStatusTimestamp * 1000).toDateString();

            return (
              <React.Fragment key={message.messageId}>
                {showDateHeader && (
                  <div
                    style={{
                      textAlign: "center",
                      margin: "10px 0",
                      position: "relative",
                    }}
                  >
                    <span
                      style={{
                        backgroundColor: "rgba(225, 245, 254, 0.92)",
                        padding: "4px 12px",
                        borderRadius: "8px",
                        fontSize: "12px",
                        color: "#666",
                        boxShadow: "0 1px 0.5px rgba(0, 0, 0, 0.13)",
                      }}
                    >
                      {new Date(message.currentStatusTimestamp * 1000).toLocaleDateString([], {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                )}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: message.from === BUSINESS_PHONE ? "flex-end" : "flex-start",
                    marginBottom: "10px",
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      maxWidth: "70%",
                      padding: "8px 12px",
                      backgroundColor: message.from === BUSINESS_PHONE ? "#dcf8c6" : "#fff",
                      borderRadius: "7.5px",
                      boxShadow: "0 1px 0.5px rgba(0, 0, 0, 0.13)",
                      marginBottom: "2px",
                    }}
                  >
                    <div 
                      style={{ 
                        fontSize: "14px",
                        color: "#303030",
                        marginRight: message.from === BUSINESS_PHONE ? "15px" : "0",
                      }}
                    >
                      {message.messageBody}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        gap: "4px",
                        marginTop: "4px",
                        minHeight: "15px",
                      }}
                    >
                      <span style={{ 
                        fontSize: "11px", 
                        color: "#667781",
                      }}>
                        {formatMessageTime(message.currentStatusTimestamp)}
                      </span>
                      {message.from === BUSINESS_PHONE && (
                        <span style={{ 
                          marginLeft: "4px",
                          display: "flex",
                          alignItems: "center",
                          color: message.status === 'read' ? "#34B7F1" : "#667781"
                        }}>
                          {getStatusIcon(message.status)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        <div ref={messagesEndRef} />
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
            onChange={(e) => {
              setNewMessage(e.target.value);
              setIsTyping(true);
              if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
              typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 1000);
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage(e);
              }
            }}
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
            onClick={sendMessage}
            disabled={loading || !newMessage.trim()}
          >
            <FaPaperPlane size={20} color="#fff" />
          </Button>
        </div>
      </div>
    </Col>
  );

  return (
    <div style={{ 
      height: "100vh", 
      backgroundColor: "#f0f2f5",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden" // This prevents main page scroll
    }}>
      <Header />
      <Container 
        fluid 
        style={{ 
          flex: 1,
          padding: "20px 15px 0 15px",
          minHeight: 0 // This is important to prevent Container from expanding
        }}
      >
        <Row style={{ height: "100%" }}>
          {renderUserList()}
          {renderChatWindow()}
        </Row>
      </Container>
      {error && (
        <div 
          style={{ 
            padding: "10px",
            backgroundColor: "#f0f0f0",
            borderTop: "1px solid #e0e0e0",
            position: "sticky",
            bottom: 0,
            zIndex: 1,
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
};

export default WhatsAppChats;