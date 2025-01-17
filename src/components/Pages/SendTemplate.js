// import React, { useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { DotLottieReact } from '@lottiefiles/dotlottie-react';
// import {
//   Card,
//   CardHeader,
//   CardBody,
//   FormGroup,
//   Label,
//   Input,
//   Button,
//   Alert,
//   Spinner,
//   InputGroup,
//   Dropdown,
//   DropdownToggle,
//   DropdownMenu,
//   DropdownItem,
// } from 'reactstrap';
// import axios from 'axios';
// import { toast } from 'sonner';
// import { countryList } from './countryList';

// const SendTemplate = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [template, setTemplate] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [apiKey, setApiKey] = useState(null);
//   const [selectedCountry, setSelectedCountry] = useState(
//     countryList.find(country => country.code === '91') || countryList[0]
//   );
//   const [formData, setFormData] = useState({
//     to: '',
//     templateName: location.state?.templateName || '',
//     templateLanguage: 'en_US',
//     templateParameters: {},
//     companyId: location.state?.companyId || ''
//   });
//   const [isSending, setIsSending] = useState(false);
//   const token = localStorage.getItem('token');

//   // Filter countries based on search query
//   const filteredCountries = countryList.filter(country =>
//     country.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     country.code.includes(searchQuery)
//   );

//   const fetchTemplateDetails = async () => {
//     if (!formData.companyId || !token) {
//       return;
//     }

