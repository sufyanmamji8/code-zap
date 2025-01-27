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
  const isMobileView = window.innerWidth <= 768;
  const token = localStorage.getItem("token");
  const [contactsPerPage, setContactsPerPage] = useState(calculateContactsPerPage());
  const [countrySearchTerm, setCountrySearchTerm] = useState("");
  const [filteredCountries, setFilteredCountries] = useState(countryList);
  const [templates, setTemplates] = useState([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);

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

  const fetchUserTemplates = async (contactPhoneNumber) => {
    if (!businessId || !companyId || !contactPhoneNumber) return;

    try {
      setLoadingTemplates(true);
      const response = await axios.post(
        `${MESSAGE_API_ENDPOINT}/getTemplates`,
        {
          businessId,
          companyId,
          contactNumber: contactPhoneNumber
        },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setTemplates(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching user templates:", error);
    } finally {
      setLoadingTemplates(false);
    }
  };

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
      // First fetch contacts
      fetchContacts(1, true)
        .then(() => {
          // Then fetch messages
          fetchMessages(selectedUser.phoneNumber)
            .then(() => {
              // Finally fetch user-specific templates
              fetchUserTemplates(selectedUser.phoneNumber);
            });
        });
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
      <div className="tooltip-container">
        {children}
        <div className="tooltip-content">
          {content}
          <div className="tooltip-arrow" />
        </div>
      </div>
    );
  };
  
  const MessageStatusIcon = ({ status, failureReason }) => {
    const [showTooltip, setShowTooltip] = useState(false);
  
    const getIconStyle = (status) => ({
      animation: status === "sending" ? "spin 1s linear infinite" : "none",
      cursor: status === "failed" ? "pointer" : "default",
    });
  
    const renderIcon = () => {
      switch (status?.toLowerCase()) {
        case "sent":
          return <FaCheck size={12} color="#667781" style={getIconStyle(status)} />;
        case "delivered":
          return (
            <FaCheckDouble size={12} color="#667781" style={getIconStyle(status)} />
          );
        case "read":
          return (
            <FaCheckDouble size={12} color="#53bdeb" style={getIconStyle(status)} />
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
          return <FaClock size={12} color="#667781" style={getIconStyle(status)} />;
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

  const renderTemplates = () => {
    if (loadingTemplates || templates.length === 0) return null;
  
    return (
      <div className="templates-container">
        <h5 className="templates-title">Available Templates</h5>
        {templates.map((template) => (
          <div
            key={template._id}
            className="template-item"
            onClick={() => {
              const templateBody =
                template.components.find((c) => c.type === "BODY")?.text || "";
              setNewMessage(templateBody);
            }}
          >
            <strong>{template.templateName}</strong>
            <p>{template.components.find((c) => c.type === "BODY")?.text}</p>
          </div>
        ))}
      </div>
    );
  };
  
  const renderDateSeparator = (date) => (
    <div className="date-separator">
      <span className="date-separator-text">{formatDate(date)}</span>
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
      return countryList.filter((country) =>
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
      <Modal isOpen={isNewChatModal} toggle={() => setIsNewChatModal(false)} size="sm">
        <ModalHeader
          toggle={() => setIsNewChatModal(false)}
          className="modal-header"
        >
          New Chat
        </ModalHeader>
        <ModalBody className="modal-body">
          <div className="modal-content-container">
            <Input
              type="text"
              value={countrySearchTerm}
              onChange={handleCountrySearch}
              placeholder="Search country..."
              className="search-input"
            />
            <div className="country-list-container">
              {filteredCountries.map((country) => (
                <div
                  key={country.code}
                  onClick={() => {
                    setSelectedCountry(country);
                    setCountrySearchTerm("");
                  }}
                  className={`country-item ${
                    selectedCountry.code === country.code ? "selected" : ""
                  }`}
                >
                  <span>{country.flag}</span>
                  <span className="country-name">{country.country}</span>
                  <span className="country-code">+{country.code}</span>
                </div>
              ))}
            </div>
            <div className="phone-number-container">
              <span className="country-code-badge">+{selectedCountry.code}</span>
              <Input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                placeholder="Phone number"
                className="phone-input"
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter className="modal-footer">
          <Button
            color="secondary"
            size="sm"
            onClick={() => {
              setIsNewChatModal(false);
              setCountrySearchTerm("");
            }}
            className="cancel-button"
          >
            Cancel
          </Button>
          <Button
            color="primary"
            size="sm"
            onClick={startNewChat}
            disabled={!phoneNumber.length}
            className="start-chat-button"
          >
            Start Chat
          </Button>
        </ModalFooter>
      </Modal>
    );
  };
  
  const renderUserList = () => (
    <Col xs="12" md="4" className="user-list-container">
      {initialLoading && <LoaderOverlay />}
  
      {/* Company Info Card */}
      <Card className="company-info-card">
        <CardBody>
          <div className="company-info">
            <div className="company-icon">
              <i className="fab fa-whatsapp fa-lg text-white"></i>
            </div>
            <div>
              <small className="company-name">{config?.companyName}</small>
              <h5 className="company-phone">{config?.phoneNumber}</h5>
            </div>
          </div>
        </CardBody>
      </Card>
  
      {/* Search Bar Section */}
      <div className="search-bar-section">
        <Button
          onClick={() => setIsNewChatModal(true)}
          className="new-chat-button"
        >
          <i className="fas fa-plus"></i>
        </Button>
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search users..."
          className="user-search-input"
        />
      </div>
  
      {/* Contact List */}
      <div
        ref={contactListRef}
        onScroll={handleContactScroll}
        className="contact-list-container"
      >
        {contacts.map((contact) => {
          const latestData =
            uniqueUsers.find((u) => u.phoneNumber === contact.phoneNumber) || contact;
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
              className={`contact-item ${
                selectedUser?.phoneNumber === contact.phoneNumber ? "selected" : ""
              }`}
            >
              <div className="contact-flag">{country?.flag || "🌐"}</div>
              <div className="contact-info">
                <h6 className="contact-name">{displayName}</h6>
                <div className="contact-details">
                  <div className="last-message">{latestData.lastMessage}</div>
                  <div className="timestamp">
                    {latestData.timestamp ? format12HourTime(latestData.timestamp) : ""}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {loadingMore && (
          <div className="loading-more">Loading more contacts...</div>
        )}
      </div>
    </Col>
  );
  
  const formatTemplateText = (text) => {
    // Split the text by star patterns
    const parts = text.split(/(\*[^*]+\*)/g);
    
    // Map through parts and wrap starred content in bold tags
    return parts.map((part, index) => {
      if (part.startsWith('*') && part.endsWith('*')) {
        // Remove stars and wrap content in strong tag
        const boldContent = part.slice(1, -1);
        return `<strong>${boldContent}</strong>`;
      }
      return part;
    }).join('');
  };
  
  // Function to safely render HTML content
  const createMarkup = (htmlContent) => {
    return { __html: htmlContent };
  };
  
  const renderTemplateMessage = (message) => {
    const { components } = message;
    const isReceived = message.from === selectedUser.phoneNumber;
  
    return (
      <div className={`message-container ${isReceived ? 'received' : 'sent'}`}>
        <div className="message-bubble">
          {components.map((component, index) => {
            switch (component.type) {
              case "HEADER":
                return (
                  <img
                    key={index}
                    src={component.media.link}
                    alt="Template Header"
                    className="message-header"
                  />
                );
              case "BODY":
                return (
                  <div
                    key={index}
                    className="message-body"
                    dangerouslySetInnerHTML={createMarkup(formatTemplateText(component.text))}
                  />
                );
              case "FOOTER":
                return (
                  <div key={index} className="message-footer">
                    {component.text}
                  </div>
                );
              default:
                return null;
            }
          })}
          <div className="message-timestamp">
            <span>{format12HourTime(message.sentTimestamp || message.currentStatusTimestamp)}</span>
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
  
  const renderChatWindow = () => {
    const chatMessages = selectedUser
      ? messages.filter(
          (msg) =>
            msg.from === selectedUser.phoneNumber ||
            msg.to === selectedUser.phoneNumber
        )
      : [];
    
    const groupedMessages = groupMessagesByDate(chatMessages);
    
    return (
      <Col
        xs="12"
        md="8"
        className="chat-window"
      >
        {/* Chat Header */}
        {selectedUser && (
          <div className="chat-header">
            {isMobileView && (
              <Button
                onClick={() => setSelectedUser(null)}
                className="back-button"
              >
                <FaArrowLeft size={20} />
              </Button>
            )}
  
            <div className="user-avatar">
              {selectedUser.flag || "👤"}
            </div>
  
            <div>
              <h6 className="user-name">{selectedUser.senderName || selectedUser.phoneNumber}</h6>
            </div>
          </div>
        )}
  
        {initialLoading && <LoaderOverlay />}
        {selectedUser ? (
          <>
            <div className="messages-list">
              {groupedMessages.map((group) => (
                <div key={group.date}>
                  {renderDateSeparator(group.timestamp)}
                  {group.messages.map((message) => {
                    const isReceived = message.from === selectedUser.phoneNumber;
                    if (message.type === "template") {
                      return renderTemplateMessage(message);
                    } else {
                      return (
                        <div className={`message-container ${isReceived ? 'received' : 'sent'}`}>
                          <div className="message-bubble">
                            <div className="message-text">{message.messageBody}</div>
                            <div className="message-timestamp">
                              <span>{format12HourTime(message.sentTimestamp || message.currentStatusTimestamp)}</span>
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
                    }
                  })}
                </div>
              ))}
              <div ref={chatEndRef} style={{ height: "1px" }} />
            </div>
  
            {/* Message Input Section */}
            <div className="message-input-container">
              <div className="message-input-box">
                <Button className="attach-button">
                  <FaPaperclip size={20} />
                </Button>
                <Input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Type a message..."
                  className="message-input"
                />
                <Button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className={`send-button ${newMessage.trim() ? 'active' : ''}`}
                >
                  <FaPaperPlane size={18} />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="no-chat-selected">
            <div className="no-chat-icon">
              <FaPaperPlane size={24} className="inactive" />
            </div>
            <div className="no-chat-text">
              <p>Select a chat to start messaging</p>
              <p>Send and receive messages in real-time</p>
            </div>
          </div>
        )}
      </Col>
    );
  };
  
  const LoaderOverlay = () => (
    <div className="loader-overlay">
      <DotLottieReact
        src="https://lottie.host/fe6880d6-bf83-42f4-87cf-06835aa1a376/Blq1yF0rqk.lottie"
        loop
        autoplay
        className="loader-animation"
      />
      <p className="loading-text">Loading messages...</p>
    </div>
  );
  
  return (
    <div className="chat-container">
      <style>
        {`
          /* Hide scrollbar for Chrome, Safari and Opera */
          *::-webkit-scrollbar {
            display: none;
          }
  
          /* Hide scrollbar for IE, Edge and Firefox */
          * {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
          }
        `}
      </style>
      {renderNewChatModal()}
      <Container fluid className="chat-content">
        <Row className="chat-row">
          {(!selectedUser || !isMobileView) && renderUserList()}
          {(selectedUser || !isMobileView) && renderChatWindow()}
        </Row>
      </Container>
    </div>
  );
  
};
export default WhatsAppChats;