// import React, { useState, useEffect } from "react";
// import { Button, Card, CardBody, CardTitle, CardText, Row, Col } from "reactstrap";
// import { DotLottieReact } from '@lottiefiles/dotlottie-react';
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { toast } from "sonner";
// import { COMPANY_API_ENDPOINT } from "Api/Constant";

// const Dashboard = () => {
//   const [whatsappAccounts, setWhatsappAccounts] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [userName, setUserName] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     const fullName = localStorage.getItem("fullName");

//     if (!token) {
//       console.error("User is not logged in.");
//       navigate("/auth/login");
//       return;
//     }

//     if (fullName) {
//       setUserName(fullName);
//     } else {
//       toast.error("User not logged in.");
//       navigate("/auth/login");
//     }
//   }, [navigate]);

//   const fetchWhatsappAccounts = async () => {
//     setLoading(true);
//     setError("");
  
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         setError("No token found. Please log in again.");
//         navigate('/auth/login');
//         return;
//       }
  
//       const res = await axios.get(`${COMPANY_API_ENDPOINT}/getAllCompanies`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
  
//       if (res.data.success) {
//         if (res.data.data && Array.isArray(res.data.data)) {
//           setWhatsappAccounts(res.data.data);
//           if (res.data.data.length === 0) {
//             setError("No WhatsApp accounts available.");
//           }
//         }
//       } else {
//         setError("Failed to fetch WhatsApp accounts.");
//       }
//     } catch (error) {
//       console.error("Error fetching accounts:", error);
//       if (error.response?.status === 401) {
//         toast.error("Session expired. Please login again.");
//         navigate('/auth/login');
//       } else {
//         setError(error.response?.data?.message || "Failed to fetch WhatsApp accounts.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchWhatsappAccounts();
//   }, []);

//   const handleOpenWhatsApp = async (companyId) => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         toast.error("Please log in first.");
//         navigate('/auth/login');
//         return;
//       }
  
//       // Check if configuration exists for this company
//       const response = await axios.post(
//         // `${COMPANY_API_ENDPOINT}/configuration/check-configuration`,
//         // `https://codozap-e04e12b02929.herokuapp.com/api/v1/configuration/check-configuration`,
//         `http://192.168.0.103:25483/api/v1/configuration/check-configuration`,
//         { companyId },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         }
//       );
  
