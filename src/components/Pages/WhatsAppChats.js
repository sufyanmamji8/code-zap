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
//         // console.error("Error fetching",data error);
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
















// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import {
//   Container,
//   Row,
//   Col,
//   Card,
//   CardHeader,
//   CardBody,
//   Input,
//   Button,
//   Badge,
//   InputGroup,
//   Spinner
// } from 'reactstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';

// const WhatsAppChat = () => {
//   const [messages, setMessages] = useState([]);
//   const [selectedChat, setSelectedChat] = useState(null);
//   const [newMessage, setNewMessage] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [chats, setChats] = useState([]);
//   const messagesEndRef = useRef(null);
//   const [error, setError] = useState(null);

//   const baseURL = 'https://codozap-e04e12b02929.herokuapp.com/api/v1/messages';
//   const token = localStorage.getItem('token');

//   // Fetch messages
//   const fetchMessages = async () => {
//     try {

//       setLoading(true);
//       const response = await axios.get('https://codozap-e04e12b02929.herokuapp.com/test'); // Using the /test endpoint that works
      
//       // Parse the HTML response to extract messages data
//       const parser = new DOMParser();
//       const doc = parser.parseFromString(response.data, 'text/html');
//       const scriptContent = doc.querySelector('script');
      
//       if (scriptContent) {
//         const chatDataMatch = scriptContent.textContent.match(/const chatData = (.*?);/);
//         if (chatDataMatch) {
//           const chatData = JSON.parse(chatDataMatch[1]);
          
//           // Convert the chat data to our messages format
//           const allMessages = [];
//           Object.entries(chatData).forEach(([chatId, msgs]) => {
//             msgs.forEach(msg => {
//               allMessages.push({
//                 ...msg,
//                 chatId
//               });
//             });
//           });
          
//           setMessages(allMessages);
          
//           // Group messages by chat
//           const groupedChats = allMessages.reduce((acc, msg) => {
//             const chatId = msg.from === msg.businessId ? msg.to : msg.from;
//             if (!acc[chatId]) {
//               acc[chatId] = [];
//             }
//             acc[chatId].push(msg);
//             return acc;
//           }, {});
          
//           setChats(Object.entries(groupedChats));
//         }
//       }
//     } catch (err) {
//       setError('Failed to fetch messages: ' + (err.response?.status || err.message));
//       console.error('Error fetching messages:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Send message
//   const sendMessage = async (e) => {
//     e.preventDefault();
//     if (!newMessage.trim() || !selectedChat) return;

//     try {
//       setLoading(true);
//       await axios.post(`${baseURL}/send`, {
//         to: selectedChat,
//         body: newMessage
//       }, {
//         headers: {
//           Authorization: `Bearer ${token}`
          
//           // Add any required authentication headers here
//         }
//       });

//       // Optimistically add message to UI
//       const newMsg = {
//         messageId: Date.now().toString(),
//         from: '923030307660', // Your business phone number
//         to: selectedChat,
//         messageBody: newMessage,
//         currentStatusTimestamp: Math.floor(Date.now() / 1000).toString(),
//         status: 'sent'
//       };

//       setMessages(prev => [...prev, newMsg]);
//       setNewMessage('');
      
//       // Refresh messages after sending
//       setTimeout(fetchMessages, 1000); // Wait a second before refreshing
//     } catch (err) {
//       setError('Failed to send message: ' + (err.response?.status || err.message));
//       console.error('Error sending message:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchMessages();
//     const interval = setInterval(fetchMessages, 10000); // Poll every 10 seconds
//     return () => clearInterval(interval);
//   }, []);

//   useEffect(() => {
//       messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//     }, [messages]);
  
//     const formatTime = (timestamp) => {
//       return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
//         hour: '2-digit',
//         minute: '2-digit'
//       });
//     };


//   return (
//     <Container fluid className="vh-100 py-3" style={{ backgroundColor: '#f0f2f5' }}>
//       <Row className="h-100">
//         {/* Chat List Sidebar */}
//         <Col md="4" className="h-100">
//           <Card className="h-100 shadow">
//             <CardHeader className="bg-primary text-white">
//               <h5 className="mb-0">WhatsApp Chats</h5>
//               {error && <div className="text-warning small mt-1">{error}</div>}
//             </CardHeader>
//             <CardBody className="p-0">
//               <div className="chat-list" style={{ overflowY: 'auto', height: 'calc(100vh - 130px)' }}>
//                 {chats.map(([chatId, chatMessages]) => {
//                   const lastMessage = chatMessages[chatMessages.length - 1];
//                   const unreadCount = chatMessages.filter(
//                     msg => !msg.readTimestamp && msg.from !== '923030307660'
//                   ).length;

