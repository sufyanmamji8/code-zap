// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { 
//   Container, Row, Col, Card, CardHeader, CardBody, CardFooter,
//   Button, Form, FormGroup, Input, Label, InputGroup, InputGroupText,
//   Modal, ModalHeader, ModalBody, ModalFooter,
//   Spinner, Alert, Badge,
//   Nav, NavItem, NavLink, TabContent, TabPane
// } from 'reactstrap';
// import { WHATSAPP_API_ENDPOINT } from 'Api/Constant';

// const WhatsappWeb = () => {
//   // State variables
//   const [qrCode, setQrCode] = useState('');
//   const [selectedSession, setSelectedSession] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState('');
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [activeSessions, setActiveSessions] = useState([]);
//   const [showQRModal, setShowQRModal] = useState(false);
//   const [alertMessage, setAlertMessage] = useState({ text: '', color: 'info', visible: false });
//   const [activeTab, setActiveTab] = useState('sessions');
//   const [messages, setMessages] = useState([]);
//   const [messageLoading, setMessageLoading] = useState(false);
//   const [selectedContact, setSelectedContact] = useState(null);
//   const [contacts, setContacts] = useState([]);
//   const [refreshing, setRefreshing] = useState(false);

//   // Add these state variables
// const [scheduledMessages, setScheduledMessages] = useState([]);
// const [showScheduleModal, setShowScheduleModal] = useState(false);
// const [scheduleDate, setScheduleDate] = useState('');
// const [scheduleTime, setScheduleTime] = useState('');
// const [scheduleMessage, setScheduleMessage] = useState({
//   number: '',
//   message: '',
//   scheduledFor: null
// });

//   const token = localStorage.getItem('token');
//   const headers = {
//     'Content-Type': 'application/json',
//     'Authorization': `Bearer ${token}`
//   };

//   // Fetch active sessions on component mount
//   useEffect(() => {
//     fetchActiveSessions();
//     // Refresh every minute
//     const intervalId = setInterval(() => {
//       fetchActiveSessions(true);
//     }, 60000);
    
//     return () => clearInterval(intervalId);
//   }, []);

//   // Function to fetch message history
//   const fetchMessageHistory = async (sessionId, silent = false) => {
//     if (!sessionId) return;
    
//     try {
//       if (!silent) setMessageLoading(true);
      
//       const response = await axios.get(
//         `${WHATSAPP_API_ENDPOINT}/messages/${sessionId}`,
//         { headers }
//       );
  
//       if (response.data.success) {
//         setMessages(response.data.messages);
        
//         // Extract unique contacts from message history, filtering out undefined/null senders
//         const uniqueContacts = [...new Set(
//           response.data.messages.map(msg => msg.sender)
//         )].filter(contact => contact !== 'system' && contact != null); // Added null/undefined check
        
//         setContacts(uniqueContacts.map(contact => {
//           const numberPart = contact.split('@')[0] || ''; // Ensure a fallback if split result is undefined
//           return {
//             id: contact,
//             name: formatPhoneNumber(numberPart),
//             number: numberPart
//           };
//         }));
//       } else {
//         if (!silent) {
//           showAlert('No messages found for this session.', 'info');
//         }
//       }
//     } catch (error) {
//       console.error('Error fetching message history:', error);
//       if (!silent) {
//         showAlert('Error fetching messages. Please try again.', 'danger');
//       }
//     } finally {
//       if (!silent) setMessageLoading(false);
//     }
//   };

//   // Function to generate QR code
//   const generateQRCode = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.post(
//         `${WHATSAPP_API_ENDPOINT}/generate-qr`,
//         {},
//         { headers }
//       );

//       if (response.data.success) {
//         setQrCode(response.data.qrCode);
//         showAlert('QR code generated successfully! Scan with WhatsApp on your phone.', 'success');
        
//         // Check for new sessions every 5 seconds
//         const checkInterval = setInterval(() => {
//           fetchActiveSessions(true);
//         }, 5000);
        
//         setTimeout(() => {
//           clearInterval(checkInterval);
//           setShowQRModal(false);
//           setQrCode('');
//           showAlert('Please check if your WhatsApp session is connected.', 'info');
//         }, 30000); 
//       } else {
//         showAlert('Failed to generate QR code.', 'danger');
//       }
//     } catch (error) {
//       console.error('Error generating QR code:', error);
//       showAlert('Error generating QR code. Please try again.', 'danger');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Function to send message
//   const sendMessage = async () => {
//     if (!selectedSession) {
//       showAlert('Please select a WhatsApp session first!', 'warning');
//       return;
//     }
  
//     if (!phoneNumber || !message) {
//       showAlert('Please enter both phone number and message!', 'warning');
//       return;
//     }
  
//     try {
//       setLoading(true);
      
//       const sessionId = getSessionId(selectedSession);
      
//       if (!sessionId) {
//         showAlert('Session ID could not be found. Please try reconnecting.', 'warning');
//         setLoading(false);
//         return;
//       }
      
//       const response = await axios.post(
//         `${WHATSAPP_API_ENDPOINT}/send-message`,
//         {
//           sessionId: sessionId,
//           number: formatPhoneNumber(phoneNumber),
//           message
//         },
//         { headers }
//       );
  
//       if (response.data.success) {
//         showAlert('Message sent successfully!', 'success');
//         setMessage('');
//       } else {
//         showAlert(response.data.message || 'Failed to send message.', 'danger');
//       }
//     } catch (error) {
//       console.error('Error sending message:', error);
//       showAlert(`Error sending message: ${error.response?.data?.message || error.message}`, 'danger');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Function to disconnect session
//   const disconnectSession = async (sessionId) => {
//     try {
//       setLoading(true);
//       const response = await axios.post(
//         `${WHATSAPP_API_ENDPOINT}/disconnect`,
//         { sessionId },
//         { headers }
//       );

//       if (response.data.success) {
//         showAlert('WhatsApp session disconnected successfully!', 'success');
        
//         if (selectedSession && (selectedSession.sessionId === sessionId || selectedSession.id === sessionId)) {
//           setSelectedSession(null);
//         }
        
//         setActiveSessions(prev => prev.filter(session => 
//           (session.sessionId !== sessionId && session.id !== sessionId)
//         ));
//       } else {
//         showAlert(response.data.message || 'Failed to disconnect session.', 'danger');
//       }
//     } catch (error) {
//       console.error('Error disconnecting session:', error);
//       showAlert('Error disconnecting session. Please try again.', 'danger');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Function to fetch active sessions
//   const fetchActiveSessions = async (silent = false) => {
//     try {
//       if (!silent) setLoading(true);
//       if (silent) setRefreshing(true);
      
