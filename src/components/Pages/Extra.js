import { MENU_ENDPOINTS } from 'Api/Constant';
import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Input,
  Button,
  ListGroup,
  ListGroupItem,
  Alert,
  Card,
  CardBody,
  CardHeader,
  Spinner,
  Collapse,
  Modal,
  ModalHeader,
  ModalBody,
  Badge
} from 'reactstrap';

const MenuItem = ({ item, onDelete, onEdit }) => {
  const [showEditForm, setShowEditForm] = useState(false);
  const [editData, setEditData] = useState({
    id: item.id,
    title: item.title,
    nextMenuId: item.nextMenuId,
    apiCall: item.apiCall
  });

  const handleEdit = (e) => {
    e.preventDefault();
    onEdit(item.id, editData);
    setShowEditForm(false);
  };

  return (
    <ListGroupItem className="border mb-2 rounded-3 shadow-sm">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <div className="fw-bold">{item.title}</div>
          <small className="text-muted">
            ID: {item.id} | Next Menu: {item.nextMenuId} | API: {item.apiCall}
          </small>
        </div>
        <div>
          <Button
            color="info"
            size="sm"
            className="me-2"
            onClick={() => setShowEditForm(!showEditForm)}
          >
            Edit
          </Button>
          <Button
            color="danger"
            size="sm"
            onClick={() => onDelete(item.id)}
          >
            Delete
          </Button>
        </div>
      </div>

      <Collapse isOpen={showEditForm}>
        <Form onSubmit={handleEdit} className="mt-3">
          <Row>
            <Col md={6} className="mb-2">
              <Input
                placeholder="Title"
                value={editData.title}
                onChange={(e) => setEditData({...editData, title: e.target.value})}
              />
            </Col>
            <Col md={6} className="mb-2">
              <Input
                placeholder="Next Menu ID"
                value={editData.nextMenuId}
                onChange={(e) => setEditData({...editData, nextMenuId: e.target.value})}
              />
            </Col>
            <Col md={9} className="mb-2">
              <Input
                placeholder="API Call"
                value={editData.apiCall}
                onChange={(e) => setEditData({...editData, apiCall: e.target.value})}
              />
            </Col>
            <Col md={3}>
              <Button color="primary" type="submit" block>
                Update
              </Button>
            </Col>
          </Row>
        </Form>
      </Collapse>
    </ListGroupItem>
  );
};