//                   return (
//                     <div
//                       key={chatId}
//                       className={`p-3 border-bottom chat-item ${
//                         selectedChat === chatId ? 'active bg-light' : ''
//                       }`}
//                       onClick={() => setSelectedChat(chatId)}
//                       style={{ cursor: 'pointer' }}
//                     >
//                       <div className="d-flex align-items-center">
//                         <div className="chat-avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
//                              style={{ width: '40px', height: '40px', marginRight: '10px' }}>
//                           {chatId.slice(0, 2)}
//                         </div>
//                         <div className="flex-grow-1">
//                           <h6 className="mb-0">{chatId}</h6>
//                           <p className="mb-0 text-muted small text-truncate">
//                             {lastMessage?.messageBody}
//                           </p>
//                         </div>
//                         <div className="text-end">
//                           <small className="text-muted">
//                             {new Date(lastMessage?.currentStatusTimestamp * 1000).toLocaleTimeString()}
//                           </small>
//                           {unreadCount > 0 && (
//                             <Badge color="success" pill className="ms-2">
//                               {unreadCount}
//                             </Badge>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </CardBody>
//           </Card>
//         </Col>

//         {/* Chat Window */}
//         <Col md="8" className="h-100">
//           <Card className="h-100 shadow">
//             {selectedChat ? (
//               <>
//                 <CardHeader className="bg-primary text-white">
//                   <div className="d-flex align-items-center">
//                     <div className="chat-avatar bg-white text-primary rounded-circle d-flex align-items-center justify-content-center"
//                          style={{ width: '40px', height: '40px', marginRight: '10px' }}>
//                       {selectedChat.slice(0, 2)}
//                     </div>
//                     <h5 className="mb-0">{selectedChat}</h5>
//                   </div>
//                 </CardHeader>
//                 <CardBody className="chat-messages" style={{ overflowY: 'auto', height: 'calc(100vh - 230px)' }}>
//                   {messages
//                     .filter(msg => msg.from === selectedChat || msg.to === selectedChat)
//                     .map((message) => (
//                       <div
//                         key={message.messageId}
//                         className={`d-flex mb-3 ${
//                           message.from === '923030307660' ? 'justify-content-end' : 'justify-content-start'
//                         }`}
//                       >
//                         <div
//                           className={`message-bubble p-3 rounded-3 ${
//                             message.from === '923030307660'
//                               ? 'bg-primary text-white'
//                               : 'bg-white border'
//                           }`}
//                           style={{ maxWidth: '75%' }}
//                         >
//                           <div className="message-text">{message.messageBody}</div>
//                           <div className="message-time small opacity-75">
//                             {new Date(message.currentStatusTimestamp * 1000).toLocaleTimeString()}
//                             {message.status && (
//                               <span className="ms-2">
//                                 {message.status === 'sent' && '✓'}
//                                 {message.status === 'delivered' && '✓✓'}
//                                 {message.status === 'read' && '✓✓'}
//                               </span>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   <div ref={messagesEndRef} />
//                 </CardBody>
//                 <div className="p-3 border-top">
//                   <form onSubmit={sendMessage}>
//                     <InputGroup>
//                       <Input
//                         type="text"
//                         value={newMessage}
//                         onChange={(e) => setNewMessage(e.target.value)}
//                         placeholder="Type a message..."
//                         disabled={loading}
//                       />
//                       <Button color="primary" disabled={loading || !newMessage.trim()}>
//                         {loading ? <Spinner size="sm" /> : 'Send'}
//                       </Button>
//                     </InputGroup>
//                   </form>
//                 </div>
//               </>
//             ) : (
//               <div className="h-100 d-flex align-items-center justify-content-center">
//                 <h5 className="text-muted">Select a chat to start messaging</h5>
//               </div>
//             )}
//           </Card>
//         </Col>
//       </Row>

//       {/* Loading Overlay */}
//       {loading && (
//         <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
//              style={{ backgroundColor: 'rgba(0,0,0,0.3)', zIndex: 1050 }}>
//           <Spinner color="primary" />
//         </div>
//       )}
//     </Container>
//   );
// };

// export default WhatsAppChat;














// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import {
//   Container,
//   Row,
//   Col,
//   Card,
//   Input,
//   Button,
//   InputGroup,
//   Spinner,
//   Dropdown,
//   DropdownToggle,
//   DropdownMenu,
//   DropdownItem,
// } from 'reactstrap';
// import { Search, Send, Check, CheckCheck, Plus, Phone, Video, MoreVertical } from 'lucide-react';
// import Header from 'components/Headers/Header';
// import 'bootstrap/dist/css/bootstrap.min.css';

