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
  Spinner, Alert, Badge, UncontrolledTooltip,
  Collapse, Nav, NavItem, NavLink, TabContent, TabPane
} from 'reactstrap';
import { WHATSAPP_API_ENDPOINT } from 'Api/Constant';

const WhatsappWeb = () => {
  const [qrCode, setQrCode] = useState('');
  const [selectedSession, setSelectedSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [activeSessions, setActiveSessions] = useState([]);
  const [showQRModal, setShowQRModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState({ text: '', color: 'info', visible: false });
  const [activeTab, setActiveTab] = useState('sessions');
  const [refreshing, setRefreshing] = useState(false);

  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  useEffect(() => {
    fetchActiveSessions();
    // Set up auto-refresh interval for sessions
    const intervalId = setInterval(() => {
      fetchActiveSessions(true);
    }, 60000); // Refresh every minute
    
    return () => clearInterval(intervalId);
  }, []);

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
        
        // Auto check for new sessions after QR scan
        const checkInterval = setInterval(() => {
          fetchActiveSessions(true);
        }, 5000);
        
        // Clear interval and close modal after 30 seconds
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
        
        // If we have sessions and none is selected, select the first one
        if (response.data.sessions.length > 0 && !selectedSession) {
          setSelectedSession(response.data.sessions[0]);
          // Auto switch to messaging tab when a session is auto-selected
          setActiveTab('messaging');
        }
        
        // If the selected session no longer exists in the list, clear selection
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

  const showAlert = (text, color) => {
    setAlertMessage({ text, color, visible: true });
    setTimeout(() => {
      setAlertMessage(prev => ({ ...prev, visible: false }));
    }, 5000);
  };

  const toggleQRModal = () => {
    setShowQRModal(!showQRModal);
    if (!showQRModal) {
      setQrCode('');
    }
  };

  // Format phone number to ensure it has country code
  const formatPhoneNumber = (number) => {
    let formatted = number.replace(/\D/g, '');
    if (!formatted.startsWith('92') && !formatted.startsWith('+92')) {
      formatted = `92${formatted}`;
    }
    return formatted;
  };

  // Function to handle Enter key press in message input
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Function to select a session
  const handleSessionSelect = (session) => {
    setSelectedSession(session);
    setActiveTab('messaging'); // Switch to messaging tab when session is selected
  };

  const getSessionId = (session) => {
    if (!session) return '';
    
    if (session.sessionId) return session.sessionId;
    if (session.id) return session.id;
    if (session._id) return session._id;
    
    if (typeof session === 'string') return session;
    
    return '';
  };
  
  // Helper function to safely display a truncated ID
  const getDisplayId = (session) => {
    const id = getSessionId(session);
    return id.length > 6 ? `${id.substring(0, 6)}...` : id;
  };

  // Helper function to get session name/identifier
  const getSessionName = (session) => {
    if (session.phoneNumber) return session.phoneNumber;
    if (session.name) return session.name;
    return `Session ${getDisplayId(session)}`;
  };

  // Calculate time since connection
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
    <Container fluid className="py-4 px-md-4 " style={{ minHeight: '100vh' }}>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <h2 className="mb-0 d-flex align-items-center">
          <span className="bg-success p-2 rounded-circle me-3 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
            <i className="fab fa-whatsapp text-white fs-5"></i>
          </span>
          <span>WhatsApp Integration</span>
        </h2>
        
        <div className="d-flex gap-2">
          <Button 
            color="primary" 
            outline
            className="d-flex align-items-center"
            onClick={() => fetchActiveSessions()}
            disabled={loading || refreshing}
          >
            <i className={`fas fa-sync-alt me-2 ${refreshing ? 'fa-spin' : ''}`}></i>
            Refresh
          </Button>
          
          <Button 
            color="success" 
            className="d-flex align-items-center px-3 py-2"
            onClick={toggleQRModal}
          >
            <i className="fas fa-plus me-2"></i>
            <span className="d-none d-md-inline">Connect New</span>
            <span className="d-inline d-md-none">New</span>
          </Button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Nav tabs className="mb-4">
        <NavItem>
          <NavLink
            className={`cursor-pointer ${activeTab === 'sessions' ? 'active' : ''}`}
            onClick={() => setActiveTab('sessions')}
          >
            <i className="fas fa-mobile-alt me-2"></i>
            Sessions 
            <Badge color="primary" pill className="ms-2">{activeSessions.length}</Badge>
          </NavLink>
        </NavItem>
        
        <NavItem>
          <NavLink
            className={`cursor-pointer ${activeTab === 'messaging' ? 'active' : ''} ${!selectedSession ? 'disabled' : ''}`}
            onClick={() => selectedSession && setActiveTab('messaging')}
          >
            <i className="fas fa-comment-alt me-2"></i>
            Messaging
            {selectedSession && (
              <Badge color="success" pill className="ms-2">
                <i className="fas fa-check"></i>
              </Badge>
            )}
          </NavLink>
        </NavItem>
      </Nav>

      <TabContent activeTab={activeTab}>
        {/* Sessions Tab */}
        <TabPane tabId="sessions">
          <Row>
            {activeSessions.length > 0 ? (
              activeSessions.map((session, index) => (
                <Col key={index} sm={12} md={6} lg={4} xl={3} className="mb-4">
                  <Card 
                    className={`shadow-sm border-0 h-100 position-relative ${
                      selectedSession && getSessionId(selectedSession) === getSessionId(session)
                        ? 'border-primary border-2' : ''
                    }`}
                    onClick={() => handleSessionSelect(session)}
                    style={{ cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.boxShadow = '0 .5rem 1rem rgba(0,0,0,.15)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 .125rem .25rem rgba(0,0,0,.075)';
                    }}
                  >
                    {selectedSession && getSessionId(selectedSession) === getSessionId(session) && (
                      <div className="position-absolute" style={{ top: '-10px', right: '-10px' }}>
                        <Badge color="primary" pill className="p-2">
                          <i className="fas fa-check"></i>
                        </Badge>
                      </div>
                    )}
                  
                    <CardHeader className="bg-gradient-success text-white d-flex align-items-center">
                      <div className="d-flex justify-content-between align-items-center w-100">
                        <h5 className="mb-0 d-flex align-items-center">
                          <i className="fas fa-mobile-alt me-2"></i>
                          <span className="text-truncate" style={{ maxWidth: '150px' }}>
                            {getSessionName(session)}
                          </span>
                        </h5>
                        <Badge color="light" className="text-success" pill>Active</Badge>
                      </div>
                    </CardHeader>
                    <CardBody>
                      <div className="d-flex align-items-center mb-2">
                        <div className="bg-light rounded-circle p-2 me-2">
                          <i className="far fa-clock text-muted"></i>
                        </div>
                        <div>
                          <small className="text-muted">Connected</small>
                          <p className="mb-0">
                            {getTimeSince(session.createdAt)}
                          </p>
                        </div>
                      </div>
                      
                      {getSessionId(session) && (
                        <div className="d-flex align-items-center">
                          <div className="bg-light rounded-circle p-2 me-2">
                            <i className="fas fa-fingerprint text-muted"></i>
                          </div>
                          <div>
                            <small className="text-muted">Session ID</small>
                            <p className="mb-0 text-truncate" style={{ maxWidth: '180px' }}>
                              {getDisplayId(session)}
                            </p>
                          </div>
                        </div>
                      )}
                    </CardBody>
                    <CardFooter className="bg-light d-flex justify-content-between">
                      <Button 
                        color="primary" 
                        outline
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSessionSelect(session);
                        }}
                      >
                        <i className="fas fa-comment me-1"></i> Use
                      </Button>
                      <Button 
                        color="danger" 
                        outline
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          disconnectSession(getSessionId(session));
                        }}
                      >
                        <i className="fas fa-unlink me-1"></i> Disconnect
                      </Button>
                    </CardFooter>
                  </Card>
                </Col>
              ))
            ) : (
              <Col>
                <Card className="shadow-sm border-0 text-center p-5 bg-white">
                  <div className="py-5">
                    <div className="bg-light d-inline-block rounded-circle p-4 mb-4">
                      <i className="fas fa-mobile-alt text-muted" style={{ fontSize: '3rem' }}></i>
                    </div>
                    <h4 className="text-muted">No Active WhatsApp Sessions</h4>
                    <p className="text-muted mb-4">Connect your WhatsApp to start sending messages</p>
                    {/* <Button 
                      color="success" 
                      size="lg"
                      className="px-4 py-2"
                      onClick={toggleQRModal}
                    >
                      <i className="fas fa-plus me-2"></i> Connect New WhatsApp
                    </Button> */}
                  </div>
                </Card>
              </Col>
            )}
          </Row>
        </TabPane>

        {/* Messaging Tab */}
        <TabPane tabId="messaging">
          {selectedSession ? (
            <Row>
              <Col lg={4} className="mb-4 mb-lg-0">
                <Card className="shadow-sm border-0 bg-white h-100">
                  <CardHeader className="bg-gradient-success text-white">
                    <h5 className="mb-0">
                      <i className="fas fa-info-circle me-2"></i>
                      Active Session
                    </h5>
                  </CardHeader>
                  <CardBody>
                    <div className="text-center mb-4">
                      <div className="bg-light rounded-circle mx-auto p-4 d-inline-block mb-3">
                        <i className="fas fa-mobile-alt" style={{ fontSize: '3rem' }}></i>
                      </div>
                      <h5>{getSessionName(selectedSession)}</h5>
                      <Badge color="success" pill className="px-3 py-2">Connected</Badge>
                    </div>
                    
                    <div className="mt-4">
                      <div className="d-flex align-items-center mb-3">
                        <div className="bg-light rounded-circle p-2 me-3">
                          <i className="far fa-clock text-muted"></i>
                        </div>
                        <div>
                          <small className="text-muted">Connected Since</small>
                          <p className="mb-0">
                            {new Date(selectedSession.createdAt || Date.now()).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="d-flex align-items-center">
                        <div className="bg-light rounded-circle p-2 me-3">
                          <i className="fas fa-fingerprint text-muted"></i>
                        </div>
                        <div>
                          <small className="text-muted">Session ID</small>
                          <p className="mb-0 text-truncate">
                            {getSessionId(selectedSession)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                  <CardFooter className="bg-light">
                    <Button 
                      color="danger" 
                      outline
                      block
                      onClick={() => disconnectSession(getSessionId(selectedSession))}
                    >
                      <i className="fas fa-unlink me-2"></i> Disconnect Session
                    </Button>
                  </CardFooter>
                </Card>
              </Col>
              
              <Col lg={8}>
                <Card className="shadow-sm border-0 bg-white">
                  <CardHeader className="bg-gradient-success text-white">
                    <h5 className="mb-0">
                      <i className="fas fa-paper-plane me-2"></i>
                      Send WhatsApp Message
                    </h5>
                  </CardHeader>
                  
                  <CardBody>
                    <Form>
                      <FormGroup>
                        <Label for="phoneNumber" className="fw-bold">Phone Number</Label>
                        <InputGroup size="lg">
                          <InputGroupText className="bg-light">
                            <i className="fas fa-phone"></i>
                          </InputGroupText>
                          <Input
                            type="text"
                            id="phoneNumber"
                            placeholder="Enter phone number with country code (e.g., 923001234567)"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                            disabled={loading}
                          />
                        </InputGroup>
                        <small className="text-muted">
                          Country code will be added automatically if missing
                        </small>
                      </FormGroup>
                      
                      <FormGroup>
                        <Label for="message" className="fw-bold">Message</Label>
                        <InputGroup size="lg">
                          <InputGroupText className="bg-light">
                            <i className="fas fa-comment-alt"></i>
                          </InputGroupText>
                          <Input
                            type="textarea"
                            id="message"
                            rows="6"
                            placeholder="Type your message here..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={loading}
                          />
                        </InputGroup>
                        <div className="d-flex justify-content-between mt-2">
                          <small className="text-muted">
                            Press Shift+Enter for new line, Enter to send
                          </small>
                          <Badge color="light" className="text-muted">
                            <i className="fas fa-keyboard me-1"></i> {message.length} characters
                          </Badge>
                        </div>
                      </FormGroup>
                    </Form>
                  </CardBody>
                  
                  <CardFooter className="bg-light">
                    <Button 
                      color="success" 
                      size="lg"
                      block
                      onClick={sendMessage}
                      disabled={!phoneNumber || !message || loading}
                      className="py-2"
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
          ) : (
            <Card className="shadow-sm border-0 bg-white">
              <CardBody className="text-center p-5">
                <div className="py-5">
                  <div className="bg-light d-inline-block rounded-circle p-4 mb-4">
                    <i className="fas fa-comment-slash text-muted" style={{ fontSize: '3rem' }}></i>
                  </div>
                  <h4 className="text-muted">No WhatsApp Session Selected</h4>
                  <p className="text-muted mb-4">Please select a WhatsApp session to start messaging</p>
                  <Button 
                    color="primary" 
                    onClick={() => setActiveTab('sessions')}
                    className="me-2"
                  >
                    <i className="fas fa-mobile-alt me-2"></i> Select Session
                  </Button>
                  <Button 
                    color="success" 
                    onClick={toggleQRModal}
                  >
                    <i className="fas fa-plus me-2"></i> Connect New
                  </Button>
                </div>
              </CardBody>
            </Card>
          )}
        </TabPane>
      </TabContent>

      {/* QR Code Modal */}
      <Modal isOpen={showQRModal} toggle={toggleQRModal} size="md">
        <ModalHeader toggle={toggleQRModal} className="bg-gradient-success text-white">
          <i className="fas fa-qrcode me-2"></i>
          Connect WhatsApp
        </ModalHeader>
        <ModalBody className="text-center p-4">
          {qrCode ? (
            <div>
              <div className="border p-3 mb-3 bg-white d-inline-block rounded">
                <img 
                  src={qrCode} 
                  alt="WhatsApp QR Code" 
                  style={{ width: '250px', height: '250px' }} 
                />
              </div>
              <div className="alert alert-info p-3 d-flex align-items-center">
                <i className="fas fa-info-circle me-3 fs-4"></i>
                <div className="text-start">
                  <p className="mb-1 fw-bold">How to connect:</p>
                  <ol className="mb-0 ps-3">
                    <li>Open WhatsApp on your phone</li>
                    <li>Go to Settings &gt; Linked Devices</li>
                    <li>Tap on "Link a Device"</li>
                    <li>Scan this QR code</li>
                  </ol>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-4">
              <div className="bg-light d-inline-block rounded-circle p-4 mb-4">
                <i className="fas fa-mobile-alt text-muted" style={{ fontSize: '3rem' }}></i>
              </div>
              <h5 className="fw-bold mt-3">Connect your WhatsApp account</h5>
              <p className="text-muted">
                Click the button below to generate a QR code and connect WhatsApp from your mobile device
              </p>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          {!qrCode ? (
            <Button 
              color="success" 
              block
              className="px-4"
              onClick={generateQRCode}
              disabled={loading}
            >
              {loading ? (
                <span><Spinner size="sm" className="me-2" /> Processing...</span>
              ) : (
                <span><i className="fas fa-qrcode me-2"></i> Generate QR Code</span>
              )}
            </Button>
          ) : (
            <Button 
              color="secondary" 
              className="px-4"
              onClick={toggleQRModal}
            >
              <i className="fas fa-times me-2"></i> Close
            </Button>
          )}
        </ModalFooter>
      </Modal>

      {/* Alert */}
      <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1050, minWidth: '300px', maxWidth: '90vw' }}>
        <Alert 
          color={alertMessage.color} 
          isOpen={alertMessage.visible} 
          toggle={() => setAlertMessage(prev => ({ ...prev, visible: false }))}
          className="shadow-lg d-flex align-items-center"
        >
          <div className="d-flex align-items-center">
            {alertMessage.color === 'success' && <i className="fas fa-check-circle me-3 fs-4"></i>}
            {alertMessage.color === 'danger' && <i className="fas fa-exclamation-circle me-3 fs-4"></i>}
            {alertMessage.color === 'warning' && <i className="fas fa-exclamation-triangle me-3 fs-4"></i>}
            {alertMessage.color === 'info' && <i className="fas fa-info-circle me-3 fs-4"></i>}
            {alertMessage.text}
          </div>
        </Alert>
      </div>
    </Container>
  );
};

export default WhatsappWeb;