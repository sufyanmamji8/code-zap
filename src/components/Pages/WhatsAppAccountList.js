
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
  ModalFooter
} from "reactstrap";
import Header from "components/Headers/Header.js";
import axios from "axios";
import { COMPANY_API_ENDPOINT } from "Api/Constant";
import { useNavigate } from "react-router-dom";
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
    <div>
      {/* <Header /> */}
      <h1 className="display-4 text-center my-4" style={{ fontWeight: "bold", color: "#343a40" }}>
        WhatsApp Accounts List
      </h1>

      {/* Loading Indicator */}
      {loading && (
        <div style={{ textAlign: 'center', fontSize: "18px", color: "#17a2b8" }}>
          <Spinner animation="border" size="sm" /> Loading...
        </div>
      )}

      {/* Error Message */}
      {error && <div className="alert alert-danger text-center">{error}</div>}

      {/* Delete Confirmation Modal */}
      <Modal isOpen={deleteModal} toggle={closeDeleteModal}>
        <ModalHeader toggle={closeDeleteModal}>Confirm Delete</ModalHeader>
        <ModalBody>
          Are you sure you want to delete this company: <strong>{companyToDelete?.name}</strong>?
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={handleDelete}>
            Yes, Delete
          </Button>{' '}
          <Button color="secondary" onClick={closeDeleteModal}>
            No, Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* WhatsApp Accounts as Cards */}
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
                  <CardTitle
                    tag="h5"
                    style={{
                      fontWeight: "bold",
                      color: "#343a40"
                    }}
                  >
                    Name: {account.name}
                  </CardTitle>
                  <CardText
                    style={{
                      color: "#6c757d",
                      fontStyle: "italic",
                      fontSize:'12px'
                    }}
                  >
                    Created At: {new Date(account.createdAt).toLocaleString()}
                  </CardText>
                  <CardText style={{ color: "#6c757d" }}>
                    Description: {account.description || "No description available"}
                  </CardText>
                  <CardText
                    style={{
                      fontWeight: "bold",
                      color: account.status === "active" ? "#28a745" : "#dc3545"
                    }}
                  >
                    Status: {account.status}
                  </CardText>
                </CardBody>

                {/* Action Buttons */}
                <div className="d-flex justify-content-end">
                  <Button
                    color="link"
                    onClick={() => handleEdit(account._id)}
                    style={{ color: "#17a2b8", fontSize: "18px" }}
                  >
                    <i className="fas fa-edit"></i> Edit
                  </Button>
                  <Button
                    color="link"
                    onClick={() => openDeleteModal(account)}
                    style={{ color: "#dc3545", fontSize: "18px" }}
                  >
                    <i className="fas fa-trash-alt"></i> Delete
                  </Button>
                </div>
              </Card>
            </Col>
          ))
        ) : (
          <div style={{ textAlign: 'center', width: '100%', color: "#6c757d" }}>
            No WhatsApp accounts found.
          </div>
        )}
      </Row>
    </div>
  );
};



export default WhatsAppAccountList;