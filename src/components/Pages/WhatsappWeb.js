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
  Table
} from 'reactstrap';
import axios from 'axios';
import classnames from 'classnames';

// Constants for API endpoints
const WHATSAPP_API_ENDPOINT = 'https://codozap-e04e12b02929.herokuapp.com/api/v1/whatsapp';

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
          timestamp: new Date().toLocaleString()
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
          <Card className="shadow-sm">
            <CardHeader className="bg-primary text-white d-flex justify-content-between align-items-center">
              <h3 className="mb-0">WhatsApp Web Integration</h3>
              {isConnected && (
                <Badge color="success" pill className="px-3 py-2">
                  Connected
                </Badge>
              )}
            </CardHeader>
            
            <CardBody>
              {statusMessage.text && (
                <Alert color={statusMessage.type} toggle={() => setStatusMessage({ type: '', text: '' })}>
                  {statusMessage.text}
                </Alert>
              )}
              
              {!isConnected ? (
                <div className="text-center py-4">
                  <div className="mb-4">
                    <i className="fa fa-whatsapp" style={{ fontSize: '3rem', color: '#25D366' }}></i>
                    <h4 className="mt-3">Connect to WhatsApp Web</h4>
                    <p className="text-muted">
                      Link your WhatsApp account to start sending messages directly from this platform.
                    </p>
                  </div>
                  
                  <Button 
                    color="success" 
                    size="lg"
                    onClick={generateQRCode} 
                    disabled={loading}
                    className="px-4"
                  >
                    {loading ? <Spinner size="sm" /> : 'Generate QR Code'}
                  </Button>
                  
                  {qrCode && (
                    <div className="mt-4 p-3 border rounded bg-light">
                      <p><strong>Scan this QR code with WhatsApp on your phone:</strong></p>
                      <div className="d-flex justify-content-center">
                        <img 
                          src={qrCode} 
                          alt="WhatsApp QR Code" 
                          style={{ maxWidth: '300px' }} 
                          className="border p-2 bg-white"
                        />
                      </div>
                      <ol className="text-start mt-3 text-muted">
                        <li>Open WhatsApp on your phone</li>
                        <li>Tap Menu or Settings</li>
                        <li>Tap WhatsApp Web</li>
                        <li>Point your phone to this screen to capture the QR code</li>
                      </ol>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <Nav tabs className="mb-4">
                    <NavItem>
                      <NavLink
                        className={classnames({ active: activeTab === '1' })}
                        onClick={() => { toggle('1'); }}
                      >
                        Send Message
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({ active: activeTab === '2' })}
                        onClick={() => { toggle('2'); }}
                      >
                        Message History
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({ active: activeTab === '3' })}
                        onClick={() => { toggle('3'); }}
                      >
                        Settings
                      </NavLink>
                    </NavItem>
                  </Nav>
                  
                  <TabContent activeTab={activeTab}>
                    <TabPane tabId="1">
                      <Form onSubmit={sendWhatsAppMessage}>
                        <FormGroup>
                          <Label for="phoneNumber">Phone Number</Label>
                          <Input
                            type="text"
                            id="phoneNumber"
                            placeholder="Enter phone number with country code (e.g., 919876543210)"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                          />
                          <small className="form-text text-muted">
                            Include country code without + or 00 (e.g., 91 for India)
                          </small>
                        </FormGroup>
                        
                        <FormGroup>
                          <Label for="message">Message</Label>
                          <Input
                            type="textarea"
                            id="message"
                            rows="4"
                            placeholder="Type your message here..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                          />
                        </FormGroup>
                        
                        <Button 
                          color="primary" 
                          type="submit" 
                          disabled={loading}
                          className="px-4"
                        >
                          {loading ? <Spinner size="sm" /> : 'Send Message'}
                        </Button>
                      </Form>
                    </TabPane>
                    
                    <TabPane tabId="2">
                      <h5>Recent Messages</h5>
                      {sentMessages.length > 0 ? (
                        <Table responsive hover>
                          <thead>
                            <tr>
                              <th>Phone Number</th>
                              <th>Message</th>
                              <th>Time</th>
                            </tr>
                          </thead>
                          <tbody>
                            {sentMessages.map(msg => (
                              <tr key={msg.id}>
                                <td>{msg.number}</td>
                                <td>{msg.message}</td>
                                <td>{msg.timestamp}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      ) : (
                        <Alert color="info">
                          No messages have been sent yet.
                        </Alert>
                      )}
                    </TabPane>
                    
                    <TabPane tabId="3">
                      <div className="text-center py-3">
                        <h5>Connection Settings</h5>
                        <p className="text-muted">
                          Your WhatsApp Web session is currently active. You can disconnect at any time.
                        </p>
                        <Button 
                          color="danger" 
                          onClick={disconnectWhatsApp}
                          disabled={loading}
                          className="mt-3"
                        >
                          {loading ? <Spinner size="sm" /> : 'Disconnect WhatsApp'}
                        </Button>
                      </div>
                    </TabPane>
                  </TabContent>
                </div>
              )}
            </CardBody>
            
            <CardFooter className="text-muted">
              <small>WhatsApp and WhatsApp Web are registered trademarks of Meta Platforms, Inc.</small>
            </CardFooter>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default WhatsappWeb;