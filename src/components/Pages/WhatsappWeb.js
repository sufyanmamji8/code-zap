// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { 
//   Container, Row, Col, Card, CardHeader, CardBody, CardFooter,
//   Button, Form, FormGroup, Input, Label,
//   Modal, ModalHeader, ModalBody, ListGroup, ListGroupItem,
//   Spinner, Alert, Badge, UncontrolledTooltip
// } from 'reactstrap';
// import { WHATSAPP_API_ENDPOINT } from 'Api/Constant';

// const WhatsappWeb = () => {
//   const [qrCode, setQrCode] = useState('');
//   const [sessionId, setSessionId] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState('');
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [activeSessions, setActiveSessions] = useState([]);
//   const [showActiveSessions, setShowActiveSessions] = useState(false);
//   const [alertMessage, setAlertMessage] = useState({ text: '', color: 'info', visible: false });
//   const [countryCode, setCountryCode] = useState('91');

//   // Get token from localStorage
//   const token = localStorage.getItem('token');

//   const headers = {
//     'Content-Type': 'application/json',
//     'Authorization': `Bearer ${token}`
//   };

//   // Function to check and restore existing session on component mount
//   useEffect(() => {
//     const savedSessionId = localStorage.getItem('whatsapp_session_id');
//     if (savedSessionId) {
//       setSessionId(savedSessionId);
//       showAlert('Previous WhatsApp session restored', 'info');
//     }
//   }, []);

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
//         setSessionId(response.data.sessionId);
//         localStorage.setItem('whatsapp_session_id', response.data.sessionId);
//         showAlert('QR code generated successfully! Scan with WhatsApp on your phone.', 'success');
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

//   // Function to send a message
//   const sendMessage = async () => {
//     if (!sessionId) {
//       showAlert('Please connect WhatsApp first!', 'warning');
//       return;
//     }

//     if (!phoneNumber || !message) {
//       showAlert('Please enter both phone number and message!', 'warning');
//       return;
//     }

//     try {
//       setLoading(true);
//       const formattedNumber = `${countryCode}${phoneNumber}`;
//       const response = await axios.post(
//         `${WHATSAPP_API_ENDPOINT}/send-message`,
//         {
//           sessionId,
//           number: formattedNumber,
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
//       showAlert('Error sending message. Please try again.', 'danger');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Function to disconnect session
//   const disconnectSession = async () => {
//     if (!sessionId) {
//       showAlert('No active session to disconnect!', 'warning');
//       return;
//     }

//     try {
//       setLoading(true);
//       const response = await axios.post(
//         `${WHATSAPP_API_ENDPOINT}/disconnect`,
//         { sessionId },
//         { headers }
//       );

//       if (response.data.success) {
//         showAlert('WhatsApp session disconnected successfully!', 'success');
//         setQrCode('');
//         setSessionId('');
//         localStorage.removeItem('whatsapp_session_id');
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
//   const fetchActiveSessions = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(
//         `${WHATSAPP_API_ENDPOINT}/active-sessions`,
//         { headers }
//       );

//       if (response.data.success) {
//         setActiveSessions(response.data.sessions);
//         setShowActiveSessions(true);
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

//   // Function to show alert messages
//   const showAlert = (text, color) => {
//     setAlertMessage({ text, color, visible: true });
//     // Auto-hide alert after 6 seconds
//     setTimeout(() => {
//       setAlertMessage(prev => ({ ...prev, visible: false }));
//     }, 6000);
//   };

//   // Toggle active sessions modal
//   const toggleActiveSessionsModal = () => {
//     setShowActiveSessions(!showActiveSessions);
//   };

//   // Function to handle Enter key press in message input
//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       sendMessage();
//     }
//   };

//   return (
//     <Container fluid className="py-4 px-md-4 bg-light" style={{ minHeight: '100vh' }}>
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <h2 className="mb-0">
//           <i className="fab fa-whatsapp text-success me-2"></i>
//           WhatsApp Web Integration
//         </h2>
//         <Badge 
//           color={sessionId ? "success" : "danger"} 
//           pill
//           className="px-3 py-2"
//           style={{ fontSize: '0.9rem' }}
//         >
//           {sessionId ? "Connected" : "Disconnected"}
//         </Badge>
//       </div>

