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
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

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
  const [loading, setLoading] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);



  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth > 768) {
        setSidebarCollapsed(false);
      } else {
        setSidebarCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  
  
  
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

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleOverlayClick = (e) => {
    e.stopPropagation();
    if (window.innerWidth <= 768) {
      setSidebarCollapsed(true);
    }
  };

  const handleMenuClickMobile = (menu) => {
    handleMenuClick(menu);
    if (window.innerWidth <= 768) {
      setSidebarCollapsed(true);
    }
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
    menuOptions: [],
    isMainMenu: false  // Add this line
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
    setLoading(true);
    try {
      const response = await axios.get(MENU_ENDPOINTS.GET_ALL);
      const allMenus = response.data.data || [];
      setMenus(allMenus);
      
      const mainMenuExists = allMenus.some(menu => menu.isMainMenu === true);
      setIsFirstMenu(!mainMenuExists);
    } catch (error) {
      setError('Failed to fetch menus');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  const handleInputChange = (e, field, isOption = false, optionIndex = null, isBoolean = false) => {
    const value = isBoolean ? e.target.value === 'true' : e.target.value;
    
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
    setLoading(true);
  
    try {
      const endpoint = currentMenu 
        ? MENU_ENDPOINTS.UPDATE(currentMenu.menuId)
        : MENU_ENDPOINTS.CREATE;
      
      const method = currentMenu ? 'put' : 'post';
      
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
      
      fetchMenus();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save menu');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (menuId) => {
    setLoading(true);
    try {
      await axios.delete(MENU_ENDPOINTS.DELETE(menuId));
      setMenus(prevMenus => prevMenus.filter(menu => menu.menuId !== menuId));
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete menu');
    } finally {
      setLoading(false);
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
      if (!menuPath.includes(menuId)) {
        setMenuPath([...menuPath, menuId]);
      } else {
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
    const mainMenus = menus.filter(menu => menu.isMainMenu === true);
  
    return mainMenus.map((menu) => (
      <div
        key={menu.menuId}
        className={`menu-item p-3 mb-2 rounded cursor-pointer ${activeMenu?.menuId === menu.menuId ? 'bg-light' : ''}`}
        style={{
          cursor: 'pointer',
          transition: 'all 0.2s',
          border: '1px solid #e0e0e0',
        }}
        onClick={() => handleMenuClickMobile(menu)}
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
    <>
    {/* Loading Overlay */}
    {loading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <DotLottieReact
            src="https://lottie.host/5060de43-85ac-474a-a85b-892f9730e17a/b3jJ1vGkWh.lottie"
            loop
            autoplay
            style={{ width: "150px", height: "150px" }}
          />
        </div>
      )}

    
      {/* Overlay for mobile sidebar */}
      {!sidebarCollapsed && windowWidth <= 768 && (
        <div 
          className="sidebar-overlay active" 
          onClick={handleOverlayClick}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 999,
            display: "block"
          }}
        />
      )}


<Container fluid className="d-flex p-0">
      {/* Left Sidebar - Now has conditional classes for mobile collapse */}
      <div 
          className={`menu-sidebar ${sidebarCollapsed ? 'menu-sidebar-collapsed' : ''}`} 
          style={{
            width: windowWidth <= 768 ? '250px' : '250px',
            minHeight: '100vh',
            background: '#fff',
            borderRight: '1px solid #e0e0e0',
            padding: '1rem',
            transition: 'all 0.3s ease-in-out',
            transform: sidebarCollapsed && windowWidth <= 768 ? 'translateX(-100%)' : 'translateX(0)',
            zIndex: 1000,
            position: windowWidth <= 768 ? 'fixed' : 'sticky',
            boxShadow: windowWidth <= 768 ? '2px 0 10px rgba(0,0,0,0.1)' : 'none'
          }}
        >
          <div className="sidebar-header mb-4">
            <h5 className="mb-3">Main Menus</h5>
          </div>
          <div className="menu-list">
            {renderSidebarMenus()}
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
                  onClick={() => handleMenuClickMobile(menu)}
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
      <div className="flex-grow-1" style={{ 
          marginLeft: windowWidth <= 768 ? '0' : (sidebarCollapsed ? '0' : '0'),
          width: '100%'
        }}>
         <div className="whatsapp-menu-container">
            {/* Modified menu-header-new to include collapse toggle button for mobile */}
            <div className="menu-header-new">
              <div className="menu-title-section d-flex align-items-center">
                {/* The toggle button for mobile */}
                <Button 
                  color="light"
                  className="sidebar-toggle-btn me-3"
                  onClick={toggleSidebar}
                  style={{
                    padding: '0.5rem',
                    borderRadius: '50%',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                    zIndex: 1001,
                    position: 'relative',
                    display: windowWidth <= 768 ? 'flex' : 'none'
                  }}
                >
                  <MenuIcon size={18} />
                </Button>
                <div>
                  <h2>WhatsApp Menu Builder</h2>
                  <p className="text-muted">Build and manage your interactive WhatsApp menus</p>
                </div>
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
            {selectedMenuId ? (
              menus.filter(m => m.menuId === selectedMenuId)
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
                            {menu.isMainMenu && (
                              <Badge color="primary" className="ms-2">
                                Main Menu
                              </Badge>
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
                })
            ) : (
              <div className="text-center p-5">
                <MenuIcon size={48} className="text-muted mb-3" />
                <h4 className="text-muted">Select a menu from the sidebar to view its details</h4>
              </div>
            )}
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
                    <Col md={6}>
                      <FormGroup>
                        <Label className="fw-bold">Is Main Menu</Label>
                        <Input
                          type="select"
                          className="rounded-3 border-2"
                          value={formData.isMainMenu}
                          onChange={(e) => handleInputChange(e, 'isMainMenu', false, null, true)}
                        >
                          <option value={false}>No</option>
                          <option value={true}>Yes</option>
                        </Input>
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
    </>
  );
};

export default WhatsAppCreateMenus;