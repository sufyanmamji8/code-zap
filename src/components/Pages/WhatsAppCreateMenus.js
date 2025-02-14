// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { MENU_ENDPOINTS } from 'Api/Constant';
// import {
//   Container, Row, Col, Card, CardBody, Button, Modal, 
//   ModalHeader, ModalBody, Form, FormGroup, Label, Input, 
//   Badge, Tooltip
// } from 'reactstrap';
// import { 
//   Plus, Edit2, Trash2, Menu as MenuIcon, 
//   FileText, AlertTriangle, 
//   X, Calendar,
//   ArrowRight,
//   ChevronRight
// } from 'lucide-react';
// import "../../assets/css/WhatsAppMenus.css";

// const WhatsAppMenus = () => {
//   const [menus, setMenus] = useState([]);
//   const [isFirstMenu, setIsFirstMenu] = useState(true);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [currentMenu, setCurrentMenu] = useState(null);
//   const [error, setError] = useState(null);
//   const [tooltipOpen, setTooltipOpen] = useState({});
  

//   // Define validation format options
//   const validationFormats = {
//     date: [
//       { 
//         label: 'Month-Year', 
//         value: '^[A-Za-z]{3}-\\d{4}$', 
//         example: 'Jan-2024',
//         errorMessage: 'Please enter date in Month-YYYY format (e.g., Jan-2024)'
//       },
//       { 
//         label: 'Day-Month-Year', 
//         value: '^\\d{1,2}-[A-Za-z]{3}-\\d{4}$',
//         example: '22-Nov-2024',
//         errorMessage: 'Please enter date in DD-Month-YYYY format (e.g., 22-Nov-2024)'
//       },
//       { 
//         label: 'DD/MM/YYYY', 
//         value: '^\\d{1,2}/\\d{1,2}/\\d{4}$',
//         example: '22/11/2024',
//         errorMessage: 'Please enter date in DD/MM/YYYY format (e.g., 22/11/2024)'
//       }
//     ],
//     number: [
//       { min: 0, max: 1000, description: 'Amount (0-1000)' },
//       { min: 1000, max: 10000, description: 'Amount (1000-10000)' },
//       { min: 10000, max: 100000, description: 'Amount (10000-100000)' }
//     ],
//     phone: [
//       { label: 'International', value: '^\\+?\\d{10,14}$', example: '+1234567890' },
//       { label: 'Local', value: '^\\d{10}$', example: '1234567890' }
//     ],
//     email: [
//       { label: 'Standard', value: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$', example: 'user@domain.com' }
//     ],
//     text: [
//       { label: 'Alphanumeric', value: '^[a-zA-Z0-9\\s]+$', example: 'Letters and numbers only' },
//       { label: 'Letters only', value: '^[a-zA-Z\\s]+$', example: 'Letters only' }
//     ]
//   };

//   const createInitialMenuState = () => ({
//     menuId: isFirstMenu ? 'main-menu' : '',
//     menuTitle: '',
//     menuType: 'options',
//     prompt: '',
//     nextMenuId: '',
//     apiCall: '',
//     validationType: 'none',
//     validationRules: {
//       min: null,
//       max: null,
//       format: '',
//       required: true
//     },
//     menuOptions: []
//   });

//   const [formData, setFormData] = useState(createInitialMenuState());



//   const handleValidationFormatChange = (e) => {
//     const selectedFormat = validationFormats[formData.validationType]
//       .find(format => format.value === e.target.value);
    
//     setFormData(prevData => ({
//       ...prevData,
//       validationRules: {
//         ...prevData.validationRules,
//         format: selectedFormat?.value || '',
//         example: selectedFormat?.example || ''
//       }
//     }));
//   };

//   const handleValidationTypeChange = (e) => {
//     const type = e.target.value;
//     setFormData(prevData => ({
//       ...prevData,
//       validationType: type,
//       validationRules: {
//         min: type === 'number' ? 0 : null,
//         max: type === 'number' ? 1000 : null,
//         format: type === 'date' ? validationFormats.date[0].value :
//                type === 'phone' ? validationFormats.phone[0].value :
//                type === 'email' ? validationFormats.email[0].value :
//                type === 'text' ? validationFormats.text[0].value : '',
//         required: true
//       }
//     }));
//   };

//   const getValidationExample = () => {
//     const { validationType, validationRules } = formData;
    
//     // Find the selected format from validationFormats
//     const selectedFormat = validationType !== 'none' && validationRules.format
//       ? validationFormats[validationType]?.find(f => f.value === validationRules.format)
//       : null;
  
//     switch (validationType) {
//       case 'date':
//         return selectedFormat?.errorMessage || 'Please enter a valid date';
      
//       case 'number':
//         return `Enter a number between ${validationRules.min} and ${validationRules.max}`;
      
//       case 'phone':
//         return `Enter a phone number (Example: ${selectedFormat?.example || '1234567890'})`;
      
//       case 'email':
//         return `Enter a valid email address (Example: ${selectedFormat?.example || 'user@domain.com'})`;
      
//       case 'text':
//         return `Enter text: ${selectedFormat?.example || 'Text input'}`;
      
//       default:
//         return 'No validation required';
//     }
//   };


//   const fetchMenus = async () => {
//     try {
//       const response = await axios.get(MENU_ENDPOINTS.GET_ALL);
//       setMenus(response.data.data || []);
      
//       const mainMenuExists = response.data.data?.some(menu => menu.menuId === 'main-menu');
//       setIsFirstMenu(!mainMenuExists);
//     } catch (error) {
//       setError('Failed to fetch menus');
//     }
//   };

//   useEffect(() => {
//     fetchMenus();
//   }, []);

//   const handleInputChange = (e, field, isOption = false, optionIndex = null) => {
//     const { value } = e.target;
    
//     setFormData(prevData => {
//       const newData = { ...prevData };
      
//       if (isOption) {
//         newData.menuOptions[optionIndex][field] = value;
//       } else if (field.includes('.')) {
//         const [parent, child] = field.split('.');
//         newData[parent] = { ...newData[parent], [child]: value };
//       } else {
//         newData[field] = value;
//       }
      
//       return newData;
//     });
//   };

