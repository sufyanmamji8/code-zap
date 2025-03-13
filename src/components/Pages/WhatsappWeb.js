// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { 
//   Container, Row, Col, Card, CardHeader, CardBody, CardFooter,
//   Button, Form, FormGroup, Input, Label,
//   Modal, ModalHeader, ModalBody, ModalFooter,
//   Spinner, Alert, Badge, UncontrolledTooltip
// } from 'reactstrap';
// import { WHATSAPP_API_ENDPOINT } from 'Api/Constant';

// const WhatsappWeb = () => {
//   const [qrCode, setQrCode] = useState('');
//   const [selectedSession, setSelectedSession] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState('');
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [activeSessions, setActiveSessions] = useState([]);
//   const [showQRModal, setShowQRModal] = useState(false);
//   const [alertMessage, setAlertMessage] = useState({ text: '', color: 'info', visible: false });

//   const token = localStorage.getItem('token');

//   const headers = {
//     'Content-Type': 'application/json',
//     'Authorization': `Bearer ${token}`
//   };

//   useEffect(() => {
//     fetchActiveSessions();
//   }, []);

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
        
//         setTimeout(() => {
//           fetchActiveSessions();
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
      
//       console.log("Using sessionId:", sessionId);
      
//       if (!sessionId) {
//         showAlert('Session ID could not be found. Please try reconnecting.', 'warning');
//         setLoading(false);
//         return;
//       }
      
//       const response = await axios.post(
//         `${WHATSAPP_API_ENDPOINT}/send-message`,
//         {
//           sessionId: sessionId,
//           number: phoneNumber,
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
//       console.error('Error details:', error.response?.data || error.message);
//       showAlert(`Error sending message: ${error.response?.data?.message || error.message}`, 'danger');
//     } finally {
//       setLoading(false);
//     }
//   };

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

//   const fetchActiveSessions = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(
//         `${WHATSAPP_API_ENDPOINT}/active-sessions`,
//         { headers }
//       );

//       if (response.data.success) {
//         setActiveSessions(response.data.sessions);
        
//         if (response.data.sessions.length > 0 && !selectedSession) {
//           setSelectedSession(response.data.sessions[0]);
//         }
//       } else {
//         showAlert(response.data.message || 'No active sessions found.', 'info');
//       }
//     } catch (error) {
//       console.error('Error fetching active sessions:', error);
//       showAlert('Error fetching active sessions. Please try again.', 'danger');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const showAlert = (text, color) => {
//     setAlertMessage({ text, color, visible: true });
//     setTimeout(() => {
//       setAlertMessage(prev => ({ ...prev, visible: false }));
//     }, 6000);
//   };

  
//   const toggleQRModal = () => {
//     setShowQRModal(!showQRModal);
//     if (!showQRModal) {
//       setQrCode('');
//     }
//   };

//   // Function to handle Enter key press in message input
//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       sendMessage();
//     }
//   };

//   // Function to select a session
//   const handleSessionSelect = (session) => {
//     console.log("Selected session full object:", session);
//     console.log("Object keys:", Object.keys(session));
//     setSelectedSession(session);
//   };

//   const getSessionId = (session) => {
//     if (!session) return '';
    
//     // For debugging
//     console.log("Session object structure:", JSON.stringify(session, null, 2));
    
//     // Check all possible ID properties
//     if (session.sessionId) return session.sessionId;
//     if (session.id) return session.id;
//     if (session._id) return session._id;
    
//     // Last resort: if session itself is a string, it might be the ID
//     if (typeof session === 'string') return session;
    
//     console.error("Cannot determine session ID from:", session);
//     return '';
//   };
  
//   // Helper function to safely display a truncated ID
//   const getDisplayId = (session) => {
//     const id = getSessionId(session);
//     return id.length > 6 ? id.substring(0, 6) : id;
//   };

//   // Helper function to get session name/identifier
//   const getSessionName = (session) => {
//     if (session.phoneNumber) return session.phoneNumber;
//     if (session.name) return session.name;
//     return `Session ${getDisplayId(session)}`;
//   };

//   return (
//     <Container fluid className="py-4 px-md-4 " style={{ minHeight: '100vh' }}>
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <h2 className="mb-0">
//           <i className="fab fa-whatsapp text-success me-2"></i>
//           WhatsApp Web Integration
//         </h2>
//         <Button 
//           color="success" 
//           className="px-4 py-2"
//           onClick={toggleQRModal}
//         >
//           <i className="fas fa-plus me-2"></i> Connect New WhatsApp
//         </Button>
//       </div>

