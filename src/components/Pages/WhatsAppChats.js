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
//         console.error("Error fetching data:", error);
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
import { Button, Col, Container, Input, Row, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label } from "reactstrap";
import { toast } from "sonner";

const API_URL = "http://192.168.0.110:4000/api/v1/webHooks/getMessages";
const GET_MESSAGES_BY_USER_API = "http://192.168.0.110:4000/api/v1/webHooks/getMessagesByUser";
const GET_RECENT_MESSAGE_API = "http://192.168.0.110:4000/api/v1/webHooks/recentMessages";
const SEND_MESSAGE_API = "http://192.168.0.110:4000/api/v1/messages/send";
const GET_MESSAGES_BY_CONTACT_API = "http://192.168.0.110:4000/api/v1/messages/getMessagesByContact";
const START_NEW_CHAT_API = "http://192.168.0.110:4000/api/v1/messages/startNewChat";

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

const NewChatModal = ({ isOpen, toggle, onChatStarted }) => {
  const [countryCode, setCountryCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const countryCodes = [
    { code: '+92', country: 'pakistan' },
    { code: '+1', country: 'USA' },
    { code: '+44', country: 'UK' },
    { code: '+61', country: 'Australia' },
    { code: '+86', country: 'China' },
    { code: '+81', country: 'Japan' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(START_NEW_CHAT_API, {
        countryCode,
        phoneNumber: phoneNumber.trim(),
        body: message.trim()
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        toast.success('Chat started successfully!');
        setCountryCode('');
        setPhoneNumber('');
        setMessage('');
        onChatStarted();
        toggle();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to start chat');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Start New Chat</ModalHeader>
      <Form onSubmit={handleSubmit}>
        <ModalBody>
          <FormGroup>
            <Label>Country Code</Label>
            <Input
              type="select"
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              required
            >
              <option value="">Select Country Code</option>
              {countryCodes.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.country} ({country.code})
                </option>
              ))}
            </Input>
          </FormGroup>
          
          <FormGroup>
            <Label>Phone Number</Label>
            <Input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter phone number without country code"
              pattern="[0-9]*"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Initial Message</Label>
            <Input
              type="textarea"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your first message"
              required
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
          <Button color="primary" type="submit" disabled={loading}>
            {loading ? 'Starting Chat...' : 'Start Chat'}
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

const WhatsAppChats = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);
  const [selectedContactMessages, setSelectedContactMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
  const [showUserList, setShowUserList] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [userChats, setUserChats] = useState([]);
  const [selectedUserMessages, setSelectedUserMessages] = useState([]);
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
  const [recentMessages, setRecentMessages] = useState({});
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const toggleNewChatModal = () => {
    setIsNewChatModalOpen(!isNewChatModalOpen);
  };

  const handleChatStarted = () => {
    fetchMessages();
  };

  const fetchMessages = async () => {
    try {
      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        const uniqueUsers = Array.from(
          new Map(
            response.data.messages.map((user) => [user.senderWaId, user])
          ).values()
        );
        setUserChats(uniqueUsers);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessagesForUser = async () => {
    if (selectedUser) {
      try {
        const response = await axios.get(GET_MESSAGES_BY_USER_API, {
          params: { senderWaId: selectedUser.senderWaId },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.success) {
          setSelectedUserMessages(response.data.messages);
        }
      } catch (error) {
        console.error("Error fetching user messages:", error);
        if (error.response?.status === 401) {
          toast.error("Session expired. Please login again.");
          navigate("/auth/login");
        } else {
          toast.error("Failed to fetch user messages");
          setSelectedUserMessages([]);
        }
      }
    }
  };


  const fetchRecentMessages = async () => {
    try {
      const messageMap = {};
  
      for (const user of userChats) {
        try {
          const response = await axios.get(GET_RECENT_MESSAGE_API, {
            params: { senderWaId: user.senderWaId },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  
          if (response.data.success && response.data.data) {
            messageMap[user.senderWaId] = {
              messageBody: response.data.data.messageBody,
              timestamp: response.data.data.timestamp || response.data.data.sentTimestamp,
              status: response.data.data.status,
            };
          }
        } catch (error) {
          console.error(`Error fetching recent message for user ${user.senderWaId}:`, error);
        }
      }
      setRecentMessages(messageMap);
    } catch (error) {
      console.error("Error in fetchRecentMessages:", error);
    }
  };
  
  // Add these useEffects to handle periodic fetching
  useEffect(() => {
    // Fetch messages for selected user
    if (selectedUser) {
      fetchMessagesForUser();
      const userMessagesInterval = setInterval(fetchMessagesForUser, 5000);
      return () => clearInterval(userMessagesInterval);
    }
  }, [selectedUser]);
  
  useEffect(() => {
    // Fetch recent messages for all users
    if (userChats.length > 0) {
      fetchRecentMessages();
      const recentMessagesInterval = setInterval(fetchRecentMessages, 5000);
      return () => clearInterval(recentMessagesInterval);
    }
  }, [userChats]);
  
  // Add this function to handle user selection
  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setSelectedContact(user.contactNumber || user.senderWaId);
    if (isMobileView) setShowUserList(false);
    fetchMessagesForUser();
    fetchMessagesForContact();
  };
userChats
  .filter((user) =>
    user.senderName.toLowerCase().includes(searchTerm.toLowerCase())
  )
  .map((user) => {
    const recentMessage = recentMessages[user.senderWaId];

    return (
      <div
        key={user.senderWaId}
        onClick={() => handleUserSelect(user)}
        style={{
          display: "flex",
          alignItems: "center",
          padding: "10px",
          borderRadius: "10px",
          marginBottom: "10px",
          backgroundColor:
            selectedUser?.senderWaId === user.senderWaId
              ? "#E0F7FA"
              : "transparent",
          cursor: "pointer",
          transition: "background-color 0.3s ease",
        }}
      >
        <Avatar
          name={user.senderName}
          size="40"
          round={true}
          style={{ marginRight: "10px" }}
        />
        <div style={{ flex: 1, overflow: "hidden" }}>
          <h6
            style={{ margin: 0, fontWeight: "bold", fontSize: "14px" }}
          >
            {user.senderName}
          </h6>
          <div
            style={{
              fontSize: "12px",
              color: "#666",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "70%",
              }}
            >
              {recentMessage ? recentMessage.messageBody : "No messages yet"}
            </span>
            {recentMessage && (
              <span style={{ fontSize: "11px", color: "#999" }}>
                {formatTime(recentMessage.timestamp)}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  })  

  // Add these functions inside your WhatsAppChats component, before renderChatWindow

  function formatTime(timestamp) {
    if (!timestamp) return "";
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  
  const renderMessage = (message, index) => {
    const isFromCurrentUser =
      message.from === "me" || message.to === selectedUser?.senderWaId;
  
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
            <span>
              {formatTime(message.timestamp || message.sentTimestamp)}
            </span>
            {isFromCurrentUser && <MessageStatus status={message.status} />}
          </div>
        </div>
      </div>
    );
  };
  

const handleSendMessage = async () => {
  if (message.trim() && selectedUser) {
    try {
      const newMessage = {
        to: selectedUser.senderWaId,
        body: message,
      };

      const response = await axios.post(SEND_MESSAGE_API, newMessage, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
        fetchMessagesForContact();
      }
    } catch (error) {
      console.error("Error:", error);
      if (error.response?.status === 401 || 
          error.response?.data?.message?.includes("invalid")) {
        toast.error("Configuration is invalid.");
        navigate("/admin/settings");
      } else {
        toast.error("Failed to send message. Please try again.");
      }
    }
  }
};


// Add these functions inside your WhatsAppChats component, before the other functions

const scrollToBottom = () => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
};

const fetchMessagesForContact = async () => {
  try {
    if (selectedContact && selectedUser) {
      const contactNumber = selectedUser.contactNumber || selectedUser.senderWaId;
      const response = await axios.get(GET_MESSAGES_BY_CONTACT_API, {
        params: { contactNumber },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        const messages = response.data.data;
        setSelectedContactMessages(messages);
      }
    }
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    if (error.response?.status === 401) {
      toast.error("Session expired. Please login again.");
      navigate("/auth/login");
    } else {
      toast.error("Failed to fetch messages");
    }
    setSelectedContactMessages([]);
  }
};

// Add this useEffect to handle auto-scrolling and message fetching
useEffect(() => {
  scrollToBottom();
}, [selectedContactMessages]);

useEffect(() => {
  fetchMessagesForContact();
  const interval = setInterval(fetchMessagesForContact, 5000);
  return () => clearInterval(interval);
}, [selectedContact]);

  // Rest of your existing useEffect hooks and functions remain the same
  // ... (keep all the existing code for message fetching, sending, etc.)

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
      <div style={{ padding: "10px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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
            flex: 1,
            marginRight: "10px",
          }}
        />
        <Button
          color="success"
          style={{
            borderRadius: "50%",
            padding: "10px",
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={toggleNewChatModal}
        >
          <FaPlus />
        </Button>
      </div>
      <div style={{ overflowY: "auto", flexGrow: 1 }}>
        {userChats.length === 0 ? (
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            padding: "20px",
            textAlign: "center",
          }}>
            <p style={{ color: "#666", marginBottom: "20px" }}>No chats found</p>
            <Button color="success" onClick={toggleNewChatModal}>
              Start New Chat
            </Button>
          </div>
        ) : (
          userChats
            .filter((user) =>
              user.senderName.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((user) => {
              const recentMessage = recentMessages[user.senderWaId];

              return (
                <div
                  key={user.senderWaId}
                  onClick={() => {
                    setSelectedUser(user);
                    setSelectedContact(user.contactNumber || user.senderWaId);
                    if (isMobileView) setShowUserList(false);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "10px",
                    borderRadius: "10px",
                    marginBottom: "10px",
                    backgroundColor:
                      selectedUser?.senderWaId === user.senderWaId
                        ? "#E0F7FA"
                        : "transparent",
                    cursor: "pointer",
                    transition: "background-color 0.3s ease",
                  }}
                >
                  <Avatar
                    name={user.senderName}
                    size="40"
                    round={true}
                    style={{ marginRight: "10px" }}
                  />
                  <div style={{ flex: 1, overflow: "hidden" }}>
                    <h6
                      style={{ margin: 0, fontWeight: "bold", fontSize: "14px" }}
                    >
                      {user.senderName}
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
                      {recentMessage
                        ? recentMessage.messageBody
                        : "No messages yet"}
                    </div>
                  </div>
                </div>
              );
            })
        )}
      </div>
      
      <NewChatModal
        isOpen={isNewChatModalOpen}
        toggle={toggleNewChatModal}
        onChatStarted={handleChatStarted}
      />
    </Col>
  );

  // Keep your existing renderChatWindow function and other code
  // ... (rest of your existing code remains the same)

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

  // Add this function inside your WhatsAppChats component, before the return statement

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
            name={selectedUser.senderName}
            size="30"
            round={true}
            style={{ marginRight: "10px" }}
          />
          {selectedUser.senderName}
        </h5>
      ) : (
        <h5 style={{ margin: 0, color: "#666" }}>Select a user or start a new chat</h5>
      )}
      {isMobileView && selectedUser && (
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

        return allMessages.map((message, index) =>
          renderMessage(message, index)
        );
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
  

  return (
    <div>
      <Header />
      <Container fluid style={{ marginTop: "20px" }}>
        <Row>
          {renderUserList()}
          {renderChatWindow()}
        </Row>
      </Container>
    </div>
  );
};

export default WhatsAppChats;