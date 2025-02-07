// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { MENU_ENDPOINTS } from 'Api/Constant';
// import {
//   Card, CardBody, Modal, ModalHeader, ModalBody, Form, 
//   FormGroup, Label, Input, Button, Row, Col, Container, Alert
// } from 'reactstrap';
// import { Plus } from 'lucide-react';
// import "../../assets/css/WhatsAppMenus.css";

// const WhatsAppMenus = () => {
//   const [menus, setMenus] = useState([]);
//   const [isFirstMenu, setIsFirstMenu] = useState(true);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [currentMenu, setCurrentMenu] = useState(null);
//   const [error, setError] = useState(null);

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
//           apiCall: '' 
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

//   return (
//     <Container>
//       {error && <Alert color="danger">{error}</Alert>}
      
//       <Button color="primary" onClick={toggleModal}>
//         <Plus /> Add Menu
//       </Button>

//       <Row>
//         {menus.map(menu => (
//           <Col key={menu.menuId} md={4}>
//             <Card>
//               <CardBody>
//                 <h5>{menu.menuTitle}</h5>
//                 <p>ID: {menu.menuId}</p>
//                 <p>Type: {menu.menuType}</p>
                
//                 {menu.menuType === 'options' && menu.menuOptions && (
//                   <div>
//                     <p>Options:</p>
//                     {menu.menuOptions.map((option, index) => (
//                       <div key={index}>
//                         {option.id}. {option.title}
//                       </div>
//                     ))}
//                   </div>
//                 )}

//                 {menu.menuType === 'prompt' && (
//                   <div>
//                     <p>Prompt: {menu.prompt}</p>
//                     <p>Validation: {menu.validationType}</p>
//                   </div>
//                 )}
                
//                 <div>
//                   <Button color="secondary" onClick={() => editMenu(menu)}>
//                     Edit
//                   </Button>
//                   <Button color="danger" onClick={() => handleDelete(menu.menuId)}>
//                     Delete
//                   </Button>
//                 </div>
//               </CardBody>
//             </Card>
//           </Col>
//         ))}
//       </Row>

//       <Modal isOpen={modalOpen} toggle={toggleModal} size="lg">
//         <ModalHeader toggle={toggleModal}>
//           {currentMenu ? 'Edit Menu' : 'Create Menu'}
//         </ModalHeader>
//         <ModalBody>
//           <Form onSubmit={handleSubmit}>
//             <Row>
//               <Col md={6}>
//                 <FormGroup>
//                   <Label>Menu ID</Label>
//                   <Input
//                     value={formData.menuId}
//                     onChange={(e) => handleInputChange(e, 'menuId')}
//                     disabled={isFirstMenu}
//                     required
//                   />
//                 </FormGroup>
//               </Col>
//               <Col md={6}>
//                 <FormGroup>
//                   <Label>Menu Title</Label>
//                   <Input
//                     value={formData.menuTitle}
//                     onChange={(e) => handleInputChange(e, 'menuTitle')}
//                     required
//                   />
//                 </FormGroup>
//               </Col>
//             </Row>

//             <Row>
//               <Col md={6}>
//                 <FormGroup>
//                   <Label>Menu Type</Label>
//                   <Input
//                     type="select"
//                     value={formData.menuType}
//                     onChange={(e) => handleInputChange(e, 'menuType')}
//                   >
//                     <option value="options">Options</option>
//                     <option value="prompt">Prompt</option>
//                   </Input>
//                 </FormGroup>
//               </Col>
              
//               {formData.menuType === 'prompt' && (
//                 <Col md={6}>
//                   <FormGroup>
//                     <Label>Validation Type</Label>
//                     <Input
//                       type="select"
//                       value={formData.validationType}
//                       onChange={(e) => handleInputChange(e, 'validationType')}
//                     >
//                       <option value="none">None</option>
//                       <option value="number">Number</option>
//                       <option value="date">Date</option>
//                       <option value="phone">Phone</option>
//                       <option value="email">Email</option>
//                       <option value="text">Text</option>
//                     </Input>
//                   </FormGroup>
//                 </Col>
//               )}
//             </Row>

//             {formData.menuType === 'prompt' && (
//               <>
//                 <FormGroup>
//                   <Label>Prompt Text</Label>
//                   <Input
//                     value={formData.prompt || ''}
//                     onChange={(e) => handleInputChange(e, 'prompt')}
//                     placeholder="Enter prompt text"
//                   />
//                 </FormGroup>
//                 <FormGroup>
//                   <Label>API Call </Label>
//                   <Input
//                     value={formData.apiCall || ''}
//                     onChange={(e) => handleInputChange(e, 'apiCall')}
//                     placeholder="Enter API endpoint or function"
//                   />
//                 </FormGroup>
//               </>
//             )}

//             {formData.menuType === 'options' && (
//               <div>
//                 <div className="d-flex justify-content-between align-items-center mb-3">
//                   <h5>Menu Options</h5>
//                   <Button color="primary" outline onClick={addOption}>
//                     Add Option
//                   </Button>
//                 </div>

//                 {formData.menuOptions.map((option, index) => (
//                   <Row key={index} className="mb-3">
//                     <Col md={1}>
//                       <Input value={option.id} disabled />
//                     </Col>
//                     <Col md={4}>
//                       <Input
//                         placeholder="Option Title"
//                         value={option.title}
//                         onChange={(e) => handleInputChange(e, 'title', true, index)}
//                       />
//                     </Col>
//                     <Col md={3}>
//                       <Input
//                         placeholder="Next Menu ID"
//                         value={option.nextMenuId}
//                         onChange={(e) => handleInputChange(e, 'nextMenuId', true, index)}
//                       />
//                     </Col>
//                     <Col md={3}>
//                       <Input
//                         placeholder="API Call"
//                         value={option.apiCall}
//                         onChange={(e) => handleInputChange(e, 'apiCall', true, index)}
//                       />
//                     </Col>
//                     <Col md={1}>
//                       <Button color="danger" onClick={() => removeOption(index)}>
//                         X
//                       </Button>
//                     </Col>
//                   </Row>
//                 ))}
//               </div>
//             )}

