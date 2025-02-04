import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Card, CardBody, CardTitle, 
  Button, Row, Col, Modal, 
  ModalHeader, ModalBody, ModalFooter,
  Form, FormGroup, Label, Input,
  Badge, Alert,
} from 'reactstrap';
import { 
  Edit2, Trash2, PlusCircle, 
   FileText, X,
  Menu, CheckCircle, AlertCircle,
  ArrowRight, 
} from 'lucide-react';
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import { MENU_API_ENDPOINT, MENU_ENDPOINTS } from 'Api/Constant';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import "../../assets/css/WhatsAppMenus.css";  

const WhatsAppMenus = () => {
  const [menus, setMenus] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedMenu, setSelectedMenu] = useState(null)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [menuToDelete, setMenuToDelete] = useState(null)
  const [activeTab, setActiveTab] = useState('basic')
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState(null);
  const [apiLoading, setApiLoading] = useState(false)

  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [newMenu, setNewMenu] = useState({
    menuId: '',
    menuTitle: '',
    menuOptions: [
      { 
        id: ``, 
        title: '', 
        nextMenuId: '', 
        apiCall: '' 
      }
    ]
  })

   // Filter menus based on search
   const filteredMenus = menus.filter(menu => 
    menu.menuTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    menu.menuId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };


  useEffect(() => {
    const fetchMenus = async () => {
      setLoading(true)
      try {
        const response = await axios.get(`${MENU_API_ENDPOINT}/getAllMenus`)
        setMenus(response.data.data || [])
      } catch (err) {
        console.error('Fetch Menus Error:', err.response?.data || err.message)
        setError(err.response?.data?.message || err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchMenus()
  }, [])

  const handleEdit = (menu) => {
    const completeMenuOptions = menu.menuOptions.map(option => ({
      id: option.id || '',
      title: option.title || '',
      nextMenuId: option.nextMenuId || '',
      apiCall: option.apiCall || ''
    }))

    setSelectedMenu({
      ...menu,
      menuOptions: completeMenuOptions
    })
    setEditModalOpen(true)
  }

  const confirmDelete = (menu) => {
    setMenuToDelete(menu)
    setDeleteModal(true)
  }

  const handleDelete = async () => {
    setApiLoading(true)
    try {
      await axios.delete(`${MENU_API_ENDPOINT}/delete/${menuToDelete.menuId}`)
      setMenus(menus.filter(menu => menu.menuId !== menuToDelete.menuId))
      setDeleteModal(false)
      setMenuToDelete(null)
    } catch (err) {
      setError(err.response?.data?.message || err.message)
    } finally {
      setApiLoading(false)
    }
  }

  const handleSaveMenu = async () => {
    setApiLoading(true)
    try {
      const updatedMenuData = {
        menuTitle: selectedMenu.menuTitle,
        menuOptions: selectedMenu.menuOptions.map(option => ({
          id: option.id || '',
          title: option.title || '',
          nextMenuId: option.nextMenuId || '',
          apiCall: option.apiCall || ''
        }))
      }

      const response = await axios.put(
        `${MENU_API_ENDPOINT}/update/${selectedMenu.menuId}`, 
        updatedMenuData
      )
      
      const updatedMenus = menus.map(menu => 
        menu.menuId === selectedMenu.menuId ? response.data.data : menu
      )
      setMenus(updatedMenus)
      setEditModalOpen(false)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update menu')
    } finally {
      setApiLoading(false)
    }
  }

  const handleCreateMenu = async () => {
    setApiLoading(true);
    try {
      const validMenuOptions = newMenu.menuOptions.filter(option => 
        option.title.trim() !== '' || 
        option.nextMenuId.trim() !== ''
      );

      const response = await axios.post(MENU_ENDPOINTS.CREATE, {
        menuId: newMenu.menuId,
        menuTitle: newMenu.menuTitle,
        menuOptions: validMenuOptions
      });
      
      setMenus([...menus, response.data.data]);
      setCreateModalOpen(false);
      showNotification('Menu created successfully!');
      setNewMenu({
        menuId: '',
        menuTitle: '',
        menuOptions: [{ id: '', title: '', nextMenuId: '', apiCall: '' }]
      });
    } catch (err) {
      showNotification(err.response?.data?.message || 'Failed to create menu', 'danger');
    } finally {
      setApiLoading(false);
    }
  };

  const addMenuOption = (type = 'edit') => {
    if (type === 'edit') {
      setSelectedMenu(prev => ({
        ...prev,
        menuOptions: [
          ...prev.menuOptions, 
          { 
            id: ``, 
            title: '', 
            nextMenuId: '', 
            apiCall: '' 
          }
        ]
      }))
    } else {
      setNewMenu(prev => ({
        ...prev,
        menuOptions: [
          ...prev.menuOptions, 
          { 
            id: ``, 
            title: '', 
            nextMenuId: '', 
            apiCall: '' 
          }
        ]
      }))
    }
  }

  const removeMenuOption = (index, type = 'edit') => {
    if (type === 'edit') {
      setSelectedMenu(prev => ({
        ...prev,
        menuOptions: prev.menuOptions.filter((_, i) => i !== index)
      }))
    } else {
      setNewMenu(prev => ({
        ...prev,
        menuOptions: prev.menuOptions.filter((_, i) => i !== index)
      }))
    }
  }

  const MenuModalContent = ({ 
    menuData, 
    setMenuData, 
    type = 'edit',
    onAddOption,
    onRemoveOption 
  }) => {
    return (
      <>
        <Nav tabs className="mb-4">
          <NavItem>
            <NavLink
              className={activeTab === 'basic' ? 'active' : ''}
              onClick={() => setActiveTab('basic')}
              style={{ cursor: 'pointer' }}
            >
              Basic Info
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={activeTab === 'options' ? 'active' : ''}
              onClick={() => setActiveTab('options')}
              style={{ cursor: 'pointer' }}
            >
              Menu Options
            </NavLink>
          </NavItem>
        </Nav>

        <TabContent activeTab={activeTab}>
          <TabPane tabId="basic">
            <Form>
              <FormGroup>
                <Label>Menu ID</Label>
                <Input
                  type="text"
                  value={menuData.menuId}
                  onChange={(e) => setMenuData(prev => ({
                    ...prev,
                    menuId: e.target.value
                  }))}
                  disabled={type === 'edit'}
                />
              </FormGroup>
              <FormGroup>
                <Label>Menu Title</Label>
                <Input
                  type="text"
                  value={menuData.menuTitle}
                  onChange={(e) => setMenuData(prev => ({
                    ...prev,
                    menuTitle: e.target.value
                  }))}
                />
              </FormGroup>
            </Form>
          </TabPane>

          <TabPane tabId="options">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">Menu Options</h5>
              <Button 
                color="success" 
                size="sm" 
                onClick={() => onAddOption()}
              >
                <PlusCircle size={16} className="mr-1" /> Add Option
              </Button>
            </div>

            <div className="menu-options-scroll">
              {menuData.menuOptions.map((option, index) => (
                <Card key={option.id || index} className="mb-3">
                  <CardBody className="position-relative">
                    {menuData.menuOptions.length > 1 && (
                      <Button 
                        close 
                        className="position-absolute menu-option-close"
                        onClick={() => onRemoveOption(index)}
                      >
                        <X size={20} />
                      </Button>
                    )}
                    
                    <Row>
                      <Col md={6}>
                        <FormGroup>
                          <Label>Option ID</Label>
                          <Input
                            type="text"
                            value={option.id}
                            onChange={(e) => {
                              const updatedOptions = [...menuData.menuOptions]
                              updatedOptions[index].id = e.target.value
                              setMenuData(prev => ({
                                ...prev,
                                menuOptions: updatedOptions
                              }))
                            }}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <Label>Option Title</Label>
                          <Input
                            type="text"
                            value={option.title}
                            onChange={(e) => {
                              const updatedOptions = [...menuData.menuOptions]
                              updatedOptions[index].title = e.target.value
                              setMenuData(prev => ({
                                ...prev,
                                menuOptions: updatedOptions
                              }))
                            }}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <Label>Next Menu ID</Label>
                          <Input
                            type="text"
                            value={option.nextMenuId}
                            onChange={(e) => {
                              const updatedOptions = [...menuData.menuOptions]
                              updatedOptions[index].nextMenuId = e.target.value
                              setMenuData(prev => ({
                                ...prev,
                                menuOptions: updatedOptions
                              }))
                            }}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <Label>API Call</Label>
                          <Input
                            type="text"
                            value={option.apiCall}
                            onChange={(e) => {
                              const updatedOptions = [...menuData.menuOptions]
                              updatedOptions[index].apiCall = e.target.value
                              setMenuData(prev => ({
                                ...prev,
                                menuOptions: updatedOptions
                              }))
                            }}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              ))}
            </div>
          </TabPane>
        </TabContent>
      </>
    )
  }

  return (
    <div className="whatsapp-menus-container p-4">
      {/* Loading Overlay */}
      {(loading || apiLoading) && (
        <div className="loading-overlay">
          <div className="loading-content text-center">
            <DotLottieReact
              src="https://lottie.host/5060de43-85ac-474a-a85b-892f9730e17a/b3jJ1vGkWh.lottie"
              loop
              autoplay
              className="loading-animation"
            />
            <div className="mt-3 text-primary">
              {loading ? '' : 'Processing request...'}
            </div>
          </div>
        </div>
      )}
  
      {/* Error Alert */}
      {error && (
        <Alert color="danger" className="mb-4 d-flex align-items-center">
          <AlertCircle size={20} className="me-2" />
          {error}
          <Button close onClick={() => setError(null)} className="ms-auto" />
        </Alert>
      )}
  
      {/* Header Section */}
      <div className="header-section mb-4">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <h2 className="mb-0">
            <Menu className="me-2" size={24} />
            WhatsApp Menu Management
          </h2>
          <Button 
            color="success" 
            className="create-button"
            onClick={() => setCreateModalOpen(true)}
          >
            <PlusCircle size={18} className="me-2" /> Create New Menu
          </Button>
        </div>
      </div>
  
      {/* Menu Cards Grid */}
      <Row className="g-4">
        {menus.map((menu) => (
          <Col key={menu._id} lg={4} md={6} sm={12}>
            <Card className="menu-card h-100 shadow-sm">
              <CardBody>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <CardTitle tag="h5" className="mb-0">
                    {menu.menuTitle}
                  </CardTitle>
                  <Badge color="info" pill>
                    {menu.menuId}
                  </Badge>
                </div>
  
                <div className="menu-options mb-3">
                  {menu.menuOptions.slice(0, 3).map((option) => (
                    <div key={option.id} className="menu-option p-2 mb-2 rounded bg-light">
                      <div className="d-flex align-items-center">
                        <FileText size={16} className="text-primary me-2" />
                        <span className="option-title">{option.title}</span>
                        {option.nextMenuId && (
                          <ArrowRight size={14} className="ms-auto text-muted" />
                        )}
                      </div>
                    </div>
                  ))}
                  {menu.menuOptions.length > 3 && (
                    <div className="text-muted text-center mt-2">
                      +{menu.menuOptions.length - 3} more options
                    </div>
                  )}
                </div>
  
                <div className="d-flex gap-2 mt-auto">
                  <Button 
                    color="primary" 
                    outline
                    className="w-50"
                    onClick={() => handleEdit(menu)}
                  >
                    <Edit2 size={16} className="me-1" /> Edit
                  </Button>
                  <Button 
                    color="danger" 
                    outline
                    className="w-50"
                    onClick={() => confirmDelete(menu)}
                  >
                    <Trash2 size={16} className="me-1" /> Delete
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
  
      {/* Create Menu Modal */}
      <Modal 
        isOpen={createModalOpen} 
        toggle={() => setCreateModalOpen(false)} 
        size="lg"
        className="modal-dialog-scrollable"
      >
        <ModalHeader toggle={() => setCreateModalOpen(false)} className="bg-light">
          <PlusCircle size={18} className="me-2" />
          Create New Menu
        </ModalHeader>
        <ModalBody>
          <Nav tabs className="mb-4">
            <NavItem>
              <NavLink
                className={`cursor-pointer ${activeTab === 'basic' ? 'active' : ''}`}
                onClick={() => setActiveTab('basic')}
              >
                Basic Info
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={`cursor-pointer ${activeTab === 'options' ? 'active' : ''}`}
                onClick={() => setActiveTab('options')}
              >
                Menu Options
              </NavLink>
            </NavItem>
          </Nav>
  
          <TabContent activeTab={activeTab}>
            <TabPane tabId="basic">
              <Form>
                <FormGroup>
                  <Label>Menu ID <span className="text-danger">*</span></Label>
                  <Input
                    type="text"
                    value={newMenu.menuId}
                    onChange={(e) => setNewMenu(prev => ({
                      ...prev,
                      menuId: e.target.value
                    }))}
                    placeholder="Enter unique menu ID"
                    className="shadow-sm"
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Menu Title <span className="text-danger">*</span></Label>
                  <Input
                    type="text"
                    value={newMenu.menuTitle}
                    onChange={(e) => setNewMenu(prev => ({
                      ...prev,
                      menuTitle: e.target.value
                    }))}
                    placeholder="Enter menu title"
                    className="shadow-sm"
                  />
                </FormGroup>
              </Form>
            </TabPane>
  
            <TabPane tabId="options">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Menu Options</h5>
                <Button 
                  color="primary" 
                  size="sm"
                  onClick={() => addMenuOption('create')}
                >
                  <PlusCircle size={16} className="me-1" /> Add Option
                </Button>
              </div>
  
              <div className="menu-options-container">
                {newMenu.menuOptions.map((option, index) => (
                  <Card key={index} className="mb-3 shadow-sm">
                    <CardBody>
                      <div className="option-header d-flex justify-content-between mb-3">
                        <h6 className="mb-0">Option {index + 1}</h6>
                        {newMenu.menuOptions.length > 1 && (
                          <Button 
                            close 
                            onClick={() => removeMenuOption(index, 'create')}
                          />
                        )}
                      </div>
                      
                      <Row>
                        <Col md={6}>
                          <FormGroup>
                            <Label>Option ID</Label>
                            <Input
                              type="text"
                              value={option.id}
                              onChange={(e) => {
                                const updatedOptions = [...newMenu.menuOptions];
                                updatedOptions[index].id = e.target.value;
                                setNewMenu(prev => ({
                                  ...prev,
                                  menuOptions: updatedOptions
                                }));
                              }}
                              placeholder="Enter option ID"
                              className="shadow-sm"
                            />
                          </FormGroup>
                        </Col>
                        <Col md={6}>
                          <FormGroup>
                            <Label>Title</Label>
                            <Input
                              type="text"
                              value={option.title}
                              onChange={(e) => {
                                const updatedOptions = [...newMenu.menuOptions];
                                updatedOptions[index].title = e.target.value;
                                setNewMenu(prev => ({
                                  ...prev,
                                  menuOptions: updatedOptions
                                }));
                              }}
                              placeholder="Enter option title"
                              className="shadow-sm"
                            />
                          </FormGroup>
                        </Col>
                        <Col md={6}>
                          <FormGroup>
                            <Label>Next Menu ID</Label>
                            <Input
                              type="text"
                              value={option.nextMenuId}
                              onChange={(e) => {
                                const updatedOptions = [...newMenu.menuOptions];
                                updatedOptions[index].nextMenuId = e.target.value;
                                setNewMenu(prev => ({
                                  ...prev,
                                  menuOptions: updatedOptions
                                }));
                              }}
                              placeholder="Enter next menu ID"
                              className="shadow-sm"
                            />
                          </FormGroup>
                        </Col>
                        <Col md={6}>
                          <FormGroup>
                            <Label>API Call</Label>
                            <Input
                              type="text"
                              value={option.apiCall}
                              onChange={(e) => {
                                const updatedOptions = [...newMenu.menuOptions];
                                updatedOptions[index].apiCall = e.target.value;
                                setNewMenu(prev => ({
                                  ...prev,
                                  menuOptions: updatedOptions
                                }));
                              }}
                              placeholder="Enter API endpoint"
                              className="shadow-sm"
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </TabPane>
          </TabContent>
        </ModalBody>
        <ModalFooter className="bg-light">
          <Button 
            color="secondary" 
            onClick={() => setCreateModalOpen(false)}
          >
            Cancel
          </Button>
          <Button 
            color="primary" 
            onClick={handleCreateMenu}
            disabled={!newMenu.menuId || !newMenu.menuTitle}
          >
            Create Menu
          </Button>
        </ModalFooter>
      </Modal>
  
      {/* Edit Menu Modal */}
      <Modal 
        isOpen={editModalOpen} 
        toggle={() => setEditModalOpen(false)} 
        size="lg"
        className="modal-dialog-scrollable"
      >
        <ModalHeader toggle={() => setEditModalOpen(false)} className="bg-light">
          <Edit2 size={18} className="me-2" />
          Edit Menu: {selectedMenu?.menuTitle}
        </ModalHeader>
        <ModalBody>
          <Nav tabs className="mb-4">
            <NavItem>
              <NavLink
                className={`cursor-pointer ${activeTab === 'basic' ? 'active' : ''}`}
                onClick={() => setActiveTab('basic')}
              >
                Basic Info
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={`cursor-pointer ${activeTab === 'options' ? 'active' : ''}`}
                onClick={() => setActiveTab('options')}
              >
                Menu Options
              </NavLink>
            </NavItem>
          </Nav>
  
          <TabContent activeTab={activeTab}>
            <TabPane tabId="basic">
              <Form>
                <FormGroup>
                  <Label>Menu ID</Label>
                  <Input
                    type="text"
                    value={selectedMenu?.menuId || ''}
                    disabled
                    className="bg-light"
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Menu Title <span className="text-danger">*</span></Label>
                  <Input
                    type="text"
                    value={selectedMenu?.menuTitle || ''}
                    onChange={(e) => setSelectedMenu(prev => ({
                      ...prev,
                      menuTitle: e.target.value
                    }))}
                    className="shadow-sm"
                  />
                </FormGroup>
              </Form>
            </TabPane>
  
            <TabPane tabId="options">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Menu Options</h5>
                <Button 
                  color="primary" 
                  size="sm"
                  onClick={() => addMenuOption('edit')}
                >
                  <PlusCircle size={16} className="me-1" /> Add Option
                </Button>
              </div>
  
              <div className="menu-options-container">
                {selectedMenu?.menuOptions.map((option, index) => (
                  <Card key={index} className="mb-3 shadow-sm">
                    <CardBody>
                      <div className="option-header d-flex justify-content-between mb-3">
                        <h6 className="mb-0">Option {index + 1}</h6>
                        {selectedMenu.menuOptions.length > 1 && (
                          <Button 
                            close 
                            onClick={() => removeMenuOption(index, 'edit')}
                          />
                        )}
                      </div>
                      
                      <Row>
                        <Col md={6}>
                          <FormGroup>
                            <Label>Option ID</Label>
                            <Input
                              type="text"
                              value={option.id}
                              onChange={(e) => {
                                const updatedOptions = [...selectedMenu.menuOptions];
                                updatedOptions[index].id = e.target.value;
                                setSelectedMenu(prev => ({
                                  ...prev,
                                  menuOptions: updatedOptions
                                }));
                              }}
                              className="shadow-sm"
                            />
                          </FormGroup>
                        </Col>
                        <Col md={6}>
                          <FormGroup>
                            <Label>Title</Label>
                            <Input
                              type="text"
                              value={option.title}
                              onChange={(e) => {
                                const updatedOptions = [...selectedMenu.menuOptions];
                                updatedOptions[index].title = e.target.value;
                                setSelectedMenu(prev => ({
                                  ...prev,
                                  menuOptions: updatedOptions
                                }));
                              }}
                              className="shadow-sm"
                            />
                          </FormGroup>
                        </Col>
                        <Col md={6}>
                          <FormGroup>
                            <Label>Next Menu ID</Label>
                            <Input
                              type="text"
                              value={option.nextMenuId}
                              onChange={(e) => {
                                const updatedOptions = [...selectedMenu.menuOptions];
                                updatedOptions[index].nextMenuId = e.target.value;
                                setSelectedMenu(prev => ({
                                  ...prev,
                                  menuOptions: updatedOptions
                                }));
                              }}
                              className="shadow-sm"
                            />
                          </FormGroup>
                        </Col>
                        <Col md={6}>
                          <FormGroup>
                            <Label>API Call</Label>
                            <Input
                              type="text"
                              value={option.apiCall}
                              onChange={(e) => {
                                const updatedOptions = [...selectedMenu.menuOptions];
                                updatedOptions[index].apiCall = e.target.value;
                                setSelectedMenu(prev => ({
                                  ...prev,
                                  menuOptions: updatedOptions
                                }));
                              }}
                              className="shadow-sm"
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                  ))}
                  </div>
                </TabPane>
              </TabContent>
            </ModalBody>
            <ModalFooter className="bg-light">
              <Button 
                color="secondary" 
                onClick={() => setEditModalOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                color="primary" 
                onClick={handleSaveMenu}
                disabled={!selectedMenu?.menuTitle}
              >
                Save Changes
              </Button>
            </ModalFooter>
          </Modal>
      
          {/* Delete Confirmation Modal */}
          <Modal 
            isOpen={deleteModal} 
            toggle={() => setDeleteModal(false)}
            className="modal-dialog-centered"
          >
            <ModalHeader toggle={() => setDeleteModal(false)} className="bg-light">
              <Trash2 size={18} className="me-2 text-danger" />
              Confirm Delete
            </ModalHeader>
            <ModalBody>
              <div className="text-center p-4">
                <AlertCircle size={48} className="text-danger mb-3" />
                <h5>Are you sure you want to delete?</h5>
                <p className="text-muted">
                  This will permanently delete the menu "{menuToDelete?.menuTitle}". 
                  This action cannot be undone.
                </p>
              </div>
            </ModalBody>
            <ModalFooter className="bg-light">
              <Button 
                color="secondary" 
                onClick={() => setDeleteModal(false)}
              >
                Cancel
              </Button>
              <Button 
                color="danger" 
                onClick={handleDelete}
                disabled={apiLoading}
              >
                {apiLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-1" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} className="me-1" />
                    Delete Menu
                  </>
                )}
              </Button>
            </ModalFooter>
          </Modal>
      
          {/* Notification Toast */}
          {notification && (
            <div className={`notification-toast ${notification.type === 'success' ? 'bg-success' : 'bg-danger'}`}>
              <div className="notification-content">
                {notification.type === 'success' ? (
                  <CheckCircle size={20} className="notification-icon" />
                ) : (
                  <AlertCircle size={20} className="notification-icon" />
                )}
                <span className="notification-message">{notification.message}</span>
              </div>
            </div>
          )}
        </div>
      );
  
}

export default WhatsAppMenus