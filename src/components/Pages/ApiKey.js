// import React, { useState, useEffect } from 'react';
// import {
//   Card,
//   CardHeader,
//   CardBody,
//   Spinner,
//   Button,
//   Input,
//   InputGroup,
//   InputGroupText,
//   Badge,
//   Alert,
//   Container,
//   Row,
//   Col,
//   UncontrolledTooltip
// } from 'reactstrap';
// import axios from 'axios';
// import { toast } from 'sonner';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { API_KEY_ENDPOINTS } from 'Api/Constant';

// const ApiKey = () => {
//   const [apiKey, setApiKey] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [isKeyVisible, setIsKeyVisible] = useState(false);
//   const [companyId, setCompanyId] = useState(null);
//   const [companyName, setCompanyName] = useState("");
//   const [showRevokeConfirm, setShowRevokeConfirm] = useState(false);

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
//         API_KEY_ENDPOINTS.GET,
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
//         API_KEY_ENDPOINTS.GENERATE,
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
//         API_KEY_ENDPOINTS.REVOKE,
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
//         setShowRevokeConfirm(false);
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
//         <Spinner color="primary" />
//       </div>
//     );
//   }

//   if (!companyId) {
//     return (
//       <Container fluid className="p-4">
//         <Card className="shadow border-0">
//           <CardBody className="text-center p-5">
//             <i className="fas fa-building text-muted mb-4" style={{ fontSize: '3rem' }}></i>
//             <h4 className="mb-3">No Company Selected</h4>
//             <p className="text-muted mb-0">Please select a company to manage API keys</p>
//           </CardBody>
//         </Card>
//       </Container>
//     );
//   }

//   return (
//     <Container fluid className="p-4">
//       <Card className="shadow border-0">
//         <CardHeader className="bg-white border-0 py-4">
//           <Row className="align-items-center">
//             <Col>
//               <h3 className="mb-1">API Key Management</h3>
//               {companyName && (
//                 <Badge color="light" className="text-primary px-3 py-2">
//                   {/* <i className="fas fa-building me-2"></i> */}
//                   {companyName}
//                 </Badge>
//               )}
//             </Col>
//           </Row>
//         </CardHeader>
        
//         <CardBody className="p-4">
//           {apiKey ? (
//             <div className="api-key-section">
//               <Row>
//                 <Col>
//                   <label className="text-uppercase small fw-bold mb-3">Your API Key</label>
//                   <InputGroup size="lg" className="mb-3">
//                     <Input
//                       type={isKeyVisible ? "text" : "password"}
//                       value={apiKey.apiKey}
//                       readOnly
//                       className="border-end-0 bg-light"
//                     />
//                     <InputGroupText 
//                       className="bg-light cursor-pointer"
//                       onClick={() => setIsKeyVisible(!isKeyVisible)}
//                       id="toggleVisibility"
//                     >
//                       <i className={`fas fa-eye${isKeyVisible ? '-slash' : ''}`} />
//                     </InputGroupText>
//                     <InputGroupText 
//                       className="bg-light cursor-pointer"
//                       onClick={() => {
//                         navigator.clipboard.writeText(apiKey.apiKey);
//                         toast.success('API Key copied to clipboard!');
//                       }}
//                       id="copyKey"
//                     >
//                       <i className="fas fa-copy" />
//                     </InputGroupText>
//                     <InputGroupText 
//                       className="bg-light cursor-pointer text-danger"
//                       onClick={() => setShowRevokeConfirm(true)}
//                       id="revokeKey"
//                     >
//                       <i className="fas fa-trash" />
//                     </InputGroupText>
//                   </InputGroup>
                  
//                   <UncontrolledTooltip target="toggleVisibility">
//                     {isKeyVisible ? 'Hide API Key' : 'Show API Key'}
//                   </UncontrolledTooltip>
//                   <UncontrolledTooltip target="copyKey">
//                     Copy to Clipboard
//                   </UncontrolledTooltip>
//                   <UncontrolledTooltip target="revokeKey">
//                     Revoke API Key
//                   </UncontrolledTooltip>