//       const response = await axios.get(
//         `${WHATSAPP_API_ENDPOINT}/active-sessions`,
//         { headers }
//       );

//       if (response.data.success) {
//         setActiveSessions(response.data.sessions);
        
//         // Auto-select first session if none selected
//         if (response.data.sessions.length > 0 && !selectedSession) {
//           setSelectedSession(response.data.sessions[0]);
//           setActiveTab('messaging');
//         }
        
//         // Clear selection if session no longer exists
//         if (selectedSession) {
//           const sessionStillExists = response.data.sessions.some(
//             session => getSessionId(session) === getSessionId(selectedSession)
//           );
          
//           if (!sessionStillExists) {
//             setSelectedSession(null);
//           }
//         }
//       } else if (!silent) {
//         showAlert(response.data.message || 'No active sessions found.', 'info');
//       }
//     } catch (error) {
//       console.error('Error fetching active sessions:', error);
//       if (!silent) {
//         showAlert('Error fetching active sessions. Please try again.', 'danger');
//       }
//     } finally {
//       if (!silent) setLoading(false);
//       if (silent) setRefreshing(false);
//     }
//   };

//   // Function to toggle schedule modal
//   const toggleScheduleModal = () => {
//     setShowScheduleModal(!showScheduleModal);
//     if (!showScheduleModal) {
//       setScheduleDate('');
//       setScheduleTime('');
//       setScheduleMessage({
//         number: phoneNumber,
//         message: message,
//         scheduledFor: null
//       });
//     }
//   };
  
//   // Function to schedule a message
//   const scheduleNewMessage = async () => {
//     if (!selectedSession || !scheduleMessage.number || !scheduleMessage.message || !scheduleDate || !scheduleTime) {
//       showAlert('Please fill all fields to schedule a message', 'warning');
//       return;
//     }
  
//     try {
//       setLoading(true);
      
//       const scheduledFor = new Date(`${scheduleDate}T${scheduleTime}`);
      
//       if (scheduledFor <= new Date()) {
//         showAlert('Please select a future date and time', 'warning');
//         setLoading(false);
//         return;
//       }
      
//       const sessionId = getSessionId(selectedSession);
      
//       const response = await axios.post(
//         `${WHATSAPP_API_ENDPOINT}/schedule-message`,
//         {
//           sessionId,
//           number: formatPhoneNumber(scheduleMessage.number),
//           message: scheduleMessage.message,
//           scheduleTime: scheduledFor.toISOString()
//         },
//         { headers }
//       );
  
//       if (response.data.success) {
//         showAlert('Message scheduled successfully!', 'success');
//         setMessage('');
//         setPhoneNumber('');
//         toggleScheduleModal();
//         fetchScheduledMessages();
//       } else {
//         showAlert(response.data.message || 'Failed to schedule message.', 'danger');
//       }
//     } catch (error) {
//       console.error('Error scheduling message:', error);
//       showAlert(`Error scheduling message: ${error.response?.data?.message || error.message}`, 'danger');
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   // Function to fetch scheduled messages
//   const fetchScheduledMessages = async () => {
//     if (!selectedSession) return;
    
//     try {
//       setLoading(true);
//       const sessionId = getSessionId(selectedSession);
      
//       const response = await axios.get(
//         `${WHATSAPP_API_ENDPOINT}/scheduled-messages/${sessionId}`,
//         { headers }
//       );
  
//       if (response.data.success) {
//         setScheduledMessages(response.data.scheduledMessages || []);
//       } else {
//         showAlert('No scheduled messages found.', 'info');
//         setScheduledMessages([]);
//       }
//     } catch (error) {
//       console.error('Error fetching scheduled messages:', error);
//       showAlert('Error fetching scheduled messages. Please try again.', 'danger');
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   // Function to cancel a scheduled message
//   const cancelScheduledMessage = async (taskId) => {
//     try {
//       setLoading(true);
//       const sessionId = getSessionId(selectedSession);
      
//       const response = await axios.post(
//         `${WHATSAPP_API_ENDPOINT}/cancel-scheduled-message`,
//         {
//           sessionId,
//           taskId
//         },
//         { headers }
//       );
  
//       if (response.data.success) {
//         showAlert('Scheduled message canceled successfully!', 'success');
//         fetchScheduledMessages();
//       } else {
//         showAlert(response.data.message || 'Failed to cancel scheduled message.', 'danger');
//       }
//     } catch (error) {
//       console.error('Error canceling scheduled message:', error);
//       showAlert('Error canceling scheduled message. Please try again.', 'danger');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Function to show alert
//   const showAlert = (text, color) => {
//     setAlertMessage({ text, color, visible: true });
//     setTimeout(() => {
//       setAlertMessage(prev => ({ ...prev, visible: false }));
//     }, 5000);
//   };

//   // Function to toggle QR modal
//   const toggleQRModal = () => {
//     setShowQRModal(!showQRModal);
//     if (!showQRModal) {
//       setQrCode('');
//     }
//   };

//   // Function to format phone number
//   const formatPhoneNumber = (number) => {
//     let formatted = number.replace(/\D/g, '');
//     if (!formatted.startsWith('92') && !formatted.startsWith('+92')) {
//       formatted = `92${formatted}`;
//     }
//     return formatted;
//   };

//   // Function to handle Enter key press
//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       sendMessage();
//     }
//   };

//   // Function to select a session
//   const handleSessionSelect = (session) => {
//     setSelectedSession(session);
//     setActiveTab('messaging');
    
//     // Fetch message history
//     fetchMessageHistory(getSessionId(session));
    
//     // Fetch scheduled messages
//     fetchScheduledMessages();
    
//     // Set up message refresh interval
//     const messageIntervalId = setInterval(() => {
//       fetchMessageHistory(getSessionId(session), true);
//     }, 10000);
    
//     // Clear previous interval
//     if (window.messageRefreshInterval) {
//       clearInterval(window.messageRefreshInterval);
//     }
    
//     window.messageRefreshInterval = messageIntervalId;
//   };

//   // Function to handle contact selection
//   const handleContactSelect = (contact) => {
//     setSelectedContact(contact);
//     setPhoneNumber(contact.number);
//   };

