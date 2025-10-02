
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
  Row,
  Col,
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
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

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

  // Inline CSS styles for clean UI
  const styles = `
    .whatsapp-accounts-page {
      background: #f8fafc;
      min-height: 100vh;
      padding-top: 8rem;
    }

    .page-header {
      margin-bottom: 3rem;
    }

    .stat-card {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      transition: transform 0.2s ease;
    }

    .stat-card:hover {
      transform: scale(1.02);
    }

    .account-card {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      transition: transform 0.2s ease;
      margin-bottom: 1.5rem;
    }

    .account-card:hover {
      transform: scale(1.02);
    }

    .whatsapp-icon {
      background: #25D366;
      border-radius: 10px;
      padding: 12px;
      display: inline-flex;
    }

    .status-badge {
      padding: 6px 12px;
      border-radius: 20px;
      font-weight: 600;
      font-size: 0.8rem;
    }

    .status-active {
      background: #dcfce7;
      color: #166534;
      border: 1px solid #bbf7d0;
    }

    .status-inactive {
      background: #fef2f2;
      color: #991b1b;
      border: 1px solid #fecaca;
    }

    .btn-edit {
      background: #f8fafc;
      color: #475569;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      font-weight: 500;
    }

    .btn-edit:hover {
      background: #e2e8f0;
      color: #374151;
    }

    .btn-delete {
      background: #fef2f2;
      color: #dc2626;
      border: 1px solid #fecaca;
      border-radius: 8px;
      font-weight: 500;
    }

    .btn-delete:hover {
      background: #dc2626;
      color: white;
    }

    .empty-state {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 3rem 2rem;
      text-align: center;
    }

    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(255, 255, 255, 0.95);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
      flex-direction: column;
    }
  `;

  return (
    <>
      <style>{styles}</style>
      
      {/* Loading Animation */}
      {loading && (
        <div className="loading-overlay">
          <DotLottieReact
            src="https://lottie.host/5060de43-85ac-474a-a85b-892f9730e17a/b3jJ1vGkWh.lottie"
            loop
            autoplay
            style={{ width: "150px", height: "150px" }}
          />
          <div className="mt-3" style={{ color: '#075E54', fontWeight: '600' }}>
            Loading WhatsApp Accounts...
          </div>
        </div>
      )}

      <div className="whatsapp-accounts-page">
        <Container>
          {/* Header */}
          <div className="page-header">
            <div className="mb-3">
              <h1 className="h2 fw-bold mb-2" style={{ color: '#1a202c' }}>
                WhatsApp Accounts
              </h1>
              <p className="text-muted mb-0">
                Manage all your business accounts in one place
              </p>
            </div>
          </div>

          {/* Status Cards */}
          <Row className="mb-4">
            {[
              { 
                title: ' TOTAL ACCOUNTS ', 
                icon: 'users', 
                value: whatsappAccounts.length, 
                color: '#075E54'
              },
              { 
                title: ' ACTIVE ', 
                icon: 'check-circle', 
                value: whatsappAccounts.filter(acc => acc.status === 'active').length, 
                color: '#25D366'
              },
              { 
                title: ' INACTIVE ', 
                icon: 'ban', 
                value: whatsappAccounts.filter(acc => acc.status !== 'active').length, 
                color: '#DC3545'
              }
            ].map((stat, idx) => (
              <Col lg="4" md="4" className="mb-3" key={idx}>
                <Card className="stat-card">
                  <CardBody className="p-3">
                    <div className="d-flex align-items-center">
                      <div 
                        className="me-4"
                        style={{
                          background: stat.color,
                          borderRadius: '10px',
                          padding: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                         
                        }}
                      >
                        <i className={`fas fa-${stat.icon}`} style={{ color: 'white', fontSize: '1.25rem' }}></i>
                      </div>
                      <div>
                        <h6 className="text-muted mb-1 small fw-semibold ml-3">{stat.title}</h6>
                        <h4 className="mb-0 fw-bold ml-3" style={{ color: stat.color }}>{stat.value}</h4>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Error Message */}
          {error && (
            <div className="alert alert-danger mb-4" style={{ borderRadius: '8px' }}>
              <i className="fas fa-exclamation-circle me-2"></i>
              {error}
            </div>
          )}

          {/* Account Cards */}
          <Row>
            {whatsappAccounts.length > 0 ? (
              whatsappAccounts.map((account) => (
                <Col xl="6" lg="6" className="mb-3" key={account._id}>
                  <Card className="account-card">
                    <CardBody className="p-4">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div className="whatsapp-icon">
                          <i className="fab fa-whatsapp" style={{ color: 'white', fontSize: '1.25rem' }}></i>
                        </div>
                        <span 
                          className={`status-badge ${account.status === 'active' ? 'status-active' : 'status-inactive'}`}
                        >
                          {account.status?.toUpperCase() || 'INACTIVE'}
                        </span>
                      </div>

                      <h5 className="mb-2 fw-bold" style={{ color: '#1a202c' }}>
                        {account.name}
                      </h5>
                      
                      <p className="text-muted mb-3 small">
                        {account.description || "No description available"}
                      </p>

                      <div className="d-flex align-items-center text-muted mb-3">
                        <i className="far fa-calendar me-2 small mr-2"></i>
                        <small>Created: {new Date(account.createdAt).toLocaleDateString()}</small>
                      </div>

                      <div className="d-flex gap-2 pt-3 border-top">
                        <Button
                          className="btn-edit flex-fill"
                          onClick={() => handleEdit(account._id)}
                          size="sm"
                        >
                          <i className="fas fa-edit me-2 mr-2"></i>
                          Edit
                        </Button>
                        <Button
                          className="btn-delete flex-fill"
                          onClick={() => openDeleteModal(account)}
                          size="sm"
                        >
                          <i className="fas fa-trash me-2 mr-2"></i>
                          Delete
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              ))
            ) : (
              <Col xs="12">
                <div className="empty-state">
                  <div className="mb-3">
                    <i className="fab fa-whatsapp" style={{ color: '#cbd5e1', fontSize: '3rem' }}></i>
                  </div>
                  <h5 className="fw-bold mb-2">No WhatsApp Accounts</h5>
                  <p className="text-muted mb-3">
                    Get started by adding your first business account
                  </p>
                </div>
              </Col>
            )}
          </Row>

          {/* Delete Modal */}
          <Modal 
            isOpen={deleteModal} 
            toggle={closeDeleteModal}
            style={{ maxWidth: '400px' }}
          >
            <ModalHeader toggle={closeDeleteModal}>
              Delete Account
            </ModalHeader>
            <ModalBody className="text-center py-4">
              <div className="mb-3">
                <i className="fas fa-exclamation-triangle text-danger" style={{ fontSize: '2rem' }}></i>
              </div>
              <h6 className="fw-bold mb-2">Are you sure?</h6>
              <p className="text-muted mb-0 small">
                This will delete "{companyToDelete?.name}" permanently.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={closeDeleteModal} size="sm">
                Cancel
              </Button>
              <Button color="danger" onClick={handleDelete} size="sm">
                Delete
              </Button>
            </ModalFooter>
          </Modal>
        </Container>
      </div>
    </>
  );
};

export default WhatsAppAccountList;