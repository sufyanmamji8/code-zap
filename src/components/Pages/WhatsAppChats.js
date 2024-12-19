// import axios from "axios";
// import Header from "components/Headers/Header";
// import { useEffect, useRef, useState } from "react";
// import Avatar from "react-avatar";
// import {
//   FaArrowLeft,
//   FaCheck,
//   FaCheckDouble,
//   FaPaperclip,
//   FaPaperPlane,
// } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import { Button, Col, Container, Input, Row } from "reactstrap";
// import { toast } from "sonner";

// const API_URL = "http://192.168.0.110:4000/api/v1/webHooks/getMessages";
// const GET_MESSAGES_BY_USER_API =
//   "http://192.168.0.110:4000/api/v1/webHooks/getMessagesByUser";
// const GET_RECENT_MESSAGE_API =
//   "http://192.168.0.110:4000/api/v1/webHooks/recentMessages";
// const SEND_MESSAGE_API = "http://192.168.0.110:4000/api/v1/messages/send";
// const GET_MESSAGES_BY_CONTACT_API =
//   "http://192.168.0.110:4000/api/v1/messages/getMessagesByContact";
// const WEBHOOK_API = "http://192.168.0.110:4000/api/v1/messages/handleWebHook";
// const START_NEW_CHAT_API =
//   "http://192.168.0.110:4000/api/v1/messages/startNewChat";

// const MessageStatus = ({ status }) => {
//   if (!status) return null;

//   switch (status?.toLowerCase()) {
//     case "sent":
//       return <FaCheck style={{ fontSize: "12px", color: "#a5a5a5" }} />;
//     case "delivered":
//       return <FaCheckDouble style={{ fontSize: "12px", color: "#a5a5a5" }} />;
//     case "read":
//       return <FaCheckDouble style={{ fontSize: "12px", color: "#34B7F1" }} />;
//     default:
//       return <FaCheck style={{ fontSize: "12px", color: "#a5a5a5" }} />;
//   }
// };