//   // Function to get session ID
//   const getSessionId = (session) => {
//     if (!session) return '';
    
//     if (session.sessionId) return session.sessionId;
//     if (session.id) return session.id;
//     if (session._id) return session._id;
    
//     if (typeof session === 'string') return session;
    
//     return '';
//   };
  
//   // Function to get display ID (truncated)
//   const getDisplayId = (session) => {
//     const id = getSessionId(session);
//     return id.length > 6 ? `${id.substring(0, 6)}...` : id;
//   };

//   // Function to get session name
//   const getSessionName = (session) => {
//     if (session.phoneNumber) return session.phoneNumber;
//     if (session.name) return session.name;
//     return `Session ${getDisplayId(session)}`;
//   };

//   // Function to calculate time since connection
//   const getTimeSince = (timestamp) => {
//     const date = new Date(timestamp || Date.now());
//     const now = new Date();
//     const diffMs = now - date;
//     const diffMins = Math.floor(diffMs / 60000);
//     const diffHrs = Math.floor(diffMins / 60);
//     const diffDays = Math.floor(diffHrs / 24);
    
//     if (diffDays > 0) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
//     if (diffHrs > 0) return `${diffHrs} hour${diffHrs !== 1 ? 's' : ''} ago`;
//     if (diffMins > 0) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
//     return 'Just now';
//   };

//   return (
//     <Container fluid className="py-4 px-md-4" style={{ minHeight: '100vh' }}>
//       {/* Top Header */}
//       <div className="mb-4 d-flex justify-content-between align-items-center bg-white p-3 rounded shadow-sm">
//         <h3 className="mb-0">
//           <i className="fab fa-whatsapp text-success me-2"></i>
//           WhatsApp Integration
//         </h3>
        
//         <div>
//           <Button 
//             color="light" 
//             className="me-2"
//             onClick={() => fetchActiveSessions()}
//             disabled={loading || refreshing}
//           >
//             <i className={`fas fa-sync-alt me-2 ${refreshing ? 'fa-spin' : ''}`}></i>
//             Refresh
//           </Button>
          
//           <Button 
//             color="success"
//             onClick={toggleQRModal}
//           >
//             <i className="fas fa-plus me-2"></i>
//             Connect New
//           </Button>
//         </div>
//       </div>

//       {/* Simple Navigation Tabs */}
//       <Nav tabs className="mb-3 bg-white rounded-top shadow-sm">
//         <NavItem>
//           <NavLink
//             className={`cursor-pointer ${activeTab === 'sessions' ? 'active bg-light' : ''}`}
//             onClick={() => setActiveTab('sessions')}
//           >
//             <i className="fas fa-mobile-alt me-2"></i>
//             My WhatsApp Accounts
//           </NavLink>
//         </NavItem>
        
//         <NavItem>
//           <NavLink
//             className={`cursor-pointer ${activeTab === 'messaging' ? 'active bg-light' : ''} ${!selectedSession ? 'disabled' : ''}`}
//             onClick={() => selectedSession && setActiveTab('messaging')}
//           >
//             <i className="fas fa-paper-plane me-2"></i>
//             Send Messages
//           </NavLink>
//         </NavItem>
        
//         <NavItem>
//           <NavLink
//             className={`cursor-pointer ${activeTab === 'history' ? 'active bg-light' : ''} ${!selectedSession ? 'disabled' : ''}`}
//             onClick={() => selectedSession && setActiveTab('history')}
//           >
//             <i className="fas fa-history me-2"></i>
//             Message History
//           </NavLink>
//         </NavItem>
//       </Nav>

//       {/* Tab Contents */}
//       <TabContent activeTab={activeTab} className="bg-white p-3 rounded-bottom shadow-sm mb-4">
//         {/* SESSIONS TAB */}
//         <TabPane tabId="sessions">
//           <h4 className="mb-4">Your Connected WhatsApp Accounts</h4>
          
//           {loading && <div className="text-center p-4"><Spinner color="primary" /></div>}
          
//           {!loading && activeSessions.length === 0 && (
//             <div className="text-center p-5">
//               <div className="mb-4">
//                 <i className="fas fa-mobile-alt text-muted" style={{ fontSize: '3rem' }}></i>
//               </div>
//               <h5>No WhatsApp Accounts Connected</h5>
//               <p className="text-muted mb-4">Connect your WhatsApp to start sending messages</p>
//               <Button 
//                 color="success"
//                 onClick={toggleQRModal}
//               >
//                 <i className="fas fa-plus me-2"></i> Connect WhatsApp
//               </Button>
//             </div>
//           )}
          
//           {!loading && activeSessions.length > 0 && (
//             <Row>
//               {activeSessions.map((session, index) => (
//                 <Col key={index} sm={12} md={6} lg={4} className="mb-4">
//                 <Card 
//                   className={`shadow-sm h-100 ${
//                     selectedSession && getSessionId(selectedSession) === getSessionId(session)
//                       ? 'border-success' : ''
//                   }`}
//                   onClick={() => handleSessionSelect(session)}
//                   style={{ cursor: 'pointer' }}
//                 >
//                   <CardHeader className="bg-success text-white">
//                     <h5 className="mb-0">
//                       <i className="fas fa-user me-2"></i>
//                       {getSessionName(session)}
//                     </h5>
//                   </CardHeader>
                  
//                   <CardBody>
//                     <p>
//                       <strong>Status:</strong> 
//                       <Badge color="success" className="ms-2">Active</Badge>
//                     </p>
//                     <p>
//                       <strong>Connected:</strong> {getTimeSince(session.createdAt)}
//                     </p>
//                     <p className="mb-0">
//                       <strong>ID:</strong> {getDisplayId(session)}
//                     </p>
//                   </CardBody>
                  
//                   <CardFooter className="d-flex justify-content-between">
//                     <Button 
//                       color="primary" 
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         handleSessionSelect(session);
//                       }}
//                     >
//                       Use This
//                     </Button>
                    
//                     <Button 
//                       color="danger" 
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         disconnectSession(getSessionId(session));
//                       }}
//                     >
//                       Disconnect
//                     </Button>
//                   </CardFooter>
//                 </Card>
//               </Col>
//             ))}
//           </Row>
//         )}
//       </TabPane>

//       {/* SCHEDULE TAB */}
// <TabPane tabId="schedule">
//   <h4 className="mb-4">
//     <i className="fas fa-calendar-alt me-2 text-primary"></i>
//     Scheduled Messages
//   </h4>
  
