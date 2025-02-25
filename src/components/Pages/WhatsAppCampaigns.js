// import React, { useState, useEffect } from 'react';
// import {
//   Container,
//   Row,
//   Col,
//   Card,
//   CardBody,
//   Form,
//   FormGroup,
//   Label,
//   Input,
//   Button,
//   ButtonGroup,
//   Badge,
//   Alert,
//   Progress,
//   Dropdown,
//   DropdownToggle,
//   DropdownMenu,
//   DropdownItem
// } from 'reactstrap';
// import axios from 'axios';
// import { GROUP_ENDPOINTS, TEMPLATE_ENDPOINTS } from 'Api/Constant';

// const WhatsAppCampaigns = () => {
//   const [campaignData, setCampaignData] = useState({
//     campaignName: '',
//     template: '',
//     sendType: 'now',
//     scheduledTime: '',
//     selectedGroups: [],
//     priority: 'normal'
//   });

//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [showSuccess, setShowSuccess] = useState(false);
//   const [dropdownOpen, setDropdownOpen] = useState({
//     template: false,
//     groups: false
//   });
  
//   // Add templates state to store fetched templates
//   const [templates, setTemplates] = useState([]);
//   // Add templatesLoading state
//   const [templatesLoading, setTemplatesLoading] = useState(true);
  
//   // Add groups state to store fetched groups
//   const [groups, setGroups] = useState([]);
//   // Add search term state for filtering groups
//   const [searchTerm, setSearchTerm] = useState('');
//   // Add template search term state
//   const [templateSearchTerm, setTemplateSearchTerm] = useState('');

//   useEffect(() => {
//     fetchGroups();
//     fetchTemplates();
//   }, []);

//   // Add fetchTemplates function to get templates from API
//   const fetchTemplates = async () => {
//     const token = localStorage.getItem("token");
//     const companyId = localStorage.getItem("selectedCompanyId");
    
//     if (!companyId || !token) {
//       setTemplatesLoading(false);
//       return;
//     }

//     try {
//       setTemplatesLoading(true);
//       const response = await axios.post(
//         TEMPLATE_ENDPOINTS.FETCH,
//         { companyId },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.data.success && response.data.templates) {
//         // Only use approved templates
//         const approvedTemplates = response.data.templates.filter(
//           template => template.status === "APPROVED"
//         );
//         setTemplates(approvedTemplates);
//       }
//     } catch (error) {
//       console.error("Error fetching templates:", error);
//     } finally {
//       setTemplatesLoading(false);
//     }
//   };

//   // Add fetchGroups function to get groups from API
//   const fetchGroups = async () => {
//     try {
//       const response = await axios.get(GROUP_ENDPOINTS.GET_ALL);
//       if (response.data.success) {
//         setGroups(response.data.groups);
//       }
//     } catch (error) {
//       console.error('Error fetching groups:', error);
//     }
//   };