// const WhatsAppChats = () => {
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedContact, setSelectedContact] = useState(null);
//   const [selectedContactMessages, setSelectedContactMessages] = useState([]);
//   const [message, setMessage] = useState("");
//   const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
//   const [showUserList, setShowUserList] = useState(true);
//   const [isTyping, setIsTyping] = useState(false);
//   const messagesEndRef = useRef(null);
//   const [loading, setLoading] = useState(true);
//   const [userChats, setUserChats] = useState([]);
//   const [selectedUserMessages, setSelectedUserMessages] = useState([]);
//   const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
//   const [recentMessages, setRecentMessages] = useState({});
//   const token = localStorage.getItem("token");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobileView(window.innerWidth <= 768);
//     };
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   useEffect(() => {
//     const fetchMessages = async () => {
//       try {
//         const response = await axios.get(API_URL, {
//           headers: {
//             Authorization: `Bearer ${token}`, // Include token in the request headers
//           },
//         });
//         if (response.data.success) {
//           const uniqueUsers = Array.from(
//             new Map(
//               response.data.messages.map((user) => [user.senderWaId, user])
//             ).values()
//           );
//           setUserChats(uniqueUsers);
//           setLoading(false);
//         }
//       } catch (error) {
//         console.error("Error fetching
//  data:", error);
//         setLoading(false);
//       }
//     };

//     fetchMessages(); // Ensures the fetch happens on mount
//   }, []);

//   useEffect(() => {
//     const fetchRecentMessages = async () => {
//       try {
//         const messageMap = {}; // To store recent messages for all users

//         for (const user of userChats) {
//           const response = await axios.get(GET_RECENT_MESSAGE_API, {
//             params: { senderWaId: user.senderWaId },
//             headers: {
//               Authorization: `Bearer ${token}`, // Include token in the request headers
//             },
//           });

//           if (response.data.success) {
//             const recentMessage = response.data.data;
//             if (recentMessage) {
//               messageMap[user.senderWaId] = {
//                 messageBody: recentMessage.messageBody,
//                 timestamp:
//                   recentMessage.timestamp || recentMessage.sentTimestamp,
//                 status: recentMessage.status,
//               };
//             }
//           }
//         }
//         setRecentMessages(messageMap); // Update recent messages state
//       } catch (error) {
//         console.error("Error fetching recent messages:", error);
//       }
//     };

//     fetchRecentMessages();

//     const messageInterval = setInterval(fetchRecentMessages, 5000);
//     return () => clearInterval(messageInterval);
//   }, [userChats]); // Re-run whenever userChats changes

//   useEffect(() => {
//     const fetchMessagesForUser = async () => {
//       if (selectedUser) {
//         try {
//           const response = await axios.get(GET_MESSAGES_BY_USER_API, {
//             params: { senderWaId: selectedUser.senderWaId },
//             headers: {
//               Authorization: `Bearer ${token}`, // Include token in the request headers
//             },
//           });
//           if (response.data.success) {
//             setSelectedUserMessages(response.data.messages);
//           }
//         } catch (error) {
//           console.error("Error:", error);
//         }
//       }
//     };

//     fetchMessagesForUser();
//     const interval = setInterval(fetchMessagesForUser, 5000);
//     return () => clearInterval(interval);
//   }, [selectedUser]);

//   const fetchMessagesForContact = async () => {
//     try {
//       if (selectedContact && selectedUser) {
//         const contactNumber =
//           selectedUser.contactNumber || selectedUser.senderWaId;
//         const response = await axios.get(GET_MESSAGES_BY_CONTACT_API, {
//           params: { contactNumber },
//           headers: {
//             Authorization: `Bearer ${token}`, // Include token in the request headers
//           },
//         });

//         if (response.data.success) {
//           const messages = response.data.data;
//           setSelectedContactMessages(messages);
//         }
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       setSelectedContactMessages([]);
//     }
//   };

//   useEffect(() => {
//     fetchMessagesForContact();
//     const interval = setInterval(fetchMessagesForContact, 5000);
//     return () => clearInterval(interval);
//   }, [selectedContact]);

//   useEffect(() => {
//     scrollToBottom();
//   }, [selectedContactMessages]);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   const formatTime = (timestamp) => {
//     if (!timestamp) return "";
//     const date = new Date(timestamp * 1000);
//     return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
//   };

//   const handleSendMessage = async () => {
//     if (message.trim() && selectedUser) {
//       const newMessage = {
//         to: selectedUser.senderWaId,
//         body: message,
//       };

//       try {
//         const response = await axios.post(SEND_MESSAGE_API, newMessage, {
//           headers: {
//             Authorization: `Bearer ${token}`, // Include token in the request headers
//           },
//         });

//         if (response.data.success) {
//           const sentMessage = {
//             messageBody: message,
//             timestamp: Math.floor(Date.now() / 1000),
//             from: "me",
//             status: "sent",
//             messageId: response.data.messageId,
//           };

//           setSelectedContactMessages((prev) => [...prev, sentMessage]);
//           setMessage("");
//           scrollToBottom();
//           fetchMessagesForContact();
//         }
//       } catch (error) {
//         console.error("Error:", error);
//         toast.error("Configuration is invalid.");
//         navigate("/admin/settings");
//       }
//     }
//   };

//   const renderMessage = (message, index) => {
//     const isFromCurrentUser =
//       message.from === "me" || message.to === selectedUser?.senderWaId;

//     return (
//       <div
//         key={index}
//         style={{
//           display: "flex",
//           justifyContent: isFromCurrentUser ? "flex-end" : "flex-start",
//           marginBottom: "10px",
//           width: "100%",
//         }}
//       >
//         <div
//           style={{
//             maxWidth: "70%",
//             padding: "10px",
//             backgroundColor: isFromCurrentUser ? "#00796B" : "#e9ecef",
//             borderRadius: "10px",
//             color: isFromCurrentUser ? "#fff" : "#000",
//             fontSize: "14px",
//             position: "relative",
//           }}
//         >
//           {message.messageBody}
//           <div
//             style={{
//               fontSize: "12px",
//               color: isFromCurrentUser ? "#e0e0e0" : "#6c757d",
//               textAlign: "right",
//               marginTop: "4px",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "flex-end",
//               gap: "4px",
//             }}
//           >
//             <span>
//               {formatTime(message.timestamp || message.sentTimestamp)}
//             </span>
//             {isFromCurrentUser && <MessageStatus status={message.status} />}
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const renderUserList = () => (
//     <Col
//       xs="12"
//       md="4"
//       style={{
//         backgroundColor: "#f0f4f8",
//         height: "calc(100vh - 100px)",
//         display: isMobileView && !showUserList ? "none" : "flex",
//         flexDirection: "column",
//         overflow: "hidden",
//         borderRight: "1px solid #e0e0e0",
//         padding: "10px",
//       }}
//     >
//       <div style={{ padding: "10px 0" }}>
//         <Input
//           type="text"
//           placeholder="Search users..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           style={{
//             borderRadius: "20px",
//             backgroundColor: "#fff",
//             border: "1px solid #e0e0e0",
//             padding: "8px 15px",
//           }}
//         />
//       </div>
//       <div style={{ overflowY: "auto", flexGrow: 1 }}>
//         {userChats
//           .filter((user) =>
//             user.senderName.toLowerCase().includes(searchTerm.toLowerCase())
//           )
//           .map((user) => {
//             const recentMessage = recentMessages[user.senderWaId];

//             return (
//               <div
//                 key={user.senderWaId}
//                 onClick={() => {
//                   setSelectedUser(user);
//                   setSelectedContact(user.contactNumber || user.senderWaId);
//                   if (isMobileView) setShowUserList(false);
//                 }}
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   padding: "10px",
//                   borderRadius: "10px",
//                   marginBottom: "10px",
//                   backgroundColor:
//                     selectedUser?.senderWaId === user.senderWaId
//                       ? "#E0F7FA"
//                       : "transparent",
//                   cursor: "pointer",
//                   transition: "background-color 0.3s ease",
//                 }}
//               >
//                 <Avatar
//                   name={user.senderName}
//                   size="40"
//                   round={true}
//                   style={{ marginRight: "10px" }}
//                 />
//                 <div style={{ flex: 1, overflow: "hidden" }}>
//                   <h6
//                     style={{ margin: 0, fontWeight: "bold", fontSize: "14px" }}
//                   >
//                     {user.senderName}
//                   </h6>
//                   <div
//                     style={{
//                       fontSize: "12px",
//                       color: "#666",
//                       whiteSpace: "nowrap",
//                       overflow: "hidden",
//                       textOverflow: "ellipsis",
//                     }}
//                   >
//                     {recentMessage
//                       ? recentMessage.messageBody
//                       : "No messages yet"}
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//       </div>
//     </Col>
//   );

//   const renderChatWindow = () => (
//     <Col
//       xs="12"
//       md="8"
//       style={{
//         height: "calc(100vh - 100px)",
//         display: isMobileView && showUserList ? "none" : "flex",
//         flexDirection: "column",
//         overflow: "hidden",
//         backgroundColor: selectedUser ? "#f4f8fb" : "#fff",
//       }}
//     >
//       <div
//         style={{
//           padding: "15px",
//           backgroundColor: selectedUser ? "#00796B" : "#f0f4f8",
//           color: "#fff",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           borderRadius: "10px 10px 0 0",
//         }}
//       >
//         {selectedUser ? (
//           <h5
//             style={{
//               margin: 0,
//               display: "flex",
//               alignItems: "center",
//               color: "#fff",
//             }}
//           >
//             <Avatar
//               name={selectedUser.senderName}
//               size="30"
//               round={true}
//               style={{ marginRight: "10px" }}
//             />
//             {selectedUser.senderName}
//           </h5>
//         ) : (
//           <h5 style={{ margin: 0, color: "#ddd" }}>Select a user</h5>
//         )}
//         {isMobileView && (
//           <Button
//             onClick={() => setShowUserList(true)}
//             style={{
//               backgroundColor: "transparent",
//               border: "none",
//               color: "#fff",
//             }}
//           >
//             <FaArrowLeft />
//           </Button>
//         )}
//       </div>

//       <div
//         style={{
//           flexGrow: 1,
//           padding: "20px",
//           overflowY: "auto",
//           marginTop: "20px",
//           display: "flex",
//           flexDirection: "column",
//         }}
//       >
//         {(() => {
//           const allMessages = [
//             ...selectedUserMessages.map((msg) => ({
//               ...msg,
//               timestamp: msg.timestamp || msg.sentTimestamp,
//               isFromCurrentUser: false,
//             })),
//             ...selectedContactMessages.map((msg) => ({
//               ...msg,
//               timestamp: msg.timestamp || msg.sentTimestamp,
//               isFromCurrentUser:
//                 msg.from === "me" || msg.to === selectedUser?.senderWaId,
//             })),
//           ].sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

//           return allMessages.map((message, index) =>
//             renderMessage(message, index)
//           );
//         })()}
//         <div ref={messagesEndRef} />
//       </div>

//       {selectedUser && (
//         <div style={{ padding: "10px", borderTop: "1px solid #e0e0e0" }}>
//           <div style={{ display: "flex", alignItems: "center" }}>
//             <Button
//               style={{
//                 background: "#f1f1f1",
//                 border: "none",
//                 marginRight: "10px",
//               }}
//               onClick={() => setShowAttachmentOptions(!showAttachmentOptions)}
//             >
//               <FaPaperclip />
//             </Button>

//             <Input
//               type="text"
//               value={message}
//               onChange={(e) => {
//                 setMessage(e.target.value);
//                 setIsTyping(e.target.value.trim().length > 0);
//               }}
//               onKeyPress={(e) => {
//                 if (e.key === "Enter") handleSendMessage();
//               }}
//               placeholder="Type a message..."
//               style={{
//                 borderRadius: "20px",
//                 height: "40px",
//                 fontSize: "14px",
//                 paddingLeft: "15px",
//                 flexGrow: 1,
//                 marginRight: "10px",
//               }}
//             />

//             <Button
//               style={{
//                 backgroundColor: "#00796B",
//                 borderRadius: "50%",
//                 padding: "10px",
//                 border: "none",
//               }}
//               onClick={handleSendMessage}
//               disabled={!message.trim()}
//             >
//               <FaPaperPlane color="#fff" />
//             </Button>
//           </div>
//         </div>
//       )}
//     </Col>
//   );

//   if (loading) {
//     return (
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           height: "100vh",
//         }}
//       >
//         Loading...
//       </div>
//     );
//   }

//   return (
//     <div>
//       <Header />
//       <Container fluid style={{ marginTop: "20px" }}>
//         <Row>
//           {renderUserList()}
//           {renderChatWindow()}
//         </Row>
//       </Container>
//     </div>
//   );
// };

// export default WhatsAppChats;





import axios from "axios";
import Header from "components/Headers/Header";
import { useEffect, useRef, useState } from "react";
import Avatar from "react-avatar";
import {
  FaArrowLeft,
  FaCheck,
  FaCheckDouble,
  FaPaperclip,
  FaPaperPlane,
  FaPlus,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
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
  Form,
  FormGroup,
  Label,
} from "reactstrap";
import { toast } from "sonner";
  
// API Endpoints
const API_URL = "http://192.168.0.110:4000/api/v1/webHooks/getMessages";
const GET_MESSAGES_BY_USER_API = "http://192.168.0.110:4000/api/v1/webHooks/getMessagesByUser";
const GET_RECENT_MESSAGE_API = "http://192.168.0.110:4000/api/v1/webHooks/recentMessages";
const SEND_MESSAGE_API = "http://192.168.0.110:4000/api/v1/messages/send";
const GET_MESSAGES_BY_CONTACT_API = "http://192.168.0.110:4000/api/v1/messages/getMessagesByContact";
const WEBHOOK_API = "http://192.168.0.110:4000/api/v1/messages/handleWebHook";
const START_NEW_CHAT_API = "http://192.168.0.110:4000/api/v1/messages/startNewChat";
const CREATE_CONTACT_API = "http://192.168.0.110:4000/api/v1/contact/createContact";
const GET_CONTACTS_API = "http://192.168.0.110:4000/api/v1/contact/getContacts";

// Message Status Component
const MessageStatus = ({ status }) => {
  if (!status) return null;

  switch (status?.toLowerCase()) {
    case "sent":
      return <FaCheck style={{ fontSize: "12px", color: "#a5a5a5" }} />;
    case "delivered":
      return <FaCheckDouble style={{ fontSize: "12px", color: "#a5a5a5" }} />;
    case "read":
      return <FaCheckDouble style={{ fontSize: "12px", color: "#34B7F1" }} />;
    default:
      return <FaCheck style={{ fontSize: "12px", color: "#a5a5a5" }} />;
  }
};

const WhatsAppChats = () => {
  // State Management
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);
  const [selectedContactMessages, setSelectedContactMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
  const [showUserList, setShowUserList] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userChats, setUserChats] = useState([]);
  const [selectedUserMessages, setSelectedUserMessages] = useState([]);
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
  const [recentMessages, setRecentMessages] = useState({});
  const [modal, setModal] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState({
    phoneNumber: "",
    countryCode: "",
  });

  const messagesEndRef = useRef(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Responsive Layout Effect
  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Initial Data Loading
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        await Promise.all([
          fetchMessages(),
          fetchContacts()
        ]);
        setLoading(false);
      } catch (error) {
        console.error("Error loading initial data:", error);
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Fetch Messages
  const fetchMessages = async () => {
    try {
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        const uniqueUsers = Array.from(
          new Map(response.data.messages.map((user) => [user.senderWaId, user])).values()
        );
        setUserChats(uniqueUsers);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load messages");
    }
  };

  // Fetch Contacts
  const fetchContacts = async () => {
    try {
      const response = await axios.get(GET_CONTACTS_API, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setContacts(response.data.contacts);
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
      toast.error("Failed to load contacts");
    }
  };

  // Recent Messages Polling
  useEffect(() => {
    const fetchRecentMessages = async () => {
      try {
        const messageMap = {};
        for (const user of userChats) {
          const response = await axios.get(GET_RECENT_MESSAGE_API, {
            params: { senderWaId: user.senderWaId },
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.data.success) {
            const recentMessage = response.data.data;
            if (recentMessage) {
              messageMap[user.senderWaId] = {
                messageBody: recentMessage.messageBody,
                timestamp: recentMessage.timestamp || recentMessage.sentTimestamp,
                status: recentMessage.status,
              };
            }
          }
        }
        setRecentMessages(messageMap);
      } catch (error) {
        console.error("Error fetching recent messages:", error);
      }
    };

    fetchRecentMessages();
    const messageInterval = setInterval(fetchRecentMessages, 5000);
    return () => clearInterval(messageInterval);
  }, [userChats]);

  // Selected User Messages Polling
  useEffect(() => {
    const fetchMessagesForUser = async () => {
      if (selectedUser) {
        try {
          const response = await axios.get(GET_MESSAGES_BY_USER_API, {
            params: { senderWaId: selectedUser.senderWaId },
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.data.success) {
            setSelectedUserMessages(response.data.messages);
          }
        } catch (error) {
          console.error("Error fetching user messages:", error);
        }
      }
    };

    if (selectedUser) {
      fetchMessagesForUser();
      const interval = setInterval(fetchMessagesForUser, 5000);
      return () => clearInterval(interval);
    }
  }, [selectedUser]);

  // Contact Messages Polling
  useEffect(() => {
    const fetchMessagesForContact = async () => {
      if (selectedContact && selectedUser) {
        try {
          const contactNumber = selectedUser.contactNumber || selectedUser.senderWaId;
          const response = await axios.get(GET_MESSAGES_BY_CONTACT_API, {
            params: { contactNumber },
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.data.success) {
            setSelectedContactMessages(response.data.data);
          }
        } catch (error) {
          console.error("Error fetching contact messages:", error);
        }
      }
    };

    if (selectedContact) {
      fetchMessagesForContact();
      const interval = setInterval(fetchMessagesForContact, 5000);
      return () => clearInterval(interval);
    }
  }, [selectedContact]);

  // Auto Scroll Effect
  useEffect(() => {
    scrollToBottom();
  }, [selectedContactMessages]);

  // Helper Functions
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const toggleModal = () => {
    setModal(!modal);
    if (!modal) {
      setNewContact({ phoneNumber: "", countryCode: "" });
    }
  };

  // Message Handling
  const handleSendMessage = async () => {
    if (message.trim() && selectedUser) {
      const newMessage = {
        to: selectedUser.senderWaId || selectedUser.phoneNumber,
        body: message,
      };

      try {
        const response = await axios.post(SEND_MESSAGE_API, newMessage, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          const sentMessage = {
            messageBody: message,
            timestamp: Math.floor(Date.now() / 1000),
            from: "me",
            status: "sent",
            messageId: response.data.messageId,
          };

          setSelectedContactMessages((prev) => [...prev, sentMessage]);
          setMessage("");
          scrollToBottom();
        }
      } catch (error) {
        console.error("Error sending message:", error);
        toast.error("Failed to send message");
        if (error.response?.status === 401) {
          navigate("/admin/settings");
        }
      }
    }
  };

  // Contact Creation
  const handleCreateContact = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(CREATE_CONTACT_API, newContact, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.data.success) {
        toast.success("Contact created successfully");
        await fetchContacts();
        toggleModal();
      } else {
        toast.error(response.data.message || "Error creating contact");
      }
    } catch (error) {
      console.error("Error creating contact:", error);
      toast.error("Failed to create contact");
    }
  };

  // UI Components
  const renderMessage = (message, index) => {
    const isFromCurrentUser = message.from === "me" || message.to === selectedUser?.senderWaId;

    return (
      <div
        key={index}
        style={{
          display: "flex",
          justifyContent: isFromCurrentUser ? "flex-end" : "flex-start",
          marginBottom: "10px",
          width: "100%",
        }}
      >
        <div
          style={{
            maxWidth: "70%",
            padding: "10px",
            backgroundColor: isFromCurrentUser ? "#00796B" : "#e9ecef",
            borderRadius: "10px",
            color: isFromCurrentUser ? "#fff" : "#000",
            fontSize: "14px",
            position: "relative",
          }}
        >
          {message.messageBody}
          <div
            style={{
              fontSize: "12px",
              color: isFromCurrentUser ? "#e0e0e0" : "#6c757d",
              textAlign: "right",
              marginTop: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: "4px",
            }}
          >
            <span>{formatTime(message.timestamp || message.sentTimestamp)}</span>
            {isFromCurrentUser && <MessageStatus status={message.status} />}
          </div>
        </div>
      </div>
    );
  };

  const renderContactModal = () => (
    <Modal isOpen={modal} toggle={toggleModal}>
      <ModalHeader toggle={toggleModal}>Create New Contact</ModalHeader>
      <Form onSubmit={handleCreateContact}>
        <ModalBody>
          <FormGroup>
            <Label for="countryCode">Country Code</Label>
            <Input
              id="countryCode"
              type="text"
              value={newContact.countryCode}
              onChange={(e) => setNewContact({ ...newContact, countryCode: e.target.value })}
              placeholder="+1"
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              type="text"
              value={newContact.phoneNumber}
              onChange={(e) => setNewContact({ ...newContact, phoneNumber: e.target.value })}
              placeholder="Enter phone number"
              required
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleModal}>
            Cancel
          </Button>
          <Button color="primary" type="submit">
            Create Contact
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );

  const renderUserList = () => (
    <Col
      xs="12"
      md="4"
      style={{
        backgroundColor: "#f0f4f8",
        height: "calc(100vh - 100px)",
        display: isMobileView && !showUserList ? "none" : "flex",
        flexDirection: "column",
        overflow: "hidden",
        borderRight: "1px solid #e0e0e0",
        padding: "10px",
      }}
    >
      <div style={{ 
        padding: "10px 0",
        display: "flex",
        gap: "10px",
        alignItems: "center"
      }}>
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
            flex: 1
          }}
        />
        <Button
          color="primary"
          style={{
            borderRadius: "50%",
            padding: "8px",
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
          onClick={toggleModal}
        >
          <FaPlus />
        </Button>
      </div>

      <div style={{ overflowY: "auto", flexGrow: 1 }}>
        {[...userChats, ...contacts]
          .filter((user) => {
            const searchField = user.senderName || `${user.countryCode}${user.phoneNumber}`;
            return searchField.toLowerCase().includes(searchTerm.toLowerCase());
          })
          .map((user) => {return (
            <div
              key={user.senderWaId || user.phoneNumber}
              onClick={() => {
                setSelectedUser(user);
                setSelectedContact(user.contactNumber || user.senderWaId || user.phoneNumber);
                if (isMobileView) setShowUserList(false);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px",
                borderRadius: "10px",
                marginBottom: "10px",
                backgroundColor:
                  selectedUser?.senderWaId === user.senderWaId ||
                  selectedUser?.phoneNumber === user.phoneNumber
                    ? "#E0F7FA"
                    : "transparent",
                cursor: "pointer",
                transition: "background-color 0.3s ease",
              }}
            >
              <Avatar
                name={user.senderName || `${user.countryCode}${user.phoneNumber}`}
                size="40"
                round={true}
                style={{ marginRight: "10px" }}
              />
              <div style={{ flex: 1, overflow: "hidden" }}>
                <h6 style={{ margin: 0, fontWeight: "bold", fontSize: "14px" }}>
                  {user.senderName || `${user.countryCode}${user.phoneNumber}`}
                </h6>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#666",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {recentMessages[user.senderWaId || user.phoneNumber]?.messageBody || "No messages yet"}
                </div>
              </div>
            </div>
          );
        })}
    </div>
  </Col>
);

const renderChatWindow = () => (
  <Col
    xs="12"
    md="8"
    style={{
      height: "calc(100vh - 100px)",
      display: isMobileView && showUserList ? "none" : "flex",
      flexDirection: "column",
      overflow: "hidden",
      backgroundColor: selectedUser ? "#f4f8fb" : "#fff",
    }}
  >
    <div
      style={{
        padding: "15px",
        backgroundColor: selectedUser ? "#00796B" : "#f0f4f8",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: "10px 10px 0 0",
      }}
    >
      {selectedUser ? (
        <h5
          style={{
            margin: 0,
            display: "flex",
            alignItems: "center",
            color: "#fff",
          }}
        >
          <Avatar
            name={selectedUser.senderName || `${selectedUser.countryCode}${selectedUser.phoneNumber}`}
            size="30"
            round={true}
            style={{ marginRight: "10px" }}
          />
          {selectedUser.senderName || `${selectedUser.countryCode}${selectedUser.phoneNumber}`}
        </h5>
      ) : (
        <h5 style={{ margin: 0, color: "#ddd" }}>Select a user</h5>
      )}
      {isMobileView && (
        <Button
          onClick={() => setShowUserList(true)}
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
        flexGrow: 1,
        padding: "20px",
        overflowY: "auto",
        marginTop: "20px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {(() => {
        const allMessages = [
          ...selectedUserMessages.map((msg) => ({
            ...msg,
            timestamp: msg.timestamp || msg.sentTimestamp,
            isFromCurrentUser: false,
          })),
          ...selectedContactMessages.map((msg) => ({
            ...msg,
            timestamp: msg.timestamp || msg.sentTimestamp,
            isFromCurrentUser:
              msg.from === "me" || msg.to === selectedUser?.senderWaId,
          })),
        ].sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

        return allMessages.map((message, index) => renderMessage(message, index));
      })()}
      <div ref={messagesEndRef} />
    </div>

    {selectedUser && (
      <div style={{ padding: "10px", borderTop: "1px solid #e0e0e0" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Button
            style={{
              background: "#f1f1f1",
              border: "none",
              marginRight: "10px",
            }}
            onClick={() => setShowAttachmentOptions(!showAttachmentOptions)}
          >
            <FaPaperclip />
          </Button>

          <Input
            type="text"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              setIsTyping(e.target.value.trim().length > 0);
            }}
            onKeyPress={(e) => {
              if (e.key === "Enter") handleSendMessage();
            }}
            placeholder="Type a message..."
            style={{
              borderRadius: "20px",
              height: "40px",
              fontSize: "14px",
              paddingLeft: "15px",
              flexGrow: 1,
              marginRight: "10px",
            }}
          />

          <Button
            style={{
              backgroundColor: "#00796B",
              borderRadius: "50%",
              padding: "10px",
              border: "none",
            }}
            onClick={handleSendMessage}
            disabled={!message.trim()}
          >
            <FaPaperPlane color="#fff" />
          </Button>
        </div>
      </div>
    )}
  </Col>
);

if (loading) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      Loading...
    </div>
  );
}

return (
  <div>
    <Header />
    <Container fluid style={{ marginTop: "20px" }}>
      <Row>
        {renderUserList()}
        {renderChatWindow()}
      </Row>
    </Container>
    {renderContactModal()}
  </div>
);
};

export default WhatsAppChats;






























// import axios from "axios";
// import Header from "components/Headers/Header";
// import { useEffect, useRef, useState } from "react";
// import Avatar from "react-avatar";
// import {
//   FaArrowLeft,
//   FaCheck,
//   FaCheckDouble,
//   FaPaperclip,
//   FaPaperPlane,
//   FaPlus,
// } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import { Button, Col, Container, Input, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap";
// import { toast } from "sonner";

// // API endpoint constants
// const API_URL = "http://192.168.0.110:4000/api/v1/webHooks/getMessages";
// const GET_MESSAGES_BY_USER_API = "http://192.168.0.110:4000/api/v1/webHooks/getMessagesByUser";
// const GET_RECENT_MESSAGE_API = "http://192.168.0.110:4000/api/v1/webHooks/recentMessages";
// const SEND_MESSAGE_API = "http://192.168.0.110:4000/api/v1/messages/send";
// const GET_MESSAGES_BY_CONTACT_API = "http://192.168.0.110:4000/api/v1/messages/getMessagesByContact";
// const START_NEW_CHAT_API = "http://192.168.0.110:4000/api/v1/messages/startNewChat";
// const WEBHOOK_API = "http://192.168.0.110:4000/api/v1/messages/handleWebHook";

// const MessageStatus = ({ status }) => {
//   if (!status) return null;

//   switch (status?.toLowerCase()) {
//     case "sent":
//       return <FaCheck style={{ fontSize: "12px", color: "#a5a5a5" }} />;
//     case "delivered":
//       return <FaCheckDouble style={{ fontSize: "12px", color: "#a5a5a5" }} />;
//     case "read":
//       return <FaCheckDouble style={{ fontSize: "12px", color: "#34B7F1" }} />;
//     default:
//       return <FaCheck style={{ fontSize: "12px", color: "#a5a5a5" }} />;
//   }
// };

// const WhatsAppChats = () => {
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedContact, setSelectedContact] = useState(null);
//   const [selectedContactMessages, setSelectedContactMessages] = useState([]);
//   const [message, setMessage] = useState("");
//   const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
//   const [showUserList, setShowUserList] = useState(true);
//   const [isTyping, setIsTyping] = useState(false);
//   const messagesEndRef = useRef(null);
//   const [loading, setLoading] = useState(true);
//   const [userChats, setUserChats] = useState([]);
//   const [selectedUserMessages, setSelectedUserMessages] = useState([]);
//   const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
//   const [recentMessages, setRecentMessages] = useState({});