//   {!selectedSession && (
//     <div className="text-center p-5">
//       <div className="mb-4">
//         <i className="fas fa-exclamation-circle text-warning" style={{ fontSize: '3rem' }}></i>
//       </div>
//       <h5>No WhatsApp Account Selected</h5>
//       <p className="text-muted mb-4">Please select a WhatsApp account first</p>
//       <Button color="primary" onClick={() => setActiveTab('sessions')}>
//         Select WhatsApp Account
//       </Button>
//     </div>
//   )}
  
//   {selectedSession && (
//     <div>
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <Button 
//           color="primary" 
//           onClick={() => {
//             setScheduleMessage({
//               number: '',
//               message: '',
//               scheduledFor: null
//             });
//             toggleScheduleModal();
//           }}
//         >
//           <i className="fas fa-plus me-2"></i>
//           Schedule New Message
//         </Button>
        
//         <Button 
//           color="light" 
//           onClick={fetchScheduledMessages}
//           disabled={loading}
//         >
//           <i className={`fas fa-sync-alt me-1 ${loading ? 'fa-spin' : ''}`}></i>
//           Refresh
//         </Button>
//       </div>
      
//       {loading && <div className="text-center p-4"><Spinner color="primary" /></div>}
      
//       {!loading && scheduledMessages.length === 0 && (
//         <div className="text-center p-5 bg-light rounded">
//           <div className="mb-4">
//             <i className="fas fa-calendar-plus text-muted" style={{ fontSize: '3rem' }}></i>
//           </div>
//           <h5>No Scheduled Messages</h5>
//           <p className="text-muted mb-4">Schedule messages to be sent automatically</p>
//           <Button 
//             color="success"
//             onClick={toggleScheduleModal}
//           >
//             <i className="fas fa-calendar-plus me-2"></i>
//             Schedule Your First Message
//           </Button>
//         </div>
//       )}
      
//       {!loading && scheduledMessages.length > 0 && (
//         <div className="table-responsive">
//           <table className="table table-hover border">
//             <thead className="table-light">
//               <tr>
//                 <th>Recipient</th>
//                 <th>Message</th>
//                 <th>Scheduled For</th>
//                 <th>Status</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {scheduledMessages.map((msg, index) => {
//                 const scheduledDate = new Date(msg.scheduledFor);
//                 const isPast = scheduledDate < new Date();
                
//                 return (
//                   <tr key={index}>
//                     <td>
//                       <div className="d-flex align-items-center">
//                         <i className="fas fa-user-circle text-primary me-2"></i>
//                         {formatPhoneNumber(msg.number || '')}
//                       </div>
//                     </td>
//                     <td>
//                       <div style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
//                         {msg.message}
//                       </div>
//                     </td>
//                     <td>
//                       <div>
//                         <div>{scheduledDate.toLocaleDateString()}</div>
//                         <small className="text-muted">{scheduledDate.toLocaleTimeString()}</small>
//                       </div>
//                     </td>
//                     <td>
//                       <Badge color={isPast ? 'secondary' : 'warning'}>
//                         {isPast ? 'Processed' : 'Pending'}
//                       </Badge>
//                     </td>
//                     <td>
//                       <Button 
//                         color="danger" 
//                         size="sm"
//                         disabled={isPast}
//                         onClick={() => cancelScheduledMessage(msg.id)}
//                       >
//                         <i className="fas fa-times"></i> Cancel
//                       </Button>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   )}
// </TabPane>



// {/* Schedule Message Modal */}
// <Modal isOpen={showScheduleModal} toggle={toggleScheduleModal} size="lg">
//   <ModalHeader toggle={toggleScheduleModal} className="bg-primary text-white">
//     <i className="fas fa-calendar-alt me-2"></i>
//     Schedule a Message
//   </ModalHeader>
  
//   <ModalBody>
//     <Form>
//       <Row>
//         <Col md={6}>
//           <FormGroup>
//             <Label for="scheduleNumber"><strong>Recipient Number</strong></Label>
//             <InputGroup>
//               <InputGroupText>
//                 <i className="fas fa-phone"></i>
//               </InputGroupText>
//               <Input
//                 type="text"
//                 id="scheduleNumber"
//                 placeholder="Enter phone number (e.g., 3001234567)"
//                 value={scheduleMessage.number}
//                 onChange={(e) => setScheduleMessage({
//                   ...scheduleMessage,
//                   number: e.target.value.replace(/\D/g, '')
//                 })}
//               />
//             </InputGroup>
//             <small className="text-muted">Country code (92) will be added automatically</small>
//           </FormGroup>
//         </Col>
        
//         <Col md={6}>
//           <Row>
//             <Col md={6}>
//               <FormGroup>
//                 <Label for="scheduleDate"><strong>Date</strong></Label>
//                 <Input
//                   type="date"
//                   id="scheduleDate"
//                   value={scheduleDate}
//                   onChange={(e) => setScheduleDate(e.target.value)}
//                   min={new Date().toISOString().split('T')[0]}
//                 />
//               </FormGroup>
//             </Col>
            
//             <Col md={6}>
//               <FormGroup>
//                 <Label for="scheduleTime"><strong>Time</strong></Label>
//                 <Input
//                   type="time"
//                   id="scheduleTime"
//                   value={scheduleTime}
//                   onChange={(e) => setScheduleTime(e.target.value)}

                  
//                 />
//               </FormGroup>
//             </Col>
//           </Row>
//         </Col>
//       </Row>
      
//       <FormGroup>
//         <Label for="scheduleMessageText"><strong>Message</strong></Label>
//         <Input
//           type="textarea"
//           id="scheduleMessageText"
//           rows="5"
//           placeholder="Type your message here..."
//           value={scheduleMessage.message}
//           onChange={(e) => setScheduleMessage({
//             ...scheduleMessage,
//             message: e.target.value
//           })}
//         />
//       </FormGroup>
      
//       {scheduleDate && scheduleTime && (
//         <div className="alert alert-info">
//           <i className="fas fa-info-circle me-2"></i>
//           Your message will be sent on <strong>{new Date(`${scheduleDate}T${scheduleTime}`).toLocaleString()}</strong>
//         </div>
//       )}
//     </Form>
//   </ModalBody>
  
