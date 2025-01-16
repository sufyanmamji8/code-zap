import React, { useState, useEffect } from "react";
import { Button, Card, CardBody, CardTitle, CardText, Row, Col, Container, Badge } from "reactstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { COMPANY_API_ENDPOINT } from "Api/Constant";

const Dashboard = () => {
  const [whatsappAccounts, setWhatsappAccounts] = useState([]);
  const [accountConfigs, setAccountConfigs] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("");
  const [selectedCard, setSelectedCard] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const fullName = localStorage.getItem("fullName");

    if (!token) {
      console.error("User is not logged in.");
      navigate("/auth/login");
      return;
    }

    if (fullName) {
      setUserName(fullName);
    } else {
      toast.error("User not logged in.");
      navigate("/auth/login");
    }
  }, [navigate]);

  // Check configuration status for a single account
  const checkConfiguration = async (companyId, token) => {
    try {
      const response = await axios.post(
        `http://192.168.0.108:25483/api/v1/configuration/check-configuration`,
        { companyId },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data.success && response.data.data;
    } catch (error) {
      console.error(`Error checking configuration for company ${companyId}:`, error);
      return false;
    }
  };

  const fetchWhatsappAccounts = async () => {
    setLoading(true);
    setError("");
  
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError("No token found. Please log in again.");
        navigate('/auth/login');
        return;
      }
  
      const res = await axios.get(`${COMPANY_API_ENDPOINT}/getAllCompanies`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (res.data.success) {
        if (res.data.data && Array.isArray(res.data.data)) {
          setWhatsappAccounts(res.data.data);
          
          // Check configuration status for all accounts
          const configs = {};
          for (const account of res.data.data) {
            configs[account._id] = await checkConfiguration(account._id, token);
          }
          setAccountConfigs(configs);
          
          if (res.data.data.length === 0) {
            setError("No WhatsApp accounts available.");
          }
        }
      } else {
        setError("Failed to fetch WhatsApp accounts.");
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        navigate('/auth/login');
      } else {
        setError(error.response?.data?.message || "Failed to fetch WhatsApp accounts.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWhatsappAccounts();
  }, []);

const handleOpenWhatsApp = async (companyId, companyName) => {
  console.log('Received values:', { companyId, companyName });// Add companyName parameter
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in first.");
      navigate('/auth/login');
      return;
    }

    const response = await axios.post(
      `http://192.168.0.108:25483/api/v1/configuration/check-configuration`,
      { companyId},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (response.data.success) {
      // Store both companyId and companyName in localStorage
      localStorage.setItem("selectedCompanyId", companyId);
      localStorage.setItem("selectedCompanyName", companyName);

      if (response.data.data) {
        const currentPath = window.location.pathname;
        
        if (currentPath.includes('/admin/templates')) {
          navigate('/admin/templates', { 
            state: { 
              companyId: companyId,
              companyName: companyName  // Add company name to state
            } 
          });
          toast.success("Loading templates...");
        } else {
          navigate('/admin/chats', { 
            state: { 
              whatsAppView: true,
              companyId: companyId,
              companyName: companyName,  // Add company name to state
              config: response.data.data
            } 
          });
          toast.success("Opening WhatsApp chat...");
        }
      } else {
        navigate('/admin/settings', {
          state: {
            companyId: companyId,
            companyName: companyName  // Add company name to state
          }
        });
        toast.info("Please complete WhatsApp configuration first.");
      }
    }
  } catch (error) {
    console.error('Error checking configuration:', error);
    if (error.response?.status === 401) {
      toast.error("Session expired. Please login again.");
      navigate('/auth/login');
    } else {
      toast.error('Failed to verify configuration. Please try again.');
    }
  }
};
  

  const handleEditConfiguration = (companyId) => {
    navigate('/admin/settings', {
      state: {
        companyId: companyId
      }
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const StatusBadge = ({ status }) => (
    <Badge
      color={status === "active" ? "success" : "danger"}
      className="status-badge px-3 py-2 text-uppercase fw-bold"
    >
      {status === "active" ? "🟢 Active" : "🔴 Inactive"}
    </Badge>
  );

  const AccountCard = ({ account }) => (
    <Card 
      className={`fun-card h-100 border-0 ${selectedCard === account._id ? 'selected' : ''}`}
      onClick={() => setSelectedCard(account._id)}
    >
      <CardBody className="d-flex flex-column position-relative">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <CardTitle tag="h5" className="mb-0 fw-bold text-primary">
            {account.name}
          </CardTitle>
          <StatusBadge status={account.status} />
        </div>

        <CardText className="text-muted flex-grow-1">
          {account.description || "No description available"}
        </CardText>

        <div className="meta-info mb-3">
          <small className="text-muted d-flex align-items-center">
            <span className="me-2" role="img" aria-label="calendar">📅</span>
            Created: {formatDate(account.createdAt)}
          </small>
        </div>

        <div className="button-group d-flex gap-2">
          <Button
            onClick={() => handleOpenWhatsApp(account._id, account.name)}
            className="fun-button whatsapp-btn flex-grow-1"
          >
            Open WhatsApp
          </Button>

          {accountConfigs[account._id] && (
            <Button
              onClick={() => handleEditConfiguration(account._id)}
              className="fun-button config-btn flex-grow-1"
            >
              Edit Config
            </Button>
          )}
        </div>
      </CardBody>
    </Card>
  );

  const EmptyState = () => (
    <div className="empty-state text-center py-5">
      <div className="empty-animation mb-4">
        <span role="img" aria-label="empty" className="empty-emoji">📱</span>
        <span role="img" aria-label="empty" className="empty-emoji">💭</span>
        <span role="img" aria-label="empty" className="empty-emoji">❓</span>
      </div>
      <h4 className="text-primary">No WhatsApp Accounts Yet!</h4>
      <p className="text-muted">Time to add your first business account!</p>
    </div>
  );

  return (
    <Container fluid className="dashboard-container px-4">
      <div className="fun-header text-center py-4 mb-4">
        <h1 className="display-4 fw-bold fun-gradient mb-3">
          Welcome Back, {userName || "Friend"}
        </h1>
        <h2 className="h3 text-muted fw-light">
          Your WhatsApp Business Hub
          <span role="img" aria-label="rocket" className="ms-2">🚀</span>
        </h2>
      </div>

      {error && (
        <div className="fun-alert alert mx-auto mb-4">
          <span role="img" aria-label="warning" className="me-2">⚠️</span>
          {error}
        </div>
      )}

      {loading ? (
        <div className="loading-state text-center py-5">
          <div className="loading-emoji">
            <span role="img" aria-label="loading" className="loading-bounce">⏳</span>
          </div>
          <p className="text-muted mt-3 h5">Loading your  Whatsapp accounts...</p>
        </div>
      ) : (
        <Row className="g-4">
          {whatsappAccounts.length > 0 ? (
            whatsappAccounts.map((account) => (
              <Col key={account._id} lg={4} md={6} sm={12}>
                <AccountCard account={account} />
              </Col>
            ))
          ) : (
            <Col xs={12}>
              <EmptyState />
            </Col>
          )}
        </Row>
      )}

      <style>
        {`
          .dashboard-container {
            max-width: 1400px;
            margin: 0 auto;
            background: linear-gradient(135deg, #f5f7fa 0%, #e4e7eb 100%);
            min-height: 100vh;
            padding-top: 2rem;
          }

          .fun-gradient {
            background: linear-gradient(45deg, #25D366, #128C7E);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }

          .fun-header {
            background: white;
            border-radius: 2rem;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            position: relative;
            overflow: hidden;
          }

          .fun-card {
            border-radius: 1rem;
            background: white;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
            cursor: pointer;
            position: relative;
            overflow: hidden;
          }

          .fun-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
          }

          .fun-card.selected {
            border: 3px solid #25D366;
            transform: translateY(-8px);
          }

          .fun-button {
    border-radius: 0.5rem;
    font-weight: 600;
    font-size: 12px;
    padding: 0.60rem;
    transition: all 0.3s ease;
    border: none;
    text-align: center;
    display: inline-flex
;
    align-items: center;
    justify-content: center;
}

          .whatsapp-btn {
            background: #25D366;
            color: white;
          }

          .config-btn {
            background: #128C7E;
            color: white;
          }

          .fun-button:hover {
            transform: scale(1.02);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          }

          .status-badge {
            border-radius: 1rem;
            font-size: 0.7rem;
            letter-spacing: 0.05em;
          }

          .empty-state {
            background: white;
            border-radius: 2rem;
            padding: 3rem;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          }

          .empty-animation {
            font-size: 2.5rem;
          }

          .empty-emoji {
            margin: 0 0.5rem;
            display: inline-block;
            animation: float 3s ease-in-out infinite;
          }

          .loading-emoji {
            font-size: 3rem;
          }

          .loading-bounce {
            display: inline-block;
            animation: bounce 1s infinite;
          }

          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
          }

          .fun-alert {
            background: #FFE5E5;
            color: #FF4444;
            border-radius: 1rem;
            border: none;
            max-width: 800px;
          }

          /* Mobile Specific Styles */
          @media (max-width: 768px) {
            .row.g-4 {
              margin: 0;  /* Reset margin */
              padding: 1rem;  /* Add padding */
            }
            
            .row.g-4 > [class*='col-'] {
              padding: 0.75rem;  /* Add spacing between cards */
            }

            .fun-card {
              margin-bottom: 1rem;  /* Add bottom margin to cards */
            }

            .button-group {
              flex-direction: column;  /* Stack buttons on mobile */
              gap: 0.5rem;  /* Add gap between stacked buttons */
            }

            .fun-button {
              width: 100%;  /* Full width buttons on mobile */
            }
          }
        `}
      </style>
    </Container>
  );
};

export default Dashboard;