//   // New chat state
//   const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
//   const [newChatCountryCode, setNewChatCountryCode] = useState("+92");
//   const [newChatPhoneNumber, setNewChatPhoneNumber] = useState("");
//   const [newChatMessage, setNewChatMessage] = useState("");

//   const token = localStorage.getItem("token");
//   const navigate = useNavigate();

//   // Resize and persistent user effects
//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobileView(window.innerWidth <= 768);
//     };
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   // Enhanced Persistent User and Chat Storage`
//   useEffect(() => {
//     const persistedUsers = JSON.parse(localStorage.getItem('persistedChats') || '[]');
//     const persistedSelectedUser = localStorage.getItem('selectedUser');

//     if (persistedUsers.length > 0) {
//       setUserChats(persistedUsers);
//     }

//     if (persistedSelectedUser) {
//       try {
//         const user = JSON.parse(persistedSelectedUser);
//         setSelectedUser(user);
//         setSelectedContact(user.contactNumber || user.senderWaId);
//       } catch (error) {
//         console.error("Error parsing persisted user:", error);
//       }
//     }

//     setLoading(false);
//   }, []);

//   // Fetch initial messages
//   useEffect(() => {
//     const fetchMessages = async () => {
//       try {
//         const response = await axios.get(API_URL, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         if (response.data.success) {
//           const uniqueUsers = Array.from(
//             new Map(
//               response.data.messages.map((user) => [user.senderWaId, user])
//             ).values()
//           );