//   const addOption = () => {
//     setFormData(prevData => ({
//       ...prevData,
//       menuOptions: [
//         ...prevData.menuOptions, 
//         { 
//           id: (prevData.menuOptions.length + 1).toString(), 
//           title: '', 
//           nextMenuId: '', 
//           apiCall: '' ,
//           apiText: ''
//         }
//       ]
//     }));
//   };



  
//   const removeOption = (index) => {
//     setFormData(prevData => {
//       const newOptions = prevData.menuOptions.filter((_, i) => i !== index);
//       return {
//         ...prevData,
//         menuOptions: newOptions.map((option, idx) => ({
//           ...option,
//           id: (idx + 1).toString()
//         }))
//       };
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);
  
//     try {
//       const endpoint = currentMenu 
//         ? MENU_ENDPOINTS.UPDATE(currentMenu.menuId)  // Pass menuId here
//         : MENU_ENDPOINTS.CREATE;
      
//       const method = currentMenu ? 'put' : 'post';
      
//       const payload = method === 'post' 
//         ? { menus: [formData] }  
//         : formData;  // For update, send full form data
      
//       const response = await axios[method](endpoint, payload);
      
//       if (method === 'post') {
//         setMenus(prevMenus => [...prevMenus, response.data.data[0]]);
//       } else {
//         setMenus(prevMenus => 
//           prevMenus.map(menu => 
//             menu.menuId === currentMenu.menuId 
//               ? response.data.data 
//               : menu
//           )
//         );
//       }
  
//       setFormData(createInitialMenuState());
//       setModalOpen(false);
//       setCurrentMenu(null);
//     } catch (error) {
//       setError(error.response?.data?.message || 'Failed to save menu');
//       console.error(error.response); // Log full error response
//     }
//   };

//   const handleDelete = async (menuId) => {
//     try {
//       await axios.delete(MENU_ENDPOINTS.DELETE(menuId));
//       setMenus(prevMenus => prevMenus.filter(menu => menu.menuId !== menuId));
//     } catch (error) {
//       setError(error.response?.data?.message || 'Failed to delete menu');
//     }
//   };

//   const toggleModal = () => {
//     setModalOpen(!modalOpen);
//     if (!modalOpen) {
//       setFormData(createInitialMenuState());
//       setCurrentMenu(null);
//     }
//   };

//   const editMenu = (menu) => {
//     setCurrentMenu(menu);
//     setFormData(menu);
//     setModalOpen(true);
//   };

//   const toggleTooltip = (menuId) => {
//     setTooltipOpen(prev => ({
//       ...prev,
//       [menuId]: !prev[menuId]
//     }));
//   };

//   return (
//     <Container fluid className="whatsapp-menu-container">
//       <div className="menu-header-new">
//         <div className="menu-title-section">
//           <h2>WhatsApp Menu Builder</h2>
//           <p className="text-muted">Build and manage your interactive WhatsApp menus</p>
//         </div>
//         <Button 
//           color="primary" 
//           className="add-menu-btn-new"
//           onClick={toggleModal}
//         >
//           <Plus size={20} /> Create New Menu
//         </Button>
//       </div>
  
//       {error && (
//         <div className="alert alert-danger d-flex align-items-center mb-4">
//           <AlertTriangle size={20} className="me-2" />
//           <span>{error}</span>
//         </div>
//       )}
  
//       <div className="menu-flow-container">
//         {menus.map(menu => {
//           const childMenus = menus.filter(m => 
//             (menu.menuType === 'options' && 
//              menu.menuOptions?.some(opt => opt.nextMenuId === m.menuId)) ||
//             (menu.menuType === 'prompt' && menu.nextMenuId === m.menuId)
//           );
  
//           return (
//             <div key={menu.menuId} className="menu-flow-item">
//               <Card className="menu-card-new">
//                 <CardBody>
//                   <div className="menu-card-header">
//                     <h4>{menu.menuTitle}</h4>
//                     <Badge 
//                       color={menu.menuType === 'options' ? 'success' : 'warning'}
//                       className="menu-type-badge"
//                     >
//                       {menu.menuType === 'options' ? 'Multiple Choice' : 'User Input'}
//                     </Badge>
//                   </div>
  
//                   <div className="menu-id-section">
//                     <MenuIcon size={16} className="me-2" />
//                     <span className="menu-id-text">{menu.menuId}</span>
//                   </div>
  
//                   {menu.menuType === 'options' && (
//                     <div className="menu-options-new">
//                       {menu.menuOptions.map((option, idx) => (
//                         <div key={idx} className="option-item-new">
//                           <div className="option-number">{option.id}</div>
//                           <div className="option-content">
//                             <div className="option-title">{option.title}</div>
//                             {option.nextMenuId && (
//                               <div className="option-flow">
//                                 <ArrowRight size={14} />
//                                 <span className="next-menu-id">{option.nextMenuId}</span>
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   )}
  
//                   {menu.menuType === 'prompt' && (
//                     <div className="prompt-content">
//                       <div className="prompt-text">
//                         <FileText size={16} className="me-2" />
//                         {menu.prompt}
//                       </div>
//                       <div className="validation-type">
//                         <AlertTriangle size={16} className="me-2" />
//                         Validates: {menu.validationType}
//                       </div>
//                       {menu.nextMenuId && (
//                         <div className="next-menu-flow">
//                           <ChevronRight size={16} className="me-2" />
//                           Next: {menu.nextMenuId}
//                         </div>
//                       )}
//                     </div>
//                   )}
  
//                   <div className="menu-actions-new">
//                     <Button 
//                       color="light"
//                       className="edit-btn"
//                       onClick={() => editMenu(menu)}
//                     >
//                       <Edit2 size={16} /> Edit
//                     </Button>
//                     <Button 
//                       color="danger"
//                       className="delete-btn"
//                       onClick={() => handleDelete(menu.menuId)}
//                     >
//                       <Trash2 size={16} /> Delete
//                     </Button>
//                   </div>
  
//                   {childMenus.length > 0 && (
//                     <div className="submenu-indicator">
//                       <div className="submenu-count">
//                         {childMenus.length} Submenu{childMenus.length > 1 ? 's' : ''}
//                       </div>
//                       <div className="submenu-list">
//                         {childMenus.map(child => (
//                           <Badge 
//                             key={child.menuId} 
//                             color="light" 
//                             className="submenu-badge"
//                           >
//                             {child.menuTitle}
//                           </Badge>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </CardBody>
//               </Card>
//             </div>
//           );
//         })}
//       </div>

