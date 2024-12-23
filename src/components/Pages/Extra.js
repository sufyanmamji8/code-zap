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
          }
          .message-container {
            max-width: 85%;
          }
          .chat-messages {
            height: calc(100vh - 170px) !important;
          }
        }
      `}</style>
    </div>
  );
}