//       <Row>
//         {/* QR Code Section */}
//         <Col lg={5} className="mb-4">
//           <Card className="shadow-sm border-0 h-100">
//             <CardHeader className="bg-dark text-white">
//               <div className="d-flex justify-content-between align-items-center">
//                 <h5 className="mb-0">
//                   <i className="fas fa-qrcode me-2"></i>
//                   Connect WhatsApp
//                 </h5>
//                 {sessionId && (
//                   <Badge color="light" className="text-dark" pill id="sessionIdBadge">
//                     ID: {sessionId.substring(0, 8)}...
//                   </Badge>
//                 )}
//               </div>
//             </CardHeader>
            
//             <CardBody className="d-flex flex-column align-items-center justify-content-center p-4">
//               {qrCode ? (
//                 <div className="text-center">
//                   <div className="border p-2 mb-3 bg-white" style={{ display: 'inline-block' }}>
//                     <img 
//                       src={qrCode} 
//                       alt="WhatsApp QR Code" 
//                       style={{ width: '250px', height: '250px' }} 
//                     />
//                   </div>
//                   <div className="alert alert-info p-2">
//                     <i className="fas fa-info-circle me-2"></i>
//                     Scan this QR code with WhatsApp on your phone
//                   </div>
//                 </div>
//               ) : (
//                 <div className="text-center py-5">
//                   <i className="fas fa-mobile-alt text-muted mb-3" style={{ fontSize: '5rem' }}></i>
//                   <h5 className="text-muted">Connect your WhatsApp account</h5>
//                   <p className="text-muted">
//                     Click "Generate QR Code" to connect WhatsApp from your mobile device
//                   </p>
//                 </div>
//               )}
//             </CardBody>
            
//             <CardFooter className="bg-light d-flex justify-content-center gap-3 p-3">
//               <Button 
//                 color="success" 
//                 className="px-4 py-2"
//                 onClick={generateQRCode}
//                 disabled={loading}
//               >
//                 {loading ? (
//                   <span><Spinner size="sm" className="me-2" /> Processing...</span>
//                 ) : (
//                   <span><i className="fas fa-qrcode me-2"></i> Generate QR Code</span>
//                 )}
//               </Button>
              
//               <Button 
//                 color="danger" 
//                 className="px-4 py-2"
//                 onClick={disconnectSession}
//                 disabled={!sessionId || loading}
//               >
//                 <i className="fas fa-unlink me-2"></i> Disconnect
//               </Button>
              
//               <Button 
//                 color="primary" 
//                 className="px-4 py-2"
//                 onClick={fetchActiveSessions}
//                 disabled={loading}
//                 id="viewSessionsBtn"
//               >
//                 <i className="fas fa-list me-2"></i> Sessions
//               </Button>
//               <UncontrolledTooltip target="viewSessionsBtn">
//                 View all active WhatsApp sessions
//               </UncontrolledTooltip>
//             </CardFooter>
//           </Card>
//         </Col>

//         {/* Send Message Section */}
//         <Col lg={7} className="mb-4">
//           <Card className="shadow-sm border-0 h-100">
//             <CardHeader className="bg-dark text-white">
//               <h5 className="mb-0">
//                 <i className="fas fa-paper-plane me-2"></i>
//                 Send WhatsApp Message
//               </h5>
//             </CardHeader>
            
//             <CardBody>
//               <Form>
//                 <Row className="mb-3">
//                   <Col xs={3} sm={2}>
//                     <FormGroup>
//                       <Label for="countryCode">Code</Label>
//                       <Input
//                         type="select"
//                         id="countryCode"
//                         value={countryCode}
//                         onChange={(e) => setCountryCode(e.target.value)}
//                         disabled={!sessionId || loading}
//                       >
//                         <option value="92">+92 (PAK)</option>
//                         <option value="1">+1 (US)</option>
//                         <option value="44">+44 (UK)</option>
//                         <option value="971">+971 (UAE)</option>
//                         <option value="966">+966 (SA)</option>
//                         <option value="65">+65 (SG)</option>
//                       </Input>
//                     </FormGroup>
//                   </Col>
                  