//       {/* Session Selection Row */}
//       <Row className="mb-4">
//         <Col>
//           <h4 className="mb-3">Active Sessions</h4>
//           <Row>
//             {activeSessions.length > 0 ? (
//               activeSessions.map((session, index) => (
//                 <Col key={index} md={6} lg={4} className="mb-4">
//                   <Card 
//                     className={`shadow-sm border-0 h-100 ${
//                       selectedSession && 
//                       (selectedSession.sessionId === getSessionId(session) || 
//                        selectedSession.id === getSessionId(session)) 
//                         ? 'border-primary border-2' : ''
//                     }`}
//                     onClick={() => handleSessionSelect(session)}
//                     style={{ cursor: 'pointer' }}
//                   >
//                     <CardHeader className=" text-white">
//                       <div className="d-flex justify-content-between align-items-center">
//                         <h5 className="mb-0">
//                           <i className="fas fa-mobile-alt me-2"></i>
//                           {getSessionName(session)}
//                         </h5>
//                         <Badge color="success" pill>Active</Badge>
//                       </div>
//                     </CardHeader>
//                     <CardBody>
//                       <p>
//                         <i className="far fa-clock text-muted me-2"></i>
//                         Connected: {new Date(session.createdAt || Date.now()).toLocaleString()}
//                       </p>
//                       {getSessionId(session) && (
//                         <p>
//                           <i className="fas fa-fingerprint text-muted me-2"></i>
//                           ID: {getDisplayId(session)}...
//                         </p>
//                       )}
//                     </CardBody>
//                     <CardFooter className="">
//                       <div className="d-flex justify-content-between">
//                         <Button 
//                           color="primary" 
//                           size="sm"
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             handleSessionSelect(session);
//                           }}
//                         >
//                           <i className="fas fa-comment me-1"></i> Use
//                         </Button>
//                         <Button 
//                           color="danger" 
//                           size="sm"
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             disconnectSession(getSessionId(session));
//                           }}
//                         >
//                           <i className="fas fa-unlink me-1"></i> Disconnect
//                         </Button>
//                       </div>
//                     </CardFooter>
//                   </Card>
//                 </Col>
//               ))
//             ) : (
//               <Col>
//                 <Card className="shadow-sm border-0 text-center p-5">
//                   <div className="py-5">
//                     <i className="fas fa-mobile-alt text-muted mb-4" style={{ fontSize: '4rem' }}></i>
//                     <h4 className="text-muted">No Active WhatsApp Sessions</h4>
//                     <p>Click "Connect New WhatsApp" to add a new session</p>
//                     <Button 
//                       color="success" 
//                       className="mt-3"
//                       onClick={toggleQRModal}
//                     >
//                       <i className="fas fa-plus me-2"></i> Connect New WhatsApp
//                     </Button>
//                   </div>
//                 </Card>
//               </Col>
//             )}
//           </Row>
//         </Col>
//       </Row>

//       {/* Send Message Section - Only shown when a session is selected */}
//       {selectedSession && (
//         <Row>
//           <Col>
//             <Card className="shadow-sm border-0">
//               <CardHeader className=" text-white">
//                 <div className="d-flex justify-content-between align-items-center">
//                   <h5 className="mb-0">
//                     <i className="fas fa-paper-plane me-2"></i>
//                     Send Message with {getSessionName(selectedSession)}
//                   </h5>
//                   <Badge color="success" pill className="px-3 py-2">Connected</Badge>
//                 </div>
//               </CardHeader>
              
//               <CardBody>
//                 <Form>
//                   <FormGroup>
//                     <Label for="phoneNumber">Phone Number</Label>
//                     <Input
//                       type="text"
//                       id="phoneNumber"
//                       placeholder="Enter complete phone number with country code (e.g., 923001234567)"
//                       value={phoneNumber}
//                       onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
//                       disabled={loading}
//                       className="form-control-lg"
//                     />
//                   </FormGroup>
                  
//                   <FormGroup>
//                     <Label for="message">Message</Label>
//                     <Input
//                       type="textarea"
//                       id="message"
//                       rows="6"
//                       placeholder="Type your message here..."
//                       value={message}
//                       onChange={(e) => setMessage(e.target.value)}
//                       onKeyPress={handleKeyPress}
//                       disabled={loading}
//                       className="form-control-lg"
//                     />
//                     <small className="text-muted">
//                       Press Shift+Enter for new line, Enter to send
//                     </small>
//                   </FormGroup>
                  
