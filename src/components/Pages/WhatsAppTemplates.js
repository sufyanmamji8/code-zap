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
// } from "reactstrap";

// const WhatsAppTemplates = () => {
//   const [templates, setTemplates] = useState([]);
//   const [search, setSearch] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [selectedLanguage, setSelectedLanguage] = useState("");
//   const [isLoading, setIsLoading] = useState(true);

//   const token = localStorage.getItem("token");
//   const companyId = "67766f5326d48c4790f1fbd1"; // Fixed company ID


  

//   useEffect(() => {
//     const fetchTemplates = async () => {
//       try {
//         setIsLoading(true);
//         const response = await axios.post(
//           "http://192.168.0.103:25483/api/v1/messages/fetchTemplates",
//           {
//             companyId: companyId,
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );
    
//         const data = response.data;
    
//         if (data.success && data.templates) {
//           setTemplates(data.templates);
//         }
//       } catch (error) {
//         console.error("Error fetching templates:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };
    

//     fetchTemplates();
//   }, [token]);

//   const filteredTemplates = templates.filter((template) => {
//     const matchesSearch = template.name
//       .toLowerCase()
//       .includes(search.toLowerCase());
//     const matchesCategory =
//       !selectedCategory || template.category === selectedCategory;
//     const matchesLanguage =
//       !selectedLanguage || template.language === selectedLanguage;
//     return matchesSearch && matchesCategory && matchesLanguage;
//   });

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "APPROVED":
//         return "success";
//       case "REJECTED":
//         return "danger";
//       default:
//         return "warning";
//     }
//   };

//   return (
//     <Card className="shadow-sm">
//       <CardHeader className="bg-white">
//         <h4 className="mb-0">WhatsApp Templates</h4>
//       </CardHeader>
//       <CardBody>
//         {/* Filters Section */}
//         <Row className="mb-4 align-items-end">
//           <Col md={3}>
//             <FormGroup>
//               <Label for="search">Search</Label>
//               <Input
//                 id="search"
//                 type="text"
//                 placeholder="Search templates..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//               />
//             </FormGroup>
//           </Col>
//           <Col md={2}>
//             <FormGroup>
//               <Label for="category">Category</Label>
//               <Input
//                 id="category"
//                 type="select"
//                 value={selectedCategory}
//                 onChange={(e) => setSelectedCategory(e.target.value)}
//               >
//                 <option value="">All Categories</option>
//                 <option value="MARKETING">Marketing</option>
//                 <option value="UTILITY">Utility</option>
//               </Input>
//             </FormGroup>
//           </Col>
//           <Col md={2}>
//             <FormGroup>
//               <Label for="language">Language</Label>
//               <Input
//                 id="language"
//                 type="select"
//                 value={selectedLanguage}
//                 onChange={(e) => setSelectedLanguage(e.target.value)}
//               >
//                 <option value="">All Languages</option>
//                 <option value="en_US">English (US)</option>
//               </Input>
//             </FormGroup>
//           </Col>
//           <Col md={3}>
//             <Button color="primary" className="mt-2">
//               Create Template
//             </Button>
//           </Col>
//         </Row>

//         {/* Table Section */}
//         <div className="table-responsive">
//           <Table hover bordered className="mb-0">
//             <thead>
//               <tr>
//                 <th>Template name</th>
//                 <th>Category</th>
//                 <th>Language</th>
//                 <th>Status</th>
//                 <th className="text-right">Message delivered</th>
//                 <th className="text-right">Message read</th>
//                 <th className="text-right">Last edited</th>
//               </tr>
//             </thead>
//             <tbody>
//               {isLoading ? (
//                 <tr>
//                   <td colSpan="7" className="text-center py-4">
//                     Loading templates...
//                   </td>
//                 </tr>
//               ) : filteredTemplates.length === 0 ? (
//                 <tr>
//                   <td colSpan="7" className="text-center py-4">
//                     No templates found
//                   </td>
//                 </tr>
//               ) : (
//                 filteredTemplates.map((template, index) => (
//                   <tr key={index}>
//                     <td>{template.name}</td>
//                     <td>{template.category}</td>
//                     <td>{template.language}</td>
//                     <td>
//                       <Badge color={getStatusColor(template.status)} pill>
//                         {template.status}
//                       </Badge>
//                     </td>
//                     <td className="text-right">0</td>
//                     <td className="text-right">0</td>
//                     <td className="text-right">
//                       {new Date().toLocaleDateString()}
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </Table>
//         </div>

