
// import React, { useState, useEffect } from "react";
// import { 
//   Button, 
//   Card, 
//   CardBody, 
//   CardTitle, 
//   CardText, 
//   Row, 
//   Col, 
//   Spinner,
//   Modal,
//   ModalHeader,
//   ModalBody,
//   ModalFooter
// } from "reactstrap";
// import Header from "components/Headers/Header.js";
// import axios from "axios";
// import { COMPANY_API_ENDPOINT } from "Api/Constant";
// import { useNavigate } from "react-router-dom";
// import { toast } from "sonner";

// const WhatsAppAccountList = () => {
//   const [whatsappAccounts, setWhatsappAccounts] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [deleteModal, setDeleteModal] = useState(false);
//   const [companyToDelete, setCompanyToDelete] = useState(null);
//   const navigate = useNavigate();

//   // Fetch WhatsApp Accounts
//   const fetchWhatsappAccounts = async () => {
//     setLoading(true);
//     setError("");

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

//       if (res.status === 200) {
//         if (res.data && res.data.success && Array.isArray(res.data.data)) {
//           setWhatsappAccounts(res.data.data);
//         } else {
//           navigate("/admin/dashboard")
//         }
//       } else {
//         setError("Unexpected response status: " + res.status);
//       }
//     } catch (error) {
//       if (error.response) {
//         setError("Error fetching WhatsApp accounts: " + error.response.data.message);
//       } else if (error.request) {
//         setError("No response from server.");
//       } else {
//         setError("An error occurred: " + error.message);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle Edit
//   const handleEdit = (id) => {
//     console.log("edit button clicked with id:", id);
//     navigate(`/admin/getCompanyById/${id}`);
//   };

//   // Open Delete Confirmation Modal
//   const openDeleteModal = (company) => {
//     setCompanyToDelete(company);
//     setDeleteModal(true);
//   };

//   // Close Delete Confirmation Modal
//   const closeDeleteModal = () => {
//     setCompanyToDelete(null);
//     setDeleteModal(false);
//   };

//   // Handle Delete
//   const handleDelete = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.delete(`${COMPANY_API_ENDPOINT}/deleteCompany/${companyToDelete._id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (res.status === 200) {
//         toast.success('Account deleted successfully!')
//         fetchWhatsappAccounts();
//       } else {
//         toast.error('Failed to delete account. Please try again.')
//       }
//     } catch (error) {
//       console.error("Error deleting account:", error);
//       toast.error('An error occurred while deleting the account.')
//     } finally {
//       closeDeleteModal();
//     }
//   };

//   useEffect(() => {
//     fetchWhatsappAccounts();
//   }, []);

//   return (
//     <div>
//       {/* <Header /> */}
//       <h1 className="display-4 text-center my-4" style={{ fontWeight: "bold", color: "#343a40" }}>
//         WhatsApp Accounts List
//       </h1>

//       {/* Loading Indicator */}
//       {loading && (
//         <div style={{ textAlign: 'center', fontSize: "18px", color: "#17a2b8" }}>
//           <Spinner animation="border" size="sm" /> Loading...
//         </div>
//       )}

//       {/* Error Message */}
//       {error && <div className="alert alert-danger text-center">{error}</div>}

//       {/* Delete Confirmation Modal */}
//       <Modal isOpen={deleteModal} toggle={closeDeleteModal}>
//         <ModalHeader toggle={closeDeleteModal}>Confirm Delete</ModalHeader>
//         <ModalBody>
//           Are you sure you want to delete this company: <strong>{companyToDelete?.name}</strong>?
//         </ModalBody>
//         <ModalFooter>
//           <Button color="danger" onClick={handleDelete}>
//             Yes, Delete
//           </Button>{' '}
//           <Button color="secondary" onClick={closeDeleteModal}>
//             No, Cancel
//           </Button>
//         </ModalFooter>
//       </Modal>

//       {/* WhatsApp Accounts as Cards */}
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
//                   <CardTitle
//                     tag="h5"
//                     style={{
//                       fontWeight: "bold",
//                       color: "#343a40"
//                     }}
//                   >
//                     Name: {account.name}
//                   </CardTitle>
//                   <CardText
//                     style={{
//                       color: "#6c757d",
//                       fontStyle: "italic",
//                       fontSize:'12px'
//                     }}
//                   >
//                     Created At: {new Date(account.createdAt).toLocaleString()}
//                   </CardText>
//                   <CardText style={{ color: "#6c757d" }}>
//                     Description: {account.description || "No description available"}
//                   </CardText>
//                   <CardText
//                     style={{
//                       fontWeight: "bold",
//                       color: account.status === "active" ? "#28a745" : "#dc3545"
//                     }}
//                   >
//                     Status: {account.status}
//                   </CardText>
//                 </CardBody>

