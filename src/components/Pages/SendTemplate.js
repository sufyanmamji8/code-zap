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
// } from 'reactstrap';
// import axios from 'axios';
// import { toast } from 'sonner';

// const SendTemplate = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [template, setTemplate] = useState(null);
//   const [isLoading, setIsLoading] = useState(true); // New loading state
//   const [formData, setFormData] = useState({
//     to: '',
//     templateName: location.state?.templateName || '',
//     templateLanguage: 'en_US',
//     templateParameters: [],
//     companyId: location.state?.companyId || ''
//   });
//   const [isSending, setIsSending] = useState(false);
//   const token = localStorage.getItem('token');

//   useEffect(() => {
//     const fetchTemplateDetails = async () => {
//       if (!formData.companyId || !token) {
//         setIsLoading(false);
//         return;
//       }

//       try {
//         const response = await axios.post(
//           'http://192.168.0.108:25483/api/v1/messages/fetchTemplates',
//           {
//             companyId: formData.companyId
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               'Content-Type': 'application/json'
//             }
//           }
//         );

//         if (response.data.success) {
//           const selectedTemplate = response.data.templates.find(
//             t => t.name === location.state?.templateName
//           );

//           if (selectedTemplate) {
//             setTemplate(selectedTemplate);
//             const bodyComponent = selectedTemplate.components.find(c => c.type === 'BODY');
//             const paramCount = (bodyComponent?.text.match(/{{[0-9]+}}/g) || []).length;
//             setFormData(prev => ({
//               ...prev,
//               templateParameters: Array(paramCount).fill('')
//             }));
//           }
//         } else {
//           toast.error('Failed to load template details');
//         }
//       } catch (error) {
//         console.error('Error fetching template details:', error);
//         if (error.response?.status === 401) {
//           navigate('/auth/login');
//         } else {
//           toast.error('Failed to load template details');
//         }
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     if (location.state?.templateName) {
//       fetchTemplateDetails();
//     }
//   }, [location.state, token, formData.companyId, navigate]);

//   const handleParameterChange = (index, value) => {
//     const newParameters = [...formData.templateParameters];
//     newParameters[index] = value;
//     setFormData(prev => ({
//       ...prev,
//       templateParameters: newParameters
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
//           formData.templateParameters.forEach((param, index) => {
//             bodyText = bodyText.replace(`{{${index + 1}}}`, param || `[Parameter ${index + 1}]`);
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
  
//     try {
//       const response = await axios.post(
//         'http://192.168.0.108:25483/api/v1/messages/sendTemplate',
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );
  
//       if (response.data.success) {
//         toast.success('Template message sent successfully!');
//         // Add navigation after successful send
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
//             src="https://lottie.host/1e0f6d76-ea46-4d93-b658-9ea0e46ee3ab/PK9gwc3KRs.lottie"
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


//   return (
//     <div className="container-fluid p-4 bg-light">
//       <div className="row">
//         <div className="col-md-6">
//           <Card className="shadow border-0">
//             <CardHeader>
//               <h4 className="mb-0">
//                 <i className="fas fa-arrow-left me-2" 
//                    onClick={() => window.history.back()}
//                    style={{ cursor: 'pointer', marginRight: '10px' }}
//                 />
//                 {template.name} ({template.language})
//               </h4>
//               <div className="mt-2">
//                 <span className={`badge bg-${template.status === 'APPROVED' ? 'success' : 'danger'}`}>
//                   {/* {template.status} */}
//                 </span>
//                 {/* <span className="badge bg-info ms-2">{template.category}</span> */}
//               </div>
//             </CardHeader>
//             <CardBody>
//               <h5 className="mb-4">Personalization</h5>
//               <form onSubmit={handleSubmit}>
//                 <FormGroup>
//                   <Label for="phoneNumber">Recipient's Phone Number</Label>
//                   <Input
//                     id="phoneNumber"
//                     type="text"
//                     placeholder="Enter phone number with country code"
//                     value={formData.to}
//                     onChange={(e) => setFormData(prev => ({ ...prev, to: e.target.value }))}
//                     required
//                   />
//                 </FormGroup>

