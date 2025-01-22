// import React, { useState, useEffect } from 'react';
// import { Card, CardHeader, CardBody, Spinner } from 'reactstrap';
// import axios from 'axios';
// import { toast } from 'sonner';
// import { useLocation, useNavigate } from 'react-router-dom';

// const ApiKey = () => {
//   const [apiKey, setApiKey] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [isKeyVisible, setIsKeyVisible] = useState(false);
//   const [companyId, setCompanyId] = useState(null);
//   const [companyName, setCompanyName] = useState("");

//   const token = localStorage.getItem('token');
//   const location = useLocation();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (location.state?.companyId) {
//       setCompanyId(location.state.companyId);
//       setCompanyName(
//         location.state.companyName ||
//           localStorage.getItem("selectedCompanyName") ||
//           ""
//       );
//     } else if (localStorage.getItem("selectedCompanyId")) {
//       setCompanyId(localStorage.getItem("selectedCompanyId"));
//       setCompanyName(localStorage.getItem("selectedCompanyName") || "");
//     }
//   }, [location]);

//   const fetchExistingApiKey = async () => {
//     if (!companyId || !token) {
//       setIsLoading(false);
//       return;
//     }

//     try {
//       const response = await axios.post(
//         'http://192.168.0.108:25483/api/v1/apiKey/get-Api-Key',
//         { companyId },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         }
//       );
      