//       <Modal isOpen={modalOpen} toggle={toggleModal} size="lg" className="menu-modal">
//   <ModalHeader 
//     toggle={toggleModal} 
//     className="bg-primary text-white border-0"
//   >
//     <h4 className="mb-0 text-white">
//       {currentMenu ? 'Edit Menu' : 'Create Menu'}
//     </h4>
//   </ModalHeader>
//   <ModalBody className="p-4">
//     <Form onSubmit={handleSubmit}>
//       <div className="bg-light p-4 rounded mb-4">
//         <Row>
//           <Col md={6}>
//             <FormGroup>
//               <Label className="fw-bold">Menu ID</Label>
//               <Input
//                 className="rounded-3 border-2"
//                 value={formData.menuId}
//                 onChange={(e) => handleInputChange(e, 'menuId')}
//                 disabled={isFirstMenu}
//                 required
//               />
//             </FormGroup>
//           </Col>
//           <Col md={6}>
//             <FormGroup>
//               <Label className="fw-bold">Menu Title</Label>
//               <Input
//                 className="rounded-3 border-2"
//                 value={formData.menuTitle}
//                 onChange={(e) => handleInputChange(e, 'menuTitle')}
//                 required
//               />
//             </FormGroup>
//           </Col>
//         </Row>

//         {formData.menuType === 'prompt' && formData.validationType === 'date' && (
//             <div className="validation-rules mb-3">
//               <FormGroup>
//                 <Label className="fw-bold">Date Format</Label>
//                 <Input
//                   type="select"
//                   className="rounded-3 border-2"
//                   value={formData.validationRules.format}
//                   onChange={handleValidationFormatChange}
//                 >
//                   {validationFormats.date.map((format, index) => (
//                     <option key={index} value={format.value}>
//                       {format.label} (Example: {format.example})
//                     </option>
//                   ))}
//                 </Input>
//                 <small className="text-muted d-block mt-2">
//                   <Calendar size={14} className="me-1" />
//                   This format will be used to validate user input
//                 </small>
//               </FormGroup>

//               <div className="validation-example mt-3 p-3 bg-light rounded-3 border">
//                 <div className="d-flex align-items-start">
//                   <AlertTriangle size={16} className="me-2 mt-1 text-warning" />
//                   <div>
//                     <div className="fw-bold mb-1">Format Requirements:</div>
//                     <div className="text-muted">{getValidationExample()}</div>
//                     <div className="mt-2">
//                       <span className="fw-bold">Example: </span>
//                       {validationFormats.date.find(f => f.value === formData.validationRules.format)?.example}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//         <Row>
//           <Col md={formData.menuType === 'prompt' ? 6 : 12}>
//             <FormGroup>
//               <Label className="fw-bold">Menu Type</Label>
//               <Input
//                 type="select"
//                 className="rounded-3 border-2"
//                 value={formData.menuType}
//                 onChange={(e) => handleInputChange(e, 'menuType')}
//               >
//                 <option value="options">Options Menu</option>
//                 <option value="prompt">Prompt Menu</option>
//               </Input>
//             </FormGroup>
//           </Col>
          
//           {formData.menuType === 'prompt' && (
//             <Col md={6}>
//               <FormGroup>
//                 <Label className="fw-bold">Validation Type</Label>
//                 <Input
//                   type="select"
//                   className="rounded-3 border-2"
//                   value={formData.validationType}
//                   onChange={handleValidationTypeChange}
//                 >
//                   <option value="none">No Validation</option>
//                   <option value="number">Number Only</option>
//                   <option value="date">Date Format</option>
//                   <option value="phone">Phone Number</option>
//                   <option value="email">Email Address</option>
//                   <option value="text">Text Input</option>
//                 </Input>
//               </FormGroup>
//             </Col>
//           )}
//         </Row>
//       </div>

//       {formData.menuType === 'prompt' && (
//         <div className="bg-light p-4 rounded mb-4">
//           <FormGroup className="mb-3">
//             <Label className="fw-bold">Prompt Text</Label>
//             <Input
//               type="textarea"
//               className="rounded-3 border-2"
//               value={formData.prompt || ''}
//               onChange={(e) => handleInputChange(e, 'prompt')}
//               placeholder="Enter prompt text for user..."
//               rows="3"
//             />
//           </FormGroup>

//           {formData.validationType !== 'none' && (
//             <div className="validation-rules mb-3">
//               {formData.validationType === 'date' && (
//                 <FormGroup>
//                   <Label className="fw-bold">Date Format</Label>
//                   <Input
//                     type="select"
//                     className="rounded-3 border-2"
//                     value={formData.validationRules.format}
//                     onChange={handleValidationFormatChange}
//                   >
//                     {validationFormats.date.map((format, index) => (
//                       <option key={index} value={format.value}>
//                         {format.label} (Example: {format.example})
//                       </option>
//                     ))}
//                   </Input>
//                 </FormGroup>
//               )}

//               {formData.validationType === 'number' && (
//                 <Row>
//                   <Col md={6}>
//                     <FormGroup>
//                       <Label className="fw-bold">Minimum Value</Label>
//                       <Input
//                         type="number"
//                         className="rounded-3 border-2"
//                         value={formData.validationRules.min}
//                         onChange={(e) => handleInputChange(e, 'validationRules.min')}
//                       />
//                     </FormGroup>
//                   </Col>
//                   <Col md={6}>
//                     <FormGroup>
//                       <Label className="fw-bold">Maximum Value</Label>
//                       <Input
//                         type="number"
//                         className="rounded-3 border-2"
//                         value={formData.validationRules.max}
//                         onChange={(e) => handleInputChange(e, 'validationRules.max')}
//                       />
//                     </FormGroup>
//                   </Col>
//                 </Row>
//               )}

