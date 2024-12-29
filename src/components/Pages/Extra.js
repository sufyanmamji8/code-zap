import React, { useState, useEffect, useRef } from "react";
import { FaArrowLeft, FaPaperclip, FaPaperPlane, FaCheck, FaCheckDouble, FaClock, FaExclamationTriangle } from "react-icons/fa";
import { Button, Col, Container, Input, Row, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import axios from "axios";
import io from "socket.io-client";
import Header from "components/Headers/Header";

const SOCKET_URL = "http://192.168.100.8:25483";
const API_BASE_URL = "http://192.168.100.8:25483/api/v1";
const BUSINESS_ID = "102953305799075";

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
  const token = localStorage.getItem('token');
  const isMobileView = window.innerWidth <= 768;

  // Socket Connection Setup
  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      transports: ["websocket"],
      withCredentials: true,
    });

    newSocket.on("connect", () => {
      console.log("Connected to socket server");
      newSocket.emit('join_business', BUSINESS_ID);
    });

    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    setSocket(newSocket);

    return () => {
      if (newSocket) newSocket.disconnect();
    };
  }, []);

  // Socket Event Handlers
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (messageData) => {
      setMessages(prevMessages => {
        if (prevMessages.some(msg => msg.messageId === messageData.messageId)) {
          return prevMessages;
        }
        const newMessages = [...prevMessages, messageData];
        updateContactsWithMessage(messageData);
        scrollToBottom();
        return newMessages;
      });
    };

    const handleMessageSent = (messageData) => {
      setMessages(prevMessages => {
        const messageIndex = prevMessages.findIndex(msg => msg.messageId === messageData.messageId);
        if (messageIndex === -1) {
          return [...prevMessages, messageData];
        }
        const updatedMessages = [...prevMessages];
        updatedMessages[messageIndex] = { ...updatedMessages[messageIndex], ...messageData };
        return updatedMessages;
      });
      updateContactsWithMessage(messageData);
    };

    const handleStatusUpdate = (updatedMessage) => {
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.messageId === updatedMessage.messageId
            ? { ...msg, ...updatedMessage }
            : msg
        )
      );
      updateContactsWithMessage(updatedMessage);
    };

    socket.on("new_message", handleNewMessage);
    socket.on("message_sent", handleMessageSent);
    socket.on("message_status_update", handleStatusUpdate);

    return () => {
      socket.off("new_message", handleNewMessage);
      socket.off("message_sent", handleMessageSent);
      socket.off("message_status_update", handleStatusUpdate);
    };
  }, [socket]);

  // Save contacts to localStorage
  useEffect(() => {
    localStorage.setItem('whatsappContacts', JSON.stringify(contacts));
  }, [contacts]);

  // Initial Messages Fetch
  useEffect(() => {
    fetchInitialMessages();
  }, []);

  const fetchInitialMessages = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${API_BASE_URL}/messages/getMessages`,
        { businessId: BUSINESS_ID },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        setMessages(response.data.data);
        response.data.data.forEach(msg => updateContactsWithMessage(msg));
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateContactsWithMessage = (message) => {
    const userNumber = message.from === "923030307660" ? message.to : message.from;
    
    setContacts(prevContacts => {
      const contactIndex = prevContacts.findIndex(c => c.phoneNumber === userNumber);
      const country = countryList.find(c => userNumber.startsWith(c.code));
      
      const updatedContact = {
        phoneNumber: userNumber,
        lastMessage: message.messageBody,
        timestamp: message.currentStatusTimestamp,
        flag: country?.flag || '🌐'
      };

      if (contactIndex === -1) {
        return [...prevContacts, updatedContact];
      }

      const newContacts = [...prevContacts];
      if (parseInt(message.currentStatusTimestamp) > parseInt(prevContacts[contactIndex].timestamp)) {
        newContacts[contactIndex] = updatedContact;
      }
      return newContacts;
    });
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return;

    const tempId = Date.now().toString();
    const tempMessage = {
      messageId: tempId,
      businessId: BUSINESS_ID,
      from: "923030307660",
      to: selectedUser.phoneNumber,
      messageBody: newMessage,
      type: "text",
      status: "sending",
      currentStatusTimestamp: (Date.now() / 1000).toString()
    };

    setMessages(prev => [...prev, tempMessage]);
    setNewMessage("");
    scrollToBottom();

    try {
      await axios.post(
        `${API_BASE_URL}/messages/send`,
        {
          to: selectedUser.phoneNumber,
          body: newMessage
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => prev.map(msg =>
        msg.messageId === tempId ? { ...msg, status: "failed" } : msg
      ));
    }
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

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const MessageStatusIcon = ({ status }) => {
    switch(status?.toLowerCase()) {
      case 'sent':
        return <FaCheck size={12} color="#667781" />;
      case 'delivered':
        return <FaCheckDouble size={12} color="#667781" />;
      case 'read':
        return <FaCheckDouble size={12} color="#53bdeb" />;
      case 'failed':
        return <FaExclamationTriangle size={12} color="#ef5350" />;
      case 'sending':
        return <FaClock size={12} color="#667781" />;
      default:
        return <FaCheck size={12} color="#667781" />;
    }
  };

  const filteredUsers = contacts
    .filter(user => user.phoneNumber && searchTerm 
      ? user.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase())
      : true)
    .sort((a, b) => parseInt(b.timestamp || '0') - parseInt(a.timestamp || '0'));

  // Component render methods
  const renderNewChatModal = () => (
    <Modal isOpen={isNewChatModal} toggle={() => setIsNewChatModal(false)}>
      <ModalHeader toggle={() => setIsNewChatModal(false)}>New Chat</ModalHeader>
      <ModalBody>
        <div className="flex gap-2 mb-4">
          <select
            value={selectedCountry.code}
            onChange={(e) => {
              const country = countryList.find(c => c.code === e.target.value);
              setSelectedCountry(country);
            }}
            className="p-2 rounded border border-gray-300 w-32"
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
            className="flex-1"
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
          className="bg-green-600 border-0"
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
      className="bg-gray-50 h-screen-minus-header border-r border-gray-200 p-4"
    >
      <div className="flex justify-between items-center gap-2 p-2">
        <Button
          onClick={() => setIsNewChatModal(true)}
          className="bg-green-600 rounded-full w-10 h-10 flex items-center justify-center border-0"
        >
          <i className="fas fa-plus text-white"></i>
        </Button>
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search users..."
          className="rounded-full bg-white border border-gray-200 px-4 py-2 flex-1"
        />
      </div>

      <div className="overflow-y-auto flex-1">
        {filteredUsers.map((user) => (
          <div
            key={user.phoneNumber}
            onClick={() => setSelectedUser(user)}
            className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors mb-1 ${
              selectedUser?.phoneNumber === user.phoneNumber ? 'bg-gray-200' : 'hover:bg-gray-100'
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3 text-xl">
              {user.flag}
            </div>
            <div className="flex-1 overflow-hidden">
              <h6 className="m-0 font-bold text-sm">{user.phoneNumber}</h6>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600 truncate max-w-[70%]">
                  {user.lastMessage}
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(parseInt(user.timestamp) * 1000).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
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
        className="h-screen-minus-header flex flex-col bg-gray-50 relative overflow-hidden"
      >
        {selectedUser ? (
          <>
            <div className="p-4 bg-green-800 text-white flex items-center justify-between rounded-t-lg sticky top-0 z-10">
              <h5 className="m-0 flex items-center text-white">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3 text-base">
                  {selectedUser.flag}
                </div>
                {selectedUser.phoneNumber}
              </h5>
              {isMobileView && (
                <Button
                  onClick={() => setSelectedUser(null)}
                  className="bg-transparent border-0 text-white"
                >
                  <FaArrowLeft />
                </Button>
              )}
            </div>

            <div className="flex-1 p-5 overflow-y-auto bg-chat-pattern">
              {chatMessages.map((message) => (
                <div
                  key={message.messageId}
                  className={`flex flex-col ${
                    message.from === selectedUser.phoneNumber ? 'items-start' : 'items-end'
                  } mb-3`}
                >
                  <div className={`relative max-w-[70%] p-3 rounded-lg shadow-sm ${
                    message.from === selectedUser.phoneNumber ? 'bg-white' : 'bg-green-100'
                  }`}>
                    <div className="text-sm text-gray-800 mr-4">
                      {message.messageBody}
                    </div>
                    <div className="text-xs text-gray-500 text-right flex items-center justify-end gap-1">
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

            <div className="p-3 bg-gray-100 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <Button
                  className="bg-white border-0 rounded-full w-10 h-10 flex items-center justify-center"
                >
                  <FaPaperclip size={20} className="text-gray-600" />
                </Button>

                <Input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message..."
                  className="rounded-full h-10 text-sm px-4 flex-grow border border-gray-200 bg-white"
                />

                <Button
                  onClick={sendMessage}
                  className="bg-green-600 rounded-full w-10 h-10 flex items-center justify-center border-0"
                >
                  <FaPaperPlane size={20} className="text-white" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a chat to start messaging
          </div>
        )}
      </Col>
    );
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden relative">
      <div>
        <Header />
      </div>
      {renderNewChatModal()}
      <Container 
        fluid 
        className="flex-1 pt-5 px-4 min-h-0 z-10"
      >
        <Row className="h-full">
          {(!selectedUser || !isMobileView) && renderUserList()}
          {(selectedUser || !isMobileView) && renderChatWindow()}
        </Row>
      </Container>

      {loading && (
        <div className="fixed inset-0 bg-white/70 flex items-center justify-center z-50">
          <div>Loading...</div>
        </div>
      )}
    </div>
  );
};

// Add custom styles to the document head
const style = document.createElement('style');
style.textContent = `
  .h-screen-minus-header {
    height: calc(100vh - 100px);
  }
  
  .bg-chat-pattern {
    background-color: #efeae2;
    background-image: url("data:image/svg+xml,%3Csvg width='64' height='64' viewBox='0 0 64 64' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 16c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm0-2c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6zm33.414-6l5.95-5.95L45.95.636 40 6.586 34.05.636 32.636 2.05 38.586 8l-5.95 5.95 1.414 1.414L40 9.414l5.95 5.95 1.414-1.414L41.414 8zM40 48c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm0-2c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6zM9.414 40l5.95-5.95-1.414-1.414L8 38.586l-5.95-5.95L.636 34.05 6.586 40l-5.95 5.95 1.414 1.414L8 41.414l5.95 5.95 1.414-1.414L9.414 40z' fill='%239C92AC' fill-opacity='0.08' fill-rule='evenodd'/%3E%3C/svg%3E");
  }
`;
document.head.appendChild(style);

export default WhatsAppChats;