//                   <Col xs={9} sm={10}>
//                     <FormGroup>
//                       <Label for="phoneNumber">Phone Number</Label>
//                       <Input
//                         type="text"
//                         id="phoneNumber"
//                         placeholder="Enter phone number without country code"
//                         value={phoneNumber}
//                         onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
//                         disabled={!sessionId || loading}
//                         className="form-control-lg"
//                       />
//                     </FormGroup>
//                   </Col>
//                 </Row>
                
//                 <FormGroup>
//                   <Label for="message">Message</Label>
//                   <Input
//                     type="textarea"
//                     id="message"
//                     rows="6"
//                     placeholder="Type your message here..."
//                     value={message}
//                     onChange={(e) => setMessage(e.target.value)}
//                     onKeyPress={handleKeyPress}
//                     disabled={!sessionId || loading}
//                     className="form-control-lg"
//                   />
//                   <small className="text-muted">
//                     Press Shift+Enter for new line, Enter to send
//                   </small>
//                 </FormGroup>
                
//                 <div className="text-end mt-3">
//                   <Badge color="light" className="me-2 text-muted">
//                     <i className="fas fa-keyboard me-1"></i> {message.length} characters
//                   </Badge>
//                 </div>
//               </Form>
//             </CardBody>
            
//             <CardFooter className="bg-light p-3">
//               <Button 
//                 color="success" 
//                 size="lg"
//                 block
//                 onClick={sendMessage}
//                 disabled={!sessionId || !phoneNumber || !message || loading}
//                 className="py-2"
//               >
//                 {loading ? (
//                   <span><Spinner size="sm" className="me-2" /> Sending...</span>
//                 ) : (
//                   <span><i className="fas fa-paper-plane me-2"></i> Send Message</span>
//                 )}
//               </Button>
              
//               <div className="text-center mt-3">
//                 <small className="text-muted">
//                   {!sessionId ? (
//                     <span className="text-danger"><i className="fas fa-exclamation-circle me-1"></i> Please connect WhatsApp first</span>
//                   ) : (
//                     <span className="text-success"><i className="fas fa-check-circle me-1"></i> Ready to send messages</span>
//                   )}
//                 </small>
//               </div>
//             </CardFooter>
//           </Card>
//         </Col>
//       </Row>

