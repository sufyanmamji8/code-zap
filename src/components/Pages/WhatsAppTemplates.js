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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const token = localStorage.getItem("token");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.companyId) {
      setCompanyId(location.state.companyId);
      setCompanyName(location.state.companyName || localStorage.getItem("selectedCompanyName") || "");
    } else if (localStorage.getItem("selectedCompanyId")) {
      setCompanyId(localStorage.getItem("selectedCompanyId"));
      setCompanyName(localStorage.getItem("selectedCompanyName") || "");
    }
  }, [location]);

  useEffect(() => {
    const fetchTemplates = async () => {
      if (!companyId || !token) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await axios.post(
          "https://codozap-e04e12b02929.herokuapp.com/api/v1/messages/fetchTemplates",
          { companyId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.success && response.data.templates) {
          setTemplates(response.data.templates);
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
    return (
      template.name.toLowerCase().includes(search.toLowerCase()) &&
      (!selectedCategory || template.category === selectedCategory) &&
      (!selectedLanguage || template.language === selectedLanguage)
    );
  });

  const currentTemplates = filteredTemplates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredTemplates.length / itemsPerPage);

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
        templateName: template.name,
      },
    });
  };

  const getStatusBadge = (status) => {
    const colors = {
      APPROVED: "success",
      REJECTED: "danger",
      PENDING: "warning",
    };
    return (
      <Badge color={colors[status] || "secondary"} pill className="px-3 py-2">
        {status}
      </Badge>
    );
  };

  return (
    <Card className="shadow-sm border-0">
      {/* Header Section */}
      <CardHeader className="bg-white border-bottom">
        <Row className="align-items-center">
          <Col>
            <h4 className="mb-0 text-primary">WhatsApp Templates</h4>
            {companyName && (
              <small className="text-muted">
                Managing templates for {companyName}
              </small>
            )}
          </Col>
          <Col xs="auto">
            <Button color="primary" className="rounded-pill px-4">
              <i className="fas fa-plus me-2"></i>
              Create Template
            </Button>
          </Col>
        </Row>
      </CardHeader>

      <CardBody className="p-4">
        {/* Filter Section */}
        <Card className="bg-light border-0 mb-4">
          <CardBody>
            <Row className="g-3">
              <Col md={4}>
                <FormGroup>
                  <Label className="text-muted small">Search Templates</Label>
                  <Input
                    placeholder="Search by name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="rounded-pill"
                  />
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label className="text-muted small">Category</Label>
                  <Input
                    type="select"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="rounded-pill"
                  >
                    <option value="">All Categories</option>
                    <option value="MARKETING">Marketing</option>
                    <option value="UTILITY">Utility</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label className="text-muted small">Language</Label>
                  <Input
                    type="select"
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="rounded-pill"
                  >
                    <option value="">All Languages</option>
                    <option value="en_US">English (US)</option>
                    <option value="es">Spanish</option>
                  </Input>
                </FormGroup>
              </Col>
            </Row>
          </CardBody>
        </Card>

        {/* Templates Table */}
        <div className="table-responsive">
          {isLoading ? (
            <div className="text-center py-5">
              <Spinner color="primary" className="mb-2" />
              <p className="text-muted">Loading templates...</p>
            </div>
          ) : !companyId ? (
            <Alert color="info" className="rounded-3 text-center">
              <i className="fas fa-info-circle me-2"></i>
              Please select a company to view templates
            </Alert>
          ) : filteredTemplates.length === 0 ? (
            <Alert color="light" className="rounded-3 text-center">
              <i className="fas fa-search me-2"></i>
              No templates found matching your criteria
            </Alert>
          ) : (
            <Table hover className="align-middle">
              <thead className="bg-light">
                <tr>
                  <th className="border-0">Template Name</th>
                  <th className="border-0">Category</th>
                  <th className="border-0">Language</th>
                  <th className="border-0">Status</th>
                  <th className="border-0 text-center">Delivered</th>
                  <th className="border-0 text-center">Read</th>
                  <th className="border-0">Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {currentTemplates.map((template, index) => (
                  <tr
                    key={index}
                    onClick={() => handleRowClick(template)}
                    className={`cursor-pointer ${
                      template.status === "REJECTED" ? "opacity-50" : ""
                    }`}
                    style={{ cursor: template.status === "REJECTED" ? "not-allowed" : "pointer" }}
                  >
                    <td className="fw-medium">{template.name}</td>
                    <td>{template.category.charAt(0) + template.category.slice(1).toLowerCase()}</td>
                    <td>{template.language}</td>
                    <td>{getStatusBadge(template.status)}</td>
                    <td className="text-center">
                      <Badge color="light" pill className="px-3">
                        {template.delivered || 0}
                      </Badge>
                    </td>
                    <td className="text-center">
                      <Badge color="light" pill className="px-3">
                        {template.read || 0}
                      </Badge>
                    </td>
                    <td className="text-muted">
                      {new Date(template.updatedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>

        {/* Pagination */}
        {filteredTemplates.length > 0 && (
          <div className="d-flex justify-content-between align-items-center mt-4">
            <Button
              color="light"
              className="rounded-pill px-4"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <i className="fas fa-arrow-left me-2"></i>
              Previous
            </Button>
            <small className="text-muted">
              Page {currentPage} of {totalPages}
            </small>
            <Button
              color="light"
              className="rounded-pill px-4"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              Next
              <i className="fas fa-arrow-right ms-2"></i>
            </Button>
          </div>
        )}

        {/* Results Summary */}
        <div className="text-center mt-3">
          <small className="text-muted">
            Showing {Math.min(currentPage * itemsPerPage, filteredTemplates.length)} of{" "}
            {filteredTemplates.length} templates
          </small>
        </div>
      </CardBody>
    </Card>
  );
};

export default WhatsAppTemplates;