//           // Merge with persisted chats, prioritizing persisted chats
//           const mergedChats = [...uniqueUsers, ...userChats].filter(
//             (obj, pos, arr) => arr.findIndex(t => t.senderWaId === obj.senderWaId) === pos
//           );

//           setUserChats(mergedChats);
//           localStorage.setItem('persistedChats', JSON.stringify(mergedChats));
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     if (userChats.length === 0) {
//       fetchMessages();
//     }
//   }, []);

//   // Save Chats to localStorage whenever userChats changes
//   useEffect(() => {
//     if (userChats.length > 0) {
//       localStorage.setItem('persistedChats', JSON.stringify(userChats));
//     }
//   }, [userChats]);

//   // Fetch recent messages
//   useEffect(() => {
//     const fetchRecentMessages = async () => {
//       try {
//         const messageMap = {};

//         for (const user of userChats) {
//           const response = await axios.get(GET_RECENT_MESSAGE_API, {
//             params: { senderWaId: user.senderWaId },
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           });

//           if (response.data.success) {
//             const recentMessage = response.data.data;
//             if (recentMessage) {
//               messageMap[user.senderWaId] = {
//                 messageBody: recentMessage.messageBody,
//                 timestamp: recentMessage.timestamp || recentMessage.sentTimestamp,
//                 status: recentMessage.status,
//               };
//             }
//           }
//         }
//         setRecentMessages(messageMap);
//       } catch (error) {
//         console.error("Error fetching recent messages:", error);
//       }
//     };