//         {/* Bottom Info */}
//         <div className="mt-3 text-muted small">
//           {filteredTemplates.length} message templates shown (total active
//           templates: {templates.length} of 6000)
//         </div>
//       </CardBody>
//     </Card>
//   );
// };

// export default WhatsAppTemplates;
















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

//   const token = localStorage.getItem("token");
//   const location = useLocation();
//   const navigate = useNavigate();

//   // Get companyId from location state or config check
//   useEffect(() => {
//     // Check if companyId is available in the location state
//     if (location.state?.companyId) {
//       setCompanyId(location.state.companyId);
//     }
//     // If no company ID in location state, check localStorage
//     else if (localStorage.getItem("selectedCompanyId")) {
//       setCompanyId(localStorage.getItem("selectedCompanyId"));
//     }
//     // If still no company ID, just log to console (no redirection)
//     else {
//       console.log("No company ID found");
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
//           "http://192.168.0.103:25483/api/v1/messages/fetchTemplates",
//           {
//             companyId: companyId,
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         const data = response.data;

//         if (data.success && data.templates) {
//           setTemplates(data.templates);
//         } else {
//           toast.error("Failed to fetch templates");
//         }
//       } catch (error) {
//         console.error("Error fetching templates:", error);
//         if (error.response?.status === 401) {
//           navigate("/auth/login");
//         }
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchTemplates();
//   }, [companyId, token, navigate]);

//   const filteredTemplates = templates.filter((template) => {
//     const matchesSearch = template.name
//       .toLowerCase()
//       .includes(search.toLowerCase());
//     const matchesCategory =
//       !selectedCategory || template.category === selectedCategory;
//     const matchesLanguage =
//       !selectedLanguage || template.language === selectedLanguage;
//     return matchesSearch && matchesCategory && matchesLanguage;
//   });

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "APPROVED":
//         return "success";
//       case "REJECTED":
//         return "danger";
//       default:
//         return "warning";
//     }
//   };

//   return (
//     <Card className="shadow-sm">
//       <CardHeader className="bg-white">
//         <h4 className="mb-0">WhatsApp Templates</h4>
//         {!companyId && (
//           <div className="text-muted small mt-2">
//             No company selected. Please select a company from the dashboard.
//           </div>
//         )}
//       </CardHeader>
//       <CardBody>
//         {/* Filters Section */}
//         <Row className="mb-4 align-items-end">
//           <Col md={3}>
//             <FormGroup>
//               <Label for="search">Search</Label>
//               <Input
//                 id="search"
//                 type="text"
//                 placeholder="Search templates..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//               />
//             </FormGroup>
//           </Col>
//           <Col md={2}>
//             <FormGroup>
//               <Label for="category">Category</Label>
//               <Input
//                 id="category"
//                 type="select"
//                 value={selectedCategory}
//                 onChange={(e) => setSelectedCategory(e.target.value)}
//               >
//                 <option value="">All Categories</option>
//                 <option value="MARKETING">Marketing</option>
//                 <option value="UTILITY">Utility</option>
//               </Input>
//             </FormGroup>
//           </Col>
//           <Col md={2}>
//             <FormGroup>
//               <Label for="language">Language</Label>
//               <Input
//                 id="language"
//                 type="select"
//                 value={selectedLanguage}
//                 onChange={(e) => setSelectedLanguage(e.target.value)}
//               >
//                 <option value="">All Languages</option>
//                 <option value="en_US">English (US)</option>
//               </Input>
//             </FormGroup>
//           </Col>
//           <Col md={3}>
//             <Button color="primary" className="mt-2">
//               Create Template
//             </Button>
//           </Col>
//         </Row>

