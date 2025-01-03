import React, { useState, useEffect } from "react";
import { Button, Card, CardBody, CardTitle, CardText, Row, Col, Spinner } from "reactstrap";
import Header from "components/Headers/Header.js";
import axios from "axios";
import { COMPANY_API_ENDPOINT } from "Api/Constant";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";



const Dashboard = () => {
  const [whatsappAccounts, setWhatsappAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("");
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

  const handleOpenWhatsApp = async (companyId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in first.");
        navigate('/auth/login');
        return;
      }
  
      // Check if configuration exists for this company
      const response = await axios.post(
        // `${COMPANY_API_ENDPOINT}/configuration/check-configuration`,
        // `https://codozap-e04e12b02929.herokuapp.com/api/v1/configuration/check-configuration`,
        `http://192.168.0.109:25483/api/v1/configuration/check-configuration`,
        { companyId },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
  
      if (response.data.success) {
        if (response.data.data) {
          // Configuration exists, redirect to chat
          navigate('/admin/chats', { 
            state: { 
              whatsAppView: true,
              companyId: companyId,
              config: response.data.data
            } 
          });
          toast.success("Opening WhatsApp chat...");
        } else {
          // No configuration, redirect to settings
          navigate('/admin/settings', {
            state: {
              companyId: companyId
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

  // Function to format date in a readable way
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      {/* <Header /> */}
      
      {/* Welcome Message */}
      <div className="dashboard-header">
        <h1 className="display-4 text-center my-4" style={{ fontWeight: "bold", color: "#343a40" }}>
          Welcome Back, {userName || "User"}
        </h1>

        <h2 className="text-center text-muted my-4" style={{ fontWeight: "lighter", fontSize: "36px" }}>
          WhatsApp Business Accounts
        </h2>
      </div>

      {/* Error Message */}
      {error && (
        <div className="alert alert-danger text-center mx-4">
          {error}
        </div>
      )}

      {/* Loading Spinner */}
      {loading && (
        <div className="text-center my-4">
          <Spinner color="primary" /> 
          <p className="mt-2" style={{ color: "#6c757d" }}>Loading accounts...</p>
        </div>
      )}

      {/* WhatsApp Accounts Grid */}
      <div className="px-4">
        <Row>
          {whatsappAccounts.length > 0 ? (
            whatsappAccounts.map((account) => (
              <Col lg="4" md="6" sm="12" key={account._id} className="mb-4">
                <Card 
                  className="shadow-lg h-100" 
                  style={{
                    borderRadius: "15px",
                    transition: "transform 0.2s",
                    cursor: "pointer"
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
                  onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
                >
                  <CardBody className="d-flex flex-column">
                    {/* Company Name */}
                    <CardTitle tag="h5" className="mb-3" style={{ fontWeight: "bold", color: "#2c3e50" }}>
                      {account.name}
                    </CardTitle>

                    {/* Status Badge */}
                    <div className="mb-3">
                      <span 
                        className={`badge ${account.status === "active" ? "bg-success" : "bg-danger"}`}
                        style={{ fontSize: "0.8rem", padding: "5px 10px" }}
                      >
                        {account.status.toUpperCase()}
                      </span>
                    </div>

                    {/* Description */}
                    <CardText className="text-muted mb-3" style={{ flex: 1 }}>
                      {account.description || "No description available"}
                    </CardText>

                    {/* Creation Date */}
                    <CardText className="text-muted mb-3" style={{ fontSize: '0.8rem' }}>
                      <i className="fas fa-calendar-alt mr-2"></i>
                      Created: {formatDate(account.createdAt)}
                    </CardText>

                    {/* Action Button */}
                    <div className="mt-auto">
                      <Button
                        onClick={() => handleOpenWhatsApp(account._id)}
                        color="success"
                        className="w-100"
                        style={{
                          borderRadius: "8px",
                          fontWeight: "500",
                          padding: "10px",
                          backgroundColor: "#25D366",
                          border: "none"
                        }}
                      >
                        <i className="fab fa-whatsapp mr-2"></i>
                        Open WhatsApp
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            ))
          ) : (
            !loading && (
              <Col xs="12">
                <div className="text-center py-5" style={{ color: "#6c757d" }}>
                  <i className="fas fa-inbox fa-3x mb-3"></i>
                  <h4>No WhatsApp accounts found</h4>
                  <p>No business accounts are currently available.</p>
                </div>
              </Col>
            )
          )}
        </Row>
      </div>

      {/* Additional Styles */}
      <style jsx>{`
        .dashboard-header {
          padding: 2rem 0;
          background: linear-gradient(to right, #f8f9fa, #e9ecef);
          margin-bottom: 2rem;
        }
        
        .card:hover {
          box-shadow: 0 8px 16px rgba(0,0,0,0.1);
        }

        .badge {
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
      `}</style>
    </>
  );
};

export default Dashboard;