//       {/* Active Sessions Modal */}
//       <Modal isOpen={showActiveSessions} toggle={toggleActiveSessionsModal} size="lg">
//         <ModalHeader toggle={toggleActiveSessionsModal} className="bg-primary text-white">
//           <i className="fas fa-list-alt me-2"></i>
//           Active WhatsApp Sessions
//         </ModalHeader>
//         <ModalBody>
//           {loading ? (
//             <div className="text-center py-5">
//               <Spinner color="primary" />
//               <p className="mt-3">Loading active sessions...</p>
//             </div>
//           ) : activeSessions.length > 0 ? (
//             <ListGroup flush>
//               {activeSessions.map((session, index) => (
//                 <ListGroupItem key={index} className="border-0 border-bottom py-3">
//                   <div className="d-flex justify-content-between align-items-center">
//                     <div>
//                       <h5 className="mb-1">
//                         <i className="fas fa-mobile-alt me-2 text-primary"></i>
//                         {session.phoneNumber}
//                       </h5>
//                       <small className="text-muted">
//                         <i className="far fa-clock me-1"></i>
//                         Connected since: {new Date(session.createdAt).toLocaleString()}
//                       </small>
//                     </div>
//                     <div>
//                       <Badge color="success" pill className="px-3 py-2">Active</Badge>
//                     </div>
//                   </div>
//                 </ListGroupItem>
//               ))}
//             </ListGroup>
//           ) : (
//             <div className="text-center py-5">
//               <i className="fas fa-search text-muted mb-3" style={{ fontSize: '3rem' }}></i>
//               <h5>No active sessions found</h5>
//               <p className="text-muted">Generate a QR code and scan it to create a new session</p>
//             </div>
//           )}
//         </ModalBody>
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
  Button, Form, FormGroup, Input, Label,
  Modal, ModalHeader, ModalBody, ModalFooter,
  Spinner, Alert, Badge, UncontrolledTooltip
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

  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  useEffect(() => {
    fetchActiveSessions();
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
        
        setTimeout(() => {
          fetchActiveSessions();
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
      
      console.log("Using sessionId:", sessionId);
      
      if (!sessionId) {
        showAlert('Session ID could not be found. Please try reconnecting.', 'warning');
        setLoading(false);
        return;
      }
      
      const response = await axios.post(
        `${WHATSAPP_API_ENDPOINT}/send-message`,
        {
          sessionId: sessionId,
          number: phoneNumber,
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
      console.error('Error details:', error.response?.data || error.message);
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

  const fetchActiveSessions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${WHATSAPP_API_ENDPOINT}/active-sessions`,
        { headers }
      );

      if (response.data.success) {
        setActiveSessions(response.data.sessions);
        
        if (response.data.sessions.length > 0 && !selectedSession) {
          setSelectedSession(response.data.sessions[0]);
        }
      } else {
        showAlert(response.data.message || 'No active sessions found.', 'info');
      }
    } catch (error) {
      console.error('Error fetching active sessions:', error);
      showAlert('Error fetching active sessions. Please try again.', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (text, color) => {
    setAlertMessage({ text, color, visible: true });
    setTimeout(() => {
      setAlertMessage(prev => ({ ...prev, visible: false }));
    }, 6000);
  };

  
  const toggleQRModal = () => {
    setShowQRModal(!showQRModal);
    if (!showQRModal) {
      setQrCode('');
    }
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
    console.log("Selected session full object:", session);
    console.log("Object keys:", Object.keys(session));
    setSelectedSession(session);
  };

  const getSessionId = (session) => {
    if (!session) return '';
    
    // For debugging
    console.log("Session object structure:", JSON.stringify(session, null, 2));
    
    // Check all possible ID properties
    if (session.sessionId) return session.sessionId;
    if (session.id) return session.id;
    if (session._id) return session._id;
    
    // Last resort: if session itself is a string, it might be the ID
    if (typeof session === 'string') return session;
    
    console.error("Cannot determine session ID from:", session);
    return '';
  };
  
  // Helper function to safely display a truncated ID
  const getDisplayId = (session) => {
    const id = getSessionId(session);
    return id.length > 6 ? id.substring(0, 6) : id;
  };

  // Helper function to get session name/identifier
  const getSessionName = (session) => {
    if (session.phoneNumber) return session.phoneNumber;
    if (session.name) return session.name;
    return `Session ${getDisplayId(session)}`;
  };

  return (
    <Container fluid className="py-4 px-md-4 bg-light" style={{ minHeight: '100vh' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">
          <i className="fab fa-whatsapp text-success me-2"></i>
          WhatsApp Web Integration
        </h2>
        <Button 
          color="success" 
          className="px-4 py-2"
          onClick={toggleQRModal}
        >
          <i className="fas fa-plus me-2"></i> Connect New WhatsApp
        </Button>
      </div>

      {/* Session Selection Row */}
      <Row className="mb-4">
        <Col>
          <h4 className="mb-3">Active Sessions</h4>
          <Row>
            {activeSessions.length > 0 ? (
              activeSessions.map((session, index) => (
                <Col key={index} md={6} lg={4} className="mb-4">
                  <Card 
                    className={`shadow-sm border-0 h-100 ${
                      selectedSession && 
                      (selectedSession.sessionId === getSessionId(session) || 
                       selectedSession.id === getSessionId(session)) 
                        ? 'border-primary border-2' : ''
                    }`}
                    onClick={() => handleSessionSelect(session)}
                    style={{ cursor: 'pointer' }}
                  >
                    <CardHeader className="bg-dark text-white">
                      <div className="d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">
                          <i className="fas fa-mobile-alt me-2"></i>
                          {getSessionName(session)}
                        </h5>
                        <Badge color="success" pill>Active</Badge>
                      </div>
                    </CardHeader>
                    <CardBody>
                      <p>
                        <i className="far fa-clock text-muted me-2"></i>
                        Connected: {new Date(session.createdAt || Date.now()).toLocaleString()}
                      </p>
                      {getSessionId(session) && (
                        <p>
                          <i className="fas fa-fingerprint text-muted me-2"></i>
                          ID: {getDisplayId(session)}...
                        </p>
                      )}
                    </CardBody>
                    <CardFooter className="bg-light">
                      <div className="d-flex justify-content-between">
                        <Button 
                          color="primary" 
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
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            disconnectSession(getSessionId(session));
                          }}
                        >
                          <i className="fas fa-unlink me-1"></i> Disconnect
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                </Col>
              ))
            ) : (
              <Col>
                <Card className="shadow-sm border-0 text-center p-5">
                  <div className="py-5">
                    <i className="fas fa-mobile-alt text-muted mb-4" style={{ fontSize: '4rem' }}></i>
                    <h4 className="text-muted">No Active WhatsApp Sessions</h4>
                    <p>Click "Connect New WhatsApp" to add a new session</p>
                    <Button 
                      color="success" 
                      className="mt-3"
                      onClick={toggleQRModal}
                    >
                      <i className="fas fa-plus me-2"></i> Connect New WhatsApp
                    </Button>
                  </div>
                </Card>
              </Col>
            )}
          </Row>
        </Col>
      </Row>

      {/* Send Message Section - Only shown when a session is selected */}
      {selectedSession && (
        <Row>
          <Col>
            <Card className="shadow-sm border-0">
              <CardHeader className="bg-dark text-white">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">
                    <i className="fas fa-paper-plane me-2"></i>
                    Send Message with {getSessionName(selectedSession)}
                  </h5>
                  <Badge color="success" pill className="px-3 py-2">Connected</Badge>
                </div>
              </CardHeader>
              
              <CardBody>
                <Form>
                  <FormGroup>
                    <Label for="phoneNumber">Phone Number</Label>
                    <Input
                      type="text"
                      id="phoneNumber"
                      placeholder="Enter complete phone number with country code (e.g., 923001234567)"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                      disabled={loading}
                      className="form-control-lg"
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label for="message">Message</Label>
                    <Input
                      type="textarea"
                      id="message"
                      rows="6"
                      placeholder="Type your message here..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      disabled={loading}
                      className="form-control-lg"
                    />
                    <small className="text-muted">
                      Press Shift+Enter for new line, Enter to send
                    </small>
                  </FormGroup>
                  
                  <div className="text-end mt-3">
                    <Badge color="light" className="me-2 text-muted">
                      <i className="fas fa-keyboard me-1"></i> {message.length} characters
                    </Badge>
                  </div>
                </Form>
              </CardBody>
              
              <CardFooter className="bg-light p-3">
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
      )}

      {/* QR Code Modal */}
      <Modal isOpen={showQRModal} toggle={toggleQRModal} size="md">
        <ModalHeader toggle={toggleQRModal} className="bg-dark text-white">
          <i className="fas fa-qrcode me-2"></i>
          Connect New WhatsApp Session
        </ModalHeader>
        <ModalBody className="text-center p-4">
          {qrCode ? (
            <div>
              <div className="border p-2 mb-3 bg-white d-inline-block">
                <img 
                  src={qrCode} 
                  alt="WhatsApp QR Code" 
                  style={{ width: '250px', height: '250px' }} 
                />
              </div>
              <div className="alert alert-info p-2">
                <i className="fas fa-info-circle me-2"></i>
                Scan this QR code with WhatsApp on your phone
              </div>
            </div>
          ) : (
            <div className="py-4">
              <i className="fas fa-mobile-alt text-muted mb-3" style={{ fontSize: '5rem' }}></i>
              <h5 className="text-muted mt-3">Connect your WhatsApp account</h5>
              <p className="text-muted">
                Click "Generate QR Code" to connect WhatsApp from your mobile device
              </p>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          {!qrCode ? (
            <Button 
              color="success" 
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
      <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1050, minWidth: '300px' }}>
        <Alert 
          color={alertMessage.color} 
          isOpen={alertMessage.visible} 
          toggle={() => setAlertMessage(prev => ({ ...prev, visible: false }))}
          className="shadow-lg"
        >
          <div className="d-flex align-items-center">
            {alertMessage.color === 'success' && <i className="fas fa-check-circle me-2 fs-5"></i>}
            {alertMessage.color === 'danger' && <i className="fas fa-exclamation-circle me-2 fs-5"></i>}
            {alertMessage.color === 'warning' && <i className="fas fa-exclamation-triangle me-2 fs-5"></i>}
            {alertMessage.color === 'info' && <i className="fas fa-info-circle me-2 fs-5"></i>}
            {alertMessage.text}
          </div>
        </Alert>
      </div>
    </Container>
  );
};

export default WhatsappWeb;