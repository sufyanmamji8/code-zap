// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   Table,
//   Input,
//   Button,
//   Card,
//   CardBody,
//   CardHeader,
//   Row,
//   Col,
//   Badge,
//   FormGroup,
//   Label,
//   Spinner,
//   Alert,
// } from "reactstrap";
// import { useLocation, useNavigate } from "react-router-dom";
// import { toast } from "sonner";

// const WhatsAppTemplates = () => {
//   const [templates, setTemplates] = useState([]);
//   const [search, setSearch] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [selectedLanguage, setSelectedLanguage] = useState("");
//   const [isLoading, setIsLoading] = useState(true);
//   const [companyId, setCompanyId] = useState(null);
//   const [companyName, setCompanyName] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;

//   const token = localStorage.getItem("token");
//   const location = useLocation();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (location.state?.companyId) {
//       setCompanyId(location.state.companyId);
//       setCompanyName(location.state.companyName || localStorage.getItem("selectedCompanyName") || "");
//     } else if (localStorage.getItem("selectedCompanyId")) {
//       setCompanyId(localStorage.getItem("selectedCompanyId"));
//       setCompanyName(localStorage.getItem("selectedCompanyName") || "");
//     }
//   }, [location]);

//   useEffect(() => {
//     const fetchTemplates = async () => {
//       if (!companyId || !token) {
//         setIsLoading(false);
//         return;
//       }