//   <ModalFooter>
//     <Button color="secondary" onClick={toggleScheduleModal}>
//       Cancel
//     </Button>
//     <Button 
//       color="primary" 
//       onClick={scheduleNewMessage}
//       disabled={!scheduleMessage.number || !scheduleMessage.message || !scheduleDate || !scheduleTime || loading}
//     >
//       {loading ? (
//         <span><Spinner size="sm" className="me-2" /> Scheduling...</span>
//       ) : (
//         <span><i className="fas fa-calendar-check me-2"></i> Schedule Message</span>
//       )}
//     </Button>
//   </ModalFooter>
// </Modal>
      
//       {/* MESSAGING TAB */}
//       {/* MESSAGING TAB */}
// <TabPane tabId="messaging">
//   <div className="d-flex justify-content-between align-items-center mb-4">
//     <h4 className="mb-0">
//       <i className="fas fa-paper-plane text-success me-2"></i>
//       Send WhatsApp Messages
//     </h4>
//   </div>
  
//   {!selectedSession && (
//     <div className="text-center p-5 bg-light rounded shadow-sm">
//       <div className="mb-4">
//         <i className="fas fa-exclamation-circle text-warning" style={{ fontSize: '3rem' }}></i>
//       </div>
//       <h5>No WhatsApp Account Selected</h5>
//       <p className="text-muted mb-4">Please select a WhatsApp account first</p>
//       <Button color="success" onClick={() => setActiveTab('sessions')}>
//         <i className="fas fa-mobile-alt me-2"></i>
//         Select WhatsApp Account
//       </Button>
//     </div>
//   )}
  
//   {selectedSession && (
//     <Row>
//       <Col md={4} lg={3} className="mb-4">
//         <Card className="shadow-sm h-100 border-success">
//           <CardHeader className="bg-success text-white">
//             <h5 className="mb-0">
//               <i className="fas fa-check-circle me-2"></i>
//               Active Account
//             </h5>
//           </CardHeader>
          
//           <CardBody>
//             <div className="text-center mb-4">
//               <div className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
//                 <i className="fas fa-user-circle text-success" style={{ fontSize: '3rem' }}></i>
//               </div>
//               <h5>{getSessionName(selectedSession)}</h5>
//               <Badge color="success" pill>Connected</Badge>
//             </div>
            
//             <div className="border-top pt-3">
//               <p>
//                 <i className="fas fa-clock text-muted me-2"></i>
//                 <strong>Connected:</strong> <span className="float-end">{getTimeSince(selectedSession.createdAt)}</span>
//               </p>
//               <p className="mb-0">
//                 <i className="fas fa-fingerprint text-muted me-2"></i>
//                 <strong>ID:</strong> <span className="float-end">{getDisplayId(selectedSession)}</span>
//               </p>
//             </div>
//           </CardBody>
          
//           <CardFooter className="bg-light">
//             <Button 
//               color="danger" 
//               block
//               onClick={() => disconnectSession(getSessionId(selectedSession))}
//             >
//               <i className="fas fa-power-off me-2"></i>
//               Disconnect
//             </Button>
//           </CardFooter>
//         </Card>
//       </Col>
      
//       <Col md={8} lg={9}>
//         <Card className="shadow-sm">
//           <CardHeader className="bg-success text-white">
//             <h5 className="mb-0">
//               <i className="fas fa-comment-dots me-2"></i>
//               New Message
//             </h5>
//           </CardHeader>
          
//           <CardBody>
//             <Row>
//               <Col md={6}>
//                 <FormGroup>
//                   <Label for="phoneNumber" className="fw-bold">Recipient</Label>
//                   <InputGroup>
//                     <InputGroupText>
//                       <i className="fas fa-phone"></i>
//                     </InputGroupText>
//                     <Input
//                       type="text"
//                       id="phoneNumber"
//                       placeholder="Enter phone number (e.g., 3001234567)"
//                       value={phoneNumber}
//                       onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
//                       className="form-control-lg"
//                     />
//                   </InputGroup>
//                   <small className="text-muted">Country code (92) will be added automatically</small>
//                 </FormGroup>
//               </Col>
              
//               <Col md={6}>
//                 <FormGroup className="h-100">
//                   <Label className="fw-bold">Options</Label>
//                   <div className="d-flex flex-wrap gap-2 pt-2">
//                     <Button
//                       color="outline-primary"
//                       size="sm"
//                       onClick={toggleScheduleModal}
//                     >
//                       <i className="fas fa-calendar-alt me-1"></i>
//                       Schedule
//                     </Button>
//                   </div>
//                 </FormGroup>
//               </Col>
//             </Row>
            
//             <FormGroup>
//               <Label for="message" className="fw-bold">Message</Label>
//               <Input
//                 type="textarea"
//                 id="message"
//                 rows="6"
//                 placeholder="Type your message here..."
//                 value={message}
//                 onChange={(e) => setMessage(e.target.value)}
//                 onKeyPress={handleKeyPress}
//                 className="form-control-lg"
//               />
//               <div className="d-flex justify-content-between mt-1">
//                 <small className="text-muted">Press Shift+Enter for new line, Enter to send</small>
//                 <small className="text-muted">{message.length} characters</small>
//               </div>
//             </FormGroup>
//           </CardBody>
          
//           <CardFooter className="d-flex justify-content-between bg-light">
//             <Button 
//               color="success"
//               size="lg"
//               onClick={sendMessage}
//               disabled={!phoneNumber || !message || loading}
//             >
//               {loading ? (
//                 <span><Spinner size="sm" className="me-2" /> Sending...</span>
//               ) : (
//                 <span><i className="fas fa-paper-plane me-2"></i> Send Message</span>
//               )}
//             </Button>
//           </CardFooter>
//         </Card>
//       </Col>
//     </Row>
//   )}
// </TabPane>
//       {/* HISTORY TAB */}
//       <TabPane tabId="history">
//         <h4 className="mb-4">Message History</h4>
        
//         {!selectedSession && (
//           <div className="text-center p-5">
//             <div className="mb-4">
//               <i className="fas fa-exclamation-circle text-warning" style={{ fontSize: '3rem' }}></i>
//             </div>
//             <h5>No WhatsApp Account Selected</h5>
//             <p className="text-muted mb-4">Please select a WhatsApp account first</p>
//             <Button color="primary" onClick={() => setActiveTab('sessions')}>
//               Select WhatsApp Account
//             </Button>
//           </div>
//         )}
        
//         {selectedSession && messageLoading && (
//           <div className="text-center p-4"><Spinner color="primary" /></div>
//         )}
        