const WhatsAppMenus = () => {
  const [menuId, setMenuId] = useState('');
  const [menuTitle, setMenuTitle] = useState('');
  const [menuOptions, setMenuOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [savedMenus, setSavedMenus] = useState([]);
  const [showMenusModal, setShowMenusModal] = useState(false);
  const [newOption, setNewOption] = useState({
    id: '',
    title: '',
    nextMenuId: '',
    apiCall: ''
  });

  // Fetch all menus when component mounts
  useEffect(() => {
    fetchAllMenus();
  }, []);

  // Fetch menu data by ID
  const fetchMenuData = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(MENU_ENDPOINTS.GET(id));
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch menu');
      }

      setMenuId(data.menuId);
      setMenuTitle(data.menuTitle);
      setMenuOptions(data.menuOptions);
      showMessage('Menu loaded successfully!');
    } catch (err) {
      showMessage(err.message, true);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all saved menus
  const fetchAllMenus = async () => {
    try {
      const response = await fetch(MENU_ENDPOINTS.GET_ALL);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch menus');
      }

      setSavedMenus(data);
    } catch (err) {
      showMessage(err.message, true);
    }
  };

  // Load selected menu from saved menus
  const loadSelectedMenu = (menu) => {
    setMenuId(menu.menuId);
    setMenuTitle(menu.menuTitle);
    setMenuOptions(menu.menuOptions);
    setShowMenusModal(false);
  };

  const showMessage = (message, isError = false) => {
    if (isError) {
      setError(message);
      setSuccess('');
    } else {
      setSuccess(message);
      setError('');
    }
    setTimeout(() => {
      setError('');
      setSuccess('');
    }, 3000);
  };

  // Add new menu option
  const handleAddOption = (e) => {
    e.preventDefault();
    if (!newOption.title || !newOption.id) {
      showMessage('ID and Title are required', true);
      return;
    }

    setMenuOptions([...menuOptions, { ...newOption }]);
    setNewOption({
      id: '',
      title: '',
      nextMenuId: '',
      apiCall: ''
    });
  };

  // Edit existing menu option
  const handleEditOption = (optionId, updatedData) => {
    const updatedOptions = menuOptions.map(option => 
      option.id === optionId ? updatedData : option
    );
    setMenuOptions(updatedOptions);
  };

  // Delete menu option
  const handleDeleteOption = (optionId) => {
    setMenuOptions(menuOptions.filter(option => option.id !== optionId));
  };

  // Fetch menu by ID
  const handleFetchMenu = async (e) => {
    e.preventDefault();
    if (!menuId) {
      showMessage('Please enter a Menu ID', true);
      return;
    }

    await fetchMenuData(menuId);
  };

  // Save menu
  const handleSaveMenu = async () => {
    if (!menuId || !menuTitle || menuOptions.length === 0) {
      showMessage('Menu ID, Title and at least one option are required', true);
      return;
    }

    setLoading(true);
    try {
      const menuData = {
        menuId,
        menuTitle,
        menuOptions
      };

      const response = await fetch(MENU_ENDPOINTS.CREATE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(menuData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save menu');
      }

      // Refresh the saved menus list
      await fetchAllMenus();

      showMessage('Menu saved successfully!');
    } catch (err) {
      showMessage(err.message, true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="p-0">
      <div className="py-4 mb-4 text-white" style={{
        background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)'
      }}>
        <h2 className="text-center m-0">
          <span style={{ fontSize: '1.5rem' }}>📱</span> WhatsApp Menus
        </h2>
      </div>

      <Container>
        <Row>
          <Col md={5} className="mb-4">
            <Card className="border-0 shadow-sm">
              <CardBody>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">Menu Details</h5>
                  <Button 
                    color="secondary" 
                    size="sm" 
                    onClick={() => setShowMenusModal(true)}
                  >
                    Saved Menus
                  </Button>
                </div>

                <Form onSubmit={handleFetchMenu} className="mb-3">
                  <FormGroup className="d-flex">
                    <Input
                      placeholder="Menu ID"
                      value={menuId}
                      onChange={(e) => setMenuId(e.target.value)}
                      className="me-2"
                    />
                    <Button color="primary" type="submit">
                      Fetch
                    </Button>
                  </FormGroup>
                </Form>

                <FormGroup>
                  <Input
                    placeholder="Menu Title"
                    value={menuTitle}
                    onChange={(e) => setMenuTitle(e.target.value)}
                    className="mb-3"
                  />
                </FormGroup>

                <h5 className="mb-3">Add New Option</h5>
                <Form onSubmit={handleAddOption}>
                  <FormGroup>
                    <Input
                      placeholder="Option ID"
                      value={newOption.id}
                      onChange={(e) => setNewOption({...newOption, id: e.target.value})}
                      className="mb-2"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Input
                      placeholder="Option Title"
                      value={newOption.title}
                      onChange={(e) => setNewOption({...newOption, title: e.target.value})}
                      className="mb-2"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Input
                      placeholder="Next Menu ID"
                      value={newOption.nextMenuId}
                      onChange={(e) => setNewOption({...newOption, nextMenuId: e.target.value})}
                      className="mb-2"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Input
                      placeholder="API Call"
                      value={newOption.apiCall}
                      onChange={(e) => setNewOption({...newOption, apiCall: e.target.value})}
                      className="mb-3"
                    />
                  </FormGroup>
                  <Button color="primary" type="submit" block>
                    Add Option
                  </Button>
                </Form>

                <Button
                  color="success"
                  block
                  className="mt-3"
                  onClick={handleSaveMenu}
                  disabled={loading}
                >
                  {loading ? <Spinner size="sm" /> : 'Save Menu'}
                </Button>

                {error && (
                  <Alert color="danger" className="mt-3">
                    {error}
                  </Alert>
                )}
                {success && (
                  <Alert color="success" className="mt-3">
                    {success}
                  </Alert>
                )}
              </CardBody>
            </Card>
          </Col>

          <Col md={7}>
            <Card className="border-0 shadow-sm">
              <CardHeader className="bg-white">
                <h5 className="mb-0">Menu Preview</h5>
              </CardHeader>
              <CardBody>
                {menuOptions.length > 0 ? (
                  <ListGroup>
                    {menuOptions.map(option => (
                      <MenuItem
                        key={option.id}
                        item={option}
                        onDelete={handleDeleteOption}
                        onEdit={handleEditOption}
                      />
                    ))}
                  </ListGroup>
                ) : (
                  <div className="text-center text-muted py-4">
                    <p>No menu options added yet</p>
                  </div>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Saved Menus Modal */}
      <Modal isOpen={showMenusModal} toggle={() => setShowMenusModal(!showMenusModal)}>
        <ModalHeader toggle={() => setShowMenusModal(false)}>
          Saved Menus
        </ModalHeader>
        <ModalBody>
          {savedMenus.length > 0 ? (
            <ListGroup>
              {savedMenus.map(menu => (
                <ListGroupItem 
                  key={menu.menuId} 
                  action 
                  onClick={() => loadSelectedMenu(menu)}
                >
                  <div className="d-flex justify-content-between">
                    <div>
                      <strong>{menu.menuTitle}</strong>
                      <small className="d-block text-muted">ID: {menu.menuId}</small>
                    </div>
                    <div>
                      <Badge color="primary">{menu.menuOptions.length} Options</Badge>
                    </div>
                  </div>
                </ListGroupItem>
              ))}
            </ListGroup>
          ) : (
            <div className="text-center text-muted">
              No saved menus found
            </div>
          )}
        </ModalBody>
      </Modal>
    </Container>
  );
};

export default WhatsAppMenus;