//       if (response.data.success) {
//         setApiKey(response.data.data);
//       }
//     } catch (error) {
//       if (error.response?.status === 401) {
//         navigate("/auth/login");
//       } else if (error.response?.status !== 404) {
//         console.error('Error fetching API key:', error);
//         toast.error('Error loading API key');
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleGenerateApiKey = async () => {
//     setIsGenerating(true);
//     try {
//       const response = await axios.post(
//         'http://192.168.0.108:25483/api/v1/apiKey/generate-Api-Key',
//         { companyId },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         }
//       );
      
//       if (response.data.success) {
//         setApiKey(response.data.data);
//         toast.success('API Key generated successfully!');
//         setIsKeyVisible(true);
//       }
//     } catch (error) {
//       if (error.response?.status === 401) {
//         navigate("/auth/login");
//       } else {
//         toast.error('Failed to generate API key');
//       }
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   const handleRevokeApiKey = async () => {
//     if (!apiKey?._id || !companyId) {
//       toast.error('Missing required information');
//       return;
//     }
  
//     try {
//       const response = await axios.post(
//         'http://192.168.0.108:25483/api/v1/apiKey/revoke-Api-Key',
//         { 
//           id: apiKey._id,
//           companyId 
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         }
//       );
      
//       if (response.data.success) {
//         setApiKey(null);
//         setIsKeyVisible(false);
//         toast.success('API Key revoked successfully!');
//       }
//     } catch (error) {
//       if (error.response?.status === 401) {
//         navigate("/auth/login");
//       } else {
//         toast.error('Failed to revoke API key');
//       }
//     }
//   };

//   useEffect(() => {
//     fetchExistingApiKey();
//   }, [companyId, token]);

//   if (isLoading) {
//     return (
//       <div className="d-flex justify-content-center align-items-center min-vh-75">
//         <Spinner />
//       </div>
//     );
//   }

//   if (!companyId) {
//     return (
//       <div className="container-fluid p-4">
//         <Card className="shadow-sm border-0">
//           <CardBody>
//             <div className="text-center py-4">
//               <i className="fas fa-building text-muted mb-3" style={{ fontSize: '2rem' }}></i>
//               <p className="mb-0">Please select a company to manage API keys.</p>
//             </div>
//           </CardBody>
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <div className="container-fluid p-4">
//       <Card className="shadow-sm border-0">
//         <CardHeader className="bg-white border-bottom-0">
//           <div className="d-flex align-items-center">
//             <div>
//               <h4 className="mb-0">API Key Management</h4>
//               {companyName && (
//                 <small className="text-muted">{companyName}</small>
//               )}
//             </div>
//           </div>
//         </CardHeader>
//         <CardBody>
//           {apiKey ? (
//             <div className="p-3">
//               <div className="key-container bg-light rounded p-4">
//                 <div className="mb-3">
//                   <label className="text-uppercase small fw-bold text-muted mb-2">API Key</label>
//                   <div className="input-group mb-2">
//                     <input
//                       type={isKeyVisible ? "text" : "password"}
//                       className="form-control form-control-lg bg-white"
//                       value={apiKey.apiKey}
//                       readOnly
//                     />
//                     <span className="input-group-text bg-white border-start-0">
//                       <i
//                         className={`fas fa-eye${isKeyVisible ? '-slash' : ''} text-muted`}
//                         onClick={() => setIsKeyVisible(!isKeyVisible)}
//                         style={{ cursor: 'pointer' }}
//                         title={isKeyVisible ? "Hide API Key" : "Show API Key"}
//                       />
//                     </span>
//                   </div>
//                   <div className="d-flex justify-content-end gap-3 mt-2">
//                     <i 
//                       className="fas fa-copy text-primary icon-hover"
//                       onClick={() => {
//                         navigator.clipboard.writeText(apiKey.apiKey);
//                         toast.success('API Key copied to clipboard!');
//                       }}
//                       title="Copy to Clipboard"
//                     />
//                     <i 
//                       className="fas fa-trash text-danger icon-hover"
//                       onClick={handleRevokeApiKey}
//                       title="Revoke API Key"
//                     />
//                   </div>
//                 </div>
//                 <div className="security-notice mt-3 d-flex align-items-center bg-white rounded p-3">
//                   <i className="fas fa-shield-alt text-warning me-2"></i>
//                   <small className="text-muted">
//                     Keep your API key secure and never share it publicly. This key provides access to your account.
//                   </small>
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <div className="text-center py-5">
//               <div className="mb-3">
//                 <i className="fas fa-key text-primary" style={{ fontSize: '2.5rem' }}></i>
//               </div>
//               <h5 className="mb-3">No API Key Found</h5>
//               <p className="text-muted mb-4">Generate an API key to start integrating with our services</p>
//               <div
//                 className="generate-button d-inline-flex align-items-center gap-2 text-primary"
//                 onClick={handleGenerateApiKey}
//                 style={{ cursor: 'pointer' }}
//               >
//                 {isGenerating ? (
//                   <>
//                     <Spinner size="sm" />
//                     <span>Generating...</span>
//                   </>
//                 ) : (
//                   <>
//                     <i className="fas fa-plus-circle fs-5"></i>
//                     <span className="fw-medium">Generate New API Key</span>
//                   </>
//                 )}
//               </div>
//             </div>
//           )}
//         </CardBody>
//       </Card>

//       <style jsx>{`
//         .key-container {
//           background-color: #f8f9fa;
//           border-radius: 8px;
//           transition: all 0.3s ease;
//         }
        
//         .key-container:hover {
//           box-shadow: 0 0 15px rgba(0,0,0,0.1);
//         }

//         .input-group-text {
//           border-radius: 0 6px 6px 0;
//         }

//         .form-control {
//           border-right: none;
//         }

//         .form-control:read-only {
//           background-color: white !important;
//           cursor: default;
//         }

//         .generate-button {
//           transition: all 0.2s ease;
//         }

//         .generate-button:hover {
//           opacity: 0.8;
//         }

//         .icon-hover {
//           cursor: pointer;
//           font-size: 1.2rem;
//           transition: all 0.2s ease;
//         }

//         .icon-hover:hover {
//           transform: scale(1.1);
//         }
//       `}</style>
//     </div>
//   );
// };

// export default ApiKey;













import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody, Container, Row, Col, Spinner } from 'reactstrap';
import axios from 'axios';

const ApiKey = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://192.168.0.108:25483/api/v1/messages/getTemplates', {
        businessId: "102953305799075",
        companyId: "67766f5326d48c4790f1fbd1"
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTemplates(response.data.data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center p-5">
        <Spinner />
      </div>
    );
  }

  return (
    <Container fluid className="p-4">
      <Row>
        {templates.map((template) => (
          <Col key={template._id} xs={12} md={6} lg={4} className="mb-4">
            <Card>
              <CardHeader className="bg-light">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">{template.templateName}</h5>
                  <small className="text-muted">{template.language}</small>
                </div>
              </CardHeader>
              <CardBody>
                {template.components.map((component, idx) => (
                  <div key={idx} className="mb-3">
                    <small className="text-muted text-uppercase">
                      {component.type}
                    </small>
                    <p className="mb-2">{component.text || 'No content'}</p>
                    {component.media && (
                      <img 
                        src={component.media.link} 
                        alt="Template media" 
                        className="img-fluid rounded"
                      />
                    )}
                  </div>
                ))}
                <small className="text-muted d-block mt-3">
                  Status: {template.status}
                </small>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ApiKey;