//         {selectedSession && !messageLoading && (
//           <Row>
//             <Col md={4} className="mb-4 mb-md-0">
//               <Card className="shadow-sm">
//                 <CardHeader className="bg-primary text-white">
//                   <h5 className="mb-0">
//                     <i className="fas fa-users me-2"></i>
//                     Contacts
//                   </h5>
//                 </CardHeader>
                
//                 <CardBody className="p-0" style={{ maxHeight: '500px', overflowY: 'auto' }}>
//                   {contacts.length === 0 && (
//                     <div className="text-center p-4">
//                       <i className="fas fa-address-book text-muted mb-3" style={{ fontSize: '2rem' }}></i>
//                       <p className="mb-0">No contacts found</p>
//                     </div>
//                   )}
                  
//                   {contacts.length > 0 && (
//                     <div className="list-group list-group-flush">
//                       {contacts.map((contact, index) => (
//                         <div 
//                           key={index} 
//                           className={`list-group-item list-group-item-action ${
//                             selectedContact && selectedContact.id === contact.id ? 'active' : ''
//                           }`}
//                           onClick={() => handleContactSelect(contact)}
//                           style={{ cursor: 'pointer' }}
//                         >
//                           <div className="d-flex align-items-center">
//                             <div className="me-3">
//                               <i className="fas fa-user-circle" style={{ fontSize: '2rem' }}></i>
//                             </div>
//                             <div>
//                               <h6 className="mb-0">{contact.name}</h6>
//                               <small>{contact.number}</small>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </CardBody>
//               </Card>
//             </Col>
            
//             <Col md={8}>
//               <Card className="shadow-sm">
//                 <CardHeader className="bg-primary text-white d-flex justify-content-between align-items-center">
//                   <h5 className="mb-0">
//                     <i className="fas fa-comments me-2"></i>
//                     Chat History
//                   </h5>
                  
//                   <Button 
//                     color="light" 
//                     size="sm" 
//                     onClick={() => fetchMessageHistory(getSessionId(selectedSession))}
//                   >
//                     <i className="fas fa-sync-alt"></i>
//                   </Button>
//                 </CardHeader>
                
//                 <CardBody>
//                   <div style={{ height: '400px', overflowY: 'auto' }}>
//                     {messages.length === 0 && (
//                       <div className="text-center p-5">
//                         <i className="fas fa-comment-slash text-muted mb-3" style={{ fontSize: '3rem' }}></i>
//                         <h5>No messages found</h5>
//                         <p className="text-muted">Select a contact or start a new conversation</p>
//                       </div>
//                     )}
                    
//                     {messages.length > 0 && (
//                       <div>
//                         {messages.map((msg, index) => {
//                           const isIncoming = msg.sender !== "system" && 
//                                            msg.sender.includes("@s.whatsapp.net");
//                           const isOutgoing = msg.sender === "system";
                          
//                           return (
//                             <div 
//                               key={index} 
//                               className={`d-flex mb-3 ${isIncoming ? 'justify-content-start' : 'justify-content-end'}`}
//                             >
//                               <div 
//                                 className={`p-3 rounded ${
//                                   isIncoming ? 'bg-light' : 'bg-success text-white'
//                                 }`}
//                                 style={{ maxWidth: '80%' }}
//                               >
//                                 {!isOutgoing && isIncoming && (
//                                   <div className="mb-1">
//                                     <small className="fw-bold">
//                                       {formatPhoneNumber(msg.sender.split('@')[0])}
//                                     </small>
//                                   </div>
//                                 )}
//                                 <div>{msg.message}</div>
//                                 <div className="text-end mt-1">
//                                   <small className="text-muted">
//                                     {new Date(msg.timestamp).toLocaleTimeString()}
//                                   </small>
//                                 </div>
//                               </div>
//                             </div>
//                           );
//                         })}
//                       </div>
//                     )}
//                   </div>
//                 </CardBody>
                
//                 {selectedContact && (
//                   <CardFooter>
//                     <InputGroup>
//                       <Input
//                         type="text"
//                         placeholder="Type a message..."
//                         value={message}
//                         onChange={(e) => setMessage(e.target.value)}
//                         onKeyPress={handleKeyPress}
//                       />
//                       <Button 
//                         color="success"
//                         onClick={sendMessage}
//                         disabled={!message || loading}
//                       >
//                         <i className="fas fa-paper-plane"></i>
//                       </Button>
//                     </InputGroup>
//                   </CardFooter>
//                 )}
//               </Card>
//             </Col>
//           </Row>
//         )}
//       </TabPane>
//     </TabContent>
    
//     {/* QR Code Modal */}
//     <Modal isOpen={showQRModal} toggle={toggleQRModal}>
//       <ModalHeader toggle={toggleQRModal} className="bg-success text-white">
//         Connect WhatsApp
//       </ModalHeader>
      
//       <ModalBody className="text-center p-4">
//         {qrCode ? (
//           <div>
//             <div className="border p-3 mb-3 d-inline-block">
//               <img 
//                 src={qrCode} 
//                 alt="WhatsApp QR Code" 
//                 style={{ width: '250px', height: '250px' }} 
//               />
//             </div>
//             <div className="alert alert-info mt-3">
//               <h6>How to connect:</h6>
//               <ol className="mb-0 text-start">
//                 <li>Open WhatsApp on your phone</li>
//                 <li>Go to Settings Linked Devices</li>
//                 <li>Tap on "Link a Device"</li>
//                 <li>Scan this QR code</li>
//               </ol>
//             </div>
//           </div>
//         ) : (
//           <div>
//             <i className="fab fa-whatsapp text-success mb-3" style={{ fontSize: '4rem' }}></i>
//             <h5>Connect WhatsApp</h5>
//             <p className="text-muted">
//               Click the button below to generate a QR code and connect your WhatsApp
//             </p>
//           </div>
//         )}
//       </ModalBody>
      
//       <ModalFooter>
//         {!qrCode ? (
//           <Button 
//             color="success" 
//             block
//             onClick={generateQRCode}
//             disabled={loading}
//           >
//             {loading ? (
//               <span><Spinner size="sm" className="me-2" /> Generating...</span>
//             ) : (
//               <span><i className="fas fa-qrcode me-2"></i> Generate QR Code</span>
//             )}
//           </Button>
//         ) : (
//           <Button color="secondary" onClick={toggleQRModal}>
//             Close
//           </Button>
//         )}
//       </ModalFooter>
//     </Modal>

