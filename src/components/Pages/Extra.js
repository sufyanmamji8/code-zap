import React, { useState, useEffect, useRef } from "react";
import {
  FaArrowLeft,
  FaPaperclip,
  FaPaperPlane,
  FaCheck,
  FaCheckDouble,
  FaClock,
  FaExclamationTriangle,
} from "react-icons/fa";
import {
  Button,
  Col,
  Container,
  Input,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Card,
  CardBody,
} from "reactstrap";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { MESSAGE_API_ENDPOINT } from "Api/Constant";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import countryList from "./countryList";
import io from "socket.io-client";

const WhatsAppChats = () => {
  const location = useLocation();
  const { config, companyId } = location.state || {};
  const businessId = config?.whatsappBusinessAccountId;
  
  const calculateContactsPerPage = () => {
    const screenHeight = window.innerHeight;
    const approximateContactHeight = 70; // Height of each contact item in pixels
    const headerHeight = 200; // Approximate height of header elements
    const availableHeight = screenHeight - headerHeight;
    return Math.floor(availableHeight / approximateContactHeight);
  };

  const [messages, setMessages] = useState([]);
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
  const socketRef = useRef(null);
  const chatEndRef = useRef(null);
  const contactListRef = useRef(null);
  const [templates, setTemplates] = useState([]);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);
  const isMobileView = window.innerWidth <= 768;
  const token = localStorage.getItem("token");
  const [contactsPerPage, setContactsPerPage] = useState(calculateContactsPerPage());
  const [countrySearchTerm, setCountrySearchTerm] = useState("");
  const [filteredCountries, setFilteredCountries] = useState(countryList);



 
  
  useEffect(() => {
    const handleResize = () => {
      setContactsPerPage(calculateContactsPerPage());
    };
  
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  useEffect(() => {
    if (businessId) {
      socketRef.current = io("https://codozap-e04e12b02929.herokuapp.com");
      
      socketRef.current.on(`onmessagerecv-${businessId}`, async () => {
        console.log("Socket: New message received");
        
        if (selectedUser) {
          await fetchMessages(selectedUser.phoneNumber);
        }
        
        const response = await axios.post(
          `${MESSAGE_API_ENDPOINT}/getContact`,
          {
            companyId,
          },
          {
            params: {
              page: 1,
              limit: contactsPerPage, // Use dynamic contactsPerPage
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        if (response.data.success) {
          const newContacts = response.data.contacts.map((contact) => ({
            ...contact,
            phoneNumber: contact._id,
            name: contact.senderName || contact.name || contact._id,
            lastMessage: contact.recentMessage || "",
            timestamp: contact.latestChat
              ? new Date(contact.latestChat).getTime() / 1000
              : "",
          }));
  
          setContacts(prevContacts => {
            const existingContactsNotInFirstPage = prevContacts.filter(
              existingContact => !newContacts.some(
                newContact => newContact.phoneNumber === existingContact.phoneNumber
              )
            );
            
            return [...newContacts, ...existingContactsNotInFirstPage];
          });
        }
      });
  
      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
        }
      };
    }
  }, [businessId, selectedUser, companyId, token, contactsPerPage]);

  


  // Fetch contacts with pagination
  const fetchContacts = async (pageNum = 1, isInitial = false) => {
  if (!businessId || (!isInitial && !hasMore) || loadingMore) return;

  try {
    setLoadingMore(true);

    const response = await axios.post(
      `${MESSAGE_API_ENDPOINT}/getContact`,
      {
        companyId,
      },
      {
        params: {
          page: pageNum,
          limit: contactsPerPage, // Use dynamic contactsPerPage instead of fixed 5
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.success) {
      const newContacts = response.data.contacts.map((contact) => ({
        ...contact,
        phoneNumber: contact._id,
        name: contact.senderName || contact.name || contact._id,
        lastMessage: contact.recentMessage || "",
        timestamp: contact.latestChat
          ? new Date(contact.latestChat).getTime() / 1000
          : "",
      }));

      setContacts((prev) => {
        if (pageNum === 1) {
          return newContacts;
        } else {
          const existingPhoneNumbers = prev.map((c) => c.phoneNumber);
          const uniqueNewContacts = newContacts.filter(
            (contact) => !existingPhoneNumbers.includes(contact.phoneNumber)
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

useEffect(() => {
  if (selectedUser && chatEndRef.current) {
    chatEndRef.current.scrollIntoView({ behavior: "smooth" });
  }
}, [messages, selectedUser]); 

  // Fetch messages for selected contact
  const fetchMessages = async (contactPhoneNumber) => {
    if (!businessId || !contactPhoneNumber) return;

    try {
      setLoading(true);
      const response = await axios.post(
        `${MESSAGE_API_ENDPOINT}/getMessages`,
        {
          businessId,
          contactNumber: contactPhoneNumber,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setMessages(response.data.data);

        // Extract sender name from messages
        const messages = response.data.data;
        if (messages.length > 0) {
          const latestMessage = messages.find(
            (msg) => msg.senderName && msg.from === contactPhoneNumber
          );
          if (latestMessage?.senderName) {
            setSenderNames((prev) => ({
              ...prev,
              [contactPhoneNumber]: latestMessage.senderName,
            }));
          }
        }

        // Update contacts with sender name
        setContacts((prevContacts) =>
          prevContacts.map((contact) => {
            if (contact.phoneNumber === contactPhoneNumber) {
              const latestMessage = messages.find(
                (msg) => msg.senderName && msg.from === contactPhoneNumber
              );
              return {
                ...contact,
                name: latestMessage?.senderName || contact.name,
                lastMessage: messages[0]?.messageBody || contact.lastMessage,
                timestamp:
                  messages[0]?.currentStatusTimestamp || contact.timestamp,
              };
            }
            return contact;
          })
        );

        // Add this: Scroll to bottom after messages are loaded
        setTimeout(() => {
          if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: "smooth" });
          }
        }, 100);
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
      if (
        scrollTop + clientHeight >= scrollHeight - 50 &&
        hasMore &&
        !loadingMore
      ) {
        fetchContacts(page + 1);
      }
    }
  };

  useEffect(() => {
    const fetchTemplatesAndAddToChat = async () => {
      if (!selectedUser || !businessId || isLoadingTemplates) return;

      try {
        setIsLoadingTemplates(true);
        const response = await axios.post(
          `${MESSAGE_API_ENDPOINT}/fetchTemplates`,
          {
            companyId,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.success) {
          // Convert templates to message format
          const templateMessages = response.data.templates.map(template => ({
            messageId: `template-${template.id}`,
            businessId: businessId,
            from: 'TEMPLATE',
            to: selectedUser.phoneNumber,
            messageBody: template.components?.find(c => c.type === 'BODY')?.text || 'No template content',
            type: 'template',
            status: 'template',
            sentTimestamp: Date.now() / 1000,
            currentStatusTimestamp: Date.now() / 1000,
            originalTimestamp: Date.now() / 1000,
            templateName: template.name,
            templateId: template.id,
            components: template.components
          }));

          // Add templates to messages
          setMessages(prev => [...prev, ...templateMessages]);
        }
      } catch (error) {
        console.error('Error fetching templates:', error);
      } finally {
        setIsLoadingTemplates(false);
      }
    };

    fetchTemplatesAndAddToChat();
  }, [selectedUser, businessId]);

 

  const CustomTooltip = ({ children, content, isOpen, setIsOpen }) => {
    useEffect(() => {
      let timer;
      if (isOpen) {
        timer = setTimeout(() => {
          setIsOpen(false);
        }, 2000); // Close after 2 seconds
      }
      return () => {
        if (timer) clearTimeout(timer);
      };
    }, [isOpen, setIsOpen]);
  
    if (!isOpen) return children;
  
    return (
      <div style={{ position: "relative" }}>
        {children}
        <div
          style={{
            position: "absolute",
            bottom: "100%",
            right: "0",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            color: "white",
            padding: "8px 12px",
            borderRadius: "6px",
            fontSize: "11px",
            whiteSpace: "normal",
            zIndex: 1000,
            marginBottom: "8px",
            maxWidth: "200px",
            width: "max-content",
            boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
            wordBreak: "break-word",
          }}
        >
          {content}
          <div
            style={{
              position: "absolute",
              bottom: "-4px",
              right: "4px",
              width: "6px",
              height: "6px",
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              transform: "rotate(45deg)",
            }}
          />
        </div>
      </div>
    );
  };
  
  const MessageStatusIcon = ({ status, failureReason }) => {
    const [showTooltip, setShowTooltip] = useState(false);
  
    const getIconStyle = (status) => ({
      transition: "all 0.3s ease",
      animation: status === "sending" ? "spin 1s linear infinite" : "none",
      cursor: status === "failed" ? "pointer" : "default",
    });
  
    const renderIcon = () => {
      switch (status?.toLowerCase()) {
        case "sent":
          return (
            <FaCheck size={12} color="#667781" style={getIconStyle(status)} />
          );
        case "delivered":
          return (
            <FaCheckDouble
              size={12}
              color="#667781"
              style={getIconStyle(status)}
            />
          );
        case "read":
          return (
            <FaCheckDouble
              size={12}
              color="#53bdeb"
              style={getIconStyle(status)}
            />
          );
        case "failed":
          return (
            <CustomTooltip
              content={failureReason || "Message failed to send"}
              isOpen={showTooltip}
              setIsOpen={setShowTooltip}
            >
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTooltip(true);
                }}
              >
                <FaExclamationTriangle
                  size={12}
                  color="#ef5350"
                  style={getIconStyle(status)}
                />
              </div>
            </CustomTooltip>
          );
        case "sending":
          return (
            <FaClock size={12} color="#667781" style={getIconStyle(status)} />
          );
        default:
          return <FaCheck size={12} color="#667781" style={getIconStyle("")} />;
      }
    };
  
    return renderIcon();
  };

  const startNewChat = () => {
    const fullNumber = selectedCountry.code + phoneNumber;
    const existingContact = contacts.find((c) => c.phoneNumber === fullNumber);

    if (!existingContact) {
      const newUser = {
        phoneNumber: fullNumber,
        lastMessage: "",
        timestamp: (Date.now() / 1000).toString(),
        flag: selectedCountry.flag,
      };
      setContacts((prev) => [...prev, newUser]);
      setSelectedUser(newUser);
    } else {
      setSelectedUser(existingContact);
    }

    setPhoneNumber("");
    setIsNewChatModal(false);
  };

  const scrollToBottom = () => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  };

  const uniqueUsers = React.useMemo(() => {
    const users = new Map();
  
    contacts.forEach((contact) => {
      if (contact && contact.phoneNumber) {
        users.set(contact.phoneNumber, {
          ...contact,
          lastMessage: contact.lastMessage || "",
          timestamp: contact.timestamp || (Date.now() / 1000).toString(),
        });
      }
    });
  
    messages.forEach((msg) => {
      if (!msg) return;
  
      const contactNumber =
        msg.from === config?.phoneNumber ? msg.to : msg.from;
  
      if (!contactNumber) return;
  
      const existingUser = users.get(contactNumber);
      const messageTimestamp = parseInt(msg.sentTimestamp || msg.originalTimestamp || msg.currentStatusTimestamp);
      const existingTimestamp = existingUser
        ? parseInt(existingUser.timestamp)
        : 0;
  
      if (!existingUser || messageTimestamp > existingTimestamp) {
        const country = countryList.find(
          (c) => c && c.code && contactNumber.startsWith(c.code)
        );
  
        users.set(contactNumber, {
          ...(existingUser || {}),
          phoneNumber: contactNumber,
          lastMessage: msg.messageBody,
          timestamp: msg.sentTimestamp || msg.originalTimestamp || msg.currentStatusTimestamp,
          flag: country?.flag || "🌐",
        });
      }
    });
  
    return Array.from(users.values())
      .filter((user) => user && user.phoneNumber)
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
      sentTimestamp: currentTimestamp,      // Original sent timestamp
      currentStatusTimestamp: currentTimestamp,  // Will be updated with status changes
      originalTimestamp: currentTimestamp,   // New field to store original time
      senderName: config.companyName || config.phoneNumber,
    };
  
    try {
      setMessages((prev) => [...prev, tempMessage]);
  
      setContacts((prev) => {
        const updatedContacts = prev.map((contact) => {
          if (contact.phoneNumber === selectedUser.phoneNumber) {
            return {
              ...contact,
              lastMessage: newMessage,
              timestamp: currentTimestamp, // Using the original send timestamp
            };
          }
          return contact;
        });
      
        return updatedContacts.sort((a, b) => {
          const timestampA = parseInt(a.timestamp) || 0;
          const timestampB = parseInt(b.timestamp) || 0;
          return timestampB - timestampA;
        });
      });
  
      const response = await axios.post(
        `${MESSAGE_API_ENDPOINT}/send`,
        {
          to: selectedUser.phoneNumber,
          body: newMessage,
          companyId: companyId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      if (response.data.success && response.data.data.messages) {
        const actualMessageId = response.data.data.messages[0].id;
  
        setMessages((prev) =>
          prev.map((msg) =>
            msg.messageId === tempId
              ? { 
                  ...msg, 
                  messageId: actualMessageId, 
                  status: "sent",
                  currentStatusTimestamp: Date.now() / 1000, // Update status timestamp
                  sentTimestamp: msg.originalTimestamp  // Keep original timestamp
                }
              : msg
          )
        );
  
        fetchContacts(1, false);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.messageId === tempId
            ? {
                ...msg,
                status: "failed",
                currentStatusTimestamp: Date.now() / 1000,  // Update status timestamp
                sentTimestamp: msg.originalTimestamp,       // Keep original timestamp
                failureReason:
                  error.response?.data?.message || "Failed to send message",
              }
            : msg
        )
      );
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
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  };

  const groupMessagesByDate = (messages) => {
    const groups = {};

    messages.forEach((message) => {
      const date = new Date(
        parseInt(message.currentStatusTimestamp) * 1000
      ).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });

    return Object.entries(groups)
      .map(([date, messages]) => ({
        date,
        timestamp: parseInt(messages[0].currentStatusTimestamp),
        messages,
      }))
      .sort((a, b) => a.timestamp - b.timestamp);
  };

  

  

  const renderDateSeparator = (date) => (
    <div
      style={{
        textAlign: "center",
        padding: "8px 0",
        margin: "8px 0",
      }}
    >
      <span
        style={{
          backgroundColor: "#e2f3fb",
          padding: "4px 12px",
          borderRadius: "6px",
          fontSize: "12px",
          color: "#54656f",
        }}
      >
        {formatDate(date)}
      </span>
    </div>
  );

  const format12HourTime = (timestamp) => {
    return new Date(parseInt(timestamp) * 1000).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const renderNewChatModal = () => {
    const filterCountries = (searchTerm) => {
      return countryList.filter(country => 
        country.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.code.includes(searchTerm)
      );
    };

    const handleCountrySearch = (e) => {
      const searchTerm = e.target.value;
      setCountrySearchTerm(searchTerm);
      setFilteredCountries(filterCountries(searchTerm));
    };

    return (
      <Modal 
        isOpen={isNewChatModal} 
        toggle={() => setIsNewChatModal(false)}
        size="sm" // Making modal smaller
      >
        <ModalHeader 
          toggle={() => setIsNewChatModal(false)}
          className="py-2" // Reducing header padding
        >
          New Chat
        </ModalHeader>
        <ModalBody className="p-2"> {/* Reducing body padding */}
          <div className="d-flex flex-column gap-2">
            <Input
              type="text"
              value={countrySearchTerm}
              onChange={handleCountrySearch}
              placeholder="Search country..."
              className="mb-1"
              size="sm" // Smaller input
            />
            
            <div style={{ 
              maxHeight: "150px", // Reduced height
              overflowY: "auto",
              border: "1px solid #ddd",
              borderRadius: "4px"
            }}>
              {filteredCountries.map((country) => (
                <div
                  key={country.code}
                  onClick={() => {
                    setSelectedCountry(country);
                    setCountrySearchTerm("");
                  }}
                  style={{
                    padding: "6px 8px", // Reduced padding
                    cursor: "pointer",
                    backgroundColor: selectedCountry.code === country.code ? "#e8f5ff" : "white",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    borderBottom: "1px solid #eee",
                    fontSize: "0.9rem" // Smaller font
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = "#f5f5f5"}
                  onMouseLeave={(e) => e.target.style.backgroundColor = selectedCountry.code === country.code ? "#e8f5ff" : "white"}
                >
                  <span>{country.flag}</span>
                  <span style={{ flex: 1 }}>{country.country}</span>
                  <span style={{ color: "#666", fontSize: "0.8rem" }}>+{country.code}</span>
                </div>
              ))}
            </div>

            <div className="mt-2 d-flex gap-2">
              <span className="d-flex align-items-center px-2 bg-light rounded">
                +{selectedCountry.code}
              </span>
              <Input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                placeholder="Phone number"
                size="sm" // Smaller input
                style={{ flex: 1 }}
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter className="py-2 px-2"> {/* Reducing footer padding */}
          <Button 
            color="secondary" 
            size="sm" // Smaller button
            onClick={() => {
              setIsNewChatModal(false);
              setCountrySearchTerm("");
            }}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            size="sm" // Smaller button
            onClick={startNewChat}
            disabled={!phoneNumber.length}
            style={{ backgroundColor: "#00a884", border: "none" }}
          >
            Start Chat
          </Button>
        </ModalFooter>
      </Modal>
    );
  };

  const handleTemplateClick = (template) => {
    // When template is clicked, set it as the new message
    const processedText = template.messageBody.replace(/\{\{\d+\}\}/g, '___');
    setNewMessage(processedText);
  };

  const renderMessage = (message) => {
    const isReceived = message.from === selectedUser.phoneNumber;
    const isTemplate = message.type === 'template';

    if (isTemplate) {
      return (
        <div
          key={message.messageId}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: "12px",
            width: "100%"
          }}
        >
          <div
            style={{
              maxWidth: "80%",
              padding: "12px 16px",
              backgroundColor: "#f0f7ff",
              borderRadius: "8px",
              border: "1px solid #cce4ff",
              cursor: "pointer"
            }}
            onClick={() => handleTemplateClick(message)}
          >
            <div style={{ 
              fontSize: "12px", 
              color: "#0066cc",
              marginBottom: "4px",
              fontWeight: "500" 
            }}>
              Template: {message.templateName}
            </div>
            <div style={{ fontSize: "14px" }}>
              {message.messageBody}
            </div>
            <div style={{
              fontSize: "11px",
              color: "#667781",
              textAlign: "right",
              marginTop: "4px"
            }}>
              Click to use template
            </div>
          </div>
        </div>
      );
    }

    // Regular message rendering remains the same
    return (
      <div
        key={message.messageId}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: isReceived ? "flex-start" : "flex-end",
          marginBottom: "12px",
        }}
      >
        <div
          style={{
            maxWidth: "70%",
            padding: "8px 12px",
            backgroundColor: isReceived ? "#fff" : "#dcf8c6",
            borderRadius: "8px",
            position: "relative",
          }}
        >
          <div style={{ fontSize: "14px", marginBottom: "4px" }}>
            {message.messageBody}
          </div>
          <div
            style={{
              fontSize: "11px",
              color: "#667781",
              textAlign: "right",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: "4px",
            }}
          >
            <span>
              {format12HourTime(message.sentTimestamp || message.currentStatusTimestamp)}
            </span>
            {!isReceived && (
              <MessageStatusIcon
                status={message.status}
                failureReason={message.failureReason}
              />
            )}
          </div>
        </div>
      </div>
    );
  };


  const renderUserList = () => (
    <Col
      xs="12"
      md="4"
      className="d-flex flex-column"
      style={{
        backgroundColor: "#f0f4f8",
        height: "100%",
        padding: "10px",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {initialLoading && <LoaderOverlay />}
      
      {/* Company Info Card - Fixed Height */}
      <Card className="mb-2" style={{ flexShrink: 0 }}>
        <CardBody className="p-3">
          <div className="d-flex align-items-center">
            <div
              className="me-3 rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: 45, height: 45, background: "#00a884" }}
            >
              <i className="fab fa-whatsapp fa-lg text-white"></i>
            </div>
            <div>
              <small className="font-weight-bold" style={{ marginLeft: "10px" }}>
                {config?.companyName}
              </small>
              <h5 className="mb-1 font-weight-bold" style={{ marginLeft: "10px" }}>
                {config?.phoneNumber}
              </h5>
            </div>
          </div>
        </CardBody>
      </Card>
  
      {/* Search Bar Section - Fixed Height */}
      <div
        style={{
          padding: "5px 0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "10px",
          flexShrink: 0
        }}
      >
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
  
      {/* Contact List - Scrollable */}
      <div
        ref={contactListRef}
        onScroll={handleContactScroll}
        style={{ 
          overflowY: "auto",
          flex: 1,
          marginTop: "5px",
          paddingRight: "5px"
        }}
      >
        {contacts.map((contact) => {
          const latestData =
            uniqueUsers.find((u) => u.phoneNumber === contact.phoneNumber) ||
            contact;
          const country = countryList.find((c) =>
            contact.phoneNumber.startsWith(c.code)
          );
          const displayName =
            contact.senderName ||
            contact.name ||
            senderNames[contact.phoneNumber] ||
            contact.phoneNumber;
  
          return (
            <div
              key={contact.phoneNumber}
              onClick={() =>
                setSelectedUser({
                  ...contact,
                  senderName: displayName,
                  flag: country?.flag || "🌐",
                })
              }
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px",
                borderRadius: "10px",
                backgroundColor:
                  selectedUser?.phoneNumber === contact.phoneNumber
                    ? "#e8e8e8"
                    : "transparent",
                cursor: "pointer",
                transition: "background-color 0.3s ease",
                marginBottom: "5px",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  backgroundColor: "#e0e0e0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "10px",
                  fontSize: "20px",
                }}
              >
                {country?.flag || "🌐"}
              </div>
              <div style={{ flex: 1, overflow: "hidden" }}>
                <h6 style={{ margin: 0, fontWeight: "bold", fontSize: "14px" }}>
                  {displayName}
                </h6>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
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
                    {latestData.timestamp
                      ? format12HourTime(latestData.timestamp)
                      : ""}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {loadingMore && (
          <div style={{ textAlign: "center", padding: "10px", marginBottom: "5px" }}>
            Loading more contacts...
          </div>
        )}
      </div>
    </Col>
  );

  const renderChatWindow = () => {
    const chatMessages = selectedUser
      ? messages.filter(
          (msg) =>
            msg.from === selectedUser.phoneNumber ||
            msg.to === selectedUser.phoneNumber ||
            msg.type === 'template'
        )
      : [];
  
    
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
          // overflow: "hidden",
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
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
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
                <div
                  style={{
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
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                >
                  {selectedUser.flag}
                </div>
                <div>
                  <div style={{ fontWeight: "600" }}>
                    {selectedUser.senderName ||
                      selectedUser.name ||
                      senderNames[selectedUser.phoneNumber] ||
                      selectedUser.phoneNumber}
                  </div>
                  <div style={{ fontSize: "12px", opacity: 0.9 }}>
                    {selectedUser.phoneNumber}
                  </div>
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
        marginBottom: "12px",
      }}
    >
      <div
        style={{
          maxWidth: "70%",
          padding: "8px 12px",
          backgroundColor: isReceived ? "#fff" : "#dcf8c6",
          borderRadius: "8px",
          position: "relative",
        }}
      >
        <div style={{ fontSize: "14px", marginBottom: "4px" }}>
          {message.messageBody}
        </div>
        <div
          style={{
            fontSize: "11px",
            color: "#667781",
            textAlign: "right",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "4px",
          }}
        >
          <span>
            {format12HourTime(message.sentTimestamp || message.currentStatusTimestamp)}
          </span>
          {!isReceived && (
            <MessageStatusIcon
              status={message.status}
              failureReason={message.failureReason}
            />
          )}
        </div>
      </div>
    </div>
  );
})}
                </div>
              ))}
              <div ref={chatEndRef} style={{ height: "1px" }} />
            </div>
  
            <div
  style={{
    padding: "12px 16px",
    backgroundColor: "#f0f0f0",
    position: isMobileView ? "fixed" : "relative",
    bottom: 0,
    left: isMobileView ? 0 : "auto",
    right: isMobileView ? 0 : "auto",
    width: isMobileView ? "100%" : "auto",
    zIndex: 2,
    borderTop: "none" // Removed the border
  }}
>
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "10px",
      backgroundColor: "#fff",
      padding: "6px 12px",
      borderRadius: "24px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
    }}
  >
    <Button
      style={{
        background: "transparent",
        border: "none",
        padding: "8px",
        color: "#54656f",
      }}
    >
      <FaPaperclip size={20} />
    </Button>
    <Input
      type="text"
      value={newMessage}
      onChange={(e) => setNewMessage(e.target.value)}
      onKeyPress={(e) => e.key === "Enter" && sendMessage()}
      placeholder="Type a message..."
      style={{
        border: "none",
        padding: "8px",
        flex: 1,
        backgroundColor: "transparent",
        boxShadow: "none", // Remove any default input shadow
        outline: "none" // Remove outline on focus
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
        color: newMessage.trim() ? "#fff" : "#8696a0",
      }}
    >
      <FaPaperPlane size={18} />
    </Button>
  </div>
</div>
          </>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: "#667781",
              gap: "16px",
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                backgroundColor: "#f0f2f5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FaPaperPlane size={24} style={{ color: "#8696a0" }} />
            </div>
            <div style={{ textAlign: "center" }}>
              <p
                style={{
                  fontSize: "18px",
                  fontWeight: "500",
                  margin: "0 0 8px 0",
                }}
              >
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
    <div
      style={{
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
        zIndex: 1000,
      }}
    >
      <DotLottieReact
        src="https://lottie.host/fe6880d6-bf83-42f4-87cf-06835aa1a376/Blq1yF0rqk.lottie"
        loop
        autoplay
        style={{ width: "200px", height: "200px" }}
      />
      <p
        style={{
          marginTop: "20px",
          color: "#667781",
          fontSize: "16px",
          fontWeight: "500",
        }}
      >
        Loading messages...
      </p>
    </div>
  );
  return (
    <div
      style={{
        height: "85vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative",
      }}
    >
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