//     try {
//       const response = await axios.post(
//         'http://192.168.0.108:25483/api/v1/messages/fetchTemplates',
//         {
//           companyId: formData.companyId
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       if (response.data.success) {
//         const selectedTemplate = response.data.templates.find(
//           t => t.name === location.state?.templateName
//         );

//         if (selectedTemplate) {
//           setTemplate(selectedTemplate);
//           const bodyComponent = selectedTemplate.components.find(c => c.type === 'BODY');
//           const paramMatches = bodyComponent?.text.match(/{{[0-9]+}}([^{]*)/g) || [];
          
//           const initialParams = {};
//           paramMatches.forEach((match) => {
//             const paramName = match.replace(/{{[0-9]+}}/, '').trim();
//             initialParams[paramName] = '';
//           });

//           setFormData(prev => ({
//             ...prev,
//             templateParameters: initialParams
//           }));
//         }
//       } else {
//         toast.error('Failed to load template details');
//       }
//     } catch (error) {
//       console.error('Error fetching template details:', error);
//       if (error.response?.status === 401) {
//         navigate('/auth/login');
//       } else {
//         toast.error('Failed to load template details');
//       }
//     }
//   };

//   const fetchApiKey = async () => {
//     if (!formData.companyId || !token) return;

//     try {
//       const response = await axios.post(
//         'http://192.168.0.108:25483/api/v1/apiKey/get-Api-Key',
//         { companyId: formData.companyId },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         }
//       );
      
//       if (response.data.success) {
//         setApiKey(response.data.data);
//       } else {
//         setApiKey(null);
//       }
//     } catch (error) {
//       setApiKey(null);
//       if (error.response?.status === 401) {
//         navigate('/auth/login');
//       }
//     }
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       if (!formData.companyId || !token) {
//         setIsLoading(false);
//         return;
//       }

//       setIsLoading(true);
//       try {
//         await fetchTemplateDetails();
//         await fetchApiKey();
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     if (location.state?.templateName) {
//       fetchData();
//     }
//   }, [location.state, token, formData.companyId]);

//   const getCurlCommand = () => {
//     if (!template) return '';
  
//     const bodyComponent = template.components.find(c => c.type === 'BODY');
//     const parameterNames = {};
    
//     if (bodyComponent) {
//       const matches = bodyComponent.text.match(/{{[0-9]+}}([^{]*)/g) || [];
//       matches.forEach((match) => {
//         const paramNum = match.match(/{{(\d+)}}/)[1];
//         const paramName = match.replace(/{{[0-9]+}}/, '').trim();
//         parameterNames[`parameter${paramNum}`] = paramName;
//       });
//     }
  
//     const data = {
//       to: formData.to || 'Enter phone number',
//       templateName: formData.templateName,
//       templateLanguage: formData.templateLanguage,
//       templateParameters: Object.entries(formData.templateParameters).reduce((acc, [key, value]) => {
//         acc[key] = value || `Enter ${key}`;
//         return acc;
//       }, {})
//     };
  
//     const formattedJson = JSON.stringify(data, null, 2);
//     const authHeader = apiKey 
//       ? `--header 'Authorization: Bearer [api-key]'`
//       : '# Please generate an API key first';
  
//     return `curl --location 'http://codozap.codovio.com/api/v1/messages/sendTemplate' \\
//   ${authHeader} \\
//   --header 'Content-Type: application/json' \\
//   --data '${formattedJson}'`;
//   };

//   const handleCountrySelect = (country) => {
//     setSelectedCountry(country);
//     setDropdownOpen(false);
    
//     // Update phone number with new country code
//     const phoneWithoutCode = formData.to.replace(/^\+?\d+/, '');
//     setFormData(prev => ({
//       ...prev,
//       to: `+${country.code}${phoneWithoutCode}`
//     }));
//   };

//   const handlePhoneChange = (value) => {
//     // Remove any non-digit characters except plus sign
//     const cleanedValue = value.replace(/[^\d+]/g, '');
    
//     // Ensure the phone number starts with the country code
//     let formattedValue = cleanedValue;
//     if (!cleanedValue.startsWith('+')) {
//       formattedValue = `+${selectedCountry.code}${cleanedValue.replace(/^\+?\d+/, '')}`;
//     }

//     setFormData(prev => ({
//       ...prev,
//       to: formattedValue
//     }));
//   };

//   const handleParameterChange = (paramKey, value) => {
//     setFormData(prev => ({
//       ...prev,
//       templateParameters: {
//         ...prev.templateParameters,
//         [paramKey]: value
//       }
//     }));
//   };

//   const getPreviewText = () => {
//     if (!template) return '';

//     let preview = '';

//     template.components.forEach(component => {
//       switch (component.type) {
//         case 'HEADER':
//           if (component.format === 'TEXT' && component.text) {
//             preview += `${component.text}\n\n`;
//           } else if (component.format === 'IMAGE') {
//             preview += '[Image Header]\n\n';
//           } else if (component.format === 'VIDEO') {
//             preview += '[Video Header]\n\n';
//           } else if (component.format === 'DOCUMENT') {
//             preview += '[Document Header]\n\n';
//           }
//           break;
        
//         case 'BODY':
//           let bodyText = component.text;
//           let paramCount = 1;
//           Object.entries(formData.templateParameters).forEach(([key, value]) => {
//             bodyText = bodyText.replace(`{{${paramCount}}}`, value || `[${key}]`);
//             paramCount++;
//           });
//           preview += `${bodyText}\n\n`;
//           break;
        
//         case 'FOOTER':
//           preview += `${component.text}\n`;
//           break;
        
//         case 'BUTTONS':
//           if (component.buttons) {
//             preview += '\nButtons:\n';
//             component.buttons.forEach(button => {
//               if (button.type === 'URL') {
//                 preview += `[URL Button: ${button.text}]\n`;
//               } else if (button.type === 'QUICK_REPLY') {
//                 preview += `[Quick Reply: ${button.text}]\n`;
//               }
//             });
//           }
//           break;
        
//         default:
//           break;
//       }
//     });

//     return preview;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!formData.companyId || !token) {
//       toast.error('Missing required information');
//       return;
//     }
  
//     setIsSending(true);

//     const bodyComponent = template.components.find(c => c.type === 'BODY');
//     const orderedParameters = [];
    
//     if (bodyComponent) {
//       const matches = bodyComponent.text.match(/{{[0-9]+}}([^{]*)/g) || [];
//       matches.forEach((match, index) => {
//         const paramName = match.replace(/{{[0-9]+}}/, '').trim();
//         const paramValue = formData.templateParameters[paramName] || '';
//         orderedParameters.push(paramValue);
//       });
//     }

//     const requestData = {
//       to: formData.to,
//       templateName: formData.templateName,
//       templateLanguage: formData.templateLanguage,
//       templateParameters: orderedParameters,
//       companyId: formData.companyId
//     };

//     try {
//       const response = await axios.post(
//         'http://192.168.0.108:25483/api/v1/messages/sendTemplate',
//         requestData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );
  
//       if (response.data.success) {
//         toast.success('Template message sent successfully!');
//         navigate('/admin/dashboard', { 
//           state: { 
//             companyId: formData.companyId 
//           } 
//         });
//       } else {
//         toast.error(response.data.message || 'Failed to send template');
//       }
//     } catch (error) {
//       console.error('Error sending template:', error);
//       if (error.response?.status === 401) {
//         navigate('/auth/login');
//       } else {
//         toast.error(error.response?.data?.message || 'Error sending template message');
//       }
//     } finally {
//       setIsSending(false);
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="loading-overlay">
//         <div className="loader-container">
//           <DotLottieReact
//             src="https://lottie.host/5060de43-85ac-474a-a85b-892f9730e17a/b3jJ1vGkWh.lottie"
//             loop
//             autoplay
//             style={{ width: '200px', height: '200px' }}
//           />
//         </div>
//         <style jsx>{`
//           .loading-overlay {
//             position: fixed;
//             top: 0;
//             left: 0;
//             right: 0;
//             bottom: 0;
//             background-color: rgba(255, 255, 255, 0.9);
//             display: flex;
//             justify-content: center;
//             align-items: center;
//             z-index: 9999;
//           }
//           .loader-container {
//             display: flex;
//             justify-content: center;
//             align-items: center;
//           }
//         `}</style>
//       </div>
//     );
//   }

//   if (!template) {
//     return <div>Template not found</div>;
//   }

//   return (
//     <div className="container-fluid p-4 bg-light">
//       <div className="row">
//         {/* Curl Command Display */}
//         <div className="col-12 mb-4">
//           <Card className="shadow border-0">
//             <CardHeader>
//               <h4 className="mb-0">API Request</h4>
//             </CardHeader>
//             <CardBody>
//               <div className="bg-light p-3 rounded position-relative">
//                 <div className="d-flex justify-content-end mb-2">
//                   <Button
//                     color="primary"
//                     size="sm"
//                     onClick={() => {
//                       navigator.clipboard.writeText(getCurlCommand());
//                       toast.success('Curl command copied to clipboard!');
//                     }}
//                   >
//                     <i className="fas fa-copy me-2"></i>
//                     Copy to Clipboard
//                   </Button>
//                 </div>
//                 <pre className="m-0">
//                   <code>{getCurlCommand()}</code>
//                 </pre>
//               </div>
//             </CardBody>
//           </Card>
//         </div>

//         <div className="col-md-6">
//           <Card className="shadow border-0">
//             <CardHeader>
//               <h4 className="mb-0">
//                 <i className="fas fa-arrow-left me-2" 
//                    onClick={() => window.history.back()}
//                    style={{ cursor: 'pointer' }}
//                 />
//                 {template.name} ({template.language})
//               </h4>
//               <div className="mt-2">
//                 <span className={`badge bg-${template.status === 'APPROVED' ? 'success' : 'danger'}`}>
//                   {template.status}
//                 </span>
//               </div>
//             </CardHeader>
//             <CardBody>
//               <h5 className="mb-4">Personalization</h5>
//               <form onSubmit={handleSubmit}>
//                 <FormGroup>
//                   <Label for="phoneNumber">Recipient's Phone Number</Label>
//                   <InputGroup>
//                     <Dropdown isOpen={dropdownOpen} toggle={() => setDropdownOpen(!dropdownOpen)}>
//                       <DropdownToggle caret className="d-flex align-items-center" style={{ minWidth: '120px' }}>
//                         <span className="me-1">{selectedCountry.flag}</span>
//                         +{selectedCountry.code}
//                       </DropdownToggle>
//                       <DropdownMenu className="country-dropdown" style={{ maxHeight: '200px', overflowY: 'auto' }}>
//                         <Input
//                           type="text"
//                           placeholder="Search countries..."
//                           value={searchQuery}
//                           onChange={(e) => setSearchQuery(e.target.value)}
//                           onClick={(e) => e.stopPropagation()}
//                           className="mx-2 mb-2"
//                           style={{ width: '90%' }}
//                         />
//                         {filteredCountries.map((country) => (
//                           <DropdownItem 
//                             key={country.code} 
//                             onClick={() => handleCountrySelect(country)}
//                             className="d-flex align-items-center"
//                           ><span className="me-2">{country.flag}</span>
//                           <span className="me-2">{country.country}</span>
//                           <span className="text-muted">+{country.code}</span>
//                         </DropdownItem>
//                       ))}
//                     </DropdownMenu>
//                   </Dropdown>
//                   <Input
//                     id="phoneNumber"
//                     type="tel"
//                     placeholder="Enter phone number"
//                     value={formData.to}
//                     onChange={(e) => handlePhoneChange(e.target.value)}
//                     required
//                   />
//                 </InputGroup>
//               </FormGroup>

//               {Object.entries(formData.templateParameters).map(([key, value], index) => (
//                 <FormGroup key={index}>
//                   <Label>{key}</Label>
//                   <Input
//                     placeholder={`Enter ${key}`}
//                     value={value}
//                     onChange={(e) => handleParameterChange(key, e.target.value)}
//                     required
//                   />
//                 </FormGroup>
//               ))}

//               <Button 
//                 color="primary" 
//                 type="submit" 
//                 className="mt-4"
//                 disabled={isSending || template.status !== 'APPROVED'}
//               >
//                 {isSending ? <Spinner size="sm" /> : 'Send Message'}
//               </Button>
              
//               {template.status !== 'APPROVED' && (
//                 <Alert color="warning" className="mt-3">
//                   This template is not approved and cannot be sent.
//                 </Alert>
//               )}
//             </form>
//           </CardBody>
//         </Card>
//       </div>

//       <div className="col-md-6">
//         <Card className="shadow border-0">
//           <CardHeader>
//             <h4 className="mb-0">Template Preview</h4>
//           </CardHeader>
//           <CardBody>
//             <div className="template-preview p-4 bg-light rounded">
//               <div className="whatsapp-message bg-white p-3 rounded shadow-sm">
//                 <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
//                   {getPreviewText()}
//                 </p>
//                 {template.components.find(c => c.type === 'BUTTONS')?.buttons.map((button, index) => (
//                   <div key={index} className="mt-2">
//                     <Button 
//                       color={button.type === 'URL' ? 'primary' : 'secondary'} 
//                       size="sm"
//                       disabled
//                     >
//                       {button.text}
//                     </Button>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </CardBody>
//         </Card>
//       </div>
//     </div>

//     <style jsx>{`
//       .country-dropdown {
//         max-height: 300px;
//         overflow-y: auto;
//       }
//       .whatsapp-message {
//         font-size: 14px;
//         line-height: 1.5;
//       }
//       .template-preview {
//         background-color: #f5f5f5;
//       }
//     `}</style>
//   </div>
// );
// };

// export default SendTemplate;
                          













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

  const handleHeaderParamChange = (key, value) => {
    setHeaderParams(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const extractTemplateParameters = (template) => {
    if (!template) return [];
    
    const bodyComponent = template.components.find(c => c.type === 'BODY');
    if (!bodyComponent || !bodyComponent.text) return [];
  
    const paramRegex = /\*?\{\{(\d+)\}\}\*?/g;
    const params = [];
    let match;
    let lastIndex = 0;
  
    while ((match = paramRegex.exec(bodyComponent.text)) !== null) {
      const paramNumber = parseInt(match[1]);
      
      // Find the context by looking at the text before the parameter
      let contextStart = lastIndex;
      let context = '';
      
      // Look for context in the previous text
      const previousText = bodyComponent.text.substring(contextStart, match.index);
      const lines = previousText.split('\n');
      const lastLine = lines[lines.length - 1];
      
      // If there's a label (text followed by - or :), use that as context
      if (lastLine.includes('-') || lastLine.includes(':')) {
        context = lastLine.split(/[-:]/).shift().trim();
      }
  
      params.push({
        index: paramNumber,
        context: context || `Parameter ${paramNumber}`,
        placeholder: `Enter ${context || `parameter ${paramNumber}`}`
      });
  
      lastIndex = match.index + match[0].length;
    }
  
    return params.sort((a, b) => a.index - b.index);
  };

  const fetchTemplateDetails = async () => {
    if (!formData.companyId || !token) return;

    try {
      const response = await axios.post(
        'http://192.168.0.108:25483/api/v1/messages/fetchTemplates',
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
          
          // Initialize components array based on template structure
          const initialComponents = [];
          
          // Handle header component if exists
          const headerComponent = selectedTemplate.components.find(c => c.type === 'HEADER');
          if (headerComponent) {
            initialComponents.push({
              type: 'header',
              parameters: []
            });
          }
          
          // Handle body component
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
        'http://192.168.0.108:25483/api/v1/apiKey/get-Api-Key',
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
          'http://192.168.0.108:25483/api/v1/messages/fetchTemplates',
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
            
            // Initialize components array
            const initialComponents = [];
            
            // Handle header component if exists
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
            
            // Handle body component and parameters
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

  const getCurlCommand = () => {
    if (!template) return '';
  
    // Format parameters according to WhatsApp API structure
    const bodyComponent = formData.components.find(c => c.type === 'body');
    const headerComponent = formData.components.find(c => c.type === 'header');
  
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
  
    // Add header component if it exists
    if (headerComponent) {
      const headerParam = {
        type: 'header',
        parameters: []
      };
  
      const headerFormat = template.components.find(c => c.type === 'HEADER')?.format;
      if (headerFormat) {
        switch (headerFormat) {
          case 'IMAGE':
            headerParam.parameters.push({
              type: 'image',
              image: { link: headerParams.mediaUrl }
            });
            break;
          case 'VIDEO':
            headerParam.parameters.push({
              type: 'video',
              video: { link: headerParams.mediaUrl }
            });
            break;
          case 'DOCUMENT':
            headerParam.parameters.push({
              type: 'document',
              document: { link: headerParams.mediaUrl }
            });
            break;
          case 'LOCATION':
            headerParam.parameters.push({
              type: 'location',
              location: {
                latitude: parseFloat(headerParams.latitude),
                longitude: parseFloat(headerParams.longitude),
                name: headerParams.locationName,
                address: headerParams.locationAddress
              }
            });
            break;
        }
      }
      data.template.components.push(headerParam);
    }
  
    // Add body component if it exists
    if (bodyComponent) {
      const bodyParam = {
        type: 'body',
        parameters: bodyComponent.parameters.map(param => ({
          type: 'text',
          text: param.text || `[Enter parameter]`
        }))
      };
      data.template.components.push(bodyParam);
    }
  
    const formattedJson = JSON.stringify(data, null, 2);
    const authHeader = apiKey 
      ? `--header 'Authorization: Bearer ${apiKey}'`
      : '# Please generate an API key first';
  
    return `curl --location 'http://codozap.codovio.com/api/v1/messages/sendTemplate' \\
  ${authHeader} \\
  --header 'Content-Type: application/json' \\
  --data '${formattedJson}'`;
  };

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setDropdownOpen(false);
    
    // Update phone number with new country code
    const phoneWithoutCode = formData.to.replace(/^\+?\d+/, '');
    setFormData(prev => ({
      ...prev,
      to: `+${country.code}${phoneWithoutCode}`
    }));
  };

  const handlePhoneChange = (value) => {
    // Remove any non-digit characters except plus sign
    const cleanedValue = value.replace(/[^\d+]/g, '');
    
    // Ensure the phone number starts with the country code
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
      const value = param.text || `[Parameter ${index + 1}]`;
      // Replace both {{n}} and *{{n}}* formats
      previewText = previewText.replace(
        new RegExp(`\\*?\\{\\{${index + 1}\\}\\}\\*?`, 'g'), 
        value
      );
    });
  
    return previewText;
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
        'http://192.168.0.108:25483/api/v1/messages/sendTemplate',
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
        toast.error(response.data.message || 'Failed to send template');
      }
    } catch (error) {
      console.error('Error sending template:', error);
      if (error.response?.status === 401) {
        navigate('/auth/login');
      } else {
        toast.error(error.response?.data?.message || 'Error sending template message');
      }
    } finally {
      setIsSending(false);
    }
  };

  const renderHeaderParams = () => {
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
      {isLoading ? (
        <div className="loading-overlay">
          <div className="loader-container">
            <DotLottieReact
              src="https://lottie.host/5060de43-85ac-474a-a85b-892f9730e17a/b3jJ1vGkWh.lottie"
              loop
              autoplay
              style={{ width: '200px', height: '200px' }}
            />
          </div>
        </div>
      ) : !template ? (
        <div className="text-center">Template not found</div>
      ) : (
        <>
          {/* API Request Section */}
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
            {/* Form Section */}
            <div className="col-md-6">
              <Card className="shadow">
                <CardHeader>
                  <h4 className="mb-0">
                    <i 
                      className="fas fa-arrow-left me-2 cursor-pointer" 
                      onClick={() => window.history.back()}
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
                    {/* Phone Number Input */}
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

                    {/* Dynamic Parameters */}
                    {extractTemplateParameters(template).map((param, index) => (
                      <FormGroup key={index}>
                        <Label>{param.context || `Parameter ${param.index}`}</Label>
                        <Input
                          placeholder={`Enter ${param.context || `parameter ${param.index}`}`}
                          value={formData.components.find(c => c.type === 'body')?.parameters[index]?.text || ''}
                          onChange={(e) => handleParameterChange(index, e.target.value)}
                          required
                        />
                      </FormGroup>
                    ))}

                    {/* Header Parameters */}
                    {template.components.find(c => c.type === 'HEADER') && (
                      <FormGroup>
                        <Label>Header Media URL</Label>
                        <Input
                          type="url"
                          placeholder="Enter media URL"
                          value={headerParams.mediaUrl}
                          onChange={(e) => handleHeaderParamChange('mediaUrl', e.target.value)}
                          required
                        />
                      </FormGroup>
                    )}

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

            {/* Preview Section */}
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
        </>
      )}

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
        .preview-container {
          background-color: #e5ddd5;
          padding: 1.5rem;
          border-radius: 8px;
          min-height: 300px;
        }
        .message-bubble {
          background-color: white;
          border-radius: 8px;
          padding: 16px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          max-width: 100%;
        }
        .message-text {
          white-space: pre-wrap;
          font-size: 14px;
          line-height: 1.5;
        }
        .message-footer {
          font-size: 12px;
          color: #667781;
        }
        .placeholder-image {
          width: 100%;
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f8f9fa;
          border-radius: 8px;
        }
        .cursor-pointer {
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default SendTemplate;
                          