//                 {/* Action Buttons */}
//                 <div className="d-flex justify-content-end">
//                   <Button
//                     color="link"
//                     onClick={() => handleEdit(account._id)}
//                     style={{ color: "#17a2b8", fontSize: "18px" }}
//                   >
//                     <i className="fas fa-edit"></i> Edit
//                   </Button>
//                   <Button
//                     color="link"
//                     onClick={() => openDeleteModal(account)}
//                     style={{ color: "#dc3545", fontSize: "18px" }}
//                   >
//                     <i className="fas fa-trash-alt"></i> Delete
//                   </Button>
//                 </div>
//               </Card>
//             </Col>
//           ))
//         ) : (
//           <div style={{ textAlign: 'center', width: '100%', color: "#6c757d" }}>
//             No WhatsApp accounts found.
//           </div>
//         )}
//       </Row>
//     </div>
//   );
// };



// export default WhatsAppAccountList;

















import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  CardText,
  Row,
  Col,
  Spinner,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Container
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { COMPANY_API_ENDPOINT } from "Api/Constant";
import { toast } from "sonner";

const WhatsAppAccountList = () => {
  const [whatsappAccounts, setWhatsappAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState(null);
  const navigate = useNavigate();

  // Fetch WhatsApp Accounts
  const fetchWhatsappAccounts = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError("No token found. Please log in again.");
        return;
      }

      const res = await axios.get(`${COMPANY_API_ENDPOINT}/getAllCompanies`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200) {
        if (res.data && res.data.success && Array.isArray(res.data.data)) {
          setWhatsappAccounts(res.data.data);
        } else {
          navigate("/admin/dashboard")
        }
      } else {
        setError("Unexpected response status: " + res.status);
      }
    } catch (error) {
      if (error.response) {
        setError("Error fetching WhatsApp accounts: " + error.response.data.message);
      } else if (error.request) {
        setError("No response from server.");
      } else {
        setError("An error occurred: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Edit
  const handleEdit = (id) => {
    console.log("edit button clicked with id:", id);
    navigate(`/admin/getCompanyById/${id}`);
  };

  // Open Delete Confirmation Modal
  const openDeleteModal = (company) => {
    setCompanyToDelete(company);
    setDeleteModal(true);
  };

  // Close Delete Confirmation Modal
  const closeDeleteModal = () => {
    setCompanyToDelete(null);
    setDeleteModal(false);
  };

  // Handle Delete
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(`${COMPANY_API_ENDPOINT}/deleteCompany/${companyToDelete._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200) {
        toast.success('Account deleted successfully!')
        fetchWhatsappAccounts();
      } else {
        toast.error('Failed to delete account. Please try again.')
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error('An error occurred while deleting the account.')
    } finally {
      closeDeleteModal();
    }
  };

  useEffect(() => {
    fetchWhatsappAccounts();
  }, []);

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ padding: '2.5rem 0', marginBottom: '2rem' }}>
        <Container>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="display-4 mb-2" style={{ fontWeight: '600' }}>
                WhatsApp Accounts
              </h1>
              <p className="opacity-75 mb-0">
                Manage all your business accounts in one place
              </p>
            </div>
          </div>
        </Container>
      </div>

      <Container>
        {/* Status Cards */}
        <Row className="mb-4">
          {[
            { title: 'Total Accounts', icon: 'users', value: whatsappAccounts.length, color: '#4C51BF' },
            { title: 'Active', icon: 'check-circle', value: whatsappAccounts.filter(acc => acc.status === 'active').length, color: '#25D366' },
            { title: 'Inactive', icon: 'pause-circle', value: whatsappAccounts.filter(acc => acc.status !== 'active').length, color: '#DC3545' }
          ].map((stat, idx) => (
            <Col md="4" key={idx}>
              <Card className="border-0 shadow-sm" style={{ borderRadius: '16px' }}>
                <CardBody className="d-flex align-items-center p-4">
                  <div 
                    className="me-5"  // Increased gap between icon and text
                    style={{
                      background: `${stat.color}15`,
                      borderRadius: '12px',
                      padding: '1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '2rem' // Additional margin for more spacing
                    }}
                  >
                    <i className={`fas fa-${stat.icon}`} style={{ color: stat.color, fontSize: '1.75rem' }}></i>
                  </div>
                  <div>
                    <h6 className="text-muted mb-2">{stat.title}</h6>
                    <h3 className="mb-0" style={{ fontWeight: '600' }}>{stat.value}</h3>
                  </div>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-5">
            <Spinner style={{ width: '3rem', height: '3rem', color: '#25D366' }} />
            <p className="mt-3 text-muted">Loading your accounts...</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="alert alert-danger" style={{ borderRadius: '12px' }}>
            <i className="fas fa-exclamation-circle me-2"></i>
            {error}
          </div>
        )}

        {/* Account Cards */}
        <Row>
          {whatsappAccounts.length > 0 ? (
            whatsappAccounts.map((account) => (
              <Col lg="4" md="6" className="mb-4" key={account._id}>
                <Card 
                  className="border-0 shadow-sm hover-card"
                  style={{ 
                    borderRadius: '16px',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    backgroundColor: '#ffffff'
                  }}
                >
                  <CardBody className="p-3">  {/* Reduced padding */}
                    <div className="d-flex justify-content-between align-items-start mb-3">  {/* Reduced margin */}
                      <div 
                        style={{
                          background: '#25D36610',
                          borderRadius: '12px',
                          padding: '1rem',  // Reduced padding
                          display: 'inline-flex'
                        }}
                      >
                        <i className="fab fa-whatsapp" style={{ color: '#25D366', fontSize: '1.5rem' }}></i>
                      </div>
                      <span 
                        className="badge"
                        style={{
                          background: account.status === 'active' ? '#25D36615' : '#DC354515',
                          color: account.status === 'active' ? '#25D366' : '#DC3545',
                          padding: '0.5rem 1rem',  // Reduced padding
                          borderRadius: '8px',
                          fontWeight: '500',
                          fontSize: '0.85rem'  // Slightly smaller font
                        }}
                      >
                        {account.status}
                      </span>
                    </div>

                    <h5 className="mb-2" style={{ fontWeight: '600', fontSize: '1.1rem' }}>{account.name}</h5>
                    
                    <p className="text-muted mb-3" style={{ fontSize: '0.9rem', minHeight: '2.7rem', lineHeight: '1.4' }}>
                      {account.description || "No description available"}
                    </p>

                    <div className="d-flex align-items-center mb-3">
                      <i className="far fa-calendar text-muted me-2"></i>
                      <small className="text-muted">
                        Created: {new Date(account.createdAt).toLocaleDateString()}
                      </small>
                    </div>

                    <div className="d-flex gap-2 mt-2 pt-2 border-top">
                      <Button
                        color="primary"
                        outline
                        className="w-100"
                        onClick={() => handleEdit(account._id)}
                        style={{ borderRadius: '8px', padding: '0.5rem' }}
                      >
                        <i className="fas fa-edit me-2"></i>
                        Edit
                      </Button>
                      <Button
                        color="danger"
                        outline
                        className="w-100"
                        onClick={() => openDeleteModal(account)}
                        style={{ borderRadius: '8px', padding: '0.5rem' }}
                      >
                        <i className="fas fa-trash me-2"></i>
                        Delete
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            ))
          ) : (
            <Col xs="12">
              <Card 
                className="border-0 shadow-sm text-center" 
                style={{ 
                  borderRadius: '16px',
                  padding: '2rem',  // Reduced padding
                  backgroundColor: '#ffffff'
                }}
              >
                <div className="mb-3">  {/* Reduced margin */}
                  <div 
                    style={{
                      background: '#25D36610',
                      borderRadius: '12px',
                      padding: '1.5rem',  // Reduced padding
                      display: 'inline-flex',
                      marginBottom: '1.5rem'  // Reduced margin
                    }}
                  >
                    <i className="fab fa-whatsapp" style={{ color: '#25D366', fontSize: '2rem' }}></i>
                  </div>
                  <h4 style={{ fontWeight: '600', marginBottom: '0.75rem' }}>No WhatsApp Accounts</h4>
                  <p className="text-muted" style={{ fontSize: '1rem' }}>Get started by adding your first business account</p>
                </div>
              </Card>
            </Col>
          )}
        </Row>

        {/* Delete Modal */}
        <Modal isOpen={deleteModal} toggle={closeDeleteModal} style={{ maxWidth: '400px' }}>
          <ModalHeader toggle={closeDeleteModal} className="border-0">
            <i className="fas fa-exclamation-triangle text-danger me-2"></i>
            Delete Account
          </ModalHeader>
          <ModalBody className="text-center py-4">
            <div 
              className="mb-4"
              style={{
                background: '#DC354510',
                borderRadius: '12px',
                padding: '1.5rem',
                display: 'inline-flex'
              }}
            >
              <i className="fas fa-trash" style={{ color: '#DC3545', fontSize: '2rem' }}></i>
            </div>
            <h5 style={{ fontWeight: '600' }}>Are you sure?</h5>
            <p className="text-muted mb-0">
              This will permanently delete {companyToDelete?.name}'s account.
            </p>
          </ModalBody>
          <ModalFooter className="border-0">
            <Button color="secondary" outline onClick={closeDeleteModal} style={{ borderRadius: '8px' }}>
              Cancel
            </Button>
            <Button color="danger" onClick={handleDelete} style={{ borderRadius: '8px' }}>
              Delete Account
            </Button>
          </ModalFooter>
        </Modal>
      </Container>
    </div>
  );
};

export default WhatsAppAccountList;