//               {(formData.validationType === 'phone' || 
//                 formData.validationType === 'email' || 
//                 formData.validationType === 'text') && (
//                 <FormGroup>
//                   <Label className="fw-bold">Format Type</Label>
//                   <Input
//                     type="select"
//                     className="rounded-3 border-2"
//                     value={formData.validationRules.format}
//                     onChange={handleValidationFormatChange}
//                   >
//                     {validationFormats[formData.validationType].map((format, index) => (
//                       <option key={index} value={format.value}>
//                         {format.label} (Example: {format.example})
//                       </option>
//                     ))}
//                   </Input>
//                 </FormGroup>
//               )}

//               <div className="validation-example mt-3 p-3 bg-white rounded-3 border">
//                 <div className="d-flex align-items-center text-muted">
//                   <AlertTriangle size={16} className="me-2" />
//                   <span>Expected Format: {getValidationExample()}</span>
//                 </div>
//               </div>
//             </div>
//           )}

//           <FormGroup>
//             <Label className="fw-bold">API Call</Label>
//             <Input
//               className="rounded-3 border-2"
//               value={formData.apiCall || ''}
//               onChange={(e) => handleInputChange(e, 'apiCall')}
//               placeholder="Enter API endpoint or function"
//             />
//           </FormGroup>

//           <FormGroup>
//             <Label className="fw-bold">API Response Text</Label>
//             <Input
//               className="rounded-3 border-2"
//               value={formData.apiText || ''}
//               onChange={(e) => handleInputChange(e, 'apiText')}
//               placeholder="Enter API response text"
//             />
//           </FormGroup>

//           <FormGroup>
//             <Label className="fw-bold">Next Menu ID</Label>
//             <Input
//               className="rounded-3 border-2"
//               value={formData.nextMenuId || ''}
//               onChange={(e) => handleInputChange(e, 'nextMenuId')}
//               placeholder="Enter next menu ID"
//             />
//           </FormGroup>
//         </div>
//       )}

//       {formData.menuType === 'options' && (
//         <div className="bg-light p-4 rounded">
//           <div className="d-flex justify-content-between align-items-center mb-4">
//             <h5 className="mb-0 fw-bold">Menu Options</h5>
//             <Button 
//               color="primary" 
//               outline 
//               onClick={addOption}
//               className="d-flex align-items-center gap-2"
//             >
//               <Plus size={16} /> Add Option
//             </Button>
//           </div>

//           <div className="options-container">
//             {formData.menuOptions.map((option, index) => (
//               <div key={index} className="bg-white p-3 rounded shadow-sm mb-3">
//                 <Row className="align-items-center">
//                   <Col md={1}>
//                     <div className="bg-light rounded-circle d-flex align-items-center justify-content-center" style={{width: "32px", height: "32px"}}>
//                       {option.id}
//                     </div>
//                   </Col>
//                   <Col md={3}>
//                     <Input
//                       className="rounded-3 border-2"
//                       placeholder="Option Title"
//                       value={option.title}
//                       onChange={(e) => handleInputChange(e, 'title', true, index)}
//                     />
//                   </Col>
//                   <Col md={2}>
//                     <Input
//                       className="rounded-3 border-2"
//                       placeholder="Next Menu ID"
//                       value={option.nextMenuId}
//                       onChange={(e) => handleInputChange(e, 'nextMenuId', true, index)}
//                     />
//                   </Col>
//                   <Col md={2}>
//                     <Input
//                       className="rounded-3 border-2"
//                       placeholder="API Call"
//                       value={option.apiCall}
//                       onChange={(e) => handleInputChange(e, 'apiCall', true, index)}
//                     />
//                   </Col>
//                   <Col md={3}>
//                     <Input
//                       className="rounded-3 border-2"
//                       placeholder="API Text"
//                       value={option.apiText}
//                       onChange={(e) => handleInputChange(e, 'apiText', true, index)}
//                     />
//                   </Col>
//                   <Col md={1}>
//                     <Button 
//                       color="danger" 
//                       outline
//                       className="rounded-circle p-2"
//                       onClick={() => removeOption(index)}
//                     >
//                       <X size={16} />
//                     </Button>
//                   </Col>
//                 </Row>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       <div className="d-flex justify-content-end gap-3 mt-4 pt-4 border-top">
//         <Button 
//           color="secondary" 
//           outline
//           onClick={toggleModal}
//           className="px-4"
//         >
//           Cancel
//         </Button>
//         <Button 
//           color="primary" 
//           type="submit"
//           className="px-4"
//         >
//           {currentMenu ? 'Update Menu' : 'Create Menu'}
//         </Button>
//       </div>
//     </Form>
//   </ModalBody>
// </Modal>
//     </Container>
//   );
// };

// export default WhatsAppMenus;

