// const countryCodes = [
//   { code: '+92', country: 'Pakistan' },
//   { code: '+91', country: 'India' },
//   { code: '+1', country: 'USA' },
//   { code: '+44', country: 'UK' },
//   { code: '+86', country: 'China' },
//   { code: '+971', country: 'UAE' },
// ];

// export default function WhatsAppChat() {
//   const [messages, setMessages] = useState([]);
//   const [selectedChat, setSelectedChat] = useState(null);
//   const [newMessage, setNewMessage] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [chats, setChats] = useState([]);
//   const [error, setError] = useState(null);
//   const [isTyping, setIsTyping] = useState(false);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [selectedCountryCode, setSelectedCountryCode] = useState('+92');
//   const [newUserPhone, setNewUserPhone] = useState('');
//   const [showNewChatDropdown, setShowNewChatDropdown] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');

//   const messagesEndRef = useRef(null);
//   const typingTimeoutRef = useRef(null);

//   const baseURL = 'https://codozap-e04e12b02929.herokuapp.com/api/v1/messages';
//   const BUSINESS_PHONE = '923030307660';
//   const token = localStorage.getItem('token');

//   const fetchMessages = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get('https://codozap-e04e12b02929.herokuapp.com/test');
      
//       const parser = new DOMParser();
//       const doc = parser.parseFromString(response.data, 'text/html');
//       const scriptContent = doc.querySelector('script');
      
//       if (scriptContent) {
//         const chatDataMatch = scriptContent.textContent.match(/const chatData = (.*?);/);
//         if (chatDataMatch) {
//           const chatData = JSON.parse(chatDataMatch[1]);
          
//           const allMessages = [];
//           Object.entries(chatData).forEach(([chatId, msgs]) => {
//             msgs.forEach(msg => allMessages.push({ ...msg, chatId }));
//           });
          
//           setMessages(allMessages);
          
//           const groupedChats = allMessages.reduce((acc, msg) => {
//             const chatId = msg.from === msg.businessId ? msg.to : msg.from;
//             if (chatId === BUSINESS_PHONE) return acc;
//             if (!acc[chatId]) acc[chatId] = [];
//             acc[chatId].push(msg);
//             return acc;
//           }, {});
          
//           const sortedChats = Object.entries(groupedChats).sort((a, b) => {
//             const lastMsgA = a[1][a[1].length - 1].currentStatusTimestamp;
//             const lastMsgB = b[1][b[1].length - 1].currentStatusTimestamp;
//             return lastMsgB - lastMsgA;
//           });
          
//           setChats(sortedChats);
//         }
//       }
//     } catch (err) {
//       setError('Failed to fetch messages: ' + (err.response?.status || err.message));
//     } finally {
//       setLoading(false);
//     }
//   };

//   const sendMessage = async (e) => {
//     e.preventDefault();
//     if (!newMessage.trim() || !selectedChat) return;

//     try {
//       setLoading(true);
//       await axios.post(`${baseURL}/send`, {
//         to: selectedChat,
//         body: newMessage
//       }, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       const newMsg = {
//         messageId: Date.now().toString(),
//         from: BUSINESS_PHONE,
//         to: selectedChat,
//         messageBody: newMessage,
//         currentStatusTimestamp: Math.floor(Date.now() / 1000),
//         status: 'sent'
//       };
      