//   // Filter groups based on search term
//   const filteredGroups = groups.filter(group => 
//     group?.name?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Filter templates based on template search term
//   const filteredTemplates = templates.filter(template =>
//     template?.name?.toLowerCase().includes(templateSearchTerm.toLowerCase())
//   );

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setCampaignData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const toggleDropdown = (type) => {
//     setDropdownOpen(prev => ({
//       ...prev,
//       [type]: !prev[type]
//     }));
//   };

//   const handleTemplateSelect = (templateId) => {
//     setCampaignData(prev => ({
//       ...prev,
//       template: templateId
//     }));
//     toggleDropdown('template');
//   };

//   const handleGroupSelect = (groupId) => {
//     setCampaignData(prev => ({
//       ...prev,
//       selectedGroups: prev.selectedGroups.includes(groupId)
//         ? prev.selectedGroups.filter(id => id !== groupId)
//         : [...prev.selectedGroups, groupId]
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     await new Promise(resolve => setTimeout(resolve, 1500));
//     setShowSuccess(true);
//     setIsSubmitting(false);
//     setTimeout(() => setShowSuccess(false), 3000);
//   };

//   const getCompletionPercentage = () => {
//     let filled = 0;
//     const total = 5;
//     if (campaignData.campaignName) filled++;
//     if (campaignData.template) filled++;
//     if (campaignData.selectedGroups.length > 0) filled++;
//     if (campaignData.sendType === 'now' || campaignData.scheduledTime) filled++;
//     if (campaignData.priority) filled++;
//     return (filled / total) * 100;
//   };

//   // Format the category to display it properly
//   const formatCategory = (category) => {
//     if (!category) return '';
//     return category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
//   };

//   return (
//     <div className="py-4">
//       <Container>
//         <Card className="shadow-sm">
//           <CardBody>
//             {showSuccess && (
//               <Alert color="success" className="mb-4">
//                 Campaign created successfully!
//               </Alert>
//             )}

//             <div className="mb-4">
//               <h4>Campaign Progress</h4>
//               <Progress value={getCompletionPercentage()} className="mt-2" />
//             </div>

//             <Form onSubmit={handleSubmit}>
//               <Row>
//                 {/* Column 1 */}
//                 <Col md={6}>
//                   {/* Campaign Name */}
//                   <FormGroup className="mb-4">
//                     <Label className="fw-bold">
//                       Campaign Name
//                       <Badge color="primary" pill className="ms-2">Required</Badge>
//                     </Label>
//                     <Input
//                       type="text"
//                       name="campaignName"
//                       value={campaignData.campaignName}
//                       onChange={handleInputChange}
//                       placeholder="Enter campaign name"
//                       required
//                     />
//                   </FormGroup>

//                   {/* Template Selection - Updated with API data */}
//                   <FormGroup className="mb-4 position-relative">
//                     <Label className="fw-bold">
//                       Message Template
//                       <Badge color="primary" pill className="ms-2">Required</Badge>
//                     </Label>
//                     <Dropdown isOpen={dropdownOpen.template} toggle={() => toggleDropdown('template')} className="w-100">
//                       <DropdownToggle caret color="light" className="w-100 text-start">
//                         {campaignData.template 
//                           ? templates.find(t => t.id === campaignData.template)?.name 
//                           : 'Select a template...'}
//                       </DropdownToggle>
//                       <DropdownMenu className="w-100">
//                         {/* Added search input for templates */}
//                         <div className="px-3 py-2 border-bottom">
//                           <Input
//                             type="text"
//                             placeholder="Search templates..."
//                             value={templateSearchTerm}
//                             onChange={(e) => setTemplateSearchTerm(e.target.value)}
//                             onClick={(e) => e.stopPropagation()}
//                           />
//                         </div>
//                         <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
//                           {templatesLoading ? (
//                             <DropdownItem disabled>
//                               <span className="spinner-border spinner-border-sm me-2" />
//                               Loading templates...
//                             </DropdownItem>
//                           ) : filteredTemplates.length > 0 ? (
//                             filteredTemplates.map(template => (
//                               <DropdownItem 
//                                 key={template.id}
//                                 onClick={() => handleTemplateSelect(template.id)}
//                               >
//                                 <div>
//                                   <span className="fw-bold">{template.name}</span>
//                                   <div className="d-flex mt-1">
//                                     <Badge 
//                                       color="primary" 
//                                       pill 
//                                       className="me-2"
//                                       style={{ textTransform: 'none' }}
//                                     >
//                                       {formatCategory(template.category)}
//                                     </Badge>
//                                     <Badge color="info" pill>
//                                       {template.language}
//                                     </Badge>
//                                   </div>
//                                 </div>
//                               </DropdownItem>
//                             ))
//                           ) : (
//                             <DropdownItem disabled>No templates found</DropdownItem>
//                           )}
//                         </div>
//                       </DropdownMenu>
//                     </Dropdown>
//                   </FormGroup>
//                 </Col>

//                 {/* Column 2 */}
//                 <Col md={6}>
//                   {/* Send Type */}
//                   <FormGroup className="mb-4">
//                     <Label className="fw-bold">
//                       Sending Schedule
//                       <Badge color="primary" pill className="ms-2">Required</Badge>
//                     </Label>
//                     <ButtonGroup className="w-100">
//                       <Button
//                         color={campaignData.sendType === 'now' ? 'primary' : 'light'}
//                         onClick={() => setCampaignData(prev => ({ ...prev, sendType: 'now' }))}
//                       >
//                         Send Now
//                       </Button>
//                       <Button
//                         color={campaignData.sendType === 'later' ? 'primary' : 'light'}
//                         onClick={() => setCampaignData(prev => ({ ...prev, sendType: 'later' }))}
//                       >
//                         Schedule
//                       </Button>
//                     </ButtonGroup>
//                     {campaignData.sendType === 'later' && (
//                       <Input
//                         type="datetime-local"
//                         name="scheduledTime"
//                         value={campaignData.scheduledTime}
//                         onChange={handleInputChange}
//                         className="mt-2"
//                         required
//                       />
//                     )}
//                   </FormGroup>

//                   {/* Group Selection */}
//                   <FormGroup className="mb-4 position-relative">
//                     <Label className="fw-bold">
//                       Target Groups
//                       <Badge color="primary" pill className="ms-2">Required</Badge>
//                     </Label>
//                     <Dropdown isOpen={dropdownOpen.groups} toggle={() => toggleDropdown('groups')} className="w-100">
//                       <DropdownToggle caret color="light" className="w-100 text-start">
//                         {campaignData.selectedGroups.length 
//                           ? `${campaignData.selectedGroups.length} groups selected`
//                           : 'Select target groups...'}
//                       </DropdownToggle>
//                       <DropdownMenu className="w-100">
//                         {/* Search input for groups */}
//                         <div className="px-3 py-2 border-bottom">
//                           <Input
//                             type="text"
//                             placeholder="Search groups..."
//                             value={searchTerm}
//                             onChange={(e) => setSearchTerm(e.target.value)}
//                             onClick={(e) => e.stopPropagation()}
//                           />
//                         </div>
//                         <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
//                           {filteredGroups.length > 0 ? (
//                             filteredGroups.map(group => (
//                               <DropdownItem 
//                                 key={group._id}
//                                 onClick={() => handleGroupSelect(group._id)}
//                                 className="d-flex align-items-center"
//                               >
//                                 <input
//                                   type="checkbox"
//                                   checked={campaignData.selectedGroups.includes(group._id)}
//                                   onChange={() => {}}
//                                   className="me-2"
//                                 />
//                                 <div className="d-flex justify-content-between w-100">
//                                   <span>{group.name}</span>
//                                   <Badge color="info" pill>
//                                     {group.allowedPhoneNumbers?.length || 0} members
//                                   </Badge>
//                                 </div>
//                               </DropdownItem>
//                             ))
//                           ) : (
//                             <DropdownItem disabled>No groups found</DropdownItem>
//                           )}
//                         </div>
//                       </DropdownMenu>
//                     </Dropdown>
//                   </FormGroup>
//                 </Col>
//               </Row>

//               {/* Selected Groups Preview */}
//               {campaignData.selectedGroups.length > 0 && (
//                 <Row className="mb-3">
//                   <Col>
//                     <Label className="fw-bold">Selected Groups</Label>
//                     <div className="border rounded p-3">
//                       <div className="d-flex flex-wrap gap-2">
//                         {campaignData.selectedGroups.map(groupId => {
//                           const group = groups.find(g => g._id === groupId);
//                           return group ? (
//                             <Badge 
//                               key={groupId} 
//                               color="primary" 
//                               className="p-2 d-flex align-items-center"
//                             >
//                               {group.name}
//                               <span 
//                                 className="ms-2 cursor-pointer" 
//                                 onClick={() => handleGroupSelect(groupId)}
//                                 style={{ cursor: 'pointer' }}
//                               >
//                                 ×
//                               </span>
//                             </Badge>
//                           ) : null;
//                         })}
//                       </div>
//                     </div>
//                   </Col>
//                 </Row>
//               )}

//               {/* Selected Template Preview - Added to show details of selected template */}
//               {campaignData.template && (
//                 <Row className="mb-3">
//                   <Col>
//                     <Label className="fw-bold">Selected Template</Label>
//                     <Card className="border">
//                       <CardBody>
//                         {(() => {
//                           const selectedTemplate = templates.find(t => t.id === campaignData.template);
//                           return selectedTemplate ? (
//                             <div>
//                               <h5>{selectedTemplate.name}</h5>
//                               <div className="d-flex mb-2">
//                                 <Badge 
//                                   color="primary" 
//                                   pill 
//                                   className="me-2"
//                                   style={{ textTransform: 'none' }}
//                                 >
//                                   {formatCategory(selectedTemplate.category)}
//                                 </Badge>
//                                 <Badge color="info" pill>
//                                   {selectedTemplate.language}
//                                 </Badge>
//                               </div>
//                             </div>
//                           ) : (
//                             <p>Template details not available</p>
//                           );
//                         })()}
//                       </CardBody>
//                     </Card>
//                   </Col>
//                 </Row>
//               )}

//               {/* Submit Button - Full Width */}
//               <Row>
//                 <Col>
//                   <Button
//                     color="primary"
//                     type="submit"
//                     className="w-100 mt-3"
//                     disabled={isSubmitting}
//                   >
//                     {isSubmitting ? (
//                       <>
//                         <span className="spinner-border spinner-border-sm me-2" />
//                         Creating Campaign...
//                       </>
//                     ) : (
//                       'Launch Campaign'
//                     )}
//                   </Button>
//                 </Col>
//               </Row>
//             </Form>
//           </CardBody>
//         </Card>
//       </Container>
//     </div>
//   );
// };

// export default WhatsAppCampaigns;











import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  ButtonGroup,
  Badge,
  Alert,
  Progress,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import axios from 'axios';
import { GROUP_ENDPOINTS, TEMPLATE_ENDPOINTS } from 'Api/Constant';

const WhatsAppCampaigns = () => {
  const [campaignData, setCampaignData] = useState({
    campaignName: '',
    template: '',
    sendType: 'now',
    scheduledTime: '',
    selectedGroups: [],
    priority: 'normal',
    templateParams: {} // Store parameter values here
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState({
    template: false,
    groups: false
  });
  
  // Add templates state to store fetched templates
  const [templates, setTemplates] = useState([]);
  // Add templatesLoading state
  const [templatesLoading, setTemplatesLoading] = useState(true);
  
  // Add groups state to store fetched groups
  const [groups, setGroups] = useState([]);
  // Add search term state for filtering groups
  const [searchTerm, setSearchTerm] = useState('');
  // Add template search term state
  const [templateSearchTerm, setTemplateSearchTerm] = useState('');
  // Add state to store the selected template's details
  const [selectedTemplateDetails, setSelectedTemplateDetails] = useState(null);
  // Add state to store extracted parameters
  const [extractedParams, setExtractedParams] = useState([]);

  useEffect(() => {
    fetchGroups();
    fetchTemplates();
  }, []);

  // When template selection changes, fetch template details
  useEffect(() => {
    if (campaignData.template) {
      fetchTemplateDetails(campaignData.template);
    } else {
      setSelectedTemplateDetails(null);
      setExtractedParams([]);
    }
  }, [campaignData.template]);

  // Extract parameters from template text
  const extractParameters = (templateText) => {
    // Regular expression to match {{number}} patterns
    const paramRegex = /\{\{(\d+)\}\}/g;
    let match;
    const params = [];
    const usedIndexes = new Set();
    
    // Find all matches in the template text
    while ((match = paramRegex.exec(templateText)) !== null) {
      const paramIndex = match[1];
      
      // Only add unique parameters
      if (!usedIndexes.has(paramIndex)) {
        usedIndexes.add(paramIndex);
        
        // Create parameter object with default label based on index
        let paramLabel = "Parameter";
        
        // Try to infer parameter type from context
        // This is a simple example - you can enhance this logic
        const contextBefore = templateText.substring(
          Math.max(0, match.index - 30), 
          match.index
        ).toLowerCase();
        
        if (contextBefore.includes("movie") || paramIndex === "1") {
          paramLabel = "Movie Name";
        } else if (contextBefore.includes("time") || paramIndex === "2") {
          paramLabel = "Time";
        } else if (contextBefore.includes("venue") || paramIndex === "3") {
          paramLabel = "Venue";
        } else if (contextBefore.includes("seat") || paramIndex === "4") {
          paramLabel = "Seats";
        }
        
        params.push({
          index: paramIndex,
          key: `param${paramIndex}`,
          name: paramLabel,
          type: 'text'
        });
      }
    }
    
    // Sort parameters by index
    params.sort((a, b) => parseInt(a.index) - parseInt(b.index));
    return params;
  };

  // Add fetchTemplates function to get templates from API
  const fetchTemplates = async () => {
    const token = localStorage.getItem("token");
    const companyId = localStorage.getItem("selectedCompanyId");
    
    if (!companyId || !token) {
      setTemplatesLoading(false);
      return;
    }

    try {
      setTemplatesLoading(true);
      const response = await axios.post(
        TEMPLATE_ENDPOINTS.FETCH,
        { companyId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success && response.data.templates) {
        // Only use approved templates
        const approvedTemplates = response.data.templates.filter(
          template => template.status === "APPROVED"
        );
        setTemplates(approvedTemplates);
      }
    } catch (error) {
      console.error("Error fetching templates:", error);
    } finally {
      setTemplatesLoading(false);
    }
  };

  // Add new function to fetch template details including fields
  const fetchTemplateDetails = async (templateId) => {
    try {
      const token = localStorage.getItem("token");
      // Find selected template from existing templates
      const selectedTemplate = templates.find(t => t.id === templateId);
      
      if (selectedTemplate) {
        // Extract template components text for parameter extraction
        let templateText = "";
        if (selectedTemplate.components) {
          templateText = selectedTemplate.components.map(component => 
            component.text || ""
          ).join(" ");
        } else if (selectedTemplate.text) {
          templateText = selectedTemplate.text;
        } else {
          // Fallback to sample template text for this example
          templateText = "Your ticket for *{{1}}* *Time* - {{2}} *Venue* - {{3}} *Seats* - {{4}}";
        }
        
        // Extract parameters from template text
        const params = extractParameters(templateText);
        setExtractedParams(params);
        
        // Initialize template parameters with empty values
        const initialParams = {};
        params.forEach(param => {
          initialParams[param.key] = '';
        });

        setCampaignData(prev => ({
          ...prev,
          templateParams: initialParams
        }));

        setSelectedTemplateDetails({
          ...selectedTemplate,
          text: templateText
        });
      }
    } catch (error) {
      console.error("Error fetching template details:", error);
    }
  };

  // Add fetchGroups function to get groups from API
  const fetchGroups = async () => {
    try {
      const response = await axios.get(GROUP_ENDPOINTS.GET_ALL);
      if (response.data.success) {
        setGroups(response.data.groups);
      }
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };

  // Filter groups based on search term
  const filteredGroups = groups.filter(group => 
    group?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter templates based on template search term
  const filteredTemplates = templates.filter(template =>
    template?.name?.toLowerCase().includes(templateSearchTerm.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCampaignData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add function to handle template parameter changes
  const handleParamChange = (e) => {
    const { name, value } = e.target;
    setCampaignData(prev => ({
      ...prev,
      templateParams: {
        ...prev.templateParams,
        [name]: value
      }
    }));
  };

  const toggleDropdown = (type) => {
    setDropdownOpen(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handleTemplateSelect = (templateId) => {
    setCampaignData(prev => ({
      ...prev,
      template: templateId,
      // Reset template params when template changes
      templateParams: {}
    }));
    toggleDropdown('template');
  };

  const handleGroupSelect = (groupId) => {
    setCampaignData(prev => ({
      ...prev,
      selectedGroups: prev.selectedGroups.includes(groupId)
        ? prev.selectedGroups.filter(id => id !== groupId)
        : [...prev.selectedGroups, groupId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Prepare the data including template parameters
    const payload = {
      ...campaignData,
      // Format template parameters as needed for your API
      templateParams: Object.keys(campaignData.templateParams).reduce((acc, key) => {
        const paramIndex = key.replace('param', '');
        acc[paramIndex] = campaignData.templateParams[key];
        return acc;
      }, {})
    };
    
    console.log("Submit payload:", payload);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    setShowSuccess(true);
    setIsSubmitting(false);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const getCompletionPercentage = () => {
    let filled = 0;
    let total = 5;
    
    // Add template fields to total if they exist
    if (extractedParams.length) {
      total += extractedParams.length;
      // Count filled template params
      extractedParams.forEach(param => {
        if (campaignData.templateParams[param.key]) filled++;
      });
    }
    
    if (campaignData.campaignName) filled++;
    if (campaignData.template) filled++;
    if (campaignData.selectedGroups.length > 0) filled++;
    if (campaignData.sendType === 'now' || campaignData.scheduledTime) filled++;
    if (campaignData.priority) filled++;
    
    return (filled / total) * 100;
  };

  // Format the category to display it properly
  const formatCategory = (category) => {
    if (!category) return '';
    return category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
  };

  // Generate preview with parameters replaced
  const getPreviewText = (text) => {
    if (!text) return "";
    
    return text.replace(/\{\{(\d+)\}\}/g, (match, paramIndex) => {
      const paramKey = `param${paramIndex}`;
      const paramValue = campaignData.templateParams[paramKey];
      return paramValue ? paramValue : match;
    });
  };

  return (
    <div className="py-4">
      <Container>
        <Card className="shadow-sm">
          <CardBody>
            {showSuccess && (
              <Alert color="success" className="mb-4">
                Campaign created successfully!
              </Alert>
            )}

            <div className="mb-4">
              <h4>Campaign Progress</h4>
              <Progress value={getCompletionPercentage()} className="mt-2" />
            </div>

            <Form onSubmit={handleSubmit}>
              <Row>
                {/* Column 1 */}
                <Col md={6}>
                  {/* Campaign Name */}
                  <FormGroup className="mb-4">
                    <Label className="fw-bold">
                      Campaign Name
                      <Badge color="primary" pill className="ms-2">Required</Badge>
                    </Label>
                    <Input
                      type="text"
                      name="campaignName"
                      value={campaignData.campaignName}
                      onChange={handleInputChange}
                      placeholder="Enter campaign name"
                      required
                    />
                  </FormGroup>

                  {/* Template Selection - Updated with API data */}
                  <FormGroup className="mb-4 position-relative">
                    <Label className="fw-bold">
                      Message Template
                      <Badge color="primary" pill className="ms-2">Required</Badge>
                    </Label>
                    <Dropdown isOpen={dropdownOpen.template} toggle={() => toggleDropdown('template')} className="w-100">
                      <DropdownToggle caret color="light" className="w-100 text-start">
                        {campaignData.template 
                          ? templates.find(t => t.id === campaignData.template)?.name 
                          : 'Select a template...'}
                      </DropdownToggle>
                      <DropdownMenu className="w-100">
                        {/* Added search input for templates */}
                        <div className="px-3 py-2 border-bottom">
                          <Input
                            type="text"
                            placeholder="Search templates..."
                            value={templateSearchTerm}
                            onChange={(e) => setTemplateSearchTerm(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                        <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                          {templatesLoading ? (
                            <DropdownItem disabled>
                              <span className="spinner-border spinner-border-sm me-2" />
                              Loading templates...
                            </DropdownItem>
                          ) : filteredTemplates.length > 0 ? (
                            filteredTemplates.map(template => (
                              <DropdownItem 
                                key={template.id}
                                onClick={() => handleTemplateSelect(template.id)}
                              >
                                <div>
                                  <span className="fw-bold">{template.name}</span>
                                  <div className="d-flex mt-1">
                                    <Badge 
                                      color="primary" 
                                      pill 
                                      className="me-2"
                                      style={{ textTransform: 'none' }}
                                    >
                                      {formatCategory(template.category)}
                                    </Badge>
                                    <Badge color="info" pill>
                                      {template.language}
                                    </Badge>
                                  </div>
                                </div>
                              </DropdownItem>
                            ))
                          ) : (
                            <DropdownItem disabled>No templates found</DropdownItem>
                          )}
                        </div>
                      </DropdownMenu>
                    </Dropdown>
                  </FormGroup>
                </Col>

                {/* Column 2 */}
                <Col md={6}>
                  {/* Send Type */}
                  <FormGroup className="mb-4">
                    <Label className="fw-bold">
                      Sending Schedule
                      <Badge color="primary" pill className="ms-2">Required</Badge>
                    </Label>
                    <ButtonGroup className="w-100">
                      <Button
                        color={campaignData.sendType === 'now' ? 'primary' : 'light'}
                        onClick={() => setCampaignData(prev => ({ ...prev, sendType: 'now' }))}
                      >
                        Send Now
                      </Button>
                      <Button
                        color={campaignData.sendType === 'later' ? 'primary' : 'light'}
                        onClick={() => setCampaignData(prev => ({ ...prev, sendType: 'later' }))}
                      >
                        Schedule
                      </Button>
                    </ButtonGroup>
                    {campaignData.sendType === 'later' && (
                      <Input
                        type="datetime-local"
                        name="scheduledTime"
                        value={campaignData.scheduledTime}
                        onChange={handleInputChange}
                        className="mt-2"
                        required
                      />
                    )}
                  </FormGroup>

                  {/* Group Selection */}
                  <FormGroup className="mb-4 position-relative">
                    <Label className="fw-bold">
                      Target Groups
                      <Badge color="primary" pill className="ms-2">Required</Badge>
                    </Label>
                    <Dropdown isOpen={dropdownOpen.groups} toggle={() => toggleDropdown('groups')} className="w-100">
                      <DropdownToggle caret color="light" className="w-100 text-start">
                        {campaignData.selectedGroups.length 
                          ? `${campaignData.selectedGroups.length} groups selected`
                          : 'Select target groups...'}
                      </DropdownToggle>
                      <DropdownMenu className="w-100">
                        {/* Search input for groups */}
                        <div className="px-3 py-2 border-bottom">
                          <Input
                            type="text"
                            placeholder="Search groups..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                        <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                          {filteredGroups.length > 0 ? (
                            filteredGroups.map(group => (
                              <DropdownItem 
                                key={group._id}
                                onClick={() => handleGroupSelect(group._id)}
                                className="d-flex align-items-center"
                              >
                                <input
                                  type="checkbox"
                                  checked={campaignData.selectedGroups.includes(group._id)}
                                  onChange={() => {}}
                                  className="me-2"
                                />
                                <div className="d-flex justify-content-between w-100">
                                  <span>{group.name}</span>
                                  <Badge color="info" pill>
                                    {group.allowedPhoneNumbers?.length || 0} members
                                  </Badge>
                                </div>
                              </DropdownItem>
                            ))
                          ) : (
                            <DropdownItem disabled>No groups found</DropdownItem>
                          )}
                        </div>
                      </DropdownMenu>
                    </Dropdown>
                  </FormGroup>
                </Col>
              </Row>

              {/* Selected Template Preview with Parameters - NEW SECTION */}
              {campaignData.template && selectedTemplateDetails && (
                <Row className="mb-3">
                  <Col>
                    <Card className="border">
                      <CardBody>
                        <h5 className="mb-3">Template: {selectedTemplateDetails.name || "Selected Template"}</h5>
                        
                        {/* Display template badges if available */}
                        <div className="d-flex mb-3">
                          {selectedTemplateDetails.category && (
                            <Badge 
                              color="primary" 
                              pill 
                              className="me-2"
                              style={{ textTransform: 'none' }}
                            >
                              {formatCategory(selectedTemplateDetails.category)}
                            </Badge>
                          )}
                          {selectedTemplateDetails.language && (
                            <Badge color="info" pill>
                              {selectedTemplateDetails.language}
                            </Badge>
                          )}
                        </div>

                        {/* Display template preview with live parameter replacement */}
                        <div className="mb-4">
                          <Label className="fw-bold">Template Preview</Label>
                          <div className="border rounded p-3 bg-light mb-3">
                            <div className="text-muted mb-2">(Header)</div>
                            <div className="mb-2">
                              {getPreviewText(selectedTemplateDetails.text)}
                            </div>
                            <div className="text-muted small">This message is from an unverified business.</div>
                          </div>
                        </div>

                        {/* Template Parameters Section */}
                        <div className="mb-3">
                          <Label className="fw-bold">
                            Template Parameters
                            <Badge color="primary" pill className="ms-2">Required</Badge>
                          </Label>
                          {extractedParams.length > 0 ? (
                            <Row className="mt-2">
                              {extractedParams.map((param) => (
                                <Col md={6} key={param.key} className="mb-3">
                                  <FormGroup>
                                    <Label className="fw-bold text-secondary">
                                      {param.name} ({`{${param.index}}`})
                                    </Label>
                                    <Input
                                      type={param.type}
                                      name={param.key}
                                      value={campaignData.templateParams[param.key] || ''}
                                      onChange={handleParamChange}
                                      placeholder={`Enter ${param.name}`}
                                      required
                                    />
                                  </FormGroup>
                                </Col>
                              ))}
                            </Row>
                          ) : (
                            <p className="text-muted">This template has no editable parameters.</p>
                          )}
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              )}

              {/* Selected Groups Preview */}
              {campaignData.selectedGroups.length > 0 && (
                <Row className="mb-3">
                  <Col>
                    <Label className="fw-bold">Selected Groups</Label>
                    <div className="border rounded p-3">
                      <div className="d-flex flex-wrap gap-2">
                        {campaignData.selectedGroups.map(groupId => {
                          const group = groups.find(g => g._id === groupId);
                          return group ? (
                            <Badge 
                              key={groupId} 
                              color="primary" 
                              className="p-2 d-flex align-items-center"
                            >
                              {group.name}
                              <span 
                                className="ms-2 cursor-pointer" 
                                onClick={() => handleGroupSelect(groupId)}
                                style={{ cursor: 'pointer' }}
                              >
                                ×
                              </span>
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    </div>
                  </Col>
                </Row>
              )}

              {/* Submit Button - Full Width */}
              <Row>
                <Col>
                  <Button
                    color="primary"
                    type="submit"
                    className="w-100 mt-3"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Creating Campaign...
                      </>
                    ) : (
                      'Launch Campaign'
                    )}
                  </Button>
                </Col>
              </Row>
            </Form>
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default WhatsAppCampaigns;