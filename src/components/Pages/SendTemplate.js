import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import {
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Label,
  Input,
  Button,
  Alert,
  Spinner,
  InputGroup,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import axios from 'axios';
import { toast } from 'sonner';
import { countryList } from './countryList';
import '../../assets/css/SendTemplate.css';  // Import the CSS file

const SendTemplate = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [template, setTemplate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [apiKey, setApiKey] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(
    countryList.find(country => country.code === '91') || countryList[0]
  );
  const [formData, setFormData] = useState({
    to: '',
    templateName: location.state?.templateName || '',
    templateLanguage: 'en_US',
    components: [],
    companyId: location.state?.companyId || ''
  });
  const [isSending, setIsSending] = useState(false);
  const token = localStorage.getItem('token');
  const [headerParams, setHeaderParams] = useState({
    mediaUrl: '',
    latitude: '',
    longitude: '',
    locationName: '',
    locationAddress: ''
  });

  const filteredCountries = countryList.filter(country =>
    country.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
    country.code.includes(searchQuery)
  );

  const extractTemplateParameters = (template) => {
    if (!template) return [];
    
    const bodyComponent = template.components.find(c => c.type === 'BODY');
    if (!bodyComponent || !bodyComponent.text) return [];
  
    const paramRegex = /\{\{([^}]+)\}\}/g;
    const params = [];
    let match;
    
    const fullText = bodyComponent.text;
    
    while ((match = paramRegex.exec(fullText)) !== null) {
      const paramNumber = match[1];
      
      // Find context by analyzing surrounding text
      let startPos = Math.max(0, match.index - 50);
      let contextText = fullText.substring(startPos, match.index).trim();
      
      // Try to find the nearest sentence or phrase before the parameter
      let contextWords = contextText.split(/[.,!?]\s*/).pop() || '';
      if (contextWords.includes(':')) {
        contextWords = contextWords.split(':').pop().trim();
      } else if (contextWords.includes('-')) {
        contextWords = contextWords.split('-').pop().trim();
      }
      
      contextWords = contextWords.replace(/^\W+|\W+$/g, '').trim();
      
      params.push({
        index: paramNumber,
        original: match[0],
        context: contextWords || `Variable ${paramNumber}`,
        value: ''
      });
    }
    
    return params.sort((a, b) => a.index - b.index);
  };

  const handleHeaderParamChange = (key, value) => {
    setHeaderParams(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const fetchTemplateDetails = async () => {
    if (!formData.companyId || !token) return;

    try {
      const response = await axios.post(
        'http://192.168.0.106:25483/api/v1/messages/fetchTemplates',
        {
          companyId: formData.companyId
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        const selectedTemplate = response.data.templates.find(
          t => t.name === location.state?.templateName
        );

        if (selectedTemplate) {
          setTemplate(selectedTemplate);
          
          const initialComponents = [];
          
          const headerComponent = selectedTemplate.components.find(c => c.type === 'HEADER');
          if (headerComponent) {
            initialComponents.push({
              type: 'header',
              parameters: []
            });
          }
          
          const bodyComponent = selectedTemplate.components.find(c => c.type === 'BODY');
          if (bodyComponent) {
            const params = extractTemplateParameters(selectedTemplate);
            initialComponents.push({
              type: 'body',
              parameters: params.map(() => ({
                type: 'text',
                text: ''
              }))
            });
          }

          setFormData(prev => ({
            ...prev,
            components: initialComponents
          }));
        }
      } else {
        toast.error('Failed to load template details');
      }
    } catch (error) {
      console.error('Error fetching template details:', error);
      if (error.response?.status === 401) {
        navigate('/auth/login');
      } else {
        toast.error('Failed to load template details');
      }
    }
  };

  const fetchApiKey = async () => {
    if (!formData.companyId || !token) return;

    try {
      const response = await axios.post(
        'http://192.168.0.106:25483/api/v1/apiKey/get-Api-Key',
        { companyId: formData.companyId },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        setApiKey(response.data.data);
      } else {
        setApiKey(null);
      }
    } catch (error) {
      setApiKey(null);
      if (error.response?.status === 401) {
        navigate('/auth/login');
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!formData.companyId || !token) {
        setIsLoading(false);
        return;
      }
  
      setIsLoading(true);
      try {
        const response = await axios.post(
          'http://192.168.0.106:25483/api/v1/messages/fetchTemplates',
          {
            companyId: formData.companyId
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
  
        if (response.data.success) {
          const selectedTemplate = response.data.templates.find(
            t => t.name === location.state?.templateName
          );
  
          if (selectedTemplate) {
            setTemplate(selectedTemplate);
            
            const initialComponents = [];
            
            const headerComponent = selectedTemplate.components.find(c => c.type === 'HEADER');
            if (headerComponent) {
              initialComponents.push({
                type: 'header',
                parameters: [{
                  type: headerComponent.format.toLowerCase(),
                  [headerComponent.format.toLowerCase()]: {
                    link: ''
                  }
                }]
              });
            }
            
            const bodyComponent = selectedTemplate.components.find(c => c.type === 'BODY');
            if (bodyComponent) {
              const params = extractTemplateParameters(selectedTemplate);
              initialComponents.push({
                type: 'body',
                parameters: params.map(() => ({
                  type: 'text',
                  text: ''
                }))
              });
            }
  
            setFormData(prev => ({
              ...prev,
              templateName: selectedTemplate.name,
              templateLanguage: selectedTemplate.language,
              components: initialComponents
            }));
          }
        }
        await fetchApiKey();
      } catch (error) {
        console.error('Error:', error);
        toast.error('Failed to load template details');
        if (error.response?.status === 401) {
          navigate('/auth/login');
        }
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, [location.state, token, formData.companyId]);

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setDropdownOpen(false);
    
    const phoneWithoutCode = formData.to.replace(/^\+?\d+/, '');
    setFormData(prev => ({
      ...prev,
      to: `+${country.code}${phoneWithoutCode}`
    }));
  };

  const handlePhoneChange = (value) => {
    const cleanedValue = value.replace(/[^\d+]/g, '');
    
    let formattedValue = cleanedValue;
    if (!cleanedValue.startsWith('+')) {
      formattedValue = `+${selectedCountry.code}${cleanedValue.replace(/^\+?\d+/, '')}`;
    }

    setFormData(prev => ({
      ...prev,
      to: formattedValue
    }));
  };

  const handleParameterChange = (index, value) => {
    setFormData(prev => {
      const updatedComponents = [...prev.components];
      const bodyComponent = updatedComponents.find(c => c.type === 'body');
      if (bodyComponent && bodyComponent.parameters[index]) {
        bodyComponent.parameters[index].text = value;
      }
      return {
        ...prev,
        components: updatedComponents
      };
    });
  };

  const getPreviewText = () => {
    if (!template) return '';
  
    const bodyComponent = template.components.find(c => c.type === 'BODY');
    if (!bodyComponent) return '';
  
    let previewText = bodyComponent.text;
    const parameters = formData.components.find(c => c.type === 'body')?.parameters || [];
  
    parameters.forEach((param, index) => {
      const value = param.text || `{{${index + 1}}}`;
      previewText = previewText.replace(
        new RegExp(`\\{\\{${index + 1}\\}\\}`, 'g'), 
        value
      );
    });
  
    return previewText;
  };

  const getCurlCommand = () => {
    if (!template) return '';
  
    const bodyComponent = formData.components.find(c => c.type === 'body');
    const headerComponent = formData.components.find(c => c.type === 'header');
    const bodyParams = extractTemplateParameters(template);
  
    const data = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: formData.to || 'Enter phone number',
      type: "template",
      template: {
        name: formData.templateName,
        language: {
          code: formData.templateLanguage
        },
        components: []
      }
    };
  
    // Add header parameters if they exist
    if (headerComponent) {
      const headerFormat = template.components.find(c => c.type === 'HEADER')?.format;
      const headerParam = {
        type: 'header',
        parameters: []
      };
  
      if (headerFormat === 'IMAGE' && headerParams.mediaUrl) {
        headerParam.parameters.push({
          type: 'image',
          image: { link: headerParams.mediaUrl }
        });
      } else if (headerFormat === 'VIDEO' && headerParams.mediaUrl) {
        headerParam.parameters.push({
          type: 'video',
          video: { link: headerParams.mediaUrl }
        });
      } else if (headerFormat === 'DOCUMENT' && headerParams.mediaUrl) {
        headerParam.parameters.push({
          type: 'document',
          document: { link: headerParams.mediaUrl }
        });
      } else if (headerFormat === 'LOCATION') {
        headerParam.parameters.push({
          type: 'location',
          location: {
            latitude: parseFloat(headerParams.latitude) || 0,
            longitude: parseFloat(headerParams.longitude) || 0,
            name: headerParams.locationName || '',
            address: headerParams.locationAddress || ''
          }
        });
      }
  
      if (headerParam.parameters.length > 0) {
        data.template.components.push(headerParam);
      }
    }
  
    // Add body parameters
    if (bodyComponent && bodyParams.length > 0) {
      const bodyParam = {
        type: 'body',
        parameters: bodyComponent.parameters.map((param, index) => ({
          type: 'text',
          text: param.text || `[Parameter ${index + 1}]`
        }))
      };
      data.template.components.push(bodyParam);
    }
  
    const formattedJson = JSON.stringify(data, null, 2);
    const authHeader = apiKey 
      ? `--header 'Authorization: Bearer ${apiKey}'`
      : '# Please generate an API key first';
  
    return `curl --location 'http://192.168.0.106:25483/api/v1/messages/sendTemplate' \\
  ${authHeader} \\
  --header 'Content-Type: application/json' \\
  --data '${formattedJson}'`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.companyId || !token) {
      toast.error('Missing required information');
      return;
    }
  
    setIsSending(true);
  
    try {
      const payload = {
        to: formData.to,
        templateName: formData.templateName,
        templateLanguage: formData.templateLanguage,
        companyId: formData.companyId,
        components: formData.components.map(component => {
          if (component.type === 'header') {
            const headerFormat = template.components.find(c => c.type === 'HEADER')?.format.toLowerCase();
            return {
              type: 'header',
              parameters: [{
                type: headerFormat,
                [headerFormat]: {
                  link: headerParams.mediaUrl
                }
              }]
            };
          }
          return component;
        })
      };
  
      const response = await axios.post(
        'http://192.168.0.106:25483/api/v1/messages/sendTemplate',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      if (response.data.success) {
        toast.success('Template message sent successfully!');
        navigate('/admin/dashboard', { 
          state: { companyId: formData.companyId } 
        });
      } else {
        // Stay on the same page and show error toast
        toast.error(response.data.message || 'Failed to send template');
      }
    } catch (error) {
      console.error('Error sending template:', error);
      if (error.response?.status === 401) {
        navigate('/auth/login');
      } else {
        // Stay on the same page and show detailed error message
        const errorMessage = error.response?.data?.message || 'Error sending template message';
        toast.error(errorMessage, {
          duration: 5000, // Show for 5 seconds to ensure user sees it
        });
      }
    } finally {
      setIsSending(false);
    }
  };

  const renderHeaderParams = () => {
    if (!template) return null;
    const headerComponent = template.components.find(c => c.type === 'HEADER');
    if (!headerComponent) return null;
  
    switch (headerComponent.format) {
      case 'IMAGE':
      case 'VIDEO':
      case 'DOCUMENT':
        return (
          <FormGroup>
            <Label>Media URL for {headerComponent.format.toLowerCase()}</Label>
            <Input
              type="url"
              placeholder={`Enter ${headerComponent.format.toLowerCase()} URL`}
              value={headerParams.mediaUrl}
              onChange={(e) => handleHeaderParamChange('mediaUrl', e.target.value)}
              required
            />
          </FormGroup>
        );
      case 'LOCATION':
        return (
          <>
            <FormGroup>
              <Label>Latitude</Label>
              <Input
                type="number"
                step="any"
                placeholder="Enter latitude"
                value={headerParams.latitude}
                onChange={(e) => handleHeaderParamChange('latitude', e.target.value)}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>Longitude</Label>
              <Input
                type="number"
                step="any"
                placeholder="Enter longitude"
                value={headerParams.longitude}
                onChange={(e) => handleHeaderParamChange('longitude', e.target.value)}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>Location Name</Label>
              <Input
                type="text"
                placeholder="Enter location name"
                value={headerParams.locationName}
                onChange={(e) => handleHeaderParamChange('locationName', e.target.value)}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>Address</Label>
              <Input
                type="text"
                placeholder="Enter address"
                value={headerParams.locationAddress}
                onChange={(e) => handleHeaderParamChange('locationAddress', e.target.value)}
                required
              />
            </FormGroup>
          </>
        );
      default:
        return null;
    }
  };

  const renderDynamicFields = () => {
    const params = extractTemplateParameters(template);
    return params.map((param, index) => (
      <FormGroup key={index}>
        <Label>{param.context}</Label>
        <Input
          placeholder={`Enter ${param.context.toLowerCase()}`}
          value={formData.components.find(c => c.type === 'body')?.parameters[index]?.text || ''}
          onChange={(e) => handleParameterChange(index, e.target.value)}
          required
        />
      </FormGroup>
    ));
  };

  if (isLoading) {
    return (
      <div className="loading-overlay">
        <div className="loader-container">
          <DotLottieReact
            src="https://lottie.host/5060de43-85ac-474a-a85b-892f9730e17a/b3jJ1vGkWh.lottie"
            loop
            autoplay
            style={{ width: '200px', height: '200px' }}
          />
        </div>
        <style jsx>{`
          .loading-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(255, 255, 255, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
          }
          .loader-container {
            display: flex;
            justify-content: center;
            align-items: center;
          }
        `}</style>
      </div>
    );
  }

  if (!template) {
    return <div>Template not found</div>;
  }

  return (
    <div className="container-fluid p-4">
      <div className="row mb-4">
        <div className="col-12">
          <Card className="shadow">
            <CardHeader>
              <h4 className="mb-0">API Request</h4>
            </CardHeader>
            <CardBody>
              <div className="bg-light p-3 rounded">
                <div className="d-flex justify-content-end mb-2">
                  <Button
                    color="primary"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(getCurlCommand());
                      toast.success('Curl command copied!');
                    }}
                  >
                    <i className="fas fa-copy me-2"></i>
                    Copy to Clipboard
                  </Button>
                </div>
                <pre className="m-0">
                  <code>{getCurlCommand()}</code>
                </pre>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <Card className="shadow">
            <CardHeader>
              <h4 className="mb-0">
                <i 
                  className="fas fa-arrow-left me-2 cursor-pointer" 
                  onClick={() => window.history.back()}
                  style={{ cursor: 'pointer' }}
                />
                {template.name} ({template.language})
              </h4>
              <div className="mt-2">
                <span className={`badge bg-${template.status === 'APPROVED' ? 'success' : 'danger'}`}>
                  {template.status}
                </span>
              </div>
            </CardHeader>
            <CardBody>
              <form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label>Recipient's Phone Number</Label>
                  <InputGroup>
                    <Dropdown isOpen={dropdownOpen} toggle={() => setDropdownOpen(!dropdownOpen)}>
                      <DropdownToggle caret className="d-flex align-items-center" style={{ minWidth: '120px' }}>
                        <span className="me-1">{selectedCountry.flag}</span>
                        +{selectedCountry.code}
                      </DropdownToggle>
                      <DropdownMenu style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        <Input
                          type="text"
                          placeholder="Search countries..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          className="mx-2 mb-2"
                          style={{ width: '90%' }}
                        />
                        {filteredCountries.map((country) => (
                          <DropdownItem 
                            key={country.code} 
                            onClick={() => handleCountrySelect(country)}
                            className="d-flex align-items-center"
                          >
                            <span className="me-2">{country.flag}</span>
                            <span className="me-2">{country.country}</span>
                            <span className="text-muted">+{country.code}</span>
                          </DropdownItem>
                        ))}
                      </DropdownMenu>
                    </Dropdown>
                    <Input
                      type="tel"
                      placeholder="Enter phone number"
                      value={formData.to}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      required
                    />
                  </InputGroup>
                </FormGroup>

                {renderDynamicFields()}
                {renderHeaderParams()}

                <Button 
                  color="primary" 
                  type="submit" 
                  className="mt-4 w-100"
                  disabled={isSending || template.status !== 'APPROVED'}
                >
                  {isSending ? <Spinner size="sm" /> : 'Send Message'}
                </Button>

                {template.status !== 'APPROVED' && (
                  <Alert color="warning" className="mt-3">
                    This template is not approved and cannot be sent.
                  </Alert>
                )}
              </form>
            </CardBody>
          </Card>
        </div>

        <div className="col-md-6">
          <Card className="shadow">
            <CardHeader>
              <h4 className="mb-0">Preview</h4>
            </CardHeader>
            <CardBody>
              <div className="preview-container">
                <div className="message-bubble">
                  {template.components.find(c => c.type === 'HEADER')?.format === 'IMAGE' && (
                    <div className="preview-image mb-3">
                      {headerParams.mediaUrl ? (
                        <img 
                          src={headerParams.mediaUrl} 
                          alt="Preview" 
                          className="rounded img-fluid"
                          onError={(e) => e.target.style.display = 'none'}
                        />
                      ) : (
                        <div className="placeholder-image">
                          <i className="fas fa-image fa-2x text-muted"></i>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="message-text">{getPreviewText()}</div>
                  {template.components.find(c => c.type === 'FOOTER') && (
                    <div className="message-footer text-muted mt-3">
                      {template.components.find(c => c.type === 'FOOTER').text}
                    </div>
                  )}
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};
export default SendTemplate;