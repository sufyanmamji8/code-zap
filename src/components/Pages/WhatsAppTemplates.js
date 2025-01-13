// import React, { useState, useEffect } from "react";
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

//   useEffect(() => {
//     const fetchTemplates = async () => {
//       try {
//         setIsLoading(true);
//         const response = await fetch(
//           "http://192.168.0.103:25483/api/v1/messages/fetchTemplates",
//           {
//             method: "GET", 
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         const data = await response.json();

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

const WhatsAppTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const token = localStorage.getItem("token");
  const companyId = "67766f5326d48c4790f1fbd1"; // Fixed company ID

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setIsLoading(true);
        const response = await axios.post(
          "https://codozap-e04e12b02929.herokuapp.com/api/v1/messages/fetchTemplates",
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
        }
      } catch (error) {
        console.error("Error fetching templates:", error);
      } finally {
        setIsLoading(false);
      }
    };
    

    fetchTemplates();
  }, [token]);

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
      <CardHeader className="bg-white">
        <h4 className="mb-0">WhatsApp Templates</h4>
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