//     fetchRecentMessages();

//     const messageInterval = setInterval(fetchRecentMessages, 5000);
//     return () => clearInterval(messageInterval);
//   }, [userChats]);

//   // Fetch messages for selected user
//   useEffect(() => {
//     const fetchMessagesForUser = async () => {
//       if (selectedUser) {
//         try {
//           const response = await axios.get(GET_MESSAGES_BY_USER_API, {
//             params: { senderWaId: selectedUser.senderWaId },
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           });
//           if (response.data.success) {
//             setSelectedUserMessages(response.data.messages);
//           }
//         } catch (error) {
//           console.error("Error:", error);
//         }
//       }
//     };

//     fetchMessagesForUser();
//     const interval = setInterval(fetchMessagesForUser, 5000);
//     return () => clearInterval(interval);
//   }, [selectedUser]);

//   // Fetch messages for selected contact
//   const fetchMessagesForContact = async () => {
//     try {
//       if (selectedContact && selectedUser) {
//         const contactNumber = selectedUser.contactNumber || selectedUser.senderWaId;
//         const response = await axios.get(GET_MESSAGES_BY_CONTACT_API, {
//           params: { contactNumber },
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (response.data.success) {
//           const messages = response.data.data;
//           setSelectedContactMessages(messages);
//         }
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       setSelectedContactMessages([]);
//     }
//   };

//   useEffect(() => {
//     fetchMessagesForContact();
//     const interval = setInterval(fetchMessagesForContact, 5000);
//     return () => clearInterval(interval);
//   }, [selectedContact]);

//   // Scroll to bottom when messages change
//   useEffect(() => {
//     scrollToBottom();
//   }, [selectedContactMessages]);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   const formatTime = (timestamp) => {
//     if (!timestamp) return "";
//     const date = new Date(timestamp * 1000);
//     return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
//   };

//   // Modified handleStartNewChat to improve persistence
//   const handleStartNewChat = async () => {
//     if (!newChatPhoneNumber.trim() || !newChatMessage.trim()) {
//       toast.error("Please enter phone number and message");
//       return;
//     }

//     const fullPhoneNumber = `${newChatCountryCode}${newChatPhoneNumber}`;

//     try {
//       // Check if chat already exists
//       const existingChat = userChats.find(
//         user => user.senderWaId === fullPhoneNumber
//       );

//       if (existingChat) {
//         // If chat exists, select that chat and send message
//         setSelectedUser(existingChat);
//         setSelectedContact(existingChat.contactNumber || existingChat.senderWaId);
//         localStorage.setItem('selectedUser', JSON.stringify(existingChat));
//         setMessage(newChatMessage);
//         await handleSendMessage();
//         setIsNewChatModalOpen(false);
//         return;
//       }

//       // If no existing chat, create new chat
//       const response = await axios.post(START_NEW_CHAT_API, {
//         countryCode: newChatCountryCode,
//         phoneNumber: newChatPhoneNumber,
//         body: newChatMessage
//       }, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (response.data.success) {
//         // Create new user object with enhanced details
//         const newUser = {
//           senderWaId: fullPhoneNumber,
//           senderName: fullPhoneNumber,
//           contactNumber: fullPhoneNumber,
//           createdAt: Date.now(),  // Add creation timestamp
//           lastMessage: newChatMessage
//         };

//         // Update states and localStorage
//         const updatedChats = [newUser, ...userChats];
//         setUserChats(updatedChats);

//         // Set selected user and save to localStorage
//         setSelectedUser(newUser);
//         localStorage.setItem('selectedUser', JSON.stringify(newUser));
//         localStorage.setItem('persistedChats', JSON.stringify(updatedChats));

//         setSelectedContact(newUser.senderWaId);

//         // Create initial message
//         const initialMessage = {
//           messageBody: newChatMessage,
//           timestamp: Math.floor(Date.now() / 1000),
//           from: "me",
//           status: "sent",
//           to: newUser.senderWaId
//         };

//         setSelectedContactMessages([initialMessage]);

//         // Reset form and close modal
//         setIsNewChatModalOpen(false);
//         setNewChatCountryCode("+92");
//         setNewChatPhoneNumber("");
//         setNewChatMessage("");

//         // For mobile view
//         setShowUserList(false);

//         toast.success("New chat started successfully");
//       }
//     } catch (error) {
//       console.error("Error starting new chat:", error);
//       toast.error(error.response?.data?.message || "Failed to start new chat");
//     }
//   };

//   // Send message handler
//   const handleSendMessage = async () => {
//     if (message.trim() && selectedUser) {
//       const newMessage = {
//         to: selectedUser.senderWaId,
//         body: message,
//       };

//       try {
//         const response = await axios.post(SEND_MESSAGE_API, newMessage, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (response.data.success) {
//           const sentMessage = {
//             messageBody: message,
//             timestamp: Math.floor(Date.now() / 1000),
//             from: "me",
//             status: "sent",
//             messageId: response.data.messageId,
//           };

//           // Update contact messages and save last message to localStorage
//           setSelectedContactMessages((prev) => [...prev, sentMessage]);
//           localStorage.setItem('lastMessage', JSON.stringify(sentMessage));

//           setMessage("");
//           scrollToBottom();
//           await fetchMessagesForContact();
//         }
//       } catch (error) {
//         console.error("Error:", error);
//         toast.error("Configuration is invalid.");
//         navigate("/admin/settings");
//       }
//     }
//   };

//   // Rest of the component (renderMessage, renderUserList, renderChatWindow) remains the same as your original implementation

//   // Render message helper
//   const renderMessage = (message, index) => {
//     const isFromCurrentUser =
//       message.from === "me" || message.to === selectedUser?.senderWaId;

//     return (
//       <div
//         key={index}
//         style={{
//           display: "flex",
//           justifyContent: isFromCurrentUser ? "flex-end" : "flex-start",
//           marginBottom: "10px",
//           width: "100%",
//         }}
//       >
//         <div
//           style={{
//             maxWidth: "70%",
//             padding: "10px",
//             backgroundColor: isFromCurrentUser ? "#00796B" : "#e9ecef",
//             borderRadius: "10px",
//             color: isFromCurrentUser ? "#fff" : "#000",
//             fontSize: "14px",
//             position: "relative",
//           }}
//         >
//           {message.messageBody}
//           <div
//             style={{
//               fontSize: "12px",
//               color: isFromCurrentUser ? "#e0e0e0" : "#6c757d",
//               textAlign: "right",
//               marginTop: "4px",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "flex-end",
//               gap: "4px",
//             }}
//           >
//             <span>
//               {formatTime(message.timestamp || message.sentTimestamp)}
//             </span>
//             {isFromCurrentUser && <MessageStatus status={message.status} />}
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // Render user list (original implementation)
//   // Continued from previous artifact...

//   const renderUserList = () => (
//     <Col
//       xs="12"
//       md="4"
//       style={{
//         backgroundColor: "#f0f4f8",
//         height: "calc(100vh - 100px)",
//         display: isMobileView && !showUserList ? "none" : "flex",
//         flexDirection: "column",
//         overflow: "hidden",
//         borderRight: "1px solid #e0e0e0",
//         padding: "10px",
//         position: "relative",
//       }}
//     >
//       <div style={{ padding: "10px 0" }}>
//         <Input
//           type="text"
//           placeholder="Search users..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           style={{
//             borderRadius: "20px",
//             backgroundColor: "#fff",
//             border: "1px solid #e0e0e0",
//             padding: "8px 15px",
//           }}
//         />
//       </div>
//       <div style={{ overflowY: "auto", flexGrow: 1 }}>
//         {userChats
//           .filter((user) =>
//             user.senderName.toLowerCase().includes(searchTerm.toLowerCase())
//           )
//           .map((user) => {
//             const recentMessage = recentMessages[user.senderWaId];

//             return (
//               <div
//                 key={user.senderWaId}
//                 onClick={() => {
//                   setSelectedUser(user);
//                   setSelectedContact(user.contactNumber || user.senderWaId);
//                   localStorage.setItem('selectedUser', JSON.stringify(user));
//                   if (isMobileView) setShowUserList(false);
//                 }}
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   padding: "10px",
//                   borderRadius: "10px",
//                   marginBottom: "10px",
//                   backgroundColor:
//                     selectedUser?.senderWaId === user.senderWaId
//                       ? "#E0F7FA"
//                       : "transparent",
//                   cursor: "pointer",
//                   transition: "background-color 0.3s ease",
//                 }}
//               >
//                 <Avatar
//                   name={user.senderName}
//                   size="40"
//                   round={true}
//                   style={{ marginRight: "10px" }}
//                 />
//                 <div style={{ flex: 1, overflow: "hidden" }}>
//                   <h6
//                     style={{ margin: 0, fontWeight: "bold", fontSize: "14px" }}
//                   >
//                     {user.senderName}
//                   </h6>
//                   <div
//                     style={{
//                       fontSize: "12px",
//                       color: "#666",
//                       whiteSpace: "nowrap",
//                       overflow: "hidden",
//                       textOverflow: "ellipsis",
//                     }}
//                   >
//                     {recentMessage
//                       ? recentMessage.messageBody
//                       : "No messages yet"}
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//       </div>

//       <Button
//         onClick={() => setIsNewChatModalOpen(true)}
//         style={{
//           position: 'absolute',
//           bottom: '20px',
//           right: '20px',
//           backgroundColor: '#00796B',
//           borderRadius: '50%',
//           width: '50px',
//           height: '50px',
//           display: 'flex',
//           justifyContent: 'center',
//           alignItems: 'center',
//           border: 'none',
//           boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
//         }}
//       >
//         <FaPlus color="#fff" />
//       </Button>
//     </Col>
//   );

//   // Render chat window
//   const renderChatWindow = () => (
//     <Col
//       xs="12"
//       md="8"
//       style={{
//         height: "calc(100vh - 100px)",
//         display: isMobileView && showUserList ? "none" : "flex",
//         flexDirection: "column",
//         overflow: "hidden",
//         backgroundColor: selectedUser ? "#f4f8fb" : "#fff",
//       }}
//     >
//       <div
//         style={{
//           padding: "15px",
//           backgroundColor: selectedUser ? "#00796B" : "#f0f4f8",
//           color: "#fff",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           borderRadius: "10px 10px 0 0",
//         }}
//       >
//         {selectedUser ? (
//           <h5
//             style={{
//               margin: 0,
//               display: "flex",
//               alignItems: "center",
//               color: "#fff",
//             }}
//           >
//             <Avatar
//               name={selectedUser.senderName}
//               size="30"
//               round={true}
//               style={{ marginRight: "10px" }}
//             />
//             {selectedUser.senderName}
//           </h5>
//         ) : (
//           <h5 style={{ margin: 0, color: "#ddd" }}>Select a user</h5>
//         )}
//         {isMobileView && (
//           <Button
//             onClick={() => setShowUserList(true)}
//             style={{
//               backgroundColor: "transparent",
//               border: "none",
//               color: "#fff",
//             }}
//           >
//             <FaArrowLeft />
//           </Button>
//         )}
//       </div>

//       <div
//         style={{
//           flexGrow: 1,
//           padding: "20px",
//           overflowY: "auto",
//           marginTop: "20px",
//           display: "flex",
//           flexDirection: "column",
//         }}
//       >
//         {(() => {
//           const allMessages = [
//             ...selectedUserMessages.map((msg) => ({
//               ...msg,
//               timestamp: msg.timestamp || msg.sentTimestamp,
//               isFromCurrentUser: false,
//             })),
//             ...selectedContactMessages.map((msg) => ({
//               ...msg,
//               timestamp: msg.timestamp || msg.sentTimestamp,
//               isFromCurrentUser:
//                 msg.from === "me" || msg.to === selectedUser?.senderWaId,
//             })),
//           ].sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

//           return allMessages.map((message, index) =>
//             renderMessage(message, index)
//           );
//         })()}
//         <div ref={messagesEndRef} />
//       </div>

//       {selectedUser && (
//         <div style={{ padding: "10px", borderTop: "1px solid #e0e0e0" }}>
//           <div style={{ display: "flex", alignItems: "center" }}>
//             <Button
//               style={{
//                 background: "#f1f1f1",
//                 border: "none",
//                 marginRight: "10px",
//               }}
//               onClick={() => setShowAttachmentOptions(!showAttachmentOptions)}
//             >
//               <FaPaperclip />
//             </Button>

//             <Input
//               type="text"
//               value={message}
//               onChange={(e) => {
//                 setMessage(e.target.value);
//                 setIsTyping(e.target.value.trim().length > 0);
//               }}
//               onKeyPress={(e) => {
//                 if (e.key === "Enter") handleSendMessage();
//               }}
//               placeholder="Type a message..."
//               style={{
//                 borderRadius: "20px",
//                 height: "40px",
//                 fontSize: "14px",
//                 paddingLeft: "15px",
//                 flexGrow: 1,
//                 marginRight: "10px",
//               }}
//             />

//             <Button
//               style={{
//                 backgroundColor: "#00796B",
//                 borderRadius: "50%",
//                 padding: "10px",
//                 border: "none",
//               }}
//               onClick={handleSendMessage}
//               disabled={!message.trim()}
//             >
//               <FaPaperPlane color="#fff" />
//             </Button>
//           </div>
//         </div>
//       )}
//     </Col>
//   );

//   // Loading state
//   if (loading) {
//     return (
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           height: "100vh",
//         }}
//       >
//         Loading...
//       </div>
//     );
//   }

//   return (
//     <div>
//       <Header />
//       <Container fluid style={{ marginTop: "20px" }}>
//         <Row>
//           {renderUserList()}
//           {renderChatWindow()}
//         </Row>
//       </Container>

//       {/* New Chat Modal */}
//       <Modal
//         isOpen={isNewChatModalOpen}
//         toggle={() => setIsNewChatModalOpen(!isNewChatModalOpen)}
//         centered
//       >
//         <ModalHeader toggle={() => setIsNewChatModalOpen(false)}>
//           Start New Chat
//         </ModalHeader>
//         <ModalBody>
//           <Row>
//             <Col xs="4">
//               <Input
//                 type="select"
//                 value={newChatCountryCode}
//                 onChange={(e) => setNewChatCountryCode(e.target.value)}
//                 style={{ borderRadius: '5px' }}
//               >
//                 <option value="+92">+92 (Pakistan)</option>
//                 <option value="+1">+1 (USA)</option>
//                 <option value="+44">+44 (UK)</option>
//                 <option value="+81">+81 (Japan)</option>
//                 <option value="+86">+86 (China)</option>
//                 <option value="+7">+7 (Russia)</option>
//               </Input>
//             </Col>
//             <Col xs="8">
//               <Input
//                 type="text"
//                 placeholder="Phone Number"
//                 value={newChatPhoneNumber}
//                 onChange={(e) => setNewChatPhoneNumber(e.target.value)}
//                 style={{ borderRadius: '5px' }}
//               />
//             </Col>
//           </Row>
//           <Input
//             type="textarea"
//             placeholder="Initial Message"
//             value={newChatMessage}
//             onChange={(e) => setNewChatMessage(e.target.value)}
//             style={{
//               marginTop: '15px',
//               borderRadius: '5px',
//               minHeight: '100px'
//             }}
//           />
//         </ModalBody>
//         <ModalFooter>
//           <Button
//             color="secondary"
//             onClick={() => setIsNewChatModalOpen(false)}
//           >
//             Cancel
//           </Button>
//           <Button
//             color="primary"
//             onClick={handleStartNewChat}
//           >
//             Send
//           </Button>
//         </ModalFooter>
//       </Modal>
//     </div>
//   );
// };

// export default WhatsAppChats;