//                   <div className="text-end mt-3">
//                     <Badge color="light" className="me-2 text-muted">
//                       <i className="fas fa-keyboard me-1"></i> {message.length} characters
//                     </Badge>
//                   </div>
//                 </Form>
//               </CardBody>
              
//               <CardFooter className=" p-3">
//                 <Button 
//                   color="success" 
//                   size="lg"
//                   block
//                   onClick={sendMessage}
//                   disabled={!phoneNumber || !message || loading}
//                   className="py-2"
//                 >
//                   {loading ? (
//                     <span><Spinner size="sm" className="me-2" /> Sending...</span>
//                   ) : (
//                     <span><i className="fas fa-paper-plane me-2"></i> Send Message</span>
//                   )}
//                 </Button>
//               </CardFooter>
//             </Card>
//           </Col>
//         </Row>
//       )}

//       {/* QR Code Modal */}
//       <Modal isOpen={showQRModal} toggle={toggleQRModal} size="md">
//         <ModalHeader toggle={toggleQRModal} className=" text-white">
//           <i className="fas fa-qrcode me-2"></i>
//           Connect New WhatsApp Session
//         </ModalHeader>
//         <ModalBody className="text-center p-4">
//           {qrCode ? (
//             <div>
//               <div className="border p-2 mb-3 bg-white d-inline-block">
//                 <img 
//                   src={qrCode} 
//                   alt="WhatsApp QR Code" 
//                   style={{ width: '250px', height: '250px' }} 
//                 />
//               </div>
//               <div className="alert alert-info p-2">
//                 <i className="fas fa-info-circle me-2"></i>
//                 Scan this QR code with WhatsApp on your phone
//               </div>
//             </div>
//           ) : (
//             <div className="py-4">
//               <i className="fas fa-mobile-alt text-muted mb-3" style={{ fontSize: '5rem' }}></i>
//               <h5 className="text-muted mt-3">Connect your WhatsApp account</h5>
//               <p className="text-muted">
//                 Click "Generate QR Code" to connect WhatsApp from your mobile device
//               </p>
//             </div>
//           )}
//         </ModalBody>
//         <ModalFooter>
//           {!qrCode ? (
//             <Button 
//               color="success" 
//               className="px-4"
//               onClick={generateQRCode}
//               disabled={loading}
//             >
//               {loading ? (
//                 <span><Spinner size="sm" className="me-2" /> Processing...</span>
//               ) : (
//                 <span><i className="fas fa-qrcode me-2"></i> Generate QR Code</span>
//               )}
//             </Button>
//           ) : (
//             <Button 
//               color="secondary" 
//               className="px-4"
//               onClick={toggleQRModal}
//             >
//               <i className="fas fa-times me-2"></i> Close
//             </Button>
//           )}
//         </ModalFooter>
//       </Modal>

//       {/* Alert */}
//       <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1050, minWidth: '300px' }}>
//         <Alert 
//           color={alertMessage.color} 
//           isOpen={alertMessage.visible} 
//           toggle={() => setAlertMessage(prev => ({ ...prev, visible: false }))}
//           className="shadow-lg"
//         >
//           <div className="d-flex align-items-center">
//             {alertMessage.color === 'success' && <i className="fas fa-check-circle me-2 fs-5"></i>}
//             {alertMessage.color === 'danger' && <i className="fas fa-exclamation-circle me-2 fs-5"></i>}
//             {alertMessage.color === 'warning' && <i className="fas fa-exclamation-triangle me-2 fs-5"></i>}
//             {alertMessage.color === 'info' && <i className="fas fa-info-circle me-2 fs-5"></i>}
//             {alertMessage.text}
//           </div>
//         </Alert>
//       </div>
//     </Container>
//   );
// };

// export default WhatsappWeb;






















import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Container, Row, Col, Card, CardHeader, CardBody, CardFooter,
  Button, Form, FormGroup, Input, Label, InputGroup, InputGroupText,
  Modal, ModalHeader, ModalBody, ModalFooter,
  Spinner, Alert, Badge,
  Nav, NavItem, NavLink, TabContent, TabPane
} from 'reactstrap';
import { WHATSAPP_API_ENDPOINT } from 'Api/Constant';