//                 {formData.templateParameters.map((param, index) => {
//                   const bodyComponent = template.components.find(c => c.type === 'BODY');
//                   const paramMatch = bodyComponent?.text.match(new RegExp(`{{${index + 1}}}([^{]*)`));
//                   const paramLabel = paramMatch ? paramMatch[1].trim() : `Parameter ${index + 1}`;
                  
//                   return (
//                     <FormGroup key={index}>
//                       <Label>Parameter {index + 1}: {paramLabel}</Label>
//                       <Input
//                         placeholder={`Enter ${paramLabel}`}
//                         value={param}
//                         onChange={(e) => handleParameterChange(index, e.target.value)}
//                         required
//                       />
//                     </FormGroup>
//                   );
//                 })}

//                 <Button 
//                   color="primary" 
//                   type="submit" 
//                   className="mt-4"
//                   disabled={isSending || template.status !== 'APPROVED'}
//                 >
//                   {isSending ? <Spinner size="sm" /> : 'Send Message'}
//                 </Button>
                
//                 {template.status !== 'APPROVED' && (
//                   <Alert color="warning" className="mt-3">
//                     This template is not approved and cannot be sent.
//                   </Alert>
//                 )}
//               </form>
//             </CardBody>
//           </Card>
//         </div>

//         <div className="col-md-6">
//           <Card className="shadow border-0">
//             <CardHeader>
//               <h4 className="mb-0">Template Preview</h4>
//             </CardHeader>
//             <CardBody>
//               <div className="template-preview p-4 bg-light rounded">
//                 <div className="whatsapp-message bg-white p-3 rounded shadow-sm">
//                   <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
//                     {getPreviewText()}
//                   </p>
//                   {template.components.find(c => c.type === 'BUTTONS')?.buttons.map((button, index) => (
//                     <div key={index} className="mt-2">
//                       <Button 
//                         color={button.type === 'URL' ? 'primary' : 'secondary'} 
//                         size="sm"
//                         disabled
//                       >
//                         {button.text}
//                       </Button>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </CardBody>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
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
} from 'reactstrap';
import axios from 'axios';
import { toast } from 'sonner';