//     {/* Alert Notification */}
//     <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1050, minWidth: '300px' }}>
//       <Alert 
//         color={alertMessage.color} 
//         isOpen={alertMessage.visible} 
//         toggle={() => setAlertMessage(prev => ({ ...prev, visible: false }))}
//       >
//         {alertMessage.text}
//       </Alert>
//     </div>
//   </Container>
// );
// };

// export default WhatsappWeb;



import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  CardBody, 
  Progress, 
  Button,
  Input
} from 'reactstrap';

const WhatsappWeb = () => {
  const [progress, setProgress] = useState(35);
  const [days, setDays] = useState(30);
  const [hours, setHours] = useState(7);
  const [minutes, setMinutes] = useState(23);
  const [seconds, setSeconds] = useState(45);
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  
  // Simulate progress increasing
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) return 35;
        return prev + 0.5;
      });
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      } else {
        if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          if (hours > 0) {
            setHours(hours - 1);
            setMinutes(59);
            setSeconds(59);
          } else {
            if (days > 0) {
              setDays(days - 1);
              setHours(23);
              setMinutes(59);
              setSeconds(59);
            }
          }
        }
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [days, hours, minutes, seconds]);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  // Function to format number with leading zero
  const formatNumber = (num) => {
    return num < 10 ? `0${num}` : num;
  };

  // Inline CSS styles
  const styles = `
    .whatsapp-coming-soon {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    /* Background shapes animation */
    .bg-shapes {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      z-index: 1;
    }

    .shape {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      animation: float 6s ease-in-out infinite;
    }

    .shape-1 {
      width: 200px;
      height: 200px;
      top: 10%;
      left: 10%;
      animation-delay: 0s;
    }

    .shape-2 {
      width: 150px;
      height: 150px;
      top: 60%;
      right: 10%;
      animation-delay: 2s;
    }

    .shape-3 {
      width: 100px;
      height: 100px;
      bottom: 20%;
      left: 20%;
      animation-delay: 4s;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(180deg); }
    }

    /* Card styles */
    .whatsapp-card {
      margin-top: 2rem;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      z-index: 2;
    }

    .whatsapp-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3) !important;
    }

    /* Left panel styles */
    .whatsapp-left-panel {
      position: relative;
    }

    .bg-pattern {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: 
        radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
      z-index: 1;
    }

    .whatsapp-left-panel .content-wrapper {
      position: relative;
      z-index: 2;
    }

    .logo-wrapper {
      position: relative;
    }

    .whatsapp-logo {
      width: 50px;
      height: 50px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      padding: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.3);
    }

    .brand-title {
      font-size: 1.8rem;
      background: linear-gradient(135deg, #fff, #e3f2fd);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    /* Progress bar styles */
    .custom-progress {
      height: 10px !important;
      border-radius: 10px !important;
      background: rgba(255, 255, 255, 0.2) !important;
      overflow: hidden;
    }

    .custom-progress .progress-bar {
      background: linear-gradient(90deg, #4FC3F7, #29B6F6) !important;
      border-radius: 10px;
      transition: width 0.5s ease;
    }

    .progress-percentage {
      font-weight: 700;
      font-size: 0.9rem;
      color: #4FC3F7;
    }

    /* Tech badges */
    .tech-badges {
      display: flex;
      gap: 5px;
    }

    .tech-badge {
      background: rgba(255, 255, 255, 0.2);
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 0.7rem;
      border: 1px solid rgba(255, 255, 255, 0.3);
    }

    /* Right panel styles */
    .whatsapp-right-panel {
      background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
    }

    .coming-soon-badge {
 background: linear-gradient(135deg, #667eea, #73de27ff);      color: white;
      padding: 8px 20px;
      border-radius: 20px;
      font-weight: 600;
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
    }

    .main-heading {
      color: #2c3e50;
      font-size: 2.2rem;
      line-height: 1.2;
    }

    /* Countdown styles */
    .countdown-section {
      text-align: center;
    }

    .countdown-label {
      color: #6c757d;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-size: 0.9rem;
    }

    .countdown-timer {
      display: flex;
      justify-content: center;
      gap: 15px;
      flex-wrap: wrap;
    }

    .countdown-item {
      text-align: center;
      min-width: 80px;
    }

    .countdown-value {
      background: linear-gradient(135deg, #667eea, #73de27ff);
      color: white;
      padding: 15px 10px;
      border-radius: 15px;
      font-size: 1.8rem;
      font-weight: 700;
      margin-bottom: 8px;
      transition: transform 0.3s ease;
    }

    .countdown-item:hover .countdown-value {
      transform: scale(1.05);
    }

    .countdown-label-small {
      color: #6c757d;
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    /* Notification form styles */
    .notification-form .input-group {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .email-input {
      flex: 1;
      min-width: 250px;
      border-radius: 25px !important;
      padding: 12px 20px;
      border: 2px solid #e9ecef;
      transition: all 0.3s ease;
    }

    .email-input:focus {
      border-color: #667eea;
      box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
    }

    .notify-btn {
 background: linear-gradient(135deg, #667eea, #73de27ff);      border: none !important;
      border-radius: 25px !important;
      padding: 12px 30px !important;
      font-weight: 600;
      transition: all 0.3s ease !important;
      white-space: nowrap;
    }

    .notify-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4) !important;
    }

    /* Features section */
    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 15px;
    }

    .feature-card {
      display: flex;
      align-items: flex-start;
      gap: 15px;
      padding: 20px;
      background: white;
      border-radius: 15px;
      border: 1px solid #e9ecef;
      transition: all 0.3s ease;
      cursor: pointer;
    }

    .feature-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      border-color: #667eea;
    }

    .feature-icon {
      font-size: 2rem;
      flex-shrink: 0;
    }

    .feature-content {
      flex: 1;
    }

    .feature-title {
      color: #2c3e50;
      font-weight: 600;
      margin-bottom: 5px;
      font-size: 0.95rem;
    }

    .feature-desc {
      color: #6c757d;
      font-size: 0.85rem;
      line-height: 1.4;
      margin: 0;
    }

    /* Alert styles */
    .alert {
      border-radius: 15px !important;
      border: none !important;
      box-shadow: 0 5px 20px rgba(40, 167, 69, 0.2) !important;
    }

    /* Responsive design */
    @media (max-width: 991px) {
      .whatsapp-left-panel {
        border-radius: 25px 25px 0 0 !important;
        padding: 40px 30px !important;
      }
      
      .whatsapp-right-panel {
        padding: 40px 30px !important;
      }
      
      .countdown-timer {
        gap: 10px;
      }
      
      .countdown-item {
        min-width: 70px;
      }
      
      .countdown-value {
        font-size: 1.5rem;
        padding: 12px 8px;
      }
    }

    @media (max-width: 768px) {
      .whatsapp-card {
        margin-top: 1rem;
      }
      
      .main-heading {
        font-size: 1.8rem;
      }
      
      .features-grid {
        grid-template-columns: 1fr;
      }
      
      .notification-form .input-group {
        flex-direction: column;
      }
      
      .email-input {
        min-width: 100%;
        margin-bottom: 10px;
      }
      
      .notify-btn {
        width: 100%;
      }
    }

    @media (max-width: 576px) {
      .countdown-timer {
        gap: 8px;
      }
      
      .countdown-item {
        min-width: 60px;
      }
      
      .countdown-value {
        font-size: 1.3rem;
        padding: 10px 6px;
      }
      
      .brand-title {
        font-size: 1.5rem;
      }
    }
  `;

  return (
    <div className="whatsapp-coming-soon">
      <style>{styles}</style>
      <Container fluid className="p-0">
        <Row className="g-0" style={{ 
          minHeight: '100vh', 
          background: 'white',
          overflow: 'hidden',
          position: 'relative'
        }}>
          {/* Animated background elements */}
          <div className="bg-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>
          
          <Col xs="12" className="d-flex align-items-center justify-content-center py-5">
            <Card className="shadow-lg border-0 whatsapp-card" style={{ 
              maxWidth: '95%',
              width: '1100px',
              borderRadius: '25px',
              marginTop: '70px',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              overflow: 'hidden',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <CardBody className="p-0">
                <Row className="g-0">
                  {/* Left column */}
                  <Col lg="5" className="d-flex flex-column justify-content-between whatsapp-left-panel" style={{
 background: 'linear-gradient(135deg, #667eea, #73de27ff)',                    
                    color: 'white',
                    padding: '50px 40px',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    {/* Background pattern */}
                    <div className="bg-pattern"></div>
                    
                    <div className="content-wrapper">
                      <div className="d-flex align-items-center mb-4">
                        <div className="logo-wrapper me-3">
                      
                        </div>
                        <div>
                          <h3 className="mb-0 fw-bold brand-title">WhatsApp Web</h3>
                          <small className="opacity-80">Next Generation</small>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="mb-3 fw-semibold">We're building something amazing</h4>
                        <p className="mb-0 opacity-90" style={{ lineHeight: '1.6' }}>
                          Our team is working hard to bring you the next generation of WhatsApp Web 
                          with exciting new features and enhanced user experience.
                        </p>
                      </div>
                      
                      <div className="progress-section">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <h6 className="mb-0 fw-semibold">Development Progress</h6>
                          <span className="progress-percentage">{Math.round(progress)}%</span>
                        </div>
                        <Progress 
                          value={progress} 
                          className="custom-progress" 
                        />
                        <div className="d-flex justify-content-between mt-1">
                          <small className="opacity-80">Working on it</small>
                          <small className="opacity-80">Almost there!</small>
                        </div>
                      </div>
                    </div>
                    
                   
                  </Col>
                  
                  {/* Right column */}
                  <Col lg="7" className="whatsapp-right-panel" style={{ padding: '50px 40px' }}>
                    {isSubscribed && (
                      <div className="alert alert-success alert-dismissible fade show" role="alert">
                        <strong>Success!</strong> You'll be notified when we launch.
                        <button type="button" className="btn-close" onClick={() => setIsSubscribed(false)}></button>
                      </div>
                    )}
                    
                    <div className="text-end mb-4">
                      <span className="coming-soon-badge">Coming Soon</span>
                    </div>
                    
                    <div className="mb-5">
                      <h2 className="fw-bold mb-3 main-heading">Get ready for a new experience</h2>
                      <p className="text-muted mb-4">
                        The future of messaging is here. Faster, smarter, and more connected than ever before.
                      </p>
                      
                      <div className="countdown-section">
                        <h6 className="countdown-label mb-3">Launching in:</h6>
                        <div className="countdown-timer">
                          {[
                            { value: days, label: 'Days' },
                            { value: hours, label: 'Hours' },
                            { value: minutes, label: 'Minutes' },
                            { value: seconds, label: 'Seconds' }
                          ].map((item, index) => (
                            <div key={index} className="countdown-item">
                              <div className="countdown-value">
                                {formatNumber(item.value)}
                              </div>
                              <div className="countdown-label-small">
                                {item.label}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="notification-section mb-5">
                      <h6 className="mb-3 fw-semibold">Get notified when we launch</h6>
                      <form onSubmit={handleSubscribe} className="notification-form">
                        <div className="input-group">
                          <Input 
                            type="email" 
                            placeholder="Enter your email address" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="email-input"
                          />
                          <Button 
                            type="submit"
                            className="notify-btn"
                          >
                            Notify Me
                          </Button>
                        </div>
                        <small className="text-muted mt-2 d-block">
                          We'll send you one email when we're ready. No spam, unsubscribe anytime.
                        </small>
                      </form>
                    </div>
                    
                    <div className="features-section">
                      <h6 className="mb-3 fw-semibold">Exciting New Features</h6>
                      <div className="features-grid">
                        {[
                          { icon: '📱', title: 'Multi-Device Support', desc: 'Use WhatsApp on multiple devices simultaneously' },
                          { icon: '🔒', title: 'End-to-End Encryption', desc: 'Your messages are always secure and private' },
                          { icon: '📞', title: 'HD Video Calls', desc: 'Crystal clear video calls with anyone, anywhere' },
                          { icon: '🌙', title: 'Dark Mode', desc: 'Easy on the eyes, day and night' },
                          { icon: '📎', title: 'File Sharing', desc: 'Share files up to 2GB instantly' },
                          { icon: '🔍', title: 'Smart Search', desc: 'Find messages and media in seconds' }
                        ].map((feature, idx) => (
                          <div key={idx} className="feature-card">
                            <div className="feature-icon">{feature.icon}</div>
                            <div className="feature-content">
                              <h6 className="feature-title">{feature.title}</h6>
                              <p className="feature-desc">{feature.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default WhatsappWeb;