import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MENU_ENDPOINTS } from 'Api/Constant';
import {
  Container, Row, Col, Card, CardBody, Button, Modal, 
  ModalHeader, ModalBody, Form, FormGroup, Label, Input, 
  Badge, Tooltip
} from 'reactstrap';
import { 
  Plus, Edit2, Trash2, Menu as MenuIcon, 
  FileText, AlertTriangle, 
  X, Calendar,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import "../../assets/css/WhatsAppMenus.css";

const WhatsAppCreateMenus = () => {
  const [menus, setMenus] = useState([]);
  const [isFirstMenu, setIsFirstMenu] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentMenu, setCurrentMenu] = useState(null);
  const [error, setError] = useState(null);
  const [tooltipOpen, setTooltipOpen] = useState({});
  const [selectedMenuId, setSelectedMenuId] = useState(null);
  const [menuPath, setMenuPath] = useState([]);
  const [expandedMenus, setExpandedMenus] = useState({});
  const [activeMenu, setActiveMenu] = useState(null);
  
  
  

  // Define validation format options
  const validationFormats = {
    date: [
      { 
        label: 'Month-Year', 
        value: '^[A-Za-z]{3}-\\d{4}$', 
        example: 'Jan-2024',
        errorMessage: 'Please enter date in Month-YYYY format (e.g., Jan-2024)'
      },
      { 
        label: 'Day-Month-Year', 
        value: '^\\d{1,2}-[A-Za-z]{3}-\\d{4}$',
        example: '22-Nov-2024',
        errorMessage: 'Please enter date in DD-Month-YYYY format (e.g., 22-Nov-2024)'
      },
      { 
        label: 'DD/MM/YYYY', 
        value: '^\\d{1,2}/\\d{1,2}/\\d{4}$',
        example: '22/11/2024',
        errorMessage: 'Please enter date in DD/MM/YYYY format (e.g., 22/11/2024)'
      }
    ],
    number: [
      { min: 0, max: 1000, description: 'Amount (0-1000)' },
      { min: 1000, max: 10000, description: 'Amount (1000-10000)' },
      { min: 10000, max: 100000, description: 'Amount (10000-100000)' }
    ],
    phone: [
      { label: 'International', value: '^\\+?\\d{10,14}$', example: '+1234567890' },
      { label: 'Local', value: '^\\d{10}$', example: '1234567890' }
    ],
    email: [
      { label: 'Standard', value: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$', example: 'user@domain.com' }
    ],
    text: [
      { label: 'Alphanumeric', value: '^[a-zA-Z0-9\\s]+$', example: 'Letters and numbers only' },
      { label: 'Letters only', value: '^[a-zA-Z\\s]+$', example: 'Letters only' }
    ]
  };

  const createInitialMenuState = () => ({
    menuId: isFirstMenu ? 'main-menu' : '',
    menuTitle: '',
    menuType: 'options',
    prompt: '',
    nextMenuId: '',
    apiCall: '',
    validationType: 'none',
    validationRules: {
      min: null,
      max: null,
      format: '',
      required: true
    },
    menuOptions: []
  });

  const [formData, setFormData] = useState(createInitialMenuState());



  const handleValidationFormatChange = (e) => {
    const selectedFormat = validationFormats[formData.validationType]
      .find(format => format.value === e.target.value);
    
    setFormData(prevData => ({
      ...prevData,
      validationRules: {
        ...prevData.validationRules,
        format: selectedFormat?.value || '',
        example: selectedFormat?.example || ''
      }
    }));
  };

  const handleValidationTypeChange = (e) => {
    const type = e.target.value;
    setFormData(prevData => ({
      ...prevData,
      validationType: type,
      validationRules: {
        min: type === 'number' ? 0 : null,
        max: type === 'number' ? 1000 : null,
        format: type === 'date' ? validationFormats.date[0].value :
               type === 'phone' ? validationFormats.phone[0].value :
               type === 'email' ? validationFormats.email[0].value :
               type === 'text' ? validationFormats.text[0].value : '',
        required: true
      }
    }));
  };

  const getValidationExample = () => {
    const { validationType, validationRules } = formData;
    
    // Find the selected format from validationFormats
    const selectedFormat = validationType !== 'none' && validationRules.format
      ? validationFormats[validationType]?.find(f => f.value === validationRules.format)
      : null;
  
    switch (validationType) {
      case 'date':
        return selectedFormat?.errorMessage || 'Please enter a valid date';
      
      case 'number':
        return `Enter a number between ${validationRules.min} and ${validationRules.max}`;
      
      case 'phone':
        return `Enter a phone number (Example: ${selectedFormat?.example || '1234567890'})`;
      
      case 'email':
        return `Enter a valid email address (Example: ${selectedFormat?.example || 'user@domain.com'})`;
      
      case 'text':
        return `Enter text: ${selectedFormat?.example || 'Text input'}`;
      
      default:
        return 'No validation required';
    }
  };


  const fetchMenus = async () => {
    try {
      const response = await axios.get(MENU_ENDPOINTS.GET_ALL);
      const allMenus = response.data.data || [];
      
      // Get only the main-menu
      const mainMenu = allMenus.find(menu => menu.menuId === 'main-menu');
      setMenus(allMenus); // Keep all menus in state for other operations
      setActiveMenu(mainMenu); // Set main menu as active
      setSelectedMenuId(mainMenu?.menuId); // Set main menu as selected
      
      const mainMenuExists = allMenus.some(menu => menu.menuId === 'main-menu');
      setIsFirstMenu(!mainMenuExists);
    } catch (error) {
      setError('Failed to fetch menus');
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  const handleInputChange = (e, field, isOption = false, optionIndex = null) => {
    const { value } = e.target;
    
    setFormData(prevData => {
      const newData = { ...prevData };
      
      if (isOption) {
        newData.menuOptions[optionIndex][field] = value;
      } else if (field.includes('.')) {
        const [parent, child] = field.split('.');
        newData[parent] = { ...newData[parent], [child]: value };
      } else {
        newData[field] = value;
      }
      
      return newData;
    });
  };

  const addOption = () => {
    setFormData(prevData => ({
      ...prevData,
      menuOptions: [
        ...prevData.menuOptions, 
        { 
          id: (prevData.menuOptions.length + 1).toString(), 
          title: '', 
          nextMenuId: '', 
          apiCall: '' ,
          apiText: ''
        }
      ]
    }));
  };



  
  const removeOption = (index) => {
    setFormData(prevData => {
      const newOptions = prevData.menuOptions.filter((_, i) => i !== index);
      return {
        ...prevData,
        menuOptions: newOptions.map((option, idx) => ({
          ...option,
          id: (idx + 1).toString()
        }))
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
  
    try {
      const endpoint = currentMenu 
        ? MENU_ENDPOINTS.UPDATE(currentMenu.menuId)
        : MENU_ENDPOINTS.CREATE;
      
      const method = currentMenu ? 'put' : 'post';
      
      // Format menu ID: convert title to lowercase, replace spaces with hyphens
      if (!currentMenu && !isFirstMenu) {
        const formattedId = formData.menuTitle.toLowerCase().replace(/\s+/g, '-');
        formData.menuId = formattedId;
      }
      
      const payload = method === 'post' 
        ? { menus: [formData] }
        : formData;
      
      const response = await axios[method](endpoint, payload);
      
      if (method === 'post') {
        setMenus(prevMenus => [...prevMenus, response.data.data[0]]);
      } else {
        setMenus(prevMenus => 
          prevMenus.map(menu => 
            menu.menuId === currentMenu.menuId 
              ? response.data.data 
              : menu
          )
        );
      }
  
      setFormData(createInitialMenuState());
      setModalOpen(false);
      setCurrentMenu(null);
      
      // Refresh menus to get updated hierarchy
      fetchMenus();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save menu');
      console.error(error.response);
    }
  };

  const handleDelete = async (menuId) => {
    try {
      await axios.delete(MENU_ENDPOINTS.DELETE(menuId));
      setMenus(prevMenus => prevMenus.filter(menu => menu.menuId !== menuId));
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete menu');
    }
  };

  const toggleModal = () => {
    setModalOpen(!modalOpen);
    if (!modalOpen) {
      setFormData(createInitialMenuState());
      setCurrentMenu(null);
    }
  };

  const editMenu = (menu) => {
    setCurrentMenu(menu);
    setFormData(menu);
    setModalOpen(true);
  };

  const toggleTooltip = (menuId) => {
    setTooltipOpen(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
    setSelectedMenuId(menu.menuId);
    setMenuPath([menu.menuId]);
  };

  const handleMenuSelect = (menuId) => {
    const menu = menus.find(m => m.menuId === menuId);
    if (menu) {
      setSelectedMenuId(menuId);
      // Update menu path
      if (!menuPath.includes(menuId)) {
        setMenuPath([...menuPath, menuId]);
      } else {
        // If clicking on a menu already in path, truncate to that point
        const index = menuPath.indexOf(menuId);
        setMenuPath(menuPath.slice(0, index + 1));
      }
    }
  };

  const toggleExpandMenu = (menuId) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  // Function to get child menus
  const getChildMenus = (menuId) => {
    const menu = menus.find(m => m.menuId === menuId);
    if (!menu) return [];
    
    return menus.filter(m => 
      (menu.menuType === 'options' && 
       menu.menuOptions?.some(opt => opt.nextMenuId === m.menuId)) ||
      (menu.menuType === 'prompt' && menu.nextMenuId === m.menuId)
    );
  };

   const createSubMenu = (parentMenu) => {
    // Generate menu ID without numbers, based on parent menu name
    const baseId = parentMenu.menuTitle.toLowerCase().replace(/\s+/g, '-');
    const subMenuId = `${baseId}-sub`;
    
    setFormData({
      ...createInitialMenuState(),
      menuId: subMenuId,
      menuTitle: `Sub-menu of ${parentMenu.menuTitle}`,
    });
    setModalOpen(true);
  };

  const renderSidebarMenus = () => {
    // Filter to only show Report menus
    const reportMenus = menus.filter(menu => 
      menu.menuId === 'main-menu' || 
      menu.menuTitle.toLowerCase().includes('report')
    );

    return reportMenus.map((menu) => (
      <div
        key={menu.menuId}
        className={`menu-item p-3 mb-2 rounded cursor-pointer ${activeMenu?.menuId === menu.menuId ? 'bg-light' : ''}`}
        style={{
          cursor: 'pointer',
          transition: 'all 0.2s',
          border: '1px solid #e0e0e0',
        }}
        onClick={() => handleMenuClick(menu)}
      >
        <div className="d-flex align-items-center gap-2">
          <MenuIcon size={16} />
          <span className="fw-medium">{menu.menuTitle}</span>
        </div>
        <small className="text-muted d-block mt-1">{menu.menuId}</small>
      </div>
    ));
  };

  return (
    <Container fluid className="d-flex p-0">
      {/* Left Sidebar */}
      <div className="menu-sidebar" style={{
        width: '250px',
        minHeight: '100vh',
        background: '#fff',
        borderRight: '1px solid #e0e0e0',
        padding: '1rem'
      }}>
        <div className="sidebar-header mb-4">
          <h5 className="mb-3">Available Menus</h5>
        </div>
        
        <div className="menu-list">
          {/* Only show the main-menu */}
          {menus
            .filter(menu => menu.menuId === 'main-menu')
            .map((menu) => (
              <div
                key={menu.menuId}
                className={`menu-item p-3 mb-2 rounded cursor-pointer ${activeMenu?.menuId === menu.menuId ? 'bg-light' : ''}`}
                style={{
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  border: '1px solid #e0e0e0',
                }}
                onClick={() => handleMenuClick(menu)}
              >
                <div className="d-flex align-items-center gap-2">
                  <MenuIcon size={16} />
                  <span className="fw-medium">{menu.menuTitle}</span>
                </div>
                <small className="text-muted d-block mt-1">{menu.menuId}</small>
              </div>
            ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow-1">
        <div className="whatsapp-menu-container">
          <div className="menu-header-new">
            <div className="menu-title-section">
              <h2>WhatsApp Menu Builder</h2>
              <p className="text-muted">Build and manage your interactive WhatsApp menus</p>
            </div>
            
            <Button 
              color="primary" 
              className="add-menu-btn-new"
              onClick={toggleModal}
            >
              <Plus size={20} /> Create New Menu
            </Button>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="alert alert-danger d-flex align-items-center mb-4">
              <AlertTriangle size={20} className="me-2" />
              <span>{error}</span>
            </div>
          )}

          {/* Menu Cards */}
          <div className="menu-flow-container">
            {(selectedMenuId ? [menus.find(m => m.menuId === selectedMenuId)] : [])
              .filter(Boolean)
              .map(menu => {
                const childMenus = getChildMenus(menu.menuId);
                const isExpanded = expandedMenus[menu.menuId];

            return (
              <div key={menu.menuId} className="menu-flow-item">
                 <Card className="menu-card-new">
      <CardBody>
      <div className="menu-card-header">
  <div className="d-flex align-items-center gap-2">
    {childMenus.length > 0 && (
      <Button
        color="link"
        className="p-0 me-2"
        onClick={() => toggleExpandMenu(menu.menuId)}
      >
        <ChevronRight
          size={20}
          className={`transform transition-transform ${isExpanded ? 'rotate-90' : ''}`}
        />
      </Button>
    )}
    <h4 className="mb-0">{menu.menuTitle}</h4>
  </div>
  <Badge 
    color={menu.menuType === 'options' ? 'success' : 'warning'}
    className="menu-type-badge"
  >
    {menu.menuType === 'options' ? 'Multiple Choice' : 'User Input'}
  </Badge>
</div>

<div className="menu-id-section">
  <MenuIcon size={16} className="me-2" />
  <span className="menu-id-text">{menu.menuId}</span>
  {menu.menuId === 'main-menu' && (
    <Plus 
      size={14} 
      className="ms-2 text-primary cursor-pointer" 
      onClick={(e) => {
        e.stopPropagation();
        createSubMenu({
          menuId: menu.menuId,
          menuTitle: menu.menuTitle
        });
      }}
    />
  )}
</div>

                    {menu.menuType === 'options' && (
  <div className="menu-options-new">
    {menu.menuOptions.map((option, idx) => (
      <div 
        key={idx} 
        className="option-item-new cursor-pointer"
        onClick={() => option.nextMenuId && handleMenuSelect(option.nextMenuId)}
      >
        <div className="option-number">{option.id}</div>
        <div className="option-content">
          <div className="option-title">{option.title}</div>
          {option.nextMenuId && (
            <div className="option-flow">
              <ArrowRight size={14} />
              <span className="next-menu-id">{option.nextMenuId}</span>
              <Plus 
                size={14} 
                className="ms-2 text-primary cursor-pointer" 
                onClick={(e) => {
                  e.stopPropagation();
                  const parentMenu = menus.find(m => m.menuId === option.nextMenuId);
                  if (parentMenu) {
                    createSubMenu(parentMenu);
                  } else {
                    // If menu doesn't exist yet, create a dummy menu object
                    createSubMenu({
                      menuId: option.nextMenuId,
                      menuTitle: option.title
                    });
                  }
                }}
              />
            </div>
          )}
        </div>
      </div>
    ))}
  </div>
)}

                    {menu.menuType === 'prompt' && (
                      <div className="prompt-content">
                        <div className="prompt-text">
                          <FileText size={16} className="me-2" />
                          {menu.prompt}
                        </div>
                        <div className="validation-type">
                          <AlertTriangle size={16} className="me-2" />
                          Validates: {menu.validationType}
                        </div>
                        {menu.nextMenuId && (
                          <div 
                            className="next-menu-flow cursor-pointer"
                            onClick={() => handleMenuSelect(menu.nextMenuId)}
                          >
                            <ChevronRight size={16} className="me-2" />
                            Next: {menu.nextMenuId}
                          </div>
                        )}
                      </div>
                    )}

<div className="menu-actions-new">
          <Button 
            color="light"
            className="edit-btn"
            onClick={() => editMenu(menu)}
          >
            <Edit2 size={16} /> Edit
          </Button>
          <Button 
            color="danger"
            className="delete-btn"
            onClick={() => handleDelete(menu.menuId)}
          >
            <Trash2 size={16} /> Delete
          </Button>
        </div>


                    {/* Expanded Child Menus */}
                    {isExpanded && childMenus.length > 0 && (
                      <div className="child-menus mt-4">
                        <div className="ps-4 border-start">
                          {childMenus.map(childMenu => (
                            <div 
                              key={childMenu.menuId}
                              className="child-menu-item mb-3 cursor-pointer"
                              onClick={() => handleMenuSelect(childMenu.menuId)}
                            >
                              <Badge color="light" className="mb-2">
                                {childMenu.menuType === 'options' ? 'Multiple Choice' : 'User Input'}
                              </Badge>
                              <h5>{childMenu.menuTitle}</h5>
                              <small className="text-muted">{childMenu.menuId}</small>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardBody>
                </Card>
              </div>
            );
        })}
      </div>

      <Modal isOpen={modalOpen} toggle={toggleModal} size="lg" className="menu-modal">
            <ModalHeader toggle={toggleModal} className="bg-primary text-white border-0">
              <h4 className="mb-0 text-white">
                {currentMenu ? 'Edit Menu' : 'Create Menu'}
              </h4>
            </ModalHeader>
            <ModalBody className="p-4">
              <Form onSubmit={handleSubmit}>
      <div className="bg-light p-4 rounded mb-4">
        <Row>
          <Col md={6}>
            <FormGroup>
              <Label className="fw-bold">Menu ID</Label>
              <Input
                className="rounded-3 border-2"
                value={formData.menuId}
                onChange={(e) => handleInputChange(e, 'menuId')}
                disabled={isFirstMenu}
                required
              />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label className="fw-bold">Menu Title</Label>
              <Input
                className="rounded-3 border-2"
                value={formData.menuTitle}
                onChange={(e) => handleInputChange(e, 'menuTitle')}
                required
              />
            </FormGroup>
          </Col>
        </Row>

        {formData.menuType === 'prompt' && formData.validationType === 'date' && (
            <div className="validation-rules mb-3">
              <FormGroup>
                <Label className="fw-bold">Date Format</Label>
                <Input
                  type="select"
                  className="rounded-3 border-2"
                  value={formData.validationRules.format}
                  onChange={handleValidationFormatChange}
                >
                  {validationFormats.date.map((format, index) => (
                    <option key={index} value={format.value}>
                      {format.label} (Example: {format.example})
                    </option>
                  ))}
                </Input>
                <small className="text-muted d-block mt-2">
                  <Calendar size={14} className="me-1" />
                  This format will be used to validate user input
                </small>
              </FormGroup>

              <div className="validation-example mt-3 p-3 bg-light rounded-3 border">
                <div className="d-flex align-items-start">
                  <AlertTriangle size={16} className="me-2 mt-1 text-warning" />
                  <div>
                    <div className="fw-bold mb-1">Format Requirements:</div>
                    <div className="text-muted">{getValidationExample()}</div>
                    <div className="mt-2">
                      <span className="fw-bold">Example: </span>
                      {validationFormats.date.find(f => f.value === formData.validationRules.format)?.example}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        <Row>
          <Col md={formData.menuType === 'prompt' ? 6 : 12}>
            <FormGroup>
              <Label className="fw-bold">Menu Type</Label>
              <Input
                type="select"
                className="rounded-3 border-2"
                value={formData.menuType}
                onChange={(e) => handleInputChange(e, 'menuType')}
              >
                <option value="options">Options Menu</option>
                <option value="prompt">Prompt Menu</option>
              </Input>
            </FormGroup>
          </Col>
          
          {formData.menuType === 'prompt' && (
            <Col md={6}>
              <FormGroup>
                <Label className="fw-bold">Validation Type</Label>
                <Input
                  type="select"
                  className="rounded-3 border-2"
                  value={formData.validationType}
                  onChange={handleValidationTypeChange}
                >
                  <option value="none">No Validation</option>
                  <option value="number">Number Only</option>
                  <option value="date">Date Format</option>
                  <option value="phone">Phone Number</option>
                  <option value="email">Email Address</option>
                  <option value="text">Text Input</option>
                </Input>
              </FormGroup>
            </Col>
          )}
        </Row>
      </div>

      {formData.menuType === 'prompt' && (
        <div className="bg-light p-4 rounded mb-4">
          <FormGroup className="mb-3">
            <Label className="fw-bold">Prompt Text</Label>
            <Input
              type="textarea"
              className="rounded-3 border-2"
              value={formData.prompt || ''}
              onChange={(e) => handleInputChange(e, 'prompt')}
              placeholder="Enter prompt text for user..."
              rows="3"
            />
          </FormGroup>

          {formData.validationType !== 'none' && (
            <div className="validation-rules mb-3">
              {formData.validationType === 'date' && (
                <FormGroup>
                  <Label className="fw-bold">Date Format</Label>
                  <Input
                    type="select"
                    className="rounded-3 border-2"
                    value={formData.validationRules.format}
                    onChange={handleValidationFormatChange}
                  >
                    {validationFormats.date.map((format, index) => (
                      <option key={index} value={format.value}>
                        {format.label} (Example: {format.example})
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              )}

              {formData.validationType === 'number' && (
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label className="fw-bold">Minimum Value</Label>
                      <Input
                        type="number"
                        className="rounded-3 border-2"
                        value={formData.validationRules.min}
                        onChange={(e) => handleInputChange(e, 'validationRules.min')}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label className="fw-bold">Maximum Value</Label>
                      <Input
                        type="number"
                        className="rounded-3 border-2"
                        value={formData.validationRules.max}
                        onChange={(e) => handleInputChange(e, 'validationRules.max')}
                      />
                    </FormGroup>
                  </Col>
                </Row>
              )}

              {(formData.validationType === 'phone' || 
                formData.validationType === 'email' || 
                formData.validationType === 'text') && (
                <FormGroup>
                  <Label className="fw-bold">Format Type</Label>
                  <Input
                    type="select"
                    className="rounded-3 border-2"
                    value={formData.validationRules.format}
                    onChange={handleValidationFormatChange}
                  >
                    {validationFormats[formData.validationType].map((format, index) => (
                      <option key={index} value={format.value}>
                        {format.label} (Example: {format.example})
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              )}

              <div className="validation-example mt-3 p-3 bg-white rounded-3 border">
                <div className="d-flex align-items-center text-muted">
                  <AlertTriangle size={16} className="me-2" />
                  <span>Expected Format: {getValidationExample()}</span>
                </div>
              </div>
            </div>
          )}

          <FormGroup>
            <Label className="fw-bold">API Call</Label>
            <Input
              className="rounded-3 border-2"
              value={formData.apiCall || ''}
              onChange={(e) => handleInputChange(e, 'apiCall')}
              placeholder="Enter API endpoint or function"
            />
          </FormGroup>

          <FormGroup>
            <Label className="fw-bold">API Response Text</Label>
            <Input
              className="rounded-3 border-2"
              value={formData.apiText || ''}
              onChange={(e) => handleInputChange(e, 'apiText')}
              placeholder="Enter API response text"
            />
          </FormGroup>

          <FormGroup>
            <Label className="fw-bold">Next Menu ID</Label>
            <Input
              className="rounded-3 border-2"
              value={formData.nextMenuId || ''}
              onChange={(e) => handleInputChange(e, 'nextMenuId')}
              placeholder="Enter next menu ID"
            />
          </FormGroup>
        </div>
      )}

      {formData.menuType === 'options' && (
        <div className="bg-light p-4 rounded">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="mb-0 fw-bold">Menu Options</h5>
            <Button 
              color="primary" 
              outline 
              onClick={addOption}
              className="d-flex align-items-center gap-2"
            >
              <Plus size={16} /> Add Option
            </Button>
          </div>

          <div className="options-container">
            {formData.menuOptions.map((option, index) => (
              <div key={index} className="bg-white p-3 rounded shadow-sm mb-3">
                <Row className="align-items-center">
                  <Col md={1}>
                    <div className="bg-light rounded-circle d-flex align-items-center justify-content-center" style={{width: "32px", height: "32px"}}>
                      {option.id}
                    </div>
                  </Col>
                  <Col md={3}>
                    <Input
                      className="rounded-3 border-2"
                      placeholder="Option Title"
                      value={option.title}
                      onChange={(e) => handleInputChange(e, 'title', true, index)}
                    />
                  </Col>
                  <Col md={2}>
                    <Input
                      className="rounded-3 border-2"
                      placeholder="Next Menu ID"
                      value={option.nextMenuId}
                      onChange={(e) => handleInputChange(e, 'nextMenuId', true, index)}
                    />
                  </Col>
                  <Col md={2}>
                    <Input
                      className="rounded-3 border-2"
                      placeholder="API Call"
                      value={option.apiCall}
                      onChange={(e) => handleInputChange(e, 'apiCall', true, index)}
                    />
                  </Col>
                  <Col md={3}>
                    <Input
                      className="rounded-3 border-2"
                      placeholder="API Text"
                      value={option.apiText}
                      onChange={(e) => handleInputChange(e, 'apiText', true, index)}
                    />
                  </Col>
                  <Col md={1}>
                    <Button 
                      color="danger" 
                      outline
                      className="rounded-circle p-2"
                      onClick={() => removeOption(index)}
                    >
                      <X size={16} />
                    </Button>
                  </Col>
                </Row>
              </div>
            ))}
          </div>
        </div>
      )}

<div className="d-flex justify-content-end gap-3 mt-4 pt-4 border-top">
                  <Button 
                    color="secondary" 
                    outline
                    onClick={toggleModal}
                    className="px-4"
                  >
                    Cancel
                  </Button>
                  <Button 
                    color="primary" 
                    type="submit"
                    className="px-4"
                  >
                    {currentMenu ? 'Update Menu' : 'Create Menu'}
                  </Button>
                </div>
              </Form>
            </ModalBody>
          </Modal>
        </div>
      </div>
    </Container>
  );
};

export default WhatsAppCreateMenus;