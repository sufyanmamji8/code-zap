import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Spinner,
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
import axios from 'axios';
import { toast } from 'sonner';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_KEY_ENDPOINTS } from 'Api/Constant';

const ApiKey = () => {
  const [apiKey, setApiKey] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isKeyVisible, setIsKeyVisible] = useState(false);
  const [companyId, setCompanyId] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [showRevokeConfirm, setShowRevokeConfirm] = useState(false);

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
    }
  };


  const handleGenerateApiKey = async () => {
    setIsGenerating(true);
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
        toast.success('API Key generated successfully!');
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
    }
  };

  const handleRevokeApiKey = async () => {
    if (!apiKey?._id || !companyId) {
      toast.error('Missing required information');
      return;
    }
  
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
        toast.success('API Key revoked successfully!');
      }
    } catch (error) {
      if (error.response?.status === 401) {
        navigate("/auth/login");
      } else {
        toast.error('Failed to revoke API key');
      }
    }
  };

  useEffect(() => {
    fetchExistingApiKey();
  }, [companyId, token]);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-75">
        <Spinner color="primary" />
      </div>
    );
  }

  if (!companyId) {
    return (
      <Container fluid className="p-4">
        <Card className="shadow border-0">
          <CardBody className="text-center p-5">
            <i className="fas fa-building text-muted mb-4" style={{ fontSize: '3rem' }}></i>
            <h4 className="mb-3">No Company Selected</h4>
            <p className="text-muted mb-0">Please select a company to manage API keys</p>
          </CardBody>
        </Card>
      </Container>
    );
  }

  return (
    <Container fluid className="p-4">
      <Card className="shadow border-0">
        <CardHeader className="bg-white border-0 py-4">
          <Row className="align-items-center">
            <Col>
              <h3 className="mb-1">API Key Management</h3>
              {companyName && (
                <Badge color="light" className="text-primary px-3 py-2">
                  {/* <i className="fas fa-building me-2"></i> */}
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
                  <label className="text-uppercase small fw-bold mb-3">Your API Key</label>
                  <InputGroup size="lg" className="mb-3">
                    <Input
                      type={isKeyVisible ? "text" : "password"}
                      value={apiKey.apiKey}
                      readOnly
                      className="border-end-0 bg-light"
                    />
                    <InputGroupText 
                      className="bg-light cursor-pointer"
                      onClick={() => setIsKeyVisible(!isKeyVisible)}
                      id="toggleVisibility"
                    >
                      <i className={`fas fa-eye${isKeyVisible ? '-slash' : ''}`} />
                    </InputGroupText>
                    <InputGroupText 
                      className="bg-light cursor-pointer"
                      onClick={() => {
                        navigator.clipboard.writeText(apiKey.apiKey);
                        toast.success('API Key copied to clipboard!');
                      }}
                      id="copyKey"
                    >
                      <i className="fas fa-copy" />
                    </InputGroupText>
                    <InputGroupText 
                      className="bg-light cursor-pointer text-danger"
                      onClick={() => setShowRevokeConfirm(true)}
                      id="revokeKey"
                    >
                      <i className="fas fa-trash" />
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
                    <Alert color="danger" className="mt-4">
                      <h5 className="alert-heading">
                        <i className="fas fa-exclamation-triangle me-2"></i>
                        Revoke API Key?
                      </h5>
                      <p className="mb-3">This action cannot be undone. All applications using this API key will stop working immediately.</p>
                      <div className="d-flex gap-2">
                        <Button color="danger" size="sm" onClick={handleRevokeApiKey}>
                          Yes, Revoke Key
                        </Button>
                        <Button color="secondary" size="sm" onClick={() => setShowRevokeConfirm(false)}>
                          Cancel
                        </Button>
                      </div>
                    </Alert>
                  )}

                  <Alert color="warning" className="mt-4">
                    <div className="d-flex align-items-center">
                      <i className="fas fa-shield-alt fs-4 me-3"></i>
                      <div>
                        <h5 className="alert-heading mb-1">Security Notice</h5>
                        <p className="mb-0 ">
                          Keep your API key secure and never share it publicly. This key provides full access to your account's API capabilities.
                        </p>
                      </div>
                    </div>
                  </Alert>
                </Col>
              </Row>
            </div>
          ) : (
            <div className="text-center py-5">
              <div className="mb-4">
                <i className="fas fa-key text-primary" style={{ fontSize: '3rem' }}></i>
              </div>
              <h3 className="mb-3">No API Key Found</h3>
              <p className="text-muted mb-4">Generate an API key to start integrating with our services</p>
              <Button
                color="primary"
                size="lg"
                className="px-4 py-2"
                onClick={handleGenerateApiKey}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <i className="fas fa-plus-circle me-2"></i>
                    Generate New API Key
                  </>
                )}
              </Button>
            </div>
          )}
        </CardBody>
      </Card>

      <style jsx>{`
        .cursor-pointer {
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .cursor-pointer:hover {
          opacity: 0.8;
        }

        .api-key-section {
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </Container>
  );
};

export default ApiKey;