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

  useEffect(() => {
    if (location.state?.config) {
      localStorage.setItem(
        "whatsappConfig",
        JSON.stringify(location.state.config)
      );
      localStorage.setItem("whatsappCompanyId", location.state.companyId);
    }
  }, [location.state]);

  const { config, companyId } = location.state || {
    config: JSON.parse(localStorage.getItem("whatsappConfig") || "{}"),
    companyId: localStorage.getItem("whatsappCompanyId"),
  };
  const businessId = config?.whatsappBusinessAccountId;

  const calculateContactsPerPage = () => {
    const screenHeight = window.innerHeight;
    const approximateContactHeight = 70;
    const headerHeight = 200;
    const availableHeight = screenHeight - headerHeight;
    return Math.max(5, Math.floor(availableHeight / approximateContactHeight));
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
  const [selectedCountry, setSelectedCountry] = useState(countryList[0] || {});
  const [phoneNumber, setPhoneNumber] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const chatContainerRef = useRef(null);
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
  const [templates, setTemplates] = useState([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);

  // Safe data access helper functions
  const safeGet = (obj, path, defaultValue = '') => {
    if (!obj) return defaultValue;
    return path.split('.').reduce((acc, key) => {
      if (acc && typeof acc === 'object' && key in acc) {
        return acc[key];
      }
      return defaultValue;
    }, obj);
  };

  const safeArray = (arr) => Array.isArray(arr) ? arr : [];

  const safeString = (str) => {
    if (str === null || str === undefined) return '';
    return String(str);
  };

  const safeNumber = (num, defaultValue = 0) => {
    const parsed = parseInt(num);
    return isNaN(parsed) ? defaultValue : parsed;
  };

  useEffect(() => {
    const handleResize = () => {
      setContactsPerPage(calculateContactsPerPage());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (businessId) {
      try {
        socketRef.current = io("https://codozap-e04e12b02929.herokuapp.com");

        socketRef.current.on(`onmessagerecv-${businessId}`, async () => {
          console.log("Socket: New message received");

          if (selectedUser) {
            await fetchMessages(selectedUser.phoneNumber);
          }

          const response = await axios.post(
            `${MESSAGE_API_ENDPOINT}/getContact`,
            { companyId },
            {
              params: { page: 1, limit: contactsPerPage },
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (response.data?.success) {
            const newContacts = safeArray(response.data.contacts).map((contact) => ({
              ...contact,
              phoneNumber: contact._id || '',
              name: contact.senderName || contact.name || contact._id || '',
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
      } catch (error) {
        console.error("Socket connection error:", error);
      }
    }
  }, [businessId, selectedUser, companyId, token, contactsPerPage]);

  const fetchUserTemplates = async (contactPhoneNumber) => {
    if (!businessId || !companyId || !contactPhoneNumber) return;

    try {
      setLoadingTemplates(true);
      const response = await axios.post(
        `${MESSAGE_API_ENDPOINT}/getTemplates`,
        { businessId, companyId, contactNumber: contactPhoneNumber },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data?.success) {
        setTemplates(safeArray(response.data.data));
      }
    } catch (error) {
      console.error("Error fetching user templates:", error);
    } finally {
      setLoadingTemplates(false);
    }
  };

  const fetchContacts = async (pageNum = 1, isInitial = false) => {
    if (!businessId || (!isInitial && !hasMore) || loadingMore) return;

    try {
      setLoadingMore(true);
      const response = await axios.post(
        `${MESSAGE_API_ENDPOINT}/getContact`,
        { companyId },
        {
          params: { page: pageNum, limit: contactsPerPage },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data?.success) {
        const newContacts = safeArray(response.data.contacts).map((contact) => ({
          ...contact,
          phoneNumber: contact._id || '',
          name: contact.senderName || contact.name || contact._id || '',
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

        setHasMore(pageNum < safeGet(response.data, 'pagination.totalPages', 0));
        setPage(pageNum);
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setLoadingMore(false);
      if (isInitial) setInitialLoading(false);
    }
  };

  // Auto-scroll to bottom when messages load - instant, no animation
  useEffect(() => {
    if (messages.length > 0 && chatEndRef.current) {
      // Use instant scroll, no smooth behavior
      chatEndRef.current.scrollIntoView({ behavior: "auto", block: "end" });
    }
  }, [messages]);

  const fetchMessages = async (contactPhoneNumber) => {
    if (!businessId || !contactPhoneNumber) return;
    try {
      setLoading(true);
      const response = await axios.post(
        `${MESSAGE_API_ENDPOINT}/getMessages`,
        { businessId, contactNumber: contactPhoneNumber },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data?.success) {
        setMessages(safeArray(response.data.data));

        const messages = safeArray(response.data.data);
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
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (businessId) {
      fetchContacts(1, true);
    }
  }, [businessId]);

  useEffect(() => {
    if (selectedUser?.phoneNumber) {
      fetchContacts(1, true).then(() => {
        fetchMessages(selectedUser.phoneNumber).then(() => {
          fetchUserTemplates(selectedUser.phoneNumber);
        });
      });
    }
  }, [selectedUser]);

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
        }, 2000);
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
          {safeString(content)}
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
      const safeStatus = safeString(status).toLowerCase();
      switch (safeStatus) {
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
    const fullNumber = (selectedCountry.code || '') + phoneNumber;
    const existingContact = contacts.find((c) => c.phoneNumber === fullNumber);

    if (!existingContact) {
      const newUser = {
        phoneNumber: fullNumber,
        lastMessage: "",
        timestamp: (Date.now() / 1000).toString(),
        flag: selectedCountry.flag || "🌐",
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

    safeArray(contacts).forEach((contact) => {
      if (contact && contact.phoneNumber) {
        const country = countryList.find(
          (c) => c && c.code && contact.phoneNumber.startsWith(c.code)
        );

        users.set(contact.phoneNumber, {
          ...contact,
          lastMessage: contact.lastMessage || contact.recentMessage || "",
          timestamp:
            contact.timestamp ||
            contact.latestChat ||
            (Date.now() / 1000).toString(),
          flag: country?.flag || "🌐",
        });
      }
    });

    return Array.from(users.values())
      .filter((user) => user && user.phoneNumber)
      .sort((a, b) => {
        const timestampA = safeNumber(a.timestamp);
        const timestampB = safeNumber(b.timestamp);
        return timestampB - timestampA;
      });
  }, [contacts]);

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
      sentTimestamp: currentTimestamp,
      currentStatusTimestamp: currentTimestamp,
      messageTimestamp: currentTimestamp,
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
              recentMessage: newMessage,
              timestamp: currentTimestamp,
              latestChat: new Date(
                safeNumber(currentTimestamp) * 1000
              ).toISOString(),
            };
          }
          return contact;
        });

        return updatedContacts.sort((a, b) => {
          const timestampA = safeNumber(a.timestamp);
          const timestampB = safeNumber(b.timestamp);
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

      if (response.data?.success && response.data.data?.messages) {
        const actualMessageId = safeGet(response.data.data.messages[0], 'id', tempId);

        setMessages((prev) =>
          prev.map((msg) =>
            msg.messageId === tempId
              ? {
                  ...msg,
                  messageId: actualMessageId,
                  status: "sent",
                  currentStatusTimestamp: Date.now() / 1000,
                  messageTimestamp: msg.messageTimestamp,
                }
              : msg
          )
        );
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.messageId === tempId
            ? {
                ...msg,
                status: "failed",
                currentStatusTimestamp: Date.now() / 1000,
                sentTimestamp: msg.originalTimestamp,
                failureReason:
                  safeGet(error, 'response.data.message') || "Failed to send message",
              }
            : msg
        )
      );
    }

    setNewMessage("");
    setTimeout(() => scrollToBottom(), 100);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "Date unavailable";

    try {
      const date = new Date(safeNumber(timestamp) * 1000);
      if (isNaN(date.getTime())) return "Invalid date";

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
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  const groupMessagesByDate = (messages) => {
    const groups = {};

    safeArray(messages).forEach((message) => {
      const timestamp =
        message.type === "template"
          ? message.originalTimestamp ||
            message.sentTimestamp ||
            message.currentStatusTimestamp
          : message.sentTimestamp || message.currentStatusTimestamp;

      if (!timestamp) {
        console.warn("Message missing timestamp:", message);
        return;
      }

      const date = new Date(safeNumber(timestamp) * 1000).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });

    return Object.entries(groups)
      .map(([date, messages]) => ({
        date,
        timestamp: safeNumber(
          messages[0]?.sentTimestamp || messages[0]?.currentStatusTimestamp
        ),
        messages: safeArray(messages),
      }))
      .sort((a, b) => a.timestamp - b.timestamp);
  };

  const renderTemplates = () => {
    if (loadingTemplates || templates.length === 0) return null;

    return (
      <div
        style={{
          backgroundColor: "#f0f0f0",
          padding: "10px",
          borderRadius: "8px",
          margin: "10px 0",
        }}
      >
        <h5>Available Templates</h5>
        {safeArray(templates).map((template) => (
          <div
            key={template._id || Math.random()}
            style={{
              backgroundColor: "white",
              margin: "5px 0",
              padding: "10px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            onClick={() => {
              const templateBody =
                safeArray(template.components).find((c) => c.type === "BODY")?.text || "";
              setNewMessage(templateBody);
            }}
          >
            <strong>{template.templateName || "Unnamed Template"}</strong>
            <p>{safeArray(template.components).find((c) => c.type === "BODY")?.text}</p>
          </div>
        ))}
      </div>
    );
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
    try {
      return new Date(safeNumber(timestamp) * 1000).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch (error) {
      console.error("Error formatting time:", error);
      return "Invalid time";
    }
  };

  const renderNewChatModal = () => {
    const filterCountries = (searchTerm) => {
      return safeArray(countryList).filter(
        (country) =>
          country?.country?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          country?.code?.includes(searchTerm)
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
        size="sm"
      >
        <ModalHeader toggle={() => setIsNewChatModal(false)} className="py-2">
          New Chat
        </ModalHeader>
        <ModalBody className="p-2">
          <div className="d-flex flex-column gap-2">
            <Input
              type="text"
              value={countrySearchTerm}
              onChange={handleCountrySearch}
              placeholder="Search country..."
              className="mb-1"
              size="sm"
            />

            <div
              style={{
                maxHeight: "150px",
                overflowY: "auto",
                border: "1px solid #ddd",
                borderRadius: "4px",
              }}
            >
              {safeArray(filteredCountries).map((country) => (
                <div
                  key={country?.code || Math.random()}
                  onClick={() => {
                    if (country) {
                      setSelectedCountry(country);
                      setCountrySearchTerm("");
                    }
                  }}
                  style={{
                    padding: "6px 8px",
                    cursor: "pointer",
                    backgroundColor:
                      selectedCountry.code === country?.code
                        ? "#e8f5ff"
                        : "white",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    borderBottom: "1px solid #eee",
                    fontSize: "0.9rem",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = "#f5f5f5")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor =
                      selectedCountry.code === country?.code
                        ? "#e8f5ff"
                        : "white")
                  }
                >
                  <span>{country?.flag || "🌐"}</span>
                  <span style={{ flex: 1 }}>{country?.country || "Unknown"}</span>
                  <span style={{ color: "#666", fontSize: "0.8rem" }}>
                    +{country?.code || ""}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-2 d-flex gap-2">
              <span className="d-flex align-items-center px-2 bg-light rounded">
                +{selectedCountry?.code || ""}
              </span>
              <Input
                type="text"
                value={phoneNumber}
                onChange={(e) =>
                  setPhoneNumber(e.target.value.replace(/\D/g, ""))
                }
                placeholder="Phone number"
                size="sm"
                style={{ flex: 1 }}
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter className="py-2 px-2">
          <Button
            color="secondary"
            size="sm"
            onClick={() => {
              setIsNewChatModal(false);
              setCountrySearchTerm("");
            }}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            size="sm"
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

  const renderUserList = () => (
    <Col
      xs="12"
      md="4"
      className="d-flex flex-column"
      style={{
        backgroundColor: "#f0f4f8",
        height: "calc(100vh - 120px)",
        padding: "10px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {initialLoading && <LoaderOverlay />}

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
              <small
                className="font-weight-bold"
                style={{ marginLeft: "10px" }}
              >
                {safeGet(config, 'companyName', 'Unknown Company')}
              </small>
              <h5
                className="mb-1 font-weight-bold"
                style={{ marginLeft: "10px" }}
              >
                {safeGet(config, 'phoneNumber', 'No Number')}
              </h5>
            </div>
          </div>
        </CardBody>
      </Card>

      <div
        style={{
          padding: "5px 0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "10px",
          flexShrink: 0,
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

      <div
        ref={contactListRef}
        onScroll={handleContactScroll}
        className="contact-scrollable"
        style={{
          overflowY: "auto",
          flex: 1,
          marginTop: "5px",
          paddingRight: "5px",
          msOverflowStyle: "none",
          scrollbarWidth: "none",
          WebkitOverflowScrolling: "touch",
          position: "relative"
        }}
      >
        <style>
          {`
            .contact-scrollable::-webkit-scrollbar {
              display: none;
            }
          `}
        </style>
        
        {safeArray(contacts).map((contact) => {
          const latestData =
            uniqueUsers.find((u) => u.phoneNumber === contact.phoneNumber) ||
            contact;
          const country = safeArray(countryList).find((c) =>
            contact.phoneNumber.startsWith(c.code)
          );
          const displayName =
            contact.senderName ||
            contact.name ||
            senderNames[contact.phoneNumber] ||
            contact.phoneNumber;

          return (
            <div
              key={contact.phoneNumber || Math.random()}
              onClick={(e) => {
                e.preventDefault();
                setSelectedUser({
                  ...contact,
                  senderName: displayName,
                  flag: country?.flag || "🌐",
                });
              }}
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
                  {safeString(displayName)}
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
                      fontWeight: latestData.lastMessage?.includes('*') ? "bold" : "normal",
                    }}
                  >
                    {safeString(latestData.lastMessage).replace(/\*/g, '')}
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
          <div
            style={{
              textAlign: "center",
              padding: "10px",
              marginBottom: "5px",
            }}
          >
            Loading more contacts...
          </div>
        )}
      </div>
    </Col>
  );

  const formatTemplateText = (text) => {
    if (!text) return '';
    return safeString(text).split(/(\*[^*]+\*)/g)
      .map((part, index) => {
        if (part.startsWith("*") && part.endsWith("*")) {
          const boldContent = part.slice(1, -1);
          return `<strong>${boldContent}</strong>`;
        }
        return part;
      })
      .join("");
  };

  const createMarkup = (htmlContent) => {
    return { __html: safeString(htmlContent) };
  };

  const renderTemplateMessage = (message) => {
    const { components } = message;
    const isReceived = message.from === selectedUser?.phoneNumber;

    const messageTimestamp =
      message.sentTimestamp ||
      message.originalTimestamp ||
      message.currentStatusTimestamp;

    return (
      <div
        key={message.messageId || message.id || Math.random()}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: isReceived ? "flex-start" : "flex-end",
          marginBottom: "10px",
        }}
      >
        <div
          style={{
            maxWidth: "60%",
            padding: "6px 10px",
            backgroundColor: isReceived ? "#fff" : "#dcf8c6",
            borderRadius: "6px",
          }}
        >
          {safeArray(components).map((component, index) => {
            switch (component.type) {
              case "HEADER":
                return (
                  <img
                    key={index}
                    src={component.media?.link}
                    alt="Template Header"
                    style={{ maxWidth: "100%", borderRadius: "6px 6px 0 0" }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                );
              case "BODY":
                return (
                  <div
                    key={index}
                    style={{
                      fontSize: "12px",
                      marginBottom: "4px",
                      whiteSpace: "pre-wrap",
                    }}
                    dangerouslySetInnerHTML={createMarkup(
                      formatTemplateText(component.text)
                    )}
                  />
                );
              case "FOOTER":
                return (
                  <div
                    key={index}
                    style={{
                      fontSize: "10px",
                      color: "#4f4d4d",
                    }}
                  >
                    {safeString(component.text)}
                  </div>
                );
              default:
                return null;
            }
          })}
          <div
            style={{
              fontSize: "10px",
              color: "#667781",
              textAlign: "right",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: "4px",
            }}
          >
            <span>
              {messageTimestamp
                ? format12HourTime(messageTimestamp)
                : "Time unavailable"}
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

  const renderChatWindow = () => {
    const chatMessages = selectedUser
      ? safeArray(messages).filter(
          (msg) =>
            msg.from === selectedUser.phoneNumber ||
            msg.to === selectedUser.phoneNumber
        )
      : [];

    const groupedMessages = groupMessagesByDate(chatMessages);

    const formatMessageText = (text) => {
      if (!text) return '';
      return safeString(text).replace(/\*(.*?)\*/g, '<strong>$1</strong>');
    };

    return (
      <Col
        xs="12"
        md="8"
        style={{
          height: "calc(100vh - 120px)",
          padding: 0,
          display: "flex",
          flexDirection: "column",
          position: "relative",
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='64' height='64' viewBox='0 0 64 64' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 16c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm0-2c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6zm33.414-6l5.95-5.95L45.95.636 40 6.586 34.05.636 32.636 2.05 38.586 8l-5.95 5.95 1.414 1.414L40 9.414l5.95 5.95 1.414-1.414L41.414 8zM40 48c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm0-2c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6zM9.414 40l5.95-5.95-1.414-1.414L8 38.586l-5.95-5.95L.636 34.05 6.586 40l-5.95 5.95 1.414 1.414L8 41.414l5.95 5.95 1.414-1.414L9.414 40z' fill='%239C92AC' fill-opacity='0.08' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          backgroundColor: "#efeae2",
        }}
      >
        {selectedUser && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px 20px",
              backgroundColor: "rgb(0, 168, 132)",
              borderBottom: "1px solid rgb(224, 224, 224)",
              flexShrink: 0,
            }}
            className="user_select"
          >
            {isMobileView && (
              <Button
                onClick={() => setSelectedUser(null)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "white",
                  marginRight: "10px",
                  padding: 0,
                }}
              >
                <FaArrowLeft size={20} />
              </Button>
            )}

            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: "#e0e0e0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "15px",
                fontSize: "20px",
              }}
            >
              {selectedUser.flag || "👤"}
            </div>

            <div>
              <h6
                style={{
                  margin: 0,
                  fontWeight: "bold",
                  color: "white",
                  fontSize: "13px",
                }}
              >
                {selectedUser.senderName || selectedUser.phoneNumber}
              </h6>
            </div>
          </div>
        )}

        {initialLoading && <LoaderOverlay />}
        {selectedUser ? (
          <>
            <div
              ref={chatContainerRef}
              style={{
                flex: 1,
                padding: "20px",
                overflowY: "auto",
                msOverflowStyle: "none",
                scrollbarWidth: "none",
                position: "relative",
              }}
            >
              {safeArray(groupedMessages).map((group) => (
                <div key={group.date || Math.random()}>
                  {renderDateSeparator(group.timestamp)}
                  {safeArray(group.messages).map((message) => {
                    const isReceived =
                      message.from === selectedUser.phoneNumber;
                    if (message.type === "template") {
                      return renderTemplateMessage(message);
                    } else {
                      return (
                        <div
                          key={message.messageId || message.id || Math.random()}
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
                            <div
                              style={{
                                fontSize: "14px",
                                marginBottom: "4px",
                                wordWrap: "break-word",
                                whiteSpace: "pre-wrap",
                              }}
                              dangerouslySetInnerHTML={{
                                __html: formatMessageText(message.messageBody)
                              }}
                            />
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
                                {format12HourTime(
                                  message.sentTimestamp ||
                                    message.currentStatusTimestamp
                                )}
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
                    }
                  })}
                </div>
              ))}
              <div ref={chatEndRef} style={{ height: "1px" }} />
            </div>

            <div
              style={{
                padding: "10px 15px",
                backgroundColor: "#f0f2f5",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "#fff",
                  padding: "0px 9px",
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
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Type a message..."
                  style={{
                    border: "none",
                    padding: "12px 6px",
                    flex: 1,
                    backgroundColor: "transparent",
                    boxShadow: "none",
                    outline: "none",
                    resize: "none",
                    wordWrap: "break-word",
                    whiteSpace: "pre-wrap",
                    height: "auto",
                    minHeight: "36px",
                    maxHeight: "120px",
                    overflowY: "auto",
                    fontFamily: "inherit",
                    fontSize: "16px",
                    lineHeight: "18px",
                    display: "block",
                    borderRadius: "20px",
                    backgroundColor: "#fff",
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
        minHeight: "calc(100vh - 100px)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative",
        paddingTop: "80px",
      }}
    >
      <style>
        {`
          *::-webkit-scrollbar {
            display: none;
          }
          * {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}
      </style>
      {renderNewChatModal()}
      <Container
        fluid
        style={{
          flex: 1,
          padding: "0",
          minHeight: 0,
          height: "100%",
          marginTop: "0",
        }}
      >
        <Row style={{ height: "100%", margin: 0 }}>
          {(!selectedUser || !isMobileView) && renderUserList()}
          {(selectedUser || !isMobileView) && renderChatWindow()}
        </Row>
      </Container>
    </div>
  );
};

export default WhatsAppChats;