//             <div className="modal-actions">
//               <Button color="secondary" onClick={toggleModal}>
//                 Cancel
//               </Button>
//               <Button color="primary" type="submit">
//                 {currentMenu ? 'Update Menu' : 'Create Menu'}
//               </Button>
//             </div>
//           </Form>
//         </ModalBody>
//       </Modal>
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
  X
} from 'lucide-react';
import "../../assets/css/WhatsAppMenus.css";

const WhatsAppMenus = () => {
  const [menus, setMenus] = useState([]);
  const [isFirstMenu, setIsFirstMenu] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentMenu, setCurrentMenu] = useState(null);
  const [error, setError] = useState(null);
  const [tooltipOpen, setTooltipOpen] = useState({});

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


  const fetchMenus = async () => {
    try {
      const response = await axios.get(MENU_ENDPOINTS.GET_ALL);
      setMenus(response.data.data || []);
      
      const mainMenuExists = response.data.data?.some(menu => menu.menuId === 'main-menu');
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
          apiCall: '' 
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
        ? MENU_ENDPOINTS.UPDATE(currentMenu.menuId)  // Pass menuId here
        : MENU_ENDPOINTS.CREATE;
      
      const method = currentMenu ? 'put' : 'post';
      
      const payload = method === 'post' 
        ? { menus: [formData] }  
        : formData;  // For update, send full form data
      
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
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save menu');
      console.error(error.response); // Log full error response
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

  return (
    <Container className="whatsapp-menu-container">
      <div className="menu-header">
        <h2 className="mb-0">WhatsApp Menu Builder</h2>
        <Button 
          color="primary" 
          className="add-menu-btn"
          onClick={toggleModal}
        >
          <Plus className="mr-2" /> Create New Menu
        </Button>
      </div>

      {error && (
        <div className="alert alert-danger d-flex align-items-center mb-4">
          <AlertTriangle className="mr-3 text-danger" />
          <span>{error}</span>
        </div>
      )}

      <Row className="menu-grid">
        {menus.map(menu => (
          <Col key={menu.menuId} md={4}>
            <Card className="menu-card shadow-sm">
              <CardBody>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">{menu.menuTitle}</h5>
                  <Badge 
                    color={menu.menuType === 'options' ? 'info' : 'warning'}
                    id={`menu-type-${menu.menuId}`}
                  >
                    {menu.menuType}
                  </Badge>
                  <Tooltip 
                    placement="top" 
                    isOpen={tooltipOpen[menu.menuId]} 
                    target={`menu-type-${menu.menuId}`}
                    toggle={() => toggleTooltip(menu.menuId)}
                  >
                    {menu.menuType === 'options' 
                      ? 'Multiple choice menu' 
                      : 'User input prompt menu'}
                  </Tooltip>
                </div>

                <p className="menu-id text-muted">
                  <MenuIcon size={16} className="mr-2" /> 
                  Menu ID: {menu.menuId}
                </p>

                {menu.menuType === 'options' && menu.menuOptions && (
                  <div className="menu-options">
                    <p className="options-title">Menu Options:</p>
                    {menu.menuOptions.map((option, index) => (
                      <div key={index} className="option-item">
                        {option.id}. {option.title}
                      </div>
                    ))}
                  </div>
                )}

                {menu.menuType === 'prompt' && (
                  <div>
                    <p className="text-muted">
                      <FileText size={16} className="mr-2" />
                      Prompt: {menu.prompt}
                    </p>
                    <p className="text-muted">
                      Validation: {menu.validationType}
                    </p>
                  </div>
                )}
                
                <div className="menu-actions">
                  <Button 
                    color="secondary" 
                    size="sm" 
                    onClick={() => editMenu(menu)}
                  >
                    <Edit2 size={16} className="mr-2" /> Edit
                  </Button>
                  <Button 
                    color="danger" 
                    size="sm" 
                    onClick={() => handleDelete(menu.menuId)}
                  >
                    <Trash2 size={16} className="mr-2" /> Delete
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal isOpen={modalOpen} toggle={toggleModal} size="lg" className="menu-modal">
  <ModalHeader 
    toggle={toggleModal} 
    className="bg-primary text-white border-0"
  >
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
                  onChange={(e) => handleInputChange(e, 'validationType')}
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
          <FormGroup>
            <Label className="fw-bold">API Call</Label>
            <Input
              className="rounded-3 border-2"
              value={formData.apiCall || ''}
              onChange={(e) => handleInputChange(e, 'apiCall')}
              placeholder="Enter API endpoint or function"
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
                  <Col md={4}>
                    <Input
                      className="rounded-3 border-2"
                      placeholder="Option Title"
                      value={option.title}
                      onChange={(e) => handleInputChange(e, 'title', true, index)}
                    />
                  </Col>
                  <Col md={3}>
                    <Input
                      className="rounded-3 border-2"
                      placeholder="Next Menu ID"
                      value={option.nextMenuId}
                      onChange={(e) => handleInputChange(e, 'nextMenuId', true, index)}
                    />
                  </Col>
                  <Col md={3}>
                    <Input
                      className="rounded-3 border-2"
                      placeholder="API Call"
                      value={option.apiCall}
                      onChange={(e) => handleInputChange(e, 'apiCall', true, index)}
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
    </Container>
  );
};

export default WhatsAppMenus;