//                   {showRevokeConfirm && (
//                     <Alert color="danger" className="mt-4">
//                       <h5 className="alert-heading">
//                         <i className="fas fa-exclamation-triangle me-2"></i>
//                         Revoke API Key?
//                       </h5>
//                       <p className="mb-3">This action cannot be undone. All applications using this API key will stop working immediately.</p>
//                       <div className="d-flex gap-2">
//                         <Button color="danger" size="sm" onClick={handleRevokeApiKey}>
//                           Yes, Revoke Key
//                         </Button>
//                         <Button color="secondary" size="sm" onClick={() => setShowRevokeConfirm(false)}>
//                           Cancel
//                         </Button>
//                       </div>
//                     </Alert>
//                   )}

//                   <Alert color="warning" className="mt-4">
//                     <div className="d-flex align-items-center">
//                       <i className="fas fa-shield-alt fs-4 me-3"></i>
//                       <div>
//                         <h5 className="alert-heading mb-1">Security Notice</h5>
//                         <p className="mb-0 ">
//                           Keep your API key secure and never share it publicly. This key provides full access to your account's API capabilities.
//                         </p>
//                       </div>
//                     </div>
//                   </Alert>
//                 </Col>
//               </Row>
//             </div>
//           ) : (
//             <div className="text-center py-5">
//               <div className="mb-4">
//                 <i className="fas fa-key text-primary" style={{ fontSize: '3rem' }}></i>
//               </div>
//               <h3 className="mb-3">No API Key Found</h3>
//               <p className="text-muted mb-4">Generate an API key to start integrating with our services</p>
//               <Button
//                 color="primary"
//                 size="lg"
//                 className="px-4 py-2"
//                 onClick={handleGenerateApiKey}
//                 disabled={isGenerating}
//               >
//                 {isGenerating ? (
//                   <>
//                     <Spinner size="sm" className="me-2" />
//                     Generating...
//                   </>
//                 ) : (
//                   <>
//                     <i className="fas fa-plus-circle me-2"></i>
//                     Generate New API Key
//                   </>
//                 )}
//               </Button>
//             </div>
//           )}
//         </CardBody>
//       </Card>

//       <style jsx>{`
//         .cursor-pointer {
//           cursor: pointer;
//           transition: all 0.2s ease;
//         }
        
//         .cursor-pointer:hover {
//           opacity: 0.8;
//         }

//         .api-key-section {
//           animation: fadeIn 0.3s ease;
//         }

//         @keyframes fadeIn {
//           from {
//             opacity: 0;
//             transform: translateY(10px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//       `}</style>
//     </Container>
//   );
// };

// export default ApiKey;










import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Input,
  InputGroup,
  InputGroupText,
  Badge,
  Alert,
  Container,
  Row,
  Col,
  UncontrolledTooltip
} from 'reactstrap';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import axios from 'axios';
import { toast } from 'sonner';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_KEY_ENDPOINTS } from 'Api/Constant';
import { Key, Eye, EyeOff, Copy, Trash2, Shield, Building, AlertTriangle } from 'lucide-react';