const SendTemplate = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [template, setTemplate] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // New loading state
  const [formData, setFormData] = useState({
    to: '',
    templateName: location.state?.templateName || '',
    templateLanguage: 'en_US',
    templateParameters: [],
    companyId: location.state?.companyId || ''
  });
  const [isSending, setIsSending] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchTemplateDetails = async () => {
      if (!formData.companyId || !token) {
        setIsLoading(false);
        return;
      }

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
            const bodyComponent = selectedTemplate.components.find(c => c.type === 'BODY');
            const paramCount = (bodyComponent?.text.match(/{{[0-9]+}}/g) || []).length;
            setFormData(prev => ({
              ...prev,
              templateParameters: Array(paramCount).fill('')
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
      } finally {
        setIsLoading(false);
      }
    };

    if (location.state?.templateName) {
      fetchTemplateDetails();
    }
  }, [location.state, token, formData.companyId, navigate]);

  const handleParameterChange = (index, value) => {
    const newParameters = [...formData.templateParameters];
    newParameters[index] = value;
    setFormData(prev => ({
      ...prev,
      templateParameters: newParameters
    }));
  };

  const getPreviewText = () => {
    if (!template) return '';

    let preview = '';

    template.components.forEach(component => {
      switch (component.type) {
        case 'HEADER':
          if (component.format === 'TEXT' && component.text) {
            preview += `${component.text}\n\n`;
          } else if (component.format === 'IMAGE') {
            preview += '[Image Header]\n\n';
          } else if (component.format === 'VIDEO') {
            preview += '[Video Header]\n\n';
          } else if (component.format === 'DOCUMENT') {
            preview += '[Document Header]\n\n';
          }
          break;
        
        case 'BODY':
          let bodyText = component.text;
          formData.templateParameters.forEach((param, index) => {
            bodyText = bodyText.replace(`{{${index + 1}}}`, param || `[Parameter ${index + 1}]`);
          });
          preview += `${bodyText}\n\n`;
          break;
        
        case 'FOOTER':
          preview += `${component.text}\n`;
          break;
        
        case 'BUTTONS':
          if (component.buttons) {
            preview += '\nButtons:\n';
            component.buttons.forEach(button => {
              if (button.type === 'URL') {
                preview += `[URL Button: ${button.text}]\n`;
              } else if (button.type === 'QUICK_REPLY') {
                preview += `[Quick Reply: ${button.text}]\n`;
              }
            });
          }
          break;
        
        default:
          break;
      }
    });

    return preview;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.companyId || !token) {
      toast.error('Missing required information');
      return;
    }
  
    setIsSending(true);
  
    try {
      const response = await axios.post(
        'http://192.168.0.108:25483/api/v1/messages/sendTemplate',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      if (response.data.success) {
        toast.success('Template message sent successfully!');
        // Add navigation after successful send
        navigate('/admin/dashboard', { 
          state: { 
            companyId: formData.companyId 
          } 
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

  if (isLoading) {
    return (
      <div className="loading-overlay">
        <div className="loader-container">
          <DotLottieReact
            src="https://lottie.host/1e0f6d76-ea46-4d93-b658-9ea0e46ee3ab/PK9gwc3KRs.lottie"
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


  return (
    <div className="container-fluid p-4 bg-light">
      <div className="row">
        <div className="col-md-6">
          <Card className="shadow border-0">
            <CardHeader>
              <h4 className="mb-0">
                <i className="fas fa-arrow-left me-2" 
                   onClick={() => window.history.back()}
                   style={{ cursor: 'pointer', marginRight: '10px' }}
                />
                {template.name} ({template.language})
              </h4>
              <div className="mt-2">
                <span className={`badge bg-${template.status === 'APPROVED' ? 'success' : 'danger'}`}>
                  {/* {template.status} */}
                </span>
                {/* <span className="badge bg-info ms-2">{template.category}</span> */}
              </div>
            </CardHeader>
            <CardBody>
              <h5 className="mb-4">Personalization</h5>
              <form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label for="phoneNumber">Recipient's Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    type="text"
                    placeholder="Enter phone number with country code"
                    value={formData.to}
                    onChange={(e) => setFormData(prev => ({ ...prev, to: e.target.value }))}
                    required
                  />
                </FormGroup>

                {formData.templateParameters.map((param, index) => {
                  const bodyComponent = template.components.find(c => c.type === 'BODY');
                  const paramMatch = bodyComponent?.text.match(new RegExp(`{{${index + 1}}}([^{]*)`));
                  const paramLabel = paramMatch ? paramMatch[1].trim() : `Parameter ${index + 1}`;
                  
                  return (
                    <FormGroup key={index}>
                      <Label>Parameter {index + 1}: {paramLabel}</Label>
                      <Input
                        placeholder={`Enter ${paramLabel}`}
                        value={param}
                        onChange={(e) => handleParameterChange(index, e.target.value)}
                        required
                      />
                    </FormGroup>
                  );
                })}

                <Button 
                  color="primary" 
                  type="submit" 
                  className="mt-4"
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
          <Card className="shadow border-0">
            <CardHeader>
              <h4 className="mb-0">Template Preview</h4>
            </CardHeader>
            <CardBody>
              <div className="template-preview p-4 bg-light rounded">
                <div className="whatsapp-message bg-white p-3 rounded shadow-sm">
                  <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                    {getPreviewText()}
                  </p>
                  {template.components.find(c => c.type === 'BUTTONS')?.buttons.map((button, index) => (
                    <div key={index} className="mt-2">
                      <Button 
                        color={button.type === 'URL' ? 'primary' : 'secondary'} 
                        size="sm"
                        disabled
                      >
                        {button.text}
                      </Button>
                    </div>
                  ))}
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