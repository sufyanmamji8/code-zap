// import React, { useState, useEffect } from "react";
// import { Button, Card, CardBody, CardTitle, CardText, Row, Col, Spinner } from "reactstrap";
// import Header from "components/Headers/Header.js";
// import axios from "axios";
// import { COMPANY_API_ENDPOINT } from "Api/Constant";
// import { useNavigate } from "react-router-dom";
// import { toast } from "sonner";

// const Dashboard = () => {
//   const [whatsappAccounts, setWhatsappAccounts] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

 

//   const fetchWhatsappAccounts = async () => {
//     setLoading(true);
//     setError(""); // Reset error initially
  
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         setError("No token found. Please log in again.");
//         return;
//       }
  
//       const res = await axios.get(`${COMPANY_API_ENDPOINT}/getAllCompanies`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
  
//       if (res.data.success) {
//         if (res.data.data && Array.isArray(res.data.data)) {
//           if (res.data.data.length === 0) {
//             setError(""); // Clear error if no accounts found
//           } else {
//             setWhatsappAccounts(res.data.data);
//           }
//         } else {
//         }
//       } else {
//         setError("Unexpected response status: " + res.status);
//       }
//     } catch (error) {
//       // Handle network errors (e.g., no response from server or request issues)
//       if (error.response) {
//         // Check if the error is a 404 or any other specific status code
//         if (error.response.status === 404) {
//           setError("No WhatsApp accounts found.");
//         } else {
//           setError("Error fetching WhatsApp accounts: " + error.response.data.message);
//         }
//       } else if (error.request) {
//         setError("No response from server.");
//       } else {
//         setError("An error occurred: " + error.message);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };
  

//   useEffect(() => {
//     fetchWhatsappAccounts();
//   }, []);

//   const handleOpenWhatsApp = () => {
//     // Navigate to the same route but with state indicating WhatsApp view
//     toast.success("Successfully login!"); 
//     navigate('/admin/dashboard', { 
//       state: { 
//         whatsAppView: true // This will trigger the sidebar to show WhatsApp options
//       } 
//     });
//   };

//   return (
//     <>
//       <Header />
//       <h1 className="display-4 text-center my-4" style={{ fontWeight: "bold", color: "#343a40" }}>
//         Welcome Back, Free Waba
//       </h1>

//       <h2 className="text-center text-muted my-4" style={{ fontWeight: "lighter", fontSize: "36px" }}>
//         WhatsApp Accounts
//       </h2>

      

//       {/* Error Message */}
//       {error && <div className="alert alert-danger text-center">{error}</div>}

//       {/* Loading Indicator */}
//       {loading && (
//         <div style={{ textAlign: 'center', fontSize: "18px", color: "#17a2b8" }}>
//           <Spinner animation="border" size="sm" /> Loading...
//         </div>
//       )}

//       {/* Modified WhatsApp Accounts Cards */}
//       <Row className="mx-auto">
//         {whatsappAccounts.length > 0 ? (
//           whatsappAccounts.map((account) => (
//             <Col lg="4" md="6" sm="12" key={account._id} className="mb-4">
//               <Card 
//                 className="shadow-lg" 
//                 style={{
//                   borderRadius: "10px", 
//                   transition: "transform 0.3s ease", 
//                   overflow: "hidden", 
//                   height: "300px",
//                   display: "flex", 
//                   flexDirection: "column", 
//                   justifyContent: "space-between"
//                 }}
//               >
//                 <CardBody>
//                   <CardTitle tag="h5" style={{ fontWeight: "bold", color: "#343a40" }}>
//                     Name: {account.name}
//                   </CardTitle>
//                   <CardText style={{ color: "#6c757d", fontStyle: "italic", fontSize: '12px' }}>
//                     Created At: {new Date(account.createdAt).toLocaleString()}
//                   </CardText>
//                   <CardText style={{ color: "#6c757d" }}>
//                     Description: {account.description || "No description available"}
//                   </CardText>
//                   <CardText style={{ fontWeight: "bold", color: account.status === "active" ? "#28a745" : "#dc3545" }}>
//                     Status: {account.status}
//                   </CardText>
//                 </CardBody>

//                 {/* Modified Open WhatsApp Button */}
//                 <Button
//                   onClick={handleOpenWhatsApp}
//                   color="success"
//                   style={{
//                     position: "absolute", 
//                     bottom: "10px", 
//                     right: "10px", 
//                     fontSize: "12px", 
//                     padding: "5px 10px", 
//                     backgroundColor: "#81c784", 
//                     color: "white", 
//                     fontWeight: "bold", 
//                     borderRadius: "5px", 
//                     boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
//                   }}
//                 >
//                   Open WhatsApp
//                 </Button>
//               </Card>
//             </Col>
//           ))
//         ) : (
//           <div style={{ textAlign: 'center', width: '100%', color: "#6c757d" }}>
//             No WhatsApp accounts found.
//           </div>
//         )}
//       </Row>

     
//     </>
//   );
// };

// export default Dashboard;








// NEW CODE:


import React, { useState, useEffect } from "react";
import { Button, Card, CardBody, CardTitle, CardText, Row, Col, Spinner } from "reactstrap";
import Header from "components/Headers/Header.js";
import axios from "axios";
import { COMPANY_API_ENDPOINT } from "Api/Constant";
import { FaPlus } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Dashboard = () => {
  const [whatsappAccounts, setWhatsappAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isWhatsAppView, setIsWhatsAppView] = useState(false); // State for WhatsApp view
  const navigate = useNavigate();

  useEffect(() => {
    const phoneId = localStorage.getItem('phoneNumberId');
    const accountId = localStorage.getItem('whatsappBusinessAccountId');
    const token = localStorage.getItem('token'); // User-specific token
  
    if (!token) {
      console.error("User is not logged in.");
      return;
    }
  
    // Save the configuration status using token
    const isConfigured = phoneId && accountId ? 'true' : 'false';
    localStorage.setItem(`${token}_isConfigured`, isConfigured);
  
    // Update WhatsApp view based on configuration
    const whatsappView = localStorage.getItem(`${token}_isWhatsAppView`);
    setIsWhatsAppView(whatsappView === 'true');
  
    // If user is not in WhatsApp view, redirect to dashboard or default route
    if (!whatsappView) {
      navigate('/admin/dashboard'); // or whichever default route you want to set
    }
  }, [navigate]);

  const fetchWhatsappAccounts = async () => {
    setLoading(true);
    setError(""); // Reset error initially
  
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
          if (res.data.data.length === 0) {
            setError(""); // Clear error if no accounts found
          } else {
            setWhatsappAccounts(res.data.data);
          }
        }
      } else {
        setError("Unexpected response status: " + res.status);
      }
    } catch (error) {
      // Handle network errors (e.g., no response from server or request issues)
      if (error.response) {
        if (error.response.status === 404) {
          setError("No WhatsApp accounts found.");
        } else {
          setError("Error fetching WhatsApp accounts: " + error.response.data.message);
        }
      } else if (error.request) {
        setError("No response from server.");
      } else {
        setError("An error occurred: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWhatsappAccounts();
  }, []);

  const handleOpenWhatsApp = () => {
    const token = localStorage.getItem("token");
    const phoneId = sessionStorage.getItem("phoneId");
    const accountId = sessionStorage.getItem("accountId");
  
    if (!token) {
      toast.error("Please log in first.");
      navigate('/login');
      return;
    }
  
    if (!phoneId || !accountId) {
      toast.error("Please complete your WhatsApp configuration first.");
      navigate('/admin/settings');
      return;
    }
  
    // Update WhatsApp view state globally or locally
    setIsWhatsAppView(true);
    localStorage.setItem(`${token}_isWhatsAppView`, 'true'); // Save to persist between reloads
    toast.success("Configuration verified! Opening WhatsApp...");
    navigate('/admin/chats'); // Redirect to WhatsApp chats
  };
  

  return (
    <>
      <Header />
      <h1 className="display-4 text-center my-4" style={{ fontWeight: "bold", color: "#343a40" }}>
        Welcome Back, Free Waba
      </h1>

      <h2 className="text-center text-muted my-4" style={{ fontWeight: "lighter", fontSize: "36px" }}>
        WhatsApp Accounts
      </h2>

      {/* Error Message */}
      {error && <div className="alert alert-danger text-center">{error}</div>}

      {/* Loading Indicator */}
      {loading && (
        <div style={{ textAlign: 'center', fontSize: "18px", color: "#17a2b8" }}>
          <Spinner animation="border" size="sm" /> Loading...
        </div>
      )}

      {/* Modified WhatsApp Accounts Cards */}
      <Row className="mx-auto">
        {whatsappAccounts.length > 0 ? (
          whatsappAccounts.map((account) => (
            <Col lg="4" md="6" sm="12" key={account._id} className="mb-4">
              <Card 
                className="shadow-lg" 
                style={{
                  borderRadius: "10px", 
                  transition: "transform 0.3s ease", 
                  overflow: "hidden", 
                  height: "300px",
                  display: "flex", 
                  flexDirection: "column", 
                  justifyContent: "space-between"
                }}
              >
                <CardBody>
                  <CardTitle tag="h5" style={{ fontWeight: "bold", color: "#343a40" }}>
                    Name: {account.name}
                  </CardTitle>
                  <CardText style={{ color: "#6c757d", fontStyle: "italic", fontSize: '12px' }}>
                    Created At: {new Date(account.createdAt).toLocaleString()}
                  </CardText>
                  <CardText style={{ color: "#6c757d" }}>
                    Description: {account.description || "No description available"}
                  </CardText>
                  <CardText style={{ fontWeight: "bold", color: account.status === "active" ? "#28a745" : "#dc3545" }}>
                    Status: {account.status}
                  </CardText>
                </CardBody>

                {/* Modified Open WhatsApp Button */}
                <Button
                  onClick={handleOpenWhatsApp}
                  color="success"
                  style={{
                    position: "absolute", 
                    bottom: "10px", 
                    right: "10px", 
                    fontSize: "12px", 
                    padding: "5px 10px", 
                    backgroundColor: "#81c784", 
                    color: "white", 
                    fontWeight: "bold", 
                    borderRadius: "5px", 
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  Open WhatsApp
                </Button>
              </Card>
            </Col>
          ))
        ) : (
          <div style={{ textAlign: 'center', width: '100%', color: "#6c757d" }}>
            No WhatsApp accounts found.
          </div>
        )}
      </Row>
    </>
  );
};

export default Dashboard;