//         {/* Table Section */}
//         <div className="table-responsive">
//           <Table hover bordered className="mb-0">
//             <thead>
//               <tr>
//                 <th>Template name</th>
//                 <th>Category</th>
//                 <th>Language</th>
//                 <th>Status</th>
//                 <th className="text-right">Message delivered</th>
//                 <th className="text-right">Message read</th>
//                 <th className="text-right">Last edited</th>
//               </tr>
//             </thead>
//             <tbody>
//               {isLoading ? (
//                 <tr>
//                   <td colSpan="7" className="text-center py-4">
//                     Loading templates...
//                   </td>
//                 </tr>
//               ) : !companyId ? (
//                 <tr>
//                   <td colSpan="7" className="text-center py-4">
//                     Please select a company to view templates
//                   </td>
//                 </tr>
//               ) : filteredTemplates.length === 0 ? (
//                 <tr>
//                   <td colSpan="7" className="text-center py-4">
//                     No templates found
//                   </td>
//                 </tr>
//               ) : (
//                 filteredTemplates.map((template, index) => (
//                   <tr key={index}>
//                     <td>{template.name}</td>
//                     <td>{template.category}</td>
//                     <td>{template.language}</td>
//                     <td>
//                       <Badge color={getStatusColor(template.status)} pill>
//                         {template.status}
//                       </Badge>
//                     </td>
//                     <td className="text-right">0</td>
//                     <td className="text-right">0</td>
//                     <td className="text-right">
//                       {new Date().toLocaleDateString()}
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </Table>
//         </div>

//         {/* Bottom Info */}
//         <div className="mt-3 text-muted small">
//           {filteredTemplates.length} message templates shown (total active
//           templates: {templates.length} of 6000)
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

  const token = localStorage.getItem("token");
  const location = useLocation();
  const navigate = useNavigate();

  // Get companyId and companyName from location state or localStorage
  useEffect(() => {
    if (location.state?.companyId) {
      setCompanyId(location.state.companyId);
      setCompanyName(location.state.companyName || localStorage.getItem("selectedCompanyName") || "");
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
          "http://192.168.0.103:25483/api/v1/messages/fetchTemplates",
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

  return (
    <Card className="shadow-sm">
      <CardHeader className="bg-white d-flex justify-content-between align-items-center">
        <div>
          <h4 className="mb-0">WhatsApp Templates</h4>
          {companyName && (
            <div className="text-primary mt-1">
              {companyName}
            </div>
          )}
        </div>
      </CardHeader>
      <CardBody>
        {/* Filters Section */}
        <Row className="mb-4 align-items-end">
          <Col md={3}>
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
          <Col md={2}>
            <FormGroup>
              <Label for="category">Category</Label>
              <Input
                id="category"
                type="select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="MARKETING">Marketing</option>
                <option value="UTILITY">Utility</option>
              </Input>
            </FormGroup>
          </Col>
          <Col md={2}>
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
          <Col md={3}>
            <Button color="primary" className="mt-2">
              Create Template
            </Button>
          </Col>
        </Row>

        {/* Table Section */}
        <div className="table-responsive">
          <Table hover bordered className="mb-0">
            <thead>
              <tr>
                <th>Template name</th>
                <th>Category</th>
                <th>Language</th>
                <th>Status</th>
                <th className="text-right">Message delivered</th>
                <th className="text-right">Message read</th>
                <th className="text-right">Last edited</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    Loading templates...
                  </td>
                </tr>
              ) : !companyId ? (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    Please select a company to view templates
                  </td>
                </tr>
              ) : filteredTemplates.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    No templates found
                  </td>
                </tr>
              ) : (
                filteredTemplates.map((template, index) => (
                  <tr key={index}>
                    <td>{template.name}</td>
                    <td>{template.category}</td>
                    <td>{template.language}</td>
                    <td>
                      <Badge color={getStatusColor(template.status)} pill>
                        {template.status}
                      </Badge>
                    </td>
                    <td className="text-right">0</td>
                    <td className="text-right">0</td>
                    <td className="text-right">
                      {new Date().toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>

        {/* Bottom Info */}
        <div className="mt-3 text-muted small">
          {filteredTemplates.length} message templates shown (total active
          templates: {templates.length} of 6000)
        </div>
      </CardBody>
    </Card>
  );
};

export default WhatsAppTemplates;