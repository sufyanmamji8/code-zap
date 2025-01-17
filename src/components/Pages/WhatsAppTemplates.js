import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  Input,
  Button,
  Card,
  CardBody,
  CardHeader,
  Row,
  Col,
  Badge,
  FormGroup,
  Label,
  Spinner,
  Alert,
} from "reactstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const WhatsAppTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [companyId, setCompanyId] = useState(null);
  const [companyName, setCompanyName] = useState("");
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const token = localStorage.getItem("token");
  const location = useLocation();
  const navigate = useNavigate();

  // Get companyId and companyName from location state or localStorage
  useEffect(() => {
    if (location.state?.companyId) {
      setCompanyId(location.state.companyId);
      setCompanyName(
        location.state.companyName ||
          localStorage.getItem("selectedCompanyName") ||
          ""
      );
    } else if (localStorage.getItem("selectedCompanyId")) {
      setCompanyId(localStorage.getItem("selectedCompanyId"));
      setCompanyName(localStorage.getItem("selectedCompanyName") || "");
    }
  }, [location]);

  // Fetch templates when companyId is available
  useEffect(() => {
    const fetchTemplates = async () => {
      if (!companyId || !token) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await axios.post(
          "http://192.168.0.108:25483/api/v1/messages/fetchTemplates",
          {
            companyId: companyId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = response.data;

        if (data.success && data.templates) {
          setTemplates(data.templates);
        } else {
          toast.error("Failed to fetch templates");
        }
      } catch (error) {
        console.error("Error fetching templates:", error);
        if (error.response?.status === 401) {
          navigate("/auth/login");
        } else {
          toast.error("Error loading templates");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplates();
  }, [companyId, token, navigate]);

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch = template.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory =
      !selectedCategory || template.category === selectedCategory;
    const matchesLanguage =
      !selectedLanguage || template.language === selectedLanguage;
    return matchesSearch && matchesCategory && matchesLanguage;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTemplates = filteredTemplates.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTemplates.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "APPROVED":
        return "success";
      case "REJECTED":
        return "danger";
      default:
        return "warning";
    }
  };

  // Modified handleRowClick to check template status
  const handleRowClick = (template) => {
    if (template.status === "REJECTED") {
      toast.error("This template is not approved and cannot be sent.");
      return;
    }
    
    navigate("/admin/send-template", {
      state: {
        companyId,
        companyName,
        templateId: template.id,
        templateName: template.name
      }
    });
  };

  // Function to capitalize first letter and lowercase the rest
  const formatCategory = (category) => {
    return category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
  };

  return (
    <Card className="shadow rounded border-0 overflow-hidden">
      <CardHeader className="d-flex justify-content-between align-items-center">
        <div>
          <h4 className="mb-0">WhatsApp Templates</h4>
          {companyName && (
            <small className="text-muted mt-1 d-block">{companyName}</small>
          )}
        </div>
        <Button
          color="primary"
          className="btn-sm"
        >
          + Create Template
        </Button>
      </CardHeader>
      <CardBody>
        {/* Filters Section */}
        <Row className="mb-4 align-items-end">
          <Col md={4} sm={6} xs={12}>
            <FormGroup>
              <Label for="search">Search</Label>
              <Input
                id="search"
                type="text"
                placeholder="Search templates..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </FormGroup>
          </Col>
          <Col md={4} sm={6} xs={12}>
            <FormGroup>
              <Label for="category">Category</Label>
              <Input
                id="category"
                type="select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="MARKETING">{formatCategory("Marketing")}</option>
                <option value="UTILITY">{formatCategory("Utility")}</option>
              </Input>
            </FormGroup>
          </Col>
          <Col md={4} sm={6} xs={12}>
            <FormGroup>
              <Label for="language">Language</Label>
              <Input
                id="language"
                type="select"
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
              >
                <option value="">All Languages</option>
                <option value="en_US">English (US)</option>
              </Input>
            </FormGroup>
          </Col>
        </Row>

        {/* Table Section */}
        <div className="table-responsive">
          <Table hover bordered className="align-middle">
            <thead className="table-light">
              <tr>
                <th>Template Name</th>
                <th>Category</th>
                <th>Language</th>
                <th>Status</th>
                <th>Message Delivered</th>
                <th>Message Read</th>
                <th>Last Edited</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="py-4">
                    <Spinner color="primary" /> Loading templates...
                  </td>
                </tr>
              ) : !companyId ? (
                <tr>
                  <td colSpan="7" className="py-4">
                    <Alert color="warning">
                      Please select a company to view templates.
                    </Alert>
                  </td>
                </tr>
              ) : filteredTemplates.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-4">
                    <Alert color="info">No templates found.</Alert>
                  </td>
                </tr>
              ) : (
                currentTemplates.map((template, index) => (
                  <tr 
                    key={index} 
                    onClick={() => handleRowClick(template)}
                    style={{ 
                      cursor: template.status === "REJECTED" ? "not-allowed" : "pointer",
                      opacity: template.status === "REJECTED" ? 0.7 : 1
                    }}
                    className="hover:bg-gray-50"
                  >
                    <td>{template.name}</td>
                    <td>{formatCategory(template.category)}</td>
                    <td>{template.language}</td>
                    <td>
                      <Badge color={getStatusColor(template.status)} pill>
                        {template.status}
                      </Badge>
                    </td>
                    <td>0</td>
                    <td>0</td>
                    <td>{new Date().toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>

        {/* Pagination Controls */}
        {filteredTemplates.length > 0 && (
          <div className="d-flex justify-content-between align-items-center mt-4">
            <Button
              color="primary"
              outline
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <div className="text-muted">
              Page {currentPage} of {totalPages}
            </div>
            <Button
              color="primary"
              outline
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}

        {/* Bottom Info */}
        <div className="mt-3 text-muted small text-center">
          Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredTemplates.length)} of {filteredTemplates.length} templates
        </div>
      </CardBody>
    </Card>
  );
};

export default WhatsAppTemplates;