//       setMessages(prev => [...prev, newMsg]);
//       setNewMessage('');
//       await fetchMessages();
//     } catch (err) {
//       setError('Failed to send message: ' + (err.response?.status || err.message));
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleNewChat = () => {
//     if (newUserPhone.trim()) {
//       const fullNumber = selectedCountryCode + newUserPhone.replace(/[^0-9]/g, '');
//       setChats(prev => [[fullNumber, []], ...prev]);
//       setSelectedChat(fullNumber);
//       setNewUserPhone('');
//       setShowNewChatDropdown(false);
//     }
//   };

//   const filteredChats = chats.filter(([chatId]) => 
//     chatId.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   useEffect(() => {
//     fetchMessages();
//     const interval = setInterval(fetchMessages, 10000);
//     return () => clearInterval(interval);
//   }, []);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);
//   return (
//     <div className="vh-100 bg-light">
//       <Header />
//       <Container fluid className="h-100 p-0">
//         <Row className="h-100 g-0">
//           {/* Sidebar */}
//           <Col md="4" lg="3" className="h-100 border-end bg-white">
//             <div className="d-flex flex-column h-100">
//               {/* Sidebar Header */}
//               <div className="p-3 bg-white border-bottom">
//                 <div className="d-flex justify-content-between align-items-center mb-3">
//                   <div className="d-flex align-items-center">
//                     <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center me-2"
//                          style={{ width: '40px', height: '40px' }}>
//                       WA
//                     </div>
//                     <h5 className="mb-0">WhatsApp</h5>
//                   </div>
//                   <div className="d-flex gap-2">
//                     <Button color="light" className="rounded-circle p-2">
//                       <Plus size={20} />
//                     </Button>
//                     <Button color="light" className="rounded-circle p-2">
//                       <MoreVertical size={20} />
//                     </Button>
//                   </div>
//                 </div>
//                 <InputGroup className="search-bar">
//                   <Input
//                     placeholder="Search or start new chat"
//                     className="border rounded-pill bg-light"
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                   />
//                   <div className="position-absolute top-50 translate-middle-y ps-3">
//                     <Search size={18} className="text-muted" />
//                   </div>
//                 </InputGroup>
//               </div>

//               {/* Chat List */}
//               <div className="chat-list flex-grow-1 overflow-auto">
//                 {chats.map(([chatId, chatMessages]) => {
//                   if (chatId === BUSINESS_PHONE) return null;
//                   const lastMessage = chatMessages[chatMessages.length - 1];
//                   const unreadCount = chatMessages.filter(
//                     msg => !msg.readTimestamp && msg.from !== BUSINESS_PHONE
//                   ).length;

//                   return (
//                     <div
//                       key={chatId}
//                       className={`chat-item p-3 cursor-pointer ${selectedChat === chatId ? 'active' : ''}`}
//                       onClick={() => setSelectedChat(chatId)}
//                     >
//                       <div className="d-flex align-items-center gap-3">
//                         <div className="avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
//                              style={{ width: '48px', height: '48px', flexShrink: 0 }}>
//                           {chatId.slice(0, 2).toUpperCase()}
//                         </div>
//                         <div className="flex-grow-1 min-width-0">
//                           <div className="d-flex justify-content-between align-items-start">
//                             <h6 className="mb-1 text-truncate">{chatId}</h6>
//                             <small className="text-muted">
//                               {new Date(lastMessage?.currentStatusTimestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                             </small>
//                           </div>
//                           <p className="mb-0 text-muted small text-truncate">
//                             {lastMessage?.messageBody}
//                           </p>
//                         </div>
//                         {unreadCount > 0 && (
//                           <div className="badge bg-success rounded-pill">
//                             {unreadCount}
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           </Col>

//           {/* Chat Area */}
//           <Col md="8" lg="9" className="h-100">
//             <div className="d-flex flex-column h-100">
//               {selectedChat ? (
//                 <>
//                   {/* Chat Header */}
//                   <div className="p-3 bg-white border-bottom">
//                     <div className="d-flex justify-content-between align-items-center">
//                       <div className="d-flex align-items-center gap-3">
//                         <div className="avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
//                              style={{ width: '40px', height: '40px' }}>
//                           {selectedChat.slice(0, 2).toUpperCase()}
//                         </div>
//                         <div>
//                           <h6 className="mb-0">{selectedChat}</h6>
//                           {isTyping && <small className="text-muted">typing...</small>}
//                         </div>
//                       </div>
//                       <div className="d-flex gap-2">
//                         <Button color="light" className="rounded-circle p-2">
//                           <Phone size={20} />
//                         </Button>
//                         <Button color="light" className="rounded-circle p-2">
//                           <Video size={20} />
//                         </Button>
//                         <Button color="light" className="rounded-circle p-2">
//                           <MoreVertical size={20} />
//                         </Button>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Messages Area */}
//                   <div className="chat-messages flex-grow-1 overflow-auto p-3" 
//                        style={{ backgroundColor: '#efeae2' }}>
//                     {messages
//                       .filter(msg => msg.from === selectedChat || msg.to === selectedChat)
//                       .map((message) => (
//                         <div
//                           key={message.messageId}
//                           className={`message-container mb-3 ${
//                             message.from === BUSINESS_PHONE ? 'outgoing' : 'incoming'
//                           }`}
//                         >
//                           <div className={`message-bubble ${
//                             message.from === BUSINESS_PHONE ? 'outgoing' : 'incoming'
//                           }`}>
//                             <div className="message-text">{message.messageBody}</div>
//                             <div className="message-meta">
//                               <small className="text-muted">
//                                 {new Date(message.currentStatusTimestamp * 1000).toLocaleTimeString([], { 
//                                   hour: '2-digit', 
//                                   minute: '2-digit' 
//                                 })}
//                               </small>
//                               {message.from === BUSINESS_PHONE && (
//                                 <span className="ms-1">
//                                   {message.readTimestamp ? 
//                                     <CheckCheck size={16} className="text-primary" /> : 
//                                     <Check size={16} className="text-muted" />
//                                   }
//                                 </span>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     <div ref={messagesEndRef} />
//                   </div>

//                   {/* Input Area */}
//                   <div className="p-3 bg-white border-top">
//                     <form onSubmit={sendMessage} className="d-flex gap-2">
//                       <Input
//                         type="text"
//                         className="rounded-pill border"
//                         value={newMessage}
//                         onChange={(e) => {
//                           setNewMessage(e.target.value);
//                           setIsTyping(true);
//                           if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
//                           typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 1000);
//                         }}
//                         placeholder="Type a message"
//                         disabled={loading}
//                       />
//                       <Button 
//                         color="success"
//                         className="rounded-circle"
//                         style={{ width: '40px', height: '40px', padding: 0 }}
//                         disabled={loading || !newMessage.trim()}>
//                         {loading ? <Spinner size="sm" /> : <Send size={18} />}
//                       </Button>
//                     </form>
//                   </div>
//                 </>
//               ) : (
//                 <div className="h-100 d-flex flex-column align-items-center justify-content-center text-muted">
//                   <div className="mb-3" style={{ fontSize: '48px' }}>💬</div>
//                   <h5>Select a chat to start messaging</h5>
//                 </div>
//               )}
//             </div>
//           </Col>
//         </Row>
//       </Container>

//       <style jsx>{`
//         .search-bar {
//           position: relative;
//         }
//         .search-bar input {
//           padding-left: 2.5rem;
//         }
//         .chat-item {
//           transition: background-color 0.2s;
//           border-bottom: 1px solid #f0f0f0;
//         }
//         .chat-item:hover {
//           background-color: #f5f6f6;
//           cursor: pointer;
//         }
//         .chat-item.active {
//           background-color: #f0f2f5;
//         }
//         .message-container {
//           display: flex;
//           max-width: 70%;
//         }
//         .message-container.outgoing {
//           margin-left: auto;
//         }
//         .message-bubble {
//           padding: 0.75rem 1rem;
//           border-radius: 0.75rem;
//           position: relative;
//         }
//         .message-bubble.incoming {
//           background-color: #ffffff;
//           border-top-left-radius: 0;
//         }
//         .message-bubble.outgoing {
//           background-color: #dcf8c6;
//           border-top-right-radius: 0;
//         }
//         .message-meta {
//           display: flex;
//           align-items: center;
//           justify-content: flex-end;
//           margin-top: 0.25rem;
//           font-size: 0.75rem;
//         }
//         .cursor-pointer {
//           cursor: pointer;
//         }
//       `}</style>
//     </div>
//   );
// }
























import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  Container,
  Row,
  Col,
  Card,
  Input,
  Button,
  InputGroup,
  Spinner,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import { Search, Send, Check, CheckCheck, Plus, Phone, Video, MoreVertical, ArrowLeft } from 'lucide-react';
import Header from 'components/Headers/Header';
import 'bootstrap/dist/css/bootstrap.min.css';

const countryCodes = [
  { code: '+92', country: 'Pakistan' },
  { code: '+91', country: 'India' },
  { code: '+1', country: 'USA' },
  { code: '+44', country: 'UK' },
  { code: '+86', country: 'China' },
  { code: '+971', country: 'UAE' },
];

export default function WhatsAppChat() {
  const [messages, setMessages] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [chats, setChats] = useState([]);
  const [error, setError] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState('+92');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [showNewChatDropdown, setShowNewChatDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const baseURL = 'https://codozap-e04e12b02929.herokuapp.com/api/v1/messages';
  const BUSINESS_PHONE = '923030307660';
  const token = localStorage.getItem('token');

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
    if (!newMessage.trim() || !selectedChat) return;

    try {
      setLoading(true);
      await axios.post(`${baseURL}/send`, {
        to: selectedChat,
        body: newMessage
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const newMsg = {
        messageId: Date.now().toString(),
        from: BUSINESS_PHONE,
        to: selectedChat,
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

  const handleNewChat = () => {
    if (newUserPhone.trim()) {
      const fullNumber = selectedCountryCode + newUserPhone.replace(/[^0-9]/g, '');
      setChats(prev => [[fullNumber, []], ...prev]);
      setSelectedChat(fullNumber);
      setNewUserPhone('');
      setShowNewChatDropdown(false);
    }
  };

  const handleBackClick = () => {
    setSelectedChat(null);
  };

  return (
    <div className="vh-100 bg-light">
      <Header />
      <Container fluid className="h-100 p-0">
        <Row className="h-100 g-0">
          <Col md="4" lg="3" className={`h-100 border-end bg-white ${isMobile && selectedChat ? 'd-none' : ''}`}>
            <div className="d-flex flex-column h-100">
              <div className="p-3 bg-white border-bottom">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="d-flex align-items-center">
                    <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center me-2"
                         style={{ width: '40px', height: '40px' }}>
                      WA
                    </div>
                    <h5 className="mb-0">WhatsApp</h5>
                  </div>
                  <Dropdown isOpen={showNewChatDropdown} toggle={() => setShowNewChatDropdown(!showNewChatDropdown)}>
                    <DropdownToggle color="light" className="border-0 rounded-circle">
                      <Plus size={20} />
                    </DropdownToggle>
                    <DropdownMenu end className="p-3 shadow" style={{ width: '300px' }}>
                      <h6 className="text-muted mb-3">New Chat</h6>
                      <div className="d-flex gap-2 mb-3">
                        <Dropdown isOpen={dropdownOpen} toggle={() => setDropdownOpen(!dropdownOpen)}>
                          <DropdownToggle caret color="light">
                            {selectedCountryCode}
                          </DropdownToggle>
                          <DropdownMenu>
                            {countryCodes.map(({ code, country }) => (
                              <DropdownItem key={code} onClick={() => setSelectedCountryCode(code)}>
                                {country} ({code})
                              </DropdownItem>
                            ))}
                          </DropdownMenu>
                        </Dropdown>
                        <Input
                          type="text"
                          placeholder="Phone number"
                          value={newUserPhone}
                          onChange={(e) => setNewUserPhone(e.target.value)}
                          className="flex-grow-1"
                        />
                      </div>
                      <Button color="success" block onClick={handleNewChat}>
                        Start Chat
                      </Button>
                    </DropdownMenu>
                  </Dropdown>
                </div>
                <InputGroup className="search-bar">
                  <Input
                    placeholder="Search or start new chat"
                    className="rounded-pill bg-light"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <div className="position-absolute top-50 translate-middle-y ps-3">
                    <Search size={18} className="text-muted" />
                  </div>
                </InputGroup>
              </div>

              <div className="chat-list flex-grow-1 overflow-auto">
                {chats.map(([chatId, chatMessages]) => {
                  if (chatId === BUSINESS_PHONE) return null;
                  const lastMessage = chatMessages[chatMessages.length - 1];
                  const unreadCount = chatMessages.filter(
                    msg => !msg.readTimestamp && msg.from !== BUSINESS_PHONE
                  ).length;

                  return (
                    <div
                      key={chatId}
                      className={`chat-item p-3 ${selectedChat === chatId ? 'active' : ''}`}
                      onClick={() => setSelectedChat(chatId)}
                    >
                      <div className="d-flex align-items-center gap-3">
                        <div className="avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                             style={{ width: '48px', height: '48px', flexShrink: 0 }}>
                          {chatId.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-grow-1 min-width-0">
                          <div className="d-flex justify-content-between align-items-start">
                            <h6 className="mb-1 text-truncate">{chatId}</h6>
                            <small className="text-muted">
                              {new Date(lastMessage?.currentStatusTimestamp * 1000).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </small>
                          </div>
                          <p className="mb-0 text-muted small text-truncate">
                            {lastMessage?.messageBody}
                          </p>
                        </div>
                        {unreadCount > 0 && (
                          <div className="badge bg-success rounded-pill">
                            {unreadCount}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Col>

          <Col md="8" lg="9" className={`h-100 ${isMobile && !selectedChat ? 'd-none' : ''}`}>
            <div className="d-flex flex-column h-100">
              {selectedChat ? (
                <>
                  <div className="p-3 bg-white border-bottom">
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center gap-3">
                        {isMobile && (
                          <Button color="light" className="rounded-circle p-2 me-2" onClick={handleBackClick}>
                            <ArrowLeft size={20} />
                          </Button>
                        )}
                        <div className="avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                             style={{ width: '40px', height: '40px' }}>
                          {selectedChat.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h6 className="mb-0">{selectedChat}</h6>
                          {isTyping && <small className="text-muted">typing...</small>}
                        </div>
                      </div>
                      <div className="d-none d-md-flex gap-2">
                        <Button color="light" className="rounded-circle p-2">
                          <Phone size={20} />
                        </Button>
                        <Button color="light" className="rounded-circle p-2">
                          <Video size={20} />
                        </Button>
                        <Button color="light" className="rounded-circle p-2">
                          <MoreVertical size={20} />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="chat-messages flex-grow-1 overflow-auto p-3">
                    {messages
                      .filter(msg => msg.from === selectedChat || msg.to === selectedChat)
                      .map((message) => (
                        <div
                          key={message.messageId}
                          className={`message-container mb-3 ${
                            message.from === BUSINESS_PHONE ? 'outgoing' : 'incoming'
                          }`}
                        >
                          <div className={`message-bubble ${
                            message.from === BUSINESS_PHONE ? 'outgoing' : 'incoming'
                          }`}>
                            <div className="message-text">{message.messageBody}</div>
                            <div className="message-meta">
                              <small className="text-muted">
                                {new Date(message.currentStatusTimestamp * 1000).toLocaleTimeString([], { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </small>
                              {message.from === BUSINESS_PHONE && (
                                <span className="ms-1">
                                  {message.readTimestamp ? 
                                    <CheckCheck size={16} className="text-primary" /> : 
                                    <Check size={16} className="text-muted" />
                                  }
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    <div ref={messagesEndRef} />
                  </div>

                  <div className="p-3 bg-white border-top">
                    <form onSubmit={sendMessage} className="d-flex gap-2">
                      <Input
                        type="text"
                        className="rounded-pill border"
                        value={newMessage}
                        onChange={(e) => {
                          setNewMessage(e.target.value);
                          setIsTyping(true);
                          if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
                          typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 1000);
                        }}
                        placeholder="Type a message"
                        disabled={loading}
                      />
                      <Button 
                        color="success"
                        className="rounded-circle d-flex align-items-center justify-content-center"
                        style={{ width: '40px', height: '40px', padding: 0 }}
                        disabled={loading || !newMessage.trim()}>
                        {loading ? <Spinner size="sm" /> : <Send size={18} />}
                      </Button>
                    </form>
                    </div>
                </>
              ) : (
                <div className="h-100 d-flex flex-column align-items-center justify-content-center text-muted">
                  <div className="mb-3" style={{ fontSize: '48px' }}>💬</div>
                  <h5>Select a chat to start messaging</h5>
                </div>
              )}
            </div>
          </Col>
        </Row>
      </Container>

      <style jsx>{`
        .search-bar {
          position: relative;
        }
        .search-bar input {
          padding-left: 2.5rem;
        }
        .chat-item {
          transition: background-color 0.2s;
          border-bottom: 1px solid #f0f0f0;
        }
        .chat-item:hover {
          background-color: #f5f6f6;
          cursor: pointer;
        }
        .chat-item.active {
          background-color: #f0f2f5;
        }
        .chat-messages {
          background-color: #efeae2;
          background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 50C50 50 50 50 50 50C50 50 50 50 50 50Z' fill='%23e5ddd5' fill-opacity='0.4'/%3E%3C/svg%3E");
        }
        .message-container {
          display: flex;
          max-width: 70%;
        }
        .message-container.outgoing {
          margin-left: auto;
        }
        .message-bubble {
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          position: relative;
          box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }
        .message-bubble.incoming {
          background-color: #ffffff;
          border-top-left-radius: 0;
        }
        .message-bubble.outgoing {
          background-color: #dcf8c6;
          border-top-right-radius: 0;
        }
        .message-meta {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          margin-top: 0.25rem;
          font-size: 0.75rem;
        }
        @media (max-width: 768px) {
          .chat-list {
  height: calc(100vh - 120px);
  background: #fff;
}

.chat-item {
  padding: 8px 15px;
  border-bottom: 1px solid #e9edef;
}

.chat-item:hover {
  background-color: #f0f2f5;
}

.chat-item.active {
  background-color: #f0f2f5;
}

.chat-messages {
  height: calc(100vh - 140px);
  background-color: #efeae2;
  padding: 20px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='600' viewBox='0 0 600 600'%3E%3Cpath fill='%23e5ddd5' fill-opacity='0.4' d='M600 325.1v-19.6c0-20.7-6.4-41.1-14.1-61.7C567 200.5 542.9 150 505.7 118.2c-58.6-49.7-59.8-50.3-70.5-31-1.3 2.3-2.7 4.7-4.1 7.1-1.4 2.6-3 5.3-4.5 8-11.2 19-24.2 40.5-39 56.4-14.7 15.8-34.2 27.5-51.5 36.9-15.6 8.4-29.1 15.7-40.9 22.3l-13.1 7.2c-10 5.5-19.5 10.8-28.4 16.1-8.8 5.3-17 10.5-24.4 15.8-.5.3-.9.7-1.4 1-23.1 18.2-37.6 29.6-44.3 40.2-7.4 11.4-13.2 24.9-13.2 55.3v15.7c0 17.3 3.7 37.6 11 54.8 15.2 35.8 49.6 59.3 88.8 59.3h386.7c45.6 0 82.8-37.2 82.8-82.8 0-30.3-15.5-55.4-34.7-69.8zM429.2 361.4c-16.9-14.5-60.1-52-80.8-70.9-20.7-18.9-38.3-35-47.7-44-9.4-9-22.9-21.8-36.6-35.5-10.6-10.6-19.7-19.7-27.8-27.9 27.7-28.4 72.1-76.2 144.5-76.2 40.3 0 77.9 15.7 106.3 44 29.3 29.3 45.4 68.3 45.4 109.9s-16.1 80.6-45.4 109.9c-14.4 14.4-31.2 25.4-49.7 32.9 0-.1-8.2-42.2-8.2-42.2zm-358.3 56.4c-2.4-5.7-3.7-12.3-3.7-19.2v-15.7c0-22.5 4.1-31.2 8.1-37.2 4-6 14.6-14.6 37.9-33 .7-.5 1.3-1 2-1.5 7-5 14.8-10 23.3-15.1 8.5-5.1 17.7-10.2 27.3-15.5l13.1-7.2c11.3-6.2 24.4-13.3 39.5-21.4 15.2-8.2 31.9-18.3 44.3-31.6 12.4-13.3 24.2-33 35.2-51.6 1.4-2.4 2.8-4.8 4.2-7.2.7-1.3 1.5-2.5 2.2-3.7 4.5 4.4 9.1 8.8 13.6 13.3 14.6 14.6 24.5 24.5 35.1 34.5 9.5 9.1 27.6 25.7 48.8 45 30 27.4 64.8 59.2 82.8 74.6l8 42.5c-71.3 1.4-137.6-26.1-186.6-75.1-50.8-50.8-78.8-118.3-78.8-190.2 0-10.8.7-21.5 2.1-32C162 115.3 103 162.8 66.9 195.9 47.8 213.2 35 231.9 26.7 247c-9.2 16.9-15.9 32.6-20.5 45.8-4.1 11.8-6.8 22-8.6 29.8v.2c-.3 1.5-1.8 7.1-3.2 13.2-.9 3.7-1.7 7.6-2.4 11.6 45.6-42.6 90.9-56.2 131.8-56.2 67 0 118.4 43.5 147.4 72.5 47.3 47.3 73.3 110.2 73.3 177.1s-26 129.8-73.3 177.1l-1.1 1.1c-12.4 12.2-39 35.3-83.3 35.3-26.1 0-50.1-10.2-67.5-28.8-32.6-34.8-28.8-87.7 7.6-142zM158.7 361.6l-.2.2c-26.1-26.1-40.5-60.9-40.5-97.9 0-37 14.4-71.7 40.5-97.9 18.9-18.9 41.8-31.6 66.9-37.3-3.2 13.5-4.8 27.6-4.8 42 0 65.6 25.6 127.2 71.9 173.6 41.8 41.8 96.4 66.7 155 70.1-35.3 18.9-75.3 27.2-116.2 23.9-68.8-5.5-128.6-42.5-172.6-76.7z'/%3E%3C/svg%3E");
  overflow-y: auto;
}

.message-container {
  display: flex;
  margin-bottom: 2px;
  max-width: 65%;
}

.message-container.outgoing {
  margin-left: auto;
}

.message-bubble {
  padding: 6px 7px 8px 9px;
  border-radius: 7.5px;
  position: relative;
  max-width: 100%;
  box-shadow: 0 1px 0.5px rgba(0,0,0,.13);
}

.message-bubble.incoming {
  background: #fff;
  border-top-left-radius: 0;
}

.message-bubble.outgoing {
  background: #d9fdd3;
  border-top-right-radius: 0;
}

.message-text {
  font-size: 14.2px;
  line-height: 19px;
  color: #111b21;
}

.message-meta {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 2px;
  gap: 2px;
  min-height: 15px;
}

.message-meta small {
  font-size: 11px;
  line-height: 15px;
  color: #667781;
}

.search-bar input {
  height: 35px;
  background: #f0f2f5;
  font-size: 15px;
}

.search-bar input::placeholder {
  color: #667781;
}

@media (max-width: 768px) {
  .message-container {
    max-width: 85%;
  }
  
  .chat-messages {
    height: calc(100vh - 130px);
  }
}
 `}</style>
    </div>
  );
}