const WhatsappWeb = () => {
  // State variables
  const [qrCode, setQrCode] = useState('');
  const [selectedSession, setSelectedSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [activeSessions, setActiveSessions] = useState([]);
  const [showQRModal, setShowQRModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState({ text: '', color: 'info', visible: false });
  const [activeTab, setActiveTab] = useState('sessions');
  const [messages, setMessages] = useState([]);
  const [messageLoading, setMessageLoading] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  // Fetch active sessions on component mount
  useEffect(() => {
    fetchActiveSessions();
    // Refresh every minute
    const intervalId = setInterval(() => {
      fetchActiveSessions(true);
    }, 60000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Function to fetch message history
  const fetchMessageHistory = async (sessionId, silent = false) => {
    if (!sessionId) return;
    
    try {
      if (!silent) setMessageLoading(true);
      
      const response = await axios.get(
        `${WHATSAPP_API_ENDPOINT}/messages/${sessionId}`,
        { headers }
      );

      if (response.data.success) {
        setMessages(response.data.messages);
        
        // Extract unique contacts from message history
        const uniqueContacts = [...new Set(
          response.data.messages.map(msg => msg.sender)
        )].filter(contact => contact !== 'system');
        
        setContacts(uniqueContacts.map(contact => ({
          id: contact,
          name: formatPhoneNumber(contact.split('@')[0]),
          number: contact.split('@')[0]
        })));
      } else {
        if (!silent) {
          showAlert('No messages found for this session.', 'info');
        }
      }
    } catch (error) {
      console.error('Error fetching message history:', error);
      if (!silent) {
        showAlert('Error fetching messages. Please try again.', 'danger');
      }
    } finally {
      if (!silent) setMessageLoading(false);
    }
  };

  // Function to generate QR code
  const generateQRCode = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${WHATSAPP_API_ENDPOINT}/generate-qr`,
        {},
        { headers }
      );

      if (response.data.success) {
        setQrCode(response.data.qrCode);
        showAlert('QR code generated successfully! Scan with WhatsApp on your phone.', 'success');
        
        // Check for new sessions every 5 seconds
        const checkInterval = setInterval(() => {
          fetchActiveSessions(true);
        }, 5000);
        
        setTimeout(() => {
          clearInterval(checkInterval);
          setShowQRModal(false);
          setQrCode('');
          showAlert('Please check if your WhatsApp session is connected.', 'info');
        }, 30000); 
      } else {
        showAlert('Failed to generate QR code.', 'danger');
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
      showAlert('Error generating QR code. Please try again.', 'danger');
    } finally {
      setLoading(false);
    }
  };

  // Function to send message
  const sendMessage = async () => {
    if (!selectedSession) {
      showAlert('Please select a WhatsApp session first!', 'warning');
      return;
    }
  
    if (!phoneNumber || !message) {
      showAlert('Please enter both phone number and message!', 'warning');
      return;
    }
  
    try {
      setLoading(true);
      
      const sessionId = getSessionId(selectedSession);
      
      if (!sessionId) {
        showAlert('Session ID could not be found. Please try reconnecting.', 'warning');
        setLoading(false);
        return;
      }
      
      const response = await axios.post(
        `${WHATSAPP_API_ENDPOINT}/send-message`,
        {
          sessionId: sessionId,
          number: formatPhoneNumber(phoneNumber),
          message
        },
        { headers }
      );
  
      if (response.data.success) {
        showAlert('Message sent successfully!', 'success');
        setMessage('');
      } else {
        showAlert(response.data.message || 'Failed to send message.', 'danger');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      showAlert(`Error sending message: ${error.response?.data?.message || error.message}`, 'danger');
    } finally {
      setLoading(false);
    }
  };

  // Function to disconnect session
  const disconnectSession = async (sessionId) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${WHATSAPP_API_ENDPOINT}/disconnect`,
        { sessionId },
        { headers }
      );

      if (response.data.success) {
        showAlert('WhatsApp session disconnected successfully!', 'success');
        
        if (selectedSession && (selectedSession.sessionId === sessionId || selectedSession.id === sessionId)) {
          setSelectedSession(null);
        }
        
        setActiveSessions(prev => prev.filter(session => 
          (session.sessionId !== sessionId && session.id !== sessionId)
        ));
      } else {
        showAlert(response.data.message || 'Failed to disconnect session.', 'danger');
      }
    } catch (error) {
      console.error('Error disconnecting session:', error);
      showAlert('Error disconnecting session. Please try again.', 'danger');
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch active sessions
  const fetchActiveSessions = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      if (silent) setRefreshing(true);
      
      const response = await axios.get(
        `${WHATSAPP_API_ENDPOINT}/active-sessions`,
        { headers }
      );

      if (response.data.success) {
        setActiveSessions(response.data.sessions);
        
        // Auto-select first session if none selected
        if (response.data.sessions.length > 0 && !selectedSession) {
          setSelectedSession(response.data.sessions[0]);
          setActiveTab('messaging');
        }
        
        // Clear selection if session no longer exists
        if (selectedSession) {
          const sessionStillExists = response.data.sessions.some(
            session => getSessionId(session) === getSessionId(selectedSession)
          );
          
          if (!sessionStillExists) {
            setSelectedSession(null);
          }
        }
      } else if (!silent) {
        showAlert(response.data.message || 'No active sessions found.', 'info');
      }
    } catch (error) {
      console.error('Error fetching active sessions:', error);
      if (!silent) {
        showAlert('Error fetching active sessions. Please try again.', 'danger');
      }
    } finally {
      if (!silent) setLoading(false);
      if (silent) setRefreshing(false);
    }
  };

  // Function to show alert
  const showAlert = (text, color) => {
    setAlertMessage({ text, color, visible: true });
    setTimeout(() => {
      setAlertMessage(prev => ({ ...prev, visible: false }));
    }, 5000);
  };

  // Function to toggle QR modal
  const toggleQRModal = () => {
    setShowQRModal(!showQRModal);
    if (!showQRModal) {
      setQrCode('');
    }
  };

  // Function to format phone number
  const formatPhoneNumber = (number) => {
    let formatted = number.replace(/\D/g, '');
    if (!formatted.startsWith('92') && !formatted.startsWith('+92')) {
      formatted = `92${formatted}`;
    }
    return formatted;
  };

  // Function to handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Function to select a session
  const handleSessionSelect = (session) => {
    setSelectedSession(session);
    setActiveTab('messaging');
    
    // Fetch message history
    fetchMessageHistory(getSessionId(session));
    
    // Set up message refresh interval
    const messageIntervalId = setInterval(() => {
      fetchMessageHistory(getSessionId(session), true);
    }, 10000);
    
    // Clear previous interval
    if (window.messageRefreshInterval) {
      clearInterval(window.messageRefreshInterval);
    }
    
    window.messageRefreshInterval = messageIntervalId;
  };

  // Function to handle contact selection
  const handleContactSelect = (contact) => {
    setSelectedContact(contact);
    setPhoneNumber(contact.number);
  };

  // Function to get session ID
  const getSessionId = (session) => {
    if (!session) return '';
    
    if (session.sessionId) return session.sessionId;
    if (session.id) return session.id;
    if (session._id) return session._id;
    
    if (typeof session === 'string') return session;
    
    return '';
  };
  
  // Function to get display ID (truncated)
  const getDisplayId = (session) => {
    const id = getSessionId(session);
    return id.length > 6 ? `${id.substring(0, 6)}...` : id;
  };

  // Function to get session name
  const getSessionName = (session) => {
    if (session.phoneNumber) return session.phoneNumber;
    if (session.name) return session.name;
    return `Session ${getDisplayId(session)}`;
  };

  // Function to calculate time since connection
  const getTimeSince = (timestamp) => {
    const date = new Date(timestamp || Date.now());
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHrs = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHrs / 24);
    
    if (diffDays > 0) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    if (diffHrs > 0) return `${diffHrs} hour${diffHrs !== 1 ? 's' : ''} ago`;
    if (diffMins > 0) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  return (
    <Container fluid className="py-4 px-md-4" style={{ minHeight: '100vh' }}>
      {/* Top Header */}
      <div className="mb-4 d-flex justify-content-between align-items-center bg-white p-3 rounded shadow-sm">
        <h3 className="mb-0">
          <i className="fab fa-whatsapp text-success me-2"></i>
          WhatsApp Integration
        </h3>
        
        <div>
          <Button 
            color="light" 
            className="me-2"
            onClick={() => fetchActiveSessions()}
            disabled={loading || refreshing}
          >
            <i className={`fas fa-sync-alt me-2 ${refreshing ? 'fa-spin' : ''}`}></i>
            Refresh
          </Button>
          
          <Button 
            color="success"
            onClick={toggleQRModal}
          >
            <i className="fas fa-plus me-2"></i>
            Connect New
          </Button>
        </div>
      </div>

      {/* Simple Navigation Tabs */}
      <Nav tabs className="mb-3 bg-white rounded-top shadow-sm">
        <NavItem>
          <NavLink
            className={`cursor-pointer ${activeTab === 'sessions' ? 'active bg-light' : ''}`}
            onClick={() => setActiveTab('sessions')}
          >
            <i className="fas fa-mobile-alt me-2"></i>
            My WhatsApp Accounts
          </NavLink>
        </NavItem>
        
        <NavItem>
          <NavLink
            className={`cursor-pointer ${activeTab === 'messaging' ? 'active bg-light' : ''} ${!selectedSession ? 'disabled' : ''}`}
            onClick={() => selectedSession && setActiveTab('messaging')}
          >
            <i className="fas fa-paper-plane me-2"></i>
            Send Messages
          </NavLink>
        </NavItem>
        
        <NavItem>
          <NavLink
            className={`cursor-pointer ${activeTab === 'history' ? 'active bg-light' : ''} ${!selectedSession ? 'disabled' : ''}`}
            onClick={() => selectedSession && setActiveTab('history')}
          >
            <i className="fas fa-history me-2"></i>
            Message History
          </NavLink>
        </NavItem>
      </Nav>

      {/* Tab Contents */}
      <TabContent activeTab={activeTab} className="bg-white p-3 rounded-bottom shadow-sm mb-4">
        {/* SESSIONS TAB */}
        <TabPane tabId="sessions">
          <h4 className="mb-4">Your Connected WhatsApp Accounts</h4>
          
          {loading && <div className="text-center p-4"><Spinner color="primary" /></div>}
          
          {!loading && activeSessions.length === 0 && (
            <div className="text-center p-5">
              <div className="mb-4">
                <i className="fas fa-mobile-alt text-muted" style={{ fontSize: '3rem' }}></i>
              </div>
              <h5>No WhatsApp Accounts Connected</h5>
              <p className="text-muted mb-4">Connect your WhatsApp to start sending messages</p>
              <Button 
                color="success"
                onClick={toggleQRModal}
              >
                <i className="fas fa-plus me-2"></i> Connect WhatsApp
              </Button>
            </div>
          )}
          
          {!loading && activeSessions.length > 0 && (
            <Row>
              {activeSessions.map((session, index) => (
                <Col key={index} sm={12} md={6} lg={4} className="mb-4">
                <Card 
                  className={`shadow-sm h-100 ${
                    selectedSession && getSessionId(selectedSession) === getSessionId(session)
                      ? 'border-success' : ''
                  }`}
                  onClick={() => handleSessionSelect(session)}
                  style={{ cursor: 'pointer' }}
                >
                  <CardHeader className="bg-success text-white">
                    <h5 className="mb-0">
                      <i className="fas fa-user me-2"></i>
                      {getSessionName(session)}
                    </h5>
                  </CardHeader>
                  
                  <CardBody>
                    <p>
                      <strong>Status:</strong> 
                      <Badge color="success" className="ms-2">Active</Badge>
                    </p>
                    <p>
                      <strong>Connected:</strong> {getTimeSince(session.createdAt)}
                    </p>
                    <p className="mb-0">
                      <strong>ID:</strong> {getDisplayId(session)}
                    </p>
                  </CardBody>
                  
                  <CardFooter className="d-flex justify-content-between">
                    <Button 
                      color="primary" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSessionSelect(session);
                      }}
                    >
                      Use This
                    </Button>
                    
                    <Button 
                      color="danger" 
                      onClick={(e) => {
                        e.stopPropagation();
                        disconnectSession(getSessionId(session));
                      }}
                    >
                      Disconnect
                    </Button>
                  </CardFooter>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </TabPane>
      
      {/* MESSAGING TAB */}
      <TabPane tabId="messaging">
        <h4 className="mb-4">Send WhatsApp Messages</h4>
        
        {!selectedSession && (
          <div className="text-center p-5">
            <div className="mb-4">
              <i className="fas fa-exclamation-circle text-warning" style={{ fontSize: '3rem' }}></i>
            </div>
            <h5>No WhatsApp Account Selected</h5>
            <p className="text-muted mb-4">Please select a WhatsApp account first</p>
            <Button color="primary" onClick={() => setActiveTab('sessions')}>
              Select WhatsApp Account
            </Button>
          </div>
        )}
        
        {selectedSession && (
          <Row>
            <Col md={4} className="mb-4 mb-md-0">
              <Card className="shadow-sm">
                <CardHeader className="bg-success text-white">
                  <h5 className="mb-0">Active Account</h5>
                </CardHeader>
                
                <CardBody>
                  <div className="text-center mb-3">
                    <i className="fas fa-user-circle text-success" style={{ fontSize: '3rem' }}></i>
                    <h5 className="mt-2">{getSessionName(selectedSession)}</h5>
                  </div>
                  
                  <p>
                    <strong>Connected:</strong> {getTimeSince(selectedSession.createdAt)}
                  </p>
                  <p>
                    <strong>ID:</strong> {getDisplayId(selectedSession)}
                  </p>
                </CardBody>
                
                <CardFooter>
                  <Button 
                    color="danger" 
                    block
                    onClick={() => disconnectSession(getSessionId(selectedSession))}
                  >
                    Disconnect
                  </Button>
                </CardFooter>
              </Card>
            </Col>
            
            <Col md={8}>
              <Card className="shadow-sm">
                <CardHeader className="bg-success text-white">
                  <h5 className="mb-0">Send Message</h5>
                </CardHeader>
                
                <CardBody>
                  <FormGroup>
                    <Label for="phoneNumber"><strong>Phone Number</strong></Label>
                    <InputGroup>
                      <InputGroupText>
                        <i className="fas fa-phone"></i>
                      </InputGroupText>
                      <Input
                        type="text"
                        id="phoneNumber"
                        placeholder="Enter phone number (e.g., 3001234567)"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                      />
                    </InputGroup>
                    <small className="text-muted">Country code (92) will be added automatically</small>
                  </FormGroup>
                  
                  <FormGroup>
                    <Label for="message"><strong>Message</strong></Label>
                    <Input
                      type="textarea"
                      id="message"
                      rows="5"
                      placeholder="Type your message here..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                    />
                    <small className="text-muted">Press Shift+Enter for new line, Enter to send</small>
                  </FormGroup>
                </CardBody>
                
                <CardFooter>
                  <Button 
                    color="success" 
                    block
                    onClick={sendMessage}
                    disabled={!phoneNumber || !message || loading}
                  >
                    {loading ? (
                      <span><Spinner size="sm" className="me-2" /> Sending...</span>
                    ) : (
                      <span><i className="fas fa-paper-plane me-2"></i> Send Message</span>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </Col>
          </Row>
        )}
      </TabPane>
      
      {/* HISTORY TAB */}
      <TabPane tabId="history">
        <h4 className="mb-4">Message History</h4>
        
        {!selectedSession && (
          <div className="text-center p-5">
            <div className="mb-4">
              <i className="fas fa-exclamation-circle text-warning" style={{ fontSize: '3rem' }}></i>
            </div>
            <h5>No WhatsApp Account Selected</h5>
            <p className="text-muted mb-4">Please select a WhatsApp account first</p>
            <Button color="primary" onClick={() => setActiveTab('sessions')}>
              Select WhatsApp Account
            </Button>
          </div>
        )}
        
        {selectedSession && messageLoading && (
          <div className="text-center p-4"><Spinner color="primary" /></div>
        )}
        
        {selectedSession && !messageLoading && (
          <Row>
            <Col md={4} className="mb-4 mb-md-0">
              <Card className="shadow-sm">
                <CardHeader className="bg-primary text-white">
                  <h5 className="mb-0">
                    <i className="fas fa-users me-2"></i>
                    Contacts
                  </h5>
                </CardHeader>
                
                <CardBody className="p-0" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                  {contacts.length === 0 && (
                    <div className="text-center p-4">
                      <i className="fas fa-address-book text-muted mb-3" style={{ fontSize: '2rem' }}></i>
                      <p className="mb-0">No contacts found</p>
                    </div>
                  )}
                  
                  {contacts.length > 0 && (
                    <div className="list-group list-group-flush">
                      {contacts.map((contact, index) => (
                        <div 
                          key={index} 
                          className={`list-group-item list-group-item-action ${
                            selectedContact && selectedContact.id === contact.id ? 'active' : ''
                          }`}
                          onClick={() => handleContactSelect(contact)}
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="d-flex align-items-center">
                            <div className="me-3">
                              <i className="fas fa-user-circle" style={{ fontSize: '2rem' }}></i>
                            </div>
                            <div>
                              <h6 className="mb-0">{contact.name}</h6>
                              <small>{contact.number}</small>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardBody>
              </Card>
            </Col>
            
            <Col md={8}>
              <Card className="shadow-sm">
                <CardHeader className="bg-primary text-white d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">
                    <i className="fas fa-comments me-2"></i>
                    Chat History
                  </h5>
                  
                  <Button 
                    color="light" 
                    size="sm" 
                    onClick={() => fetchMessageHistory(getSessionId(selectedSession))}
                  >
                    <i className="fas fa-sync-alt"></i>
                  </Button>
                </CardHeader>
                
                <CardBody>
                  <div style={{ height: '400px', overflowY: 'auto' }}>
                    {messages.length === 0 && (
                      <div className="text-center p-5">
                        <i className="fas fa-comment-slash text-muted mb-3" style={{ fontSize: '3rem' }}></i>
                        <h5>No messages found</h5>
                        <p className="text-muted">Select a contact or start a new conversation</p>
                      </div>
                    )}
                    
                    {messages.length > 0 && (
                      <div>
                        {messages.map((msg, index) => {
                          const isIncoming = msg.sender !== "system" && 
                                           msg.sender.includes("@s.whatsapp.net");
                          const isOutgoing = msg.sender === "system";
                          
                          return (
                            <div 
                              key={index} 
                              className={`d-flex mb-3 ${isIncoming ? 'justify-content-start' : 'justify-content-end'}`}
                            >
                              <div 
                                className={`p-3 rounded ${
                                  isIncoming ? 'bg-light' : 'bg-success text-white'
                                }`}
                                style={{ maxWidth: '80%' }}
                              >
                                {!isOutgoing && isIncoming && (
                                  <div className="mb-1">
                                    <small className="fw-bold">
                                      {formatPhoneNumber(msg.sender.split('@')[0])}
                                    </small>
                                  </div>
                                )}
                                <div>{msg.message}</div>
                                <div className="text-end mt-1">
                                  <small className="text-muted">
                                    {new Date(msg.timestamp).toLocaleTimeString()}
                                  </small>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </CardBody>
                
                {selectedContact && (
                  <CardFooter>
                    <InputGroup>
                      <Input
                        type="text"
                        placeholder="Type a message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                      />
                      <Button 
                        color="success"
                        onClick={sendMessage}
                        disabled={!message || loading}
                      >
                        <i className="fas fa-paper-plane"></i>
                      </Button>
                    </InputGroup>
                  </CardFooter>
                )}
              </Card>
            </Col>
          </Row>
        )}
      </TabPane>
    </TabContent>
    
    {/* QR Code Modal */}
    <Modal isOpen={showQRModal} toggle={toggleQRModal}>
      <ModalHeader toggle={toggleQRModal} className="bg-success text-white">
        Connect WhatsApp
      </ModalHeader>
      
      <ModalBody className="text-center p-4">
        {qrCode ? (
          <div>
            <div className="border p-3 mb-3 d-inline-block">
              <img 
                src={qrCode} 
                alt="WhatsApp QR Code" 
                style={{ width: '250px', height: '250px' }} 
              />
            </div>
            <div className="alert alert-info mt-3">
              <h6>How to connect:</h6>
              <ol className="mb-0 text-start">
                <li>Open WhatsApp on your phone</li>
                <li>Go to Settings Linked Devices</li>
                <li>Tap on "Link a Device"</li>
                <li>Scan this QR code</li>
              </ol>
            </div>
          </div>
        ) : (
          <div>
            <i className="fab fa-whatsapp text-success mb-3" style={{ fontSize: '4rem' }}></i>
            <h5>Connect WhatsApp</h5>
            <p className="text-muted">
              Click the button below to generate a QR code and connect your WhatsApp
            </p>
          </div>
        )}
      </ModalBody>
      
      <ModalFooter>
        {!qrCode ? (
          <Button 
            color="success" 
            block
            onClick={generateQRCode}
            disabled={loading}
          >
            {loading ? (
              <span><Spinner size="sm" className="me-2" /> Generating...</span>
            ) : (
              <span><i className="fas fa-qrcode me-2"></i> Generate QR Code</span>
            )}
          </Button>
        ) : (
          <Button color="secondary" onClick={toggleQRModal}>
            Close
          </Button>
        )}
      </ModalFooter>
    </Modal>

    {/* Alert Notification */}
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1050, minWidth: '300px' }}>
      <Alert 
        color={alertMessage.color} 
        isOpen={alertMessage.visible} 
        toggle={() => setAlertMessage(prev => ({ ...prev, visible: false }))}
      >
        {alertMessage.text}
      </Alert>
    </div>
  </Container>
);
};

export default WhatsappWeb;