const ApiKey = () => {
  const [apiKey, setApiKey] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isKeyVisible, setIsKeyVisible] = useState(false);
  const [companyId, setCompanyId] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [showRevokeConfirm, setShowRevokeConfirm] = useState(false);
  const [apiLoading, setApiLoading] = useState(false);

  const token = localStorage.getItem('token');
  const location = useLocation();
  const navigate = useNavigate();

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

  const fetchExistingApiKey = async () => {
    if (!companyId || !token) {
      setIsLoading(false);
      return;
    }

    setApiLoading(true);
    try {
      const response = await axios.post(
        API_KEY_ENDPOINTS.GET,
        { companyId },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        setApiKey(response.data.data);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        navigate("/auth/login");
      } else if (error.response?.status !== 404) {
        console.error('Error fetching API key:', error);
        toast.error('Error loading API key');
      }
    } finally {
      setIsLoading(false);
      setApiLoading(false);
    }
  };

  const handleGenerateApiKey = async () => {
    setIsGenerating(true);
    setApiLoading(true);
    try {
      const response = await axios.post(
        API_KEY_ENDPOINTS.GENERATE,
        { companyId },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        setApiKey(response.data.data);
        toast.success('🎉 API Key generated successfully!');
        setIsKeyVisible(true);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        navigate("/auth/login");
      } else {
        toast.error('Failed to generate API key');
      }
    } finally {
      setIsGenerating(false);
      setApiLoading(false);
    }
  };

  const handleRevokeApiKey = async () => {
    if (!apiKey?._id || !companyId) {
      toast.error('Missing required information');
      return;
    }
  
    setApiLoading(true);
    try {
      const response = await axios.post(
        API_KEY_ENDPOINTS.REVOKE,
        { 
          id: apiKey._id,
          companyId 
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        setApiKey(null);
        setIsKeyVisible(false);
        setShowRevokeConfirm(false);
        toast.success('🔒 API Key revoked successfully!');
      }
    } catch (error) {
      if (error.response?.status === 401) {
        navigate("/auth/login");
      } else {
        toast.error('Failed to revoke API key');
      }
    } finally {
      setApiLoading(false);
    }
  };

  useEffect(() => {
    fetchExistingApiKey();
  }, [companyId, token]);

  // Inline CSS styles
  const styles = `
    .api-key-page {
      background: #f8fafc;
      min-height: 100vh;
    }

    .api-key-card {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
    }

    .card-header-custom {
      background:  #4c67c7ff;
      color: white;
      border-radius: 12px 12px 0 0;
      border: none;
    }

    .company-badge {
      background: rgba(255, 255, 255, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 8px;
      padding: 6px 12px;
      font-size: 0.875rem;
      color: white;
    }

    .form-control-custom {
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 12px 16px;
      font-size: 14px;
      font-family: 'Monaco', 'Consolas', monospace;
      background: #f8fafc;
    }

    .input-group-custom .input-group-text {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-left: none;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .input-group-custom .input-group-text:hover {
      background: #e2e8f0;
    }

    .input-group-custom .input-group-text:last-child {
      border-radius: 0 8px 8px 0;
    }

    .input-group-custom .input-group-text:first-child {
      border-radius: 8px 0 0 8px;
      border-left: 1px solid #cbd5e1;
    }

    .btn-primary-custom {
      background: #25D366;
      border: none;
      border-radius: 8px;
      font-weight: 500;
      padding: 12px 24px;
    }

    .btn-primary-custom:hover:not(:disabled) {
      background: #128C7E;
      transform: translateY(-1px);
    }

    .btn-danger-custom {
      background: #dc2626;
      border: none;
      border-radius: 8px;
      font-weight: 500;
    }

    .btn-outline-custom {
      background: #f8fafc;
      color: #475569;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      font-weight: 500;
    }

    .alert-custom {
      border-radius: 8px;
      border: none;
    }

    .alert-warning-custom {
      background: #fef3c7;
      border: 1px solid #f59e0b;
    }

    .alert-danger-custom {
      background: #fef2f2;
      border: 1px solid #fecaca;
    }

    .icon-container {
      background: rgba(37, 211, 102, 0.1);
      border-radius: 10px;
      padding: 12px;
      display: inline-flex;
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

  // Show loader when API is in progress
  if (apiLoading) {
    return (
      <div className="loading-overlay">
        <DotLottieReact
          src="https://lottie.host/5060de43-85ac-474a-a85b-892f9730e17a/b3jJ1vGkWh.lottie"
          loop
          autoplay
          style={{ width: "120px", height: "120px" }}
        />
        <p className="mt-3 fw-semibold" style={{ color: '#075E54' }}>Processing your request...</p>
      </div>
    );
  }

  if (!companyId) {
    return (
      <div className="api-key-page">
        <style>{styles}</style>
        <Container style={{ marginTop: '2rem' }}>
          <Card className="api-key-card shadow-sm">
            <CardBody className="text-center p-5">
              <div className="d-flex justify-content-center mb-4">
                <div className="icon-container">
                  <Building size={32} color="#075E54" />
                </div>
              </div>
              <h4 className="fw-bold mb-3" style={{ color: '#1a202c' }}>No Company Selected</h4>
              <p className="text-muted mb-0">Please select a company to manage API keys</p>
            </CardBody>
          </Card>
        </Container>
      </div>
    );
  }

  return (
    <div className="api-key-page">
      <style>{styles}</style>
      <Container style={{ marginTop: '0rem' }}>
        <Card className="api-key-card shadow-sm " >
          <CardHeader className="card-header-custom p-4" style={{ marginTop: '8rem' }}>
            <Row className="align-items-center">
              <Col>
                <div className="d-flex align-items-center mb-2 ">
                  <Key size={24} className="me-3" color="white" />
                  <h3 className="mb-0 fw-bold">API Key Management</h3>
                </div>
                {companyName && (
                  <Badge className="company-badge">
                    {companyName}
                  </Badge>
                )}
              </Col>
            </Row>
          </CardHeader>
          
          <CardBody className="p-4">
            {apiKey ? (
              <div className="api-key-section">
                <Row>
                  <Col>
                    <label className="fw-bold mb-3 d-flex align-items-center small text-uppercase text-muted">
                      <Key size={16} className="me-2" />
                      Your API Key
                    </label>
                    <InputGroup className="input-group-custom mb-4">
                      <Input
                        type={isKeyVisible ? "text" : "password"}
                        value={apiKey.apiKey}
                        readOnly
                        className="form-control-custom"
                      />
                      <InputGroupText 
                        onClick={() => setIsKeyVisible(!isKeyVisible)}
                        id="toggleVisibility"
                      >
                        {isKeyVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                      </InputGroupText>
                      <InputGroupText 
                        onClick={() => {
                          navigator.clipboard.writeText(apiKey.apiKey);
                          toast.success('📋 API Key copied to clipboard!');
                        }}
                        id="copyKey"
                      >
                        <Copy size={16} />
                      </InputGroupText>
                      <InputGroupText 
                        onClick={() => setShowRevokeConfirm(true)}
                        id="revokeKey"
                        style={{ background: '#fef2f2', borderColor: '#fecaca' }}
                      >
                        <Trash2 size={16} color="#dc2626" />
                      </InputGroupText>
                    </InputGroup>
                    
                    <UncontrolledTooltip target="toggleVisibility">
                      {isKeyVisible ? 'Hide API Key' : 'Show API Key'}
                    </UncontrolledTooltip>
                    <UncontrolledTooltip target="copyKey">
                      Copy to Clipboard
                    </UncontrolledTooltip>
                    <UncontrolledTooltip target="revokeKey">
                      Revoke API Key
                    </UncontrolledTooltip>

                    {showRevokeConfirm && (
                      <Alert className="alert-custom alert-danger-custom mt-4">
                        <div className="d-flex align-items-start">
                          <AlertTriangle size={20} className="me-3 mt-1" color="#dc2626" />
                          <div className="flex-grow-1">
                            <h5 className="fw-bold mb-2" style={{ color: '#991b1b' }}>Revoke API Key?</h5>
                            <p className="mb-3" style={{ color: '#991b1b' }}>
                              This action cannot be undone. All applications using this API key will stop working immediately.
                            </p>
                            <div className="d-flex gap-2">
                              <Button 
                                className="btn-danger-custom"
                                onClick={handleRevokeApiKey}
                                size="sm"
                              >
                                <Trash2 size={16} className="me-2" />
                                Yes, Revoke Key
                              </Button>
                              <Button 
                                className="btn-outline-custom"
                                onClick={() => setShowRevokeConfirm(false)}
                                size="sm"
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Alert>
                    )}

                    <Alert className="alert-custom alert-warning-custom mt-4">
                      <div className="d-flex align-items-start">
                        <Shield size={20} className="me-3 mt-1" color="#d97706" />
                        <div>
                          <h5 className="fw-bold mb-2" style={{ color: '#92400e' }}>Security Notice</h5>
                          <p className="mb-0" style={{ color: '#92400e' }}>
                            Keep your API key secure and never share it publicly. This key provides full access to your account's API capabilities.
                          </p>
                        </div>
                      </div>
                    </Alert>
                  </Col>
                </Row>
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="mb-4">
                  <div className="icon-container">
                    <Key size={32} color="#075E54" />
                  </div>
                </div>
                <h3 className="fw-bold mb-3" style={{ color: '#1a202c' }}>No API Key Found</h3>
                <p className="text-muted mb-4">Generate an API key to start integrating with our services</p>
                <Button
                  className="btn-primary-custom"
                  onClick={handleGenerateApiKey}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <div className="d-flex align-items-center">
                      <div className="spinner-border spinner-border-sm me-2" role="status" />
                      Generating...
                    </div>
                  ) : (
                    <div className="d-flex align-items-center">
                      <Key size={18} className="me-2" />
                      Generate New API Key
                    </div>
                  )}
                </Button>
              </div>
            )}
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default ApiKey;