import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Alert,
  Spinner,
  Badge,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Table,
  Progress
} from 'reactstrap';
import axios from 'axios';
import classnames from 'classnames';

// Constants for API endpoints
const WHATSAPP_API_ENDPOINT = 'http://192.168.0.106:25483/api/v1/whatsapp';

const WhatsappWeb = () => {
  const [qrCode, setQrCode] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState('1');
  const [sentMessages, setSentMessages] = useState([]);

  // Get auth token from local storage
  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  // Toggle between tabs
  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  // Function to generate QR code
  const generateQRCode = async () => {
    setLoading(true);
    setStatusMessage({ type: '', text: '' });
    
    try {
      const response = await axios.post(`${WHATSAPP_API_ENDPOINT}/generate-qr`, {}, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      });
      
      if (response.data.qrCode) {
        setQrCode(response.data.qrCode);
      } else if (response.data.message === "Already connected") {
        setIsConnected(true);
        setStatusMessage({ type: 'success', text: 'WhatsApp is already connected!' });
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
      setStatusMessage({ 
        type: 'danger', 
        text: error.response?.data?.message || 'Failed to generate QR code' 
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to send message
  const sendWhatsAppMessage = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage({ type: '', text: '' });
    
    try {
      const response = await axios.post(`${WHATSAPP_API_ENDPOINT}/send-message`, {
        number: phoneNumber,
        message: message
      }, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      });
      
      setStatusMessage({ type: 'success', text: 'Message sent successfully!' });
      
      // Add to sent messages history
      setSentMessages([
        ...sentMessages,
        {
          id: Date.now(),
          number: phoneNumber,
          message: message,
          timestamp: new Date().toLocaleString(),
          status: 'delivered'
        }
      ]);
      
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      setStatusMessage({ 
        type: 'danger', 
        text: error.response?.data?.message || 'Failed to send message' 
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to disconnect WhatsApp
  const disconnectWhatsApp = async () => {
    setLoading(true);
    setStatusMessage({ type: '', text: '' });
    
    try {
      const response = await axios.post(`${WHATSAPP_API_ENDPOINT}/disconnect`, {}, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      });
      
      setIsConnected(false);
      setQrCode('');
      setStatusMessage({ type: 'success', text: 'Disconnected successfully!' });
    } catch (error) {
      console.error('Error disconnecting:', error);
      setStatusMessage({ 
        type: 'danger', 
        text: error.response?.data?.message || 'Failed to disconnect' 
      });
    } finally {
      setLoading(false);
    }
  };

  // Check connection status when component mounts
  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Try sending a test message to check connection
        await axios.post(`${WHATSAPP_API_ENDPOINT}/send-message`, {
          number: 'test',
          message: 'Connection test'
        }, {
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`
          }
        });
        
        setIsConnected(true);
      } catch (error) {
        // If error is "User not connected", we know the connection status
        if (error.response?.data?.message === "User not connected") {
          setIsConnected(false);
        }
        // Otherwise, we don't update the state
      }
    };
    
    checkConnection();
    
    // Optional: Polling to check connection status periodically
    const interval = setInterval(checkConnection, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, []);

  return (
    <Container className="mt-4">
      <Row>
        <Col md={12}>
          <Card className="shadow border-0 rounded-lg">
            <CardHeader className="bg-success text-white d-flex justify-content-between align-items-center" style={{ borderRadius: '0.5rem 0.5rem 0 0' }}>
              <div className="d-flex align-items-center">
                <i className="fa fa-whatsapp me-2" style={{ fontSize: '1.5rem' }}></i>
                <h3 className="mb-0">WhatsApp Web Integration</h3>
              </div>
              {isConnected && (
                <Badge color="light" className="text-success px-3 py-2">
                  <i className="fa fa-check-circle me-1"></i> Connected
                </Badge>
              )}
            </CardHeader>
            
            <CardBody className="px-4 py-4">
              {statusMessage.text && (
                <Alert color={statusMessage.type} toggle={() => setStatusMessage({ type: '', text: '' })} className="rounded-lg border-0 shadow-sm">
                  <div className="d-flex align-items-center">
                    <i className={`fa fa-${statusMessage.type === 'success' ? 'check-circle' : 'exclamation-circle'} me-2`}></i>
                    {statusMessage.text}
                  </div>
                </Alert>
              )}
              
              {!isConnected ? (
                <div className="text-center py-4">
                  <div className="mb-4">
                    <div className="bg-light p-4 rounded-circle d-inline-block mb-3">
                      <i className="fa fa-whatsapp" style={{ fontSize: '3.5rem', color: '#25D366' }}></i>
                    </div>
                    <h4 className="mt-3 fw-bold">Connect to WhatsApp Web</h4>
                    <p className="text-muted px-md-5 mx-md-5">
                      Link your WhatsApp account to start sending messages directly from this platform.
                      All your conversations will be synced with your phone.
                    </p>
                  </div>
                  
                  <Button 
                    color="success" 
                    size="lg"
                    onClick={generateQRCode} 
                    disabled={loading}
                    className="px-4 rounded-pill shadow-sm"
                  >
                    {loading ? (
                      <>
                        <Spinner size="sm" className="me-2" /> Generating QR Code...
                      </>
                    ) : (
                      <>
                        <i className="fa fa-qrcode me-2"></i> Generate QR Code
                      </>
                    )}
                  </Button>
                  
                  {qrCode && (
                    <div className="mt-5 p-4 border rounded-lg bg-light shadow-sm mx-auto" style={{ maxWidth: '450px' }}>
                      <h5 className="text-success fw-bold mb-3">
                        <i className="fa fa-qrcode me-2"></i> Scan QR Code
                      </h5>
                      
                      <div className="d-flex justify-content-center mb-4">
                        <div className="p-3 bg-white rounded-lg shadow-sm" style={{ padding: '8px', border: '2px solid #25D366' }}>
                          <img 
                            src={qrCode} 
                            alt="WhatsApp QR Code" 
                            style={{ maxWidth: '250px' }} 
                            className="img-fluid"
                          />
                        </div>
                      </div>
                      
                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <h6 className="text-dark mb-3 fw-bold">How to connect:</h6>
                        <ol className="text-start text-muted mb-0 ps-3">
                          <li className="mb-2">Open WhatsApp on your phone</li>
                          <li className="mb-2">Tap Menu <i className="fa fa-ellipsis-v mx-1 text-success"></i> or Settings <i className="fa fa-cog mx-1 text-success"></i></li>
                          <li className="mb-2">Select <strong>Linked Devices</strong></li>
                          <li>Point your phone camera at this screen</li>
                        </ol>
                      </div>
                      
                      <div className="mt-4">
                        <Progress animated color="success" value={30} className="mb-2" style={{ height: '6px' }} />
                        <small className="text-muted">Waiting for connection...</small>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <Nav tabs className="mb-4 border-0">
                    {['Send Message', 'Message History', 'Settings'].map((tabName, index) => (
                      <NavItem key={index}>
                        <NavLink
                          className={classnames({ 
                            active: activeTab === (index + 1).toString(),
                            'text-success': activeTab === (index + 1).toString(),
                            'border-0': true,
                            'rounded-pill': true,
                            'mx-1': true,
                            'px-4': true,
                            'shadow-sm': activeTab === (index + 1).toString()
                          })}
                          onClick={() => { toggle((index + 1).toString()); }}
                        >
                          <i className={`fa fa-${
                            index === 0 ? 'paper-plane' : 
                            index === 1 ? 'history' : 'cog'
                          } me-2`}></i>
                          {tabName}
                        </NavLink>
                      </NavItem>
                    ))}
                  </Nav>
                  
                  <TabContent activeTab={activeTab}>
                    <TabPane tabId="1">
                      <Card className="border-0 shadow-sm rounded-lg">
                        <CardBody className="p-4">
                          <h5 className="text-success mb-4">
                            <i className="fa fa-paper-plane me-2"></i>
                            Send New Message
                          </h5>
                          
                          <Form onSubmit={sendWhatsAppMessage}>
                            <FormGroup className="mb-4">
                              <Label for="phoneNumber" className="fw-bold">Phone Number</Label>
                              <div className="input-group">
                                <span className="input-group-text bg-light">
                                  <i className="fa fa-phone text-success"></i>
                                </span>
                                <Input
                                  type="text"
                                  id="phoneNumber"
                                  placeholder="e.g., 919876543210"
                                  value={phoneNumber}
                                  onChange={(e) => setPhoneNumber(e.target.value)}
                                  className="form-control-lg border-start-0"
                                  required
                                />
                              </div>
                              <small className="form-text text-muted">
                                <i className="fa fa-info-circle me-1"></i>
                                Include country code without + or 00 (e.g., 91 for India)
                              </small>
                            </FormGroup>
                            
                            <FormGroup className="mb-4">
                              <Label for="message" className="fw-bold">Message</Label>
                              <div className="input-group">
                                <span className="input-group-text bg-light">
                                  <i className="fa fa-comment text-success"></i>
                                </span>
                                <Input
                                  type="textarea"
                                  id="message"
                                  rows="5"
                                  placeholder="Type your message here..."
                                  value={message}
                                  onChange={(e) => setMessage(e.target.value)}
                                  className="border-start-0"
                                  required
                                />
                              </div>
                            </FormGroup>
                            
                            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                              <Button 
                                color="success" 
                                type="submit" 
                                disabled={loading}
                                className="px-4 py-2 rounded-pill"
                                size="lg"
                              >
                                {loading ? (
                                  <>
                                    <Spinner size="sm" className="me-2" /> Sending...
                                  </>
                                ) : (
                                  <>
                                    <i className="fa fa-paper-plane me-2"></i> Send Message
                                  </>
                                )}
                              </Button>
                            </div>
                          </Form>
                        </CardBody>
                      </Card>
                    </TabPane>
                    
                    <TabPane tabId="2">
                      <Card className="border-0 shadow-sm rounded-lg">
                        <CardBody className="p-4">
                          <h5 className="text-success mb-4">
                            <i className="fa fa-history me-2"></i>
                            Message History
                          </h5>
                          
                          {sentMessages.length > 0 ? (
                            <div className="table-responsive">
                              <Table hover className="align-middle">
                                <thead className="table-light">
                                  <tr>
                                    <th>Phone Number</th>
                                    <th>Message</th>
                                    <th>Time</th>
                                    <th>Status</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {sentMessages.map(msg => (
                                    <tr key={msg.id}>
                                      <td>
                                        <div className="d-flex align-items-center">
                                          <span className="bg-light rounded-circle p-2 me-2">
                                            <i className="fa fa-user text-secondary"></i>
                                          </span>
                                          {msg.number}
                                        </div>
                                      </td>
                                      <td>
                                        <div style={{ 
                                          maxWidth: '300px', 
                                          overflow: 'hidden', 
                                          textOverflow: 'ellipsis',
                                          whiteSpace: 'nowrap'
                                        }}>
                                          {msg.message}
                                        </div>
                                      </td>
                                      <td>
                                        <i className="fa fa-clock-o me-1 text-muted"></i>
                                        {msg.timestamp}
                                      </td>
                                      <td>
                                        <Badge color="success" className="rounded-pill px-3">
                                          <i className="fa fa-check me-1"></i>
                                          {msg.status || 'Sent'}
                                        </Badge>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </Table>
                              <div className="d-flex justify-content-between mt-3">
                                <Button color="light" outline size="sm" className="rounded-pill">
                                  <i className="fa fa-download me-1"></i> Export History
                                </Button>
                                <Button color="light" outline size="sm" className="rounded-pill">
                                  <i className="fa fa-trash me-1"></i> Clear History
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <Alert color="info" className="rounded-lg">
                              <div className="d-flex align-items-center">
                                <i className="fa fa-info-circle me-3 fs-4"></i>
                                <div>
                                  <h6 className="mb-1">No messages yet</h6>
                                  <p className="mb-0">Your sent messages will appear here.</p>
                                </div>
                              </div>
                            </Alert>
                          )}
                        </CardBody>
                      </Card>
                    </TabPane>
                    
                    <TabPane tabId="3">
                      <Row>
                        <Col md={6}>
                          <Card className="border-0 shadow-sm rounded-lg mb-4">
                            <CardBody className="p-4">
                              <div className="d-flex align-items-center mb-4">
                                <div className="bg-success rounded-circle p-3 me-3">
                                  <i className="fa fa-whatsapp text-white fs-4"></i>
                                </div>
                                <div>
                                  <h5 className="mb-1">Connection Status</h5>
                                  <p className="text-success mb-0">
                                    <i className="fa fa-check-circle me-1"></i> Active
                                  </p>
                                </div>
                              </div>
                              
                              <Alert color="light" className="rounded-lg mb-4">
                                <p className="mb-0">
                                  <i className="fa fa-info-circle me-2 text-primary"></i>
                                  Your WhatsApp Web session is currently active. You can use multiple devices while keeping your phone connected.
                                </p>
                              </Alert>
                              
                              <Button 
                                color="danger" 
                                onClick={disconnectWhatsApp}
                                disabled={loading}
                                className="rounded-pill w-100"
                                outline
                              >
                                {loading ? <Spinner size="sm" /> : <><i className="fa fa-sign-out me-2"></i> Disconnect WhatsApp</>}
                              </Button>
                            </CardBody>
                          </Card>
                        </Col>
                        
                        <Col md={6}>
                          <Card className="border-0 shadow-sm rounded-lg mb-4">
                            <CardBody className="p-4">
                              <h5 className="mb-4">
                                <i className="fa fa-cog me-2"></i> Preferences
                              </h5>
                              
                              <div className="mb-3">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                  <Label className="form-check-label fw-bold">Notification Sounds</Label>
                                  <div className="form-check form-switch">
                                    <Input type="checkbox" className="form-check-input" defaultChecked />
                                  </div>
                                </div>
                                <small className="text-muted">Play sounds when messages are sent or received</small>
                              </div>
                              
                              <div className="mb-3">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                  <Label className="form-check-label fw-bold">Desktop Notifications</Label>
                                  <div className="form-check form-switch">
                                    <Input type="checkbox" className="form-check-input" defaultChecked />
                                  </div>
                                </div>
                                <small className="text-muted">Show desktop notifications for incoming messages</small>
                              </div>
                              
                              <div>
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                  <Label className="form-check-label fw-bold">Auto Reconnect</Label>
                                  <div className="form-check form-switch">
                                    <Input type="checkbox" className="form-check-input" defaultChecked />
                                  </div>
                                </div>
                                <small className="text-muted">Automatically reconnect if connection is lost</small>
                              </div>
                            </CardBody>
                          </Card>
                        </Col>
                      </Row>
                    </TabPane>
                  </TabContent>
                </div>
              )}
            </CardBody>
            
            <CardFooter className="text-muted text-center py-3" style={{ borderRadius: '0 0 0.5rem 0.5rem' }}>
              <small>
                <i className="fa fa-shield me-1"></i> Your conversations are end-to-end encrypted
                <span className="mx-2">•</span>
                <span>WhatsApp and WhatsApp Web are registered trademarks of Meta Platforms, Inc.</span>
              </small>
            </CardFooter>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default WhatsappWeb;