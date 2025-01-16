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
  const [contactsPerPage, setContactsPerPage] = useState(
    calculateContactsPerPage()
  );
  const [countrySearchTerm, setCountrySearchTerm] = useState("");
  const [filteredCountries, setFilteredCountries] = useState(countryList);

  useEffect(() => {
    const handleResize = () => {
      setContactsPerPage(calculateContactsPerPage());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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

          setContacts((prevContacts) => {
            const existingContactsNotInFirstPage = prevContacts.filter(
              (existingContact) =>
                !newContacts.some(
                  (newContact) =>
                    newContact.phoneNumber === existingContact.phoneNumber
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
      const messageTimestamp = parseInt(
        msg.sentTimestamp || msg.originalTimestamp || msg.currentStatusTimestamp
      );
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
          timestamp:
            msg.sentTimestamp ||
            msg.originalTimestamp ||
            msg.currentStatusTimestamp,
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
    if (
      !newMessage.trim() ||
      !selectedUser ||
      !config?.phoneNumber ||
      !companyId
    ) {
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
      sentTimestamp: currentTimestamp, // Original sent timestamp
      currentStatusTimestamp: currentTimestamp, // Will be updated with status changes
      originalTimestamp: currentTimestamp, // New field to store original time
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
                  sentTimestamp: msg.originalTimestamp, // Keep original timestamp
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
                currentStatusTimestamp: Date.now() / 1000, // Update status timestamp
                sentTimestamp: msg.originalTimestamp, // Keep original timestamp
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
    return new Date(parseInt(timestamp) * 1000).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const renderNewChatModal = () => (
    <Modal
      isOpen={isNewChatModal}
      toggle={() => setIsNewChatModal(false)}
      style={{ maxWidth: "400px" }}
    >
      <ModalHeader
        toggle={() => setIsNewChatModal(false)}
        style={{
          backgroundColor: "#008069",
          color: "#fff",
          borderBottom: "none",
        }}
      >
        New Chat
      </ModalHeader>
      <ModalBody style={{ padding: "20px" }}>
        <div style={{ marginBottom: "20px" }}>
          <Input
            type="text"
            value={countrySearchTerm}
            onChange={handleCountrySearch}
            placeholder="Search country..."
            style={{
              borderRadius: "8px",
              padding: "10px",
              backgroundColor: "#f0f2f5",
              border: "1px solid #e0e0e0",
            }}
          />
        </div>

        <div
          style={{
            maxHeight: "200px",
            overflowY: "auto",
            border: "1px solid #e0e0e0",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          {filteredCountries.map((country) => (
            <div
              key={country.code}
              onClick={() => {
                setSelectedCountry(country);
                setCountrySearchTerm("");
              }}
              style={{
                padding: "10px",
                cursor: "pointer",
                backgroundColor:
                  selectedCountry.code === country.code ? "#f0f2f5" : "#fff",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                borderBottom: "1px solid #e0e0e0",
                transition: "background-color 0.2s ease",
              }}
            >
              <span style={{ fontSize: "20px" }}>{country.flag}</span>
              <span style={{ flex: 1 }}>{country.country}</span>
              <span style={{ color: "#667781" }}>+{country.code}</span>
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
          }}
        >
          <div
            style={{
              padding: "10px",
              backgroundColor: "#f0f2f5",
              borderRadius: "8px",
              color: "#667781",
            }}
          >
            +{selectedCountry.code}
          </div>
          <Input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
            placeholder="Phone number"
            style={{
              flex: 1,
              borderRadius: "8px",
              padding: "10px",
            }}
          />
        </div>
      </ModalBody>
      <ModalFooter style={{ borderTop: "none" }}>
        <Button
          color="secondary"
          onClick={() => {
            setIsNewChatModal(false);
            setCountrySearchTerm("");
          }}
          style={{
            borderRadius: "8px",
            padding: "8px 16px",
          }}
        >
          Cancel
        </Button>
        <Button
          color="primary"
          onClick={startNewChat}
          disabled={!phoneNumber.length}
          style={{
            backgroundColor: "#00a884",
            border: "none",
            borderRadius: "8px",
            padding: "8px 16px",
          }}
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
      className="chat-sidebar"
      style={{
        backgroundColor: "#ffffff",
        height: "calc(100vh - 100px)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        borderRight: "1px solid #e0e0e0",
        padding: 0,
        position: "relative",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      {initialLoading && <LoaderOverlay />}
      <div
        className="user-header"
        style={{
          padding: "15px",
          background: "linear-gradient(135deg, #00a884 0%, #008c70 100%)",
          color: "#fff",
        }}
      >
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <div
              className="profile-avatar"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "12px",
              }}
            >
              <i className="fab fa-whatsapp fa-lg"></i>
            </div>
            <div>
              <h6 className="mb-0" style={{ fontWeight: "600" }}>
                {config?.companyName}
              </h6>
              <small style={{ opacity: 0.9 }}>{config?.phoneNumber}</small>
            </div>
          </div>
          <div className="d-flex gap-3">
            <FaSearch style={{ cursor: "pointer" }} />
            <FaEllipsisV style={{ cursor: "pointer" }} />
          </div>
        </div>
      </div>

      <div
        className="search-container"
        style={{
          padding: "12px 16px",
          backgroundColor: "#f0f2f5",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <div
          className="search-box"
          style={{
            position: "relative",
            backgroundColor: "#fff",
            borderRadius: "8px",
            padding: "6px 12px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <FaSearch color="#54656f" size={14} />
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search or start new chat"
            style={{
              border: "none",
              padding: "4px 8px",
              fontSize: "14px",
              backgroundColor: "transparent",
            }}
          />
        </div>
      </div>

      <div
        ref={contactListRef}
        onScroll={handleContactScroll}
        className="contacts-list"
        style={{
          overflowY: "auto",
          flex: 1,
          padding: "8px",
        }}
      >
        {contacts.map((contact) => {
          const latestData =
            uniqueUsers.find((u) => u.phoneNumber === contact.phoneNumber) ||
            contact;
          const displayName =
            contact.senderName ||
            contact.name ||
            senderNames[contact.phoneNumber] ||
            contact.phoneNumber;

          return (
            <div
              key={contact.phoneNumber}
              onClick={() =>
                setSelectedUser({ ...contact, senderName: displayName })
              }
              className="contact-item"
              style={{
                display: "flex",
                alignItems: "center",
                padding: "12px",
                borderRadius: "12px",
                backgroundColor:
                  selectedUser?.phoneNumber === contact.phoneNumber
                    ? "#f0f2f5"
                    : "transparent",
                cursor: "pointer",
                transition: "all 0.3s ease",
                marginBottom: "4px",
                position: "relative",
              }}
            >
              <div
                className="contact-avatar"
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  backgroundColor: "#e9edef",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "12px",
                  fontSize: "20px",
                }}
              >
                {contact.flag || "🌐"}
              </div>
              <div style={{ flex: 1, overflow: "hidden" }}>
                <div className="d-flex justify-content-between align-items-center">
                  <h6
                    style={{ margin: 0, fontWeight: "500", fontSize: "16px" }}
                  >
                    {displayName}
                  </h6>
                  <small style={{ color: "#667781", fontSize: "12px" }}>
                    {latestData.timestamp
                      ? format12HourTime(latestData.timestamp)
                      : ""}
                  </small>
                </div>
                <p
                  style={{
                    margin: "4px 0 0 0",
                    fontSize: "14px",
                    color: "#667781",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {latestData.lastMessage}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <Button
        onClick={() => setIsNewChatModal(true)}
        style={{
          position: "absolute",
          bottom: "24px",
          right: "24px",
          backgroundColor: "#00a884",
          border: "none",
          borderRadius: "50%",
          width: "56px",
          height: "56px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
          transition: "transform 0.2s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        <i className="fas fa-plus" style={{ fontSize: "20px" }}></i>
      </Button>
    </Col>
  );

  const renderChatWindow = () => (
    <Col
      xs="12"
      md="8"
      style={{
        height: "calc(100vh - 100px)",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#efeae2",
        position: "relative",
        overflow: "hidden",
        padding: 0,
      }}
    >
      {selectedUser ? (
        <>
          <div
            className="chat-header"
            style={{
              padding: "10px 16px",
              background: "#f0f2f5",
              borderBottom: "1px solid #e0e0e0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div className="d-flex align-items-center">
              {isMobileView && (
                <Button
                  onClick={() => setSelectedUser(null)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#54656f",
                    padding: "8px",
                    marginRight: "8px",
                  }}
                >
                  <FaArrowLeft />
                </Button>
              )}
              <div
                className="chat-avatar"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  backgroundColor: "#e9edef",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "12px",
                  fontSize: "18px",
                }}
              >
                {selectedUser.flag}
              </div>
              <div>
                <h6 style={{ margin: 0, fontWeight: "500" }}>
                  {selectedUser.senderName ||
                    selectedUser.name ||
                    senderNames[selectedUser.phoneNumber] ||
                    selectedUser.phoneNumber}
                </h6>
                <small style={{ color: "#667781" }}>
                  {selectedUser.phoneNumber}
                </small>
              </div>
            </div>
            <div className="d-flex gap-3">
              <FaSearch style={{ color: "#54656f", cursor: "pointer" }} />
              <FaEllipsisV style={{ color: "#54656f", cursor: "pointer" }} />
            </div>
          </div>

          <div
            className="messages-container"
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "20px",
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23999999' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            }}
          >
            {groupMessagesByDate(messages).map((group) => (
              <div key={group.date}>
                {renderDateSeparator(group.timestamp)}
                {group.messages.map((message) => {
                  const isReceived = message.from === selectedUser.phoneNumber;
                  return (
                    <div
                      key={message.messageId}
                      className={`message ${isReceived ? "received" : "sent"}`}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: isReceived ? "flex-start" : "flex-end",
                        marginBottom: "8px",
                        maxWidth: "85%",
                        alignSelf: isReceived ? "flex-start" : "flex-end",
                      }}
                    >
                      <div
                        style={{
                          backgroundColor: isReceived ? "#fff" : "#d9fdd3",
                          padding: "8px 12px",
                          borderRadius: "8px",
                          position: "relative",
                          boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                          maxWidth: "100%",
                        }}
                      >
                        <p
                          style={{
                            margin: "0 0 4px 0",
                            fontSize: "14px",
                            lineHeight: "1.4",
                          }}
                        >
                          {message.messageBody}
                        </p>
                        <div
                          style={{
                            fontSize: "11px",
                            color: "#667781",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-end",
                            gap: "4px",
                          }}
                        >
                          <span>{format12HourTime(message.sentTimestamp)}</span>
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
            <div ref={chatEndRef} />
          </div>

          <div
            className="chat-input"
            style={{
              padding: "12px 16px",
              backgroundColor: "#f0f2f5",
              borderTop: "1px solid #e0e0e0",
              position: isMobileView ? "fixed" : "relative",
              bottom: 0,
              left: isMobileView ? 0 : "auto",
              right: isMobileView ? 0 : "auto",
              width: "100%",
              zIndex: 2,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "#fff",
                padding: "6px 12px",
                borderRadius: "24px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
              }}
            >
              <FaSmile
                size={20}
                color="#54656f"
                style={{ cursor: "pointer" }}
              />
              <FaPaperclip
                size={20}
                color="#54656f"
                style={{ cursor: "pointer" }}
              />
              <Input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type a message"
                style={{
                  border: "none",
                  padding: "8px 12px",
                  flex: 1,
                  backgroundColor: "transparent",
                  fontSize: "15px",
                }}
              />
              {newMessage.trim() ? (
                <Button
                  onClick={sendMessage}
                  style={{
                    backgroundColor: "#00a884",
                    border: "none",
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 0,
                    transition: "transform 0.2s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.05)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                >
                  <FaPaperPlane color="#fff" size={16} />
                </Button>
              ) : (
                <FaMicrophone
                  size={20}
                  color="#54656f"
                  style={{ cursor: "pointer" }}
                />
              )}
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
            backgroundColor: "#f0f2f5",
            padding: "20px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "250px",
              height: "250px",
              backgroundImage:
                'url("https://web.whatsapp.com/img/intro-connection-light_c98cc75f2aa905314d74375a975d2cf2.jpg")',
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              marginBottom: "32px",
            }}
          />
          <h4 style={{ color: "#41525d", marginBottom: "16px" }}>
            WhatsApp Web
          </h4>
          <p style={{ color: "#667781", fontSize: "14px", maxWidth: "500px" }}>
            Send and receive messages without keeping your phone online. Use
            WhatsApp on up to 4 linked devices and 1 phone at the same time.
          </p>
        </div>
      )}
    </Col>
  );

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
        height: "100vh",
        backgroundColor: "#f0f2f5",
        overflow: "hidden",
      }}
    >
      {renderNewChatModal()}
      <Container
        fluid
        style={{
          height: "100%",
          padding: "20px",
        }}
      >
        <Row
          style={{
            height: "100%",
            backgroundColor: "#fff",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          {(!selectedUser || !isMobileView) && renderUserList()}
          {(selectedUser || !isMobileView) && renderChatWindow()}
        </Row>
      </Container>
    </div>
  );
};
export default WhatsAppChats;