//       try {
//         setIsLoading(true);
//         const response = await axios.post(
//           "https://codozap-e04e12b02929.herokuapp.com/api/v1/messages/fetchTemplates",
//           { companyId },
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         if (response.data.success && response.data.templates) {
//           setTemplates(response.data.templates);
//         } else {
//           toast.error("Failed to fetch templates");
//         }
//       } catch (error) {
//         console.error("Error fetching templates:", error);
//         if (error.response?.status === 401) {
//           navigate("/auth/login");
//         } else {
//           toast.error("Error loading templates");
//         }
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchTemplates();
//   }, [companyId, token, navigate]);

//   const filteredTemplates = templates.filter((template) => {
//     return (
//       template.name.toLowerCase().includes(search.toLowerCase()) &&
//       (!selectedCategory || template.category === selectedCategory) &&
//       (!selectedLanguage || template.language === selectedLanguage)
//     );
//   });

//   const currentTemplates = filteredTemplates.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );
//   const totalPages = Math.ceil(filteredTemplates.length / itemsPerPage);

//   const handleRowClick = (template) => {
//     if (template.status === "REJECTED") {
//       toast.error("This template is not approved and cannot be sent.");
//       return;
//     }
//     navigate("/admin/send-template", {
//       state: {
//         companyId,
//         companyName,
//         templateId: template.id,
//         templateName: template.name,
//       },
//     });
//   };

//   const getStatusBadge = (status) => {
//     const colors = {
//       APPROVED: "success",
//       REJECTED: "danger",
//       PENDING: "warning",
//     };
//     return (
//       <Badge color={colors[status] || "secondary"} pill className="px-3 py-2">
//         {status}
//       </Badge>
//     );
//   };

//   return (
//     <Card className="shadow-sm border-0">
//       {/* Header Section */}
//       <CardHeader className="bg-white border-bottom">
//         <Row className="align-items-center">
//           <Col>
//             <h4 className="mb-0 text-primary">WhatsApp Templates</h4>
//             {companyName && (
//               <small className="text-muted">
//                 Managing templates for {companyName}
//               </small>
//             )}
//           </Col>
//           <Col xs="auto">
//             <Button color="primary" className="rounded-pill px-4">
//               <i className="fas fa-plus me-2"></i>
//               Create Template
//             </Button>
//           </Col>
//         </Row>
//       </CardHeader>

//       <CardBody className="p-4">
//         {/* Filter Section */}
//         <Card className="bg-light border-0 mb-4">
//           <CardBody>
//             <Row className="g-3">
//               <Col md={4}>
//                 <FormGroup>
//                   <Label className="text-muted small">Search Templates</Label>
//                   <Input
//                     placeholder="Search by name..."
//                     value={search}
//                     onChange={(e) => setSearch(e.target.value)}
//                     className="rounded-pill"
//                   />
//                 </FormGroup>
//               </Col>
//               <Col md={4}>
//                 <FormGroup>
//                   <Label className="text-muted small">Category</Label>
//                   <Input
//                     type="select"
//                     value={selectedCategory}
//                     onChange={(e) => setSelectedCategory(e.target.value)}
//                     className="rounded-pill"
//                   >
//                     <option value="">All Categories</option>
//                     <option value="MARKETING">Marketing</option>
//                     <option value="UTILITY">Utility</option>
//                   </Input>
//                 </FormGroup>
//               </Col>
//               <Col md={4}>
//                 <FormGroup>
//                   <Label className="text-muted small">Language</Label>
//                   <Input
//                     type="select"
//                     value={selectedLanguage}
//                     onChange={(e) => setSelectedLanguage(e.target.value)}
//                     className="rounded-pill"
//                   >
//                     <option value="">All Languages</option>
//                     <option value="en_US">English (US)</option>
//                     <option value="es">Spanish</option>
//                   </Input>
//                 </FormGroup>
//               </Col>
//             </Row>
//           </CardBody>
//         </Card>

//         {/* Templates Table */}
//         <div className="table-responsive">
//           {isLoading ? (
//             <div className="text-center py-5">
//               <Spinner color="primary" className="mb-2" />
//               <p className="text-muted">Loading templates...</p>
//             </div>
//           ) : !companyId ? (
//             <Alert color="info" className="rounded-3 text-center">
//               <i className="fas fa-info-circle me-2"></i>
//               Please select a company to view templates
//             </Alert>
//           ) : filteredTemplates.length === 0 ? (
//             <Alert color="light" className="rounded-3 text-center">
//               <i className="fas fa-search me-2"></i>
//               No templates found matching your criteria
//             </Alert>
//           ) : (
//             <Table hover className="align-middle">
//               <thead className="bg-light">
//                 <tr>
//                   <th className="border-0">Template Name</th>
//                   <th className="border-0">Category</th>
//                   <th className="border-0">Language</th>
//                   <th className="border-0">Status</th>
//                   <th className="border-0 text-center">Delivered</th>
//                   <th className="border-0 text-center">Read</th>
//                   <th className="border-0">Last Updated</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {currentTemplates.map((template, index) => (
//                   <tr
//                     key={index}
//                     onClick={() => handleRowClick(template)}
//                     className={`cursor-pointer ${
//                       template.status === "REJECTED" ? "opacity-50" : ""
//                     }`}
//                     style={{ cursor: template.status === "REJECTED" ? "not-allowed" : "pointer" }}
//                   >
//                     <td className="fw-medium">{template.name}</td>
//                     <td>{template.category.charAt(0) + template.category.slice(1).toLowerCase()}</td>
//                     <td>{template.language}</td>
//                     <td>{getStatusBadge(template.status)}</td>
//                     <td className="text-center">
//                       <Badge color="light" pill className="px-3">
//                         {template.delivered || 0}
//                       </Badge>
//                     </td>
//                     <td className="text-center">
//                       <Badge color="light" pill className="px-3">
//                         {template.read || 0}
//                       </Badge>
//                     </td>
//                     <td className="text-muted">
//                       {new Date(template.updatedAt).toLocaleDateString()}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </Table>
//           )}
//         </div>

//         {/* Pagination */}
//         {filteredTemplates.length > 0 && (
//           <div className="d-flex justify-content-between align-items-center mt-4">
//             <Button
//               color="light"
//               className="rounded-pill px-4"
//               onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
//               disabled={currentPage === 1}
//             >
//               <i className="fas fa-arrow-left me-2"></i>
//               Previous
//             </Button>
//             <small className="text-muted">
//               Page {currentPage} of {totalPages}
//             </small>
//             <Button
//               color="light"
//               className="rounded-pill px-4"
//               onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
//               disabled={currentPage === totalPages}
//             >
//               Next
//               <i className="fas fa-arrow-right ms-2"></i>
//             </Button>
//           </div>
//         )}

//         {/* Results Summary */}
//         <div className="text-center mt-3">
//           <small className="text-muted">
//             Showing {Math.min(currentPage * itemsPerPage, filteredTemplates.length)} of{" "}
//             {filteredTemplates.length} templates
//           </small>
//         </div>
//       </CardBody>
//     </Card>
//   );
// };

// export default WhatsAppTemplates;












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
  UncontrolledTooltip,
  Progress,
} from "reactstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { BarChart2, Send, AlertCircle, CheckCircle, Clock } from "lucide-react";

const WhatsAppTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [companyId, setCompanyId] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState("table"); // table or grid
  const [showFilters, setShowFilters] = useState(false);
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

  const handleNameClick = (e, template) => {
    e.stopPropagation();
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

  const handleAnalyticsClick = (e, template) => {
    e.stopPropagation();
    navigate("/admin/analytics", {
      state: {
        companyId,
        companyName,
        templateId: template.id,
        templateName: template.name,
      },
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "APPROVED":
        return <CheckCircle size={18} className="text-success" />;
      case "REJECTED":
        return <AlertCircle size={18} className="text-danger" />;
      case "PENDING":
        return <Clock size={18} className="text-warning" />;
      default:
        return null;
    }
  };

  const renderGridView = () => (
    <Row className="g-4">
      {currentTemplates.map((template, index) => (
        <Col key={index} md={6} lg={4}>
          <Card className={`h-100 border-0 shadow-sm hover-shadow transition-all ${
            template.status === "REJECTED" ? "opacity-75" : ""
          }`}>
            <CardBody>
              <div className="d-flex justify-content-between mb-3">
                <h5 className="mb-0 text-truncate" style={{ maxWidth: "70%" }}>
                  {template.name}
                </h5>
                <div>{getStatusIcon(template.status)}</div>
              </div>
              
              <div className="mb-3">
                <Badge 
                  color="primary" 
                  pill 
                  className="me-2"
                >
                  {template.category}
                </Badge>
                <Badge 
                  color="info" 
                  pill
                >
                  {template.language}
                </Badge>
              </div>

              <div className="mb-3">
                <small className="text-muted d-block mb-2">Performance</small>
                <div className="d-flex justify-content-between mb-1">
                  <span className="small">Delivered</span>
                  <span className="small text-success">{template.delivered || 0}</span>
                </div>
                <Progress 
                  value={template.delivered} 
                  max={template.delivered + 50}
                  color="success"
                  className="mb-2"
                />
                <div className="d-flex justify-content-between mb-1">
                  <span className="small">Read</span>
                  <span className="small text-info">{template.read || 0}</span>
                </div>
                <Progress 
                  value={template.read} 
                  max={template.delivered || 1}
                  color="info"
                />
              </div>

              <div className="d-flex justify-content-between align-items-center mt-auto">
                <Button
                  color="light"
                  size="sm"
                  className="rounded-pill"
                  onClick={(e) => handleAnalyticsClick(e, template)}
                >
                  <BarChart2 size={14} className="me-1" />
                  Analytics
                </Button>
                <Button
                  color="primary"
                  size="sm"
                  className="rounded-pill"
                  onClick={(e) => handleNameClick(e, template)}
                  disabled={template.status === "REJECTED"}
                >
                  <Send size={14} className="me-1" />
                  Send
                </Button>
              </div>
            </CardBody>
          </Card>
        </Col>
      ))}
    </Row>
  );

  return (
    <div className="animate__animated animate__fadeIn">
      <Card className="shadow-sm border-0 mb-4">
        <CardHeader className="bg-white border-0 py-4">
          <Row className="align-items-center">
            <Col>
              <div className="d-flex align-items-center">
                <div className="">
                  {/* <i className="fas fa-comment text-primary fs-4"></i> */}
                </div>
                <div>
                  <h4 className="mb-0 text-primary">WhatsApp Templates</h4>
                  {companyName && (
                    <small className="text-muted">
                      Managing templates for {companyName}
                    </small>
                  )}
                </div>
              </div>
            </Col>
            <Col xs="auto">
              <div className="d-flex gap-2">
                <Button
                  color="light"
                  className="rounded-pill"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <i className="fas fa-filter me-2"></i>
                  Filters
                </Button>
                <Button
                  color="light"
                  className="rounded-pill"
                  onClick={() => setViewMode(viewMode === "table" ? "grid" : "table")}
                >
                  <i className={`fas fa-${viewMode === "table" ? "th" : "list"} me-2`}></i>
                  {viewMode === "table" ? "Grid" : "Table"} View
                </Button>
                {/* <Button color="primary" className="rounded-pill px-4">
                  <i className="fas fa-plus me-2"></i>
                  Create Template
                </Button> */}
              </div>
            </Col>
          </Row>
        </CardHeader>

        <CardBody className="p-4">
          {/* Collapsible Filters */}
          <div className={`collapse ${showFilters ? "show" : ""}`}>
            <Card className="bg-light border-0 mb-4">
              <CardBody>
                <Row className="g-3">
                  <Col md={4}>
                    <FormGroup floating>
                      <Input
                        id="searchTemplates"
                        placeholder="Search by name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="rounded-pill"
                      />
                      <Label for="searchTemplates">Search Templates</Label>
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup floating>
                      <Input
                        id="categorySelect"
                        type="select"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="rounded-pill"
                      >
                        <option value="">All Categories</option>
                        <option value="MARKETING">Marketing</option>
                        <option value="UTILITY">Utility</option>
                      </Input>
                      <Label for="categorySelect">Category</Label>
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup floating>
                      <Input
                        id="languageSelect"
                        type="select"
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                        className="rounded-pill"
                      >
                        <option value="">All Languages</option>
                        <option value="en_US">English (US)</option>
                        <option value="es">Spanish</option>
                      </Input>
                      <Label for="languageSelect">Language</Label>
                    </FormGroup>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </div>

          {/* Content */}
          <div className="position-relative">
            {isLoading ? (
              <div className="text-center py-5">
                <Spinner color="primary" className="mb-2" />
                <p className="text-muted">Loading templates...</p>
              </div>
            ) : !companyId ? (
              <Alert color="info" className="rounded-3 text-center p-4">
                <div className="bg-info bg-opacity-10 rounded-circle p-3 mx-auto mb-3" style={{ width: "fit-content" }}>
                  <i className="fas fa-building fs-2 text-info"></i>
                </div>
                <h5>Select a Company</h5>
                <p className="text-muted mb-0">Please select a company to view its templates</p>
              </Alert>
            ) : filteredTemplates.length === 0 ? (
              <Alert color="light" className="rounded-3 text-center p-4">
                <div className="bg-light rounded-circle p-3 mx-auto mb-3" style={{ width: "fit-content" }}>
                  <i className="fas fa-search fs-2 text-muted"></i>
                </div>
                <h5>No Templates Found</h5>
                <p className="text-muted mb-0">Try adjusting your search criteria</p>
              </Alert>
            ) : viewMode === "grid" ? (
              renderGridView()
            ) : (
              <div className="table-responsive">
                <Table hover className="align-middle">
                  <thead className="bg-light">
                    <tr>
                      <th className="border-0">Template Name</th>
                      <th className="border-0">Category</th>
                      <th className="border-0">Language</th>
                      <th className="border-0">Status</th>
                      <th className="border-0 text-center">Performance</th>
                      <th className="border-0">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentTemplates.map((template, index) => (
                      <tr
                        key={index}
                        className={`${template.status === "REJECTED" ? "opacity-75" : ""} hover-bg-light`}
                      >
                        <td>
                          <span className="fw-medium">{template.name}</span>
                        </td>
                        <td>
                          <Badge color="primary" pill className="px-3">
                            {template.category}
                          </Badge>
                        </td>
                        <td>
                          <Badge color="info" pill className="px-3">
                            {template.language}
                          </Badge>
                        </td>
                        <td>{getStatusIcon(template.status)}</td>
                        <td>
                          <div className="d-flex align-items-center gap-3">
                            <div className="flex-grow-1">
                              <Progress multi className="rounded-pill">
                                <Progress
                                  bar
                                  color="success"
                                  value={template.delivered}
                                  max={template.delivered + 50}
                                >
                                  {template.delivered}
                                </Progress>
                                <Progress
                                  bar
                                  color="info"
                                  value={template.read}
                                  max={template.delivered + 50}
                                >
                                  {template.read}
                                </Progress>
                              </Progress>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <Button
                              color="light"
                              size="sm"
                              className="rounded-pill"
                              onClick={(e) => handleAnalyticsClick(e, template)}
                              id={`analytics-${template.id}`}
                            >
                              <BarChart2 size={14} />
                            </Button>
                            <UncontrolledTooltip target={`analytics-${template.id}`}>
                              View Analytics
                            </UncontrolledTooltip>
                            <Button
                              color="primary"
                              size="sm"
                              className="rounded-pill"
                              onClick={(e) => handleNameClick(e, template)}
                              disabled={template.status === "REJECTED"}
                              id={`send-${template.id}`}
                            >
                              <Send size={14} />
                            </Button>
                            <UncontrolledTooltip target={`send-${template.id}`}>
                              Send Template
                            </UncontrolledTooltip>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
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
              <div className="d-flex align-items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    color={currentPage === page ? "primary" : "light"}
                    className="rounded-circle"
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}
              </div>
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

          <div className="text-center mt-3">
            <small className="text-muted">
              Showing {Math.min(currentPage * itemsPerPage, filteredTemplates.length)} of{" "}
              {filteredTemplates.length} templates
            </small>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default WhatsAppTemplates;