//       if (response.data.success) {
//         if (response.data.data) {
//           // Configuration exists, redirect to chat
//           navigate('/admin/chats', { 
//             state: { 
//               whatsAppView: true,
//               companyId: companyId,
//               config: response.data.data
//             } 
//           });
//           toast.success("Opening WhatsApp chat...");
//         } else {
//           // No configuration, redirect to settings
//           navigate('/admin/settings', {
//             state: {
//               companyId: companyId
//             }
//           });
//           toast.info("Please complete WhatsApp configuration first.");
//         }
//       }
//     } catch (error) {
//       console.error('Error checking configuration:', error);
//       if (error.response?.status === 401) {
//         toast.error("Session expired. Please login again.");
//         navigate('/auth/login');
//       } else {
//         toast.error('Failed to verify configuration. Please try again.');
//       }
//     }
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   return (
//     <>
//       {/* Welcome Message */}
//       <div className="dashboard-header">
//         <h1 className="display-4 text-center my-4" style={{ fontWeight: "bold", color: "#343a40" }}>
//           Welcome Back, {userName || "User"}
//         </h1>

//         <h2 className="text-center text-muted my-4" style={{ fontWeight: "lighter", fontSize: "36px" }}>
//           WhatsApp Business Accounts
//         </h2>
//       </div>

//       {/* Error Message */}
//       {error && (
//         <div className="alert alert-danger text-center mx-4">
//           {error}
//         </div>
//       )}

//       {/* Lottie Loader */}
//       {loading ? (
//         <div className="loader-container">
//           <DotLottieReact
//             src="https://lottie.host/9b89015f-9958-43d9-a7c5-39fe7e494a08/eADyK0IzIX.lottie"
//             loop
//             autoplay
//             style={{ width: '200px', height: '200px' }}
//           />
//           <p className="loading-text">Loading your accounts...</p>
//         </div>
//       ) : (
//         /* WhatsApp Accounts Grid */
//         <div className="px-4">
//           <Row>
//             {whatsappAccounts.length > 0 ? (
//               whatsappAccounts.map((account) => (
//                 <Col lg="4" md="6" sm="12" key={account._id} className="mb-4">
//                   <Card 
//                     className="shadow-lg h-100" 
//                     style={{
//                       borderRadius: "15px",
//                       transition: "transform 0.2s",
//                       cursor: "pointer"
//                     }}
//                     onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
//                     onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
//                   >
//                     <CardBody className="d-flex flex-column">
//                       <CardTitle tag="h5" className="mb-3" style={{ fontWeight: "bold", color: "#2c3e50" }}>
//                         {account.name}
//                       </CardTitle>
//                       <div className="mb-3">
//                         <span 
//                           className={`badge ${account.status === "active" ? "bg-success" : "bg-danger"}`}
//                           style={{ fontSize: "0.8rem", padding: "5px 10px" }}
//                         >
//                           {account.status.toUpperCase()}
//                         </span>
//                       </div>
//                       <CardText className="text-muted mb-3" style={{ flex: 1 }}>
//                         {account.description || "No description available"}
//                       </CardText>
//                       <CardText className="text-muted mb-3" style={{ fontSize: '0.8rem' }}>
//                         <i className="fas fa-calendar-alt mr-2"></i>
//                         Created: {formatDate(account.createdAt)}
//                       </CardText>
//                       <div className="mt-auto">
//                         <Button
//                           onClick={() => handleOpenWhatsApp(account._id)}
//                           color="success"
//                           className="w-100"
//                           style={{
//                             borderRadius: "8px",
//                             fontWeight: "500",
//                             padding: "10px",
//                             backgroundColor: "#25D366",
//                             border: "none"
//                           }}
//                         >
//                           <i className="fab fa-whatsapp mr-2"></i>
//                           Open WhatsApp
//                         </Button>
//                       </div>
//                     </CardBody>
//                   </Card>
//                 </Col>
//               ))
//             ) : (
//               <Col xs="12">
//                 <div className="text-center py-5" style={{ color: "#6c757d" }}>
//                   <i className="fas fa-inbox fa-3x mb-3"></i>
//                   <h4>No WhatsApp accounts found</h4>
//                   <p>No business accounts are currently available.</p>
//                 </div>
//               </Col>
//             )}
//           </Row>
//         </div>
//       )}

//       {/* Styles */}
//       <style jsx>{`
//         .dashboard-header {
//           padding: 2rem 0;
//           background: linear-gradient(to right, #f8f9fa, #e9ecef);
//           margin-bottom: 2rem;
//         }
        
//         .card:hover {
//           box-shadow: 0 8px 16px rgba(0,0,0,0.1);
//         }

//         .badge {
//           text-transform: uppercase;
//           letter-spacing: 0.5px;
//         }

//         .loader-container {
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           justify-content: center;
//           min-height: 400px;
//           width: 100%;
//         }

//         .loading-text {
//           margin-top: 1rem;
//           color: #6c757d;
//           font-size: 1.2rem;
//           font-weight: 500;
//         }
//       `}</style>
//     </>
//   );
// };

// export default Dashboard;










import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  CardText,
  Row,
  Col,
  Container,
  Badge,
  Spinner
} from "reactstrap";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
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
        `http://192.168.0.103:25483/api/v1/configuration/check-configuration`,
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
      `http://192.168.0.103:25483/api/v1/configuration/check-configuration`,
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
      className="px-3 py-2 text-uppercase fw-bold"
      style={{ fontSize: "0.7rem", letterSpacing: "0.05em" }}
    >
      {status}
    </Badge>
  );

  const AccountCard = ({ account }) => (
    <Card className="h-100 border-0 account-card">
      <CardBody className="d-flex flex-column">
        {/* Title and Status */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <CardTitle tag="h5" className="mb-0 fw-bold text-primary">
            {account.name}
          </CardTitle>
          <StatusBadge status={account.status} />
        </div>
  
        {/* Description */}
        <CardText className="text-muted flex-grow-1">
          {account.description || "No description available"}
        </CardText>
  
        {/* Meta Info */}
        <div className="meta-info mb-3">
          <small className="text-muted d-flex align-items-center">
            <i className="fas fa-calendar-alt me-2"></i>
            Created: {formatDate(account.createdAt)}
          </small>
        </div>
  
        {/* Buttons */}
        <div className="button-group d-flex flex-column">
          <Button
            onClick={() => handleOpenWhatsApp(account._id, account.name)}
            className="whatsapp-btn mb-2"
          >
            <i className="fab fa-whatsapp me-2"></i>
            Open WhatsApp
          </Button>
  
          {accountConfigs[account._id] && (
            <Button
              onClick={() => handleEditConfiguration(account._id)}
              className="config-btn"
            >
              <i className="fas fa-cog me-2"></i>
              Edit Config
            </Button>
          )}
        </div>
      </CardBody>
    </Card>
  );
  

  const EmptyState = () => (
    <div className="text-center py-5 empty-state">
      <i className="fas fa-inbox fa-3x mb-3 text-muted"></i>
      <h4 className="text-muted">No WhatsApp Accounts Found</h4>
      <p className="text-muted mb-0">No business accounts are currently available.</p>
    </div>
  );

  return (
    <Container fluid className="px-4 dashboard-container">
      <div className="dashboard-header text-center py-4 mb-4">
        <h1 className="display-4 fw-bold text-gradient mb-3">
          Welcome Back, {userName || "User"}
        </h1>
        <h2 className="h3 text-muted fw-light">
          WhatsApp Business Accounts
        </h2>
      </div>

      {error && (
        <div className="alert alert-danger text-center mx-auto mb-4" style={{ maxWidth: "800px" }}>
          {error}
        </div>
      )}

      {loading ? (
        <div className="d-flex flex-column align-items-center justify-content-center py-5">
          <DotLottieReact
            src="https://lottie.host/9b89015f-9958-43d9-a7c5-39fe7e494a08/eADyK0IzIX.lottie"
            loop
            autoplay
            style={{ width: '150px', height: '150px' }}
          />
          <p className="text-muted mt-3 h5">Loading your accounts...</p>
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
          }

          .text-gradient {
            background: linear-gradient(45deg, #1a73e8, #34a853);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }

          .dashboard-header {
            background: linear-gradient(to right, #f8f9fa, #e9ecef);
            border-radius: 1rem;
            margin: 1rem 0;
          }

          .account-card {
  border-radius: 1rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.account-card:hover {
  transform: scale(1.02);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

/* Buttons Styling */
.whatsapp-btn {
  background-color: #25D366;
  border: none;
  color: #fff;
  font-weight: 600;
  border-radius: 0.5rem;
  padding: 0.8rem;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.whatsapp-btn:hover {
  background-color:rgb(255, 255, 255);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.config-btn {
  background-color: #1a73e8;
  border: none;
  color: #fff;
  font-weight: 600;
  border-radius: 0.5rem;
  padding: 0.8rem;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.config-btn:hover {
  background-color:rgb(255, 255, 255);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

/* Add Gap for Mobile View */
@media (max-width: 576px) {
  .row.g-4 > * {
    margin-bottom: 1rem; /* Add gap between cards */
  }
}

        `}
      </style>
    </Container>
  );
};

export default Dashboard;