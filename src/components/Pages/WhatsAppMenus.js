import React, { useState } from 'react';
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  ListGroup,
  ListGroupItem,
  Alert,
  Card,
  CardBody,
  CardHeader
} from 'reactstrap';


const MenuItem = ({ item, level = 0, onDelete, onAddSubmenu }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSubmenuItem, setNewSubmenuItem] = useState('');

  const handleSubmenuAdd = (e) => {
    e.preventDefault();
    if (newSubmenuItem.trim()) {
      onAddSubmenu(item.id, newSubmenuItem);
      setNewSubmenuItem('');
      setShowAddForm(false);
    }
  };

  return (
    <>
      <ListGroupItem 
        className="border mb-2 rounded-3 shadow-sm hover:shadow-md transition-all"
        style={{ backgroundColor: '#f8f9fa' }}
      >
        <div className="d-flex justify-content-between align-items-center">
          <div style={{ marginLeft: `${level * 20}px` }} className="d-flex align-items-center">
            {item.subItems?.length > 0 ? (
              <span className="me-2" style={{ fontSize: '1.2rem' }}>📁</span>
            ) : (
              <span className="me-2" style={{ fontSize: '1.2rem' }}>📝</span>
            )}
            <span style={{ fontWeight: 500 }}>{item.text}</span>
          </div>
          <div>
            <Button
              color="success"
              size="sm"
              className="me-2 rounded-pill"
              style={{ paddingLeft: '15px', paddingRight: '15px' }}
              onClick={() => setShowAddForm(!showAddForm)}
            >
              <i className="bi bi-plus-lg me-1"></i> Submenu
            </Button>
            <Button
              color="danger"
              size="sm"
              className="rounded-circle"
              style={{ width: '32px', height: '32px', padding: '0' }}
              onClick={() => onDelete(item.id)}
            >
              ×
            </Button>
          </div>
        </div>

        {showAddForm && (
          <Form onSubmit={handleSubmenuAdd} className="mt-3">
            <div className="d-flex gap-2">
              <Input
                value={newSubmenuItem}
                onChange={(e) => setNewSubmenuItem(e.target.value)}
                placeholder="Enter submenu item"
                className="rounded-pill"
              />
              <Button 
                color="primary" 
                type="submit"
                className="rounded-pill"
              >
                Add
              </Button>
            </div>
          </Form>
        )}
      </ListGroupItem>

      {item.subItems?.map(subItem => (
        <MenuItem
          key={subItem.id}
          item={subItem}
          level={level + 1}
          onDelete={onDelete}
          onAddSubmenu={onAddSubmenu}
        />
      ))}
    </>
  );
};

const WhatsAppMenus = () => {
  const [menuName, setMenuName] = useState('');
  const [newItem, setNewItem] = useState('');
  const [error, setError] = useState('');
  const [menuItems, setMenuItems] = useState([]);
  const [nextId, setNextId] = useState(1);

  const getNewId = () => {
    setNextId(prev => prev + 1);
    return nextId;
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (newItem.trim()) {
      setMenuItems([...menuItems, { id: getNewId(), text: newItem.trim(), subItems: [] }]);
      setNewItem('');
      setError('');
    } else {
      setError('Item cannot be empty');
    }
  };

  const handleAddSubmenu = (parentId, text) => {
    const newMenuItems = JSON.parse(JSON.stringify(menuItems));
    
    const addSubmenuToItem = (items) => {
      for (let item of items) {
        if (item.id === parentId) {
          item.subItems.push({ id: getNewId(), text, subItems: [] });
          return true;
        }
        if (item.subItems?.length) {
          if (addSubmenuToItem(item.subItems)) return true;
        }
      }
      return false;
    };

    addSubmenuToItem(newMenuItems);
    setMenuItems(newMenuItems);
  };

  const handleDelete = (idToDelete) => {
    const deleteFromItems = (items) => {
      return items.filter(item => {
        if (item.id === idToDelete) return false;
        if (item.subItems?.length) {
          item.subItems = deleteFromItems(item.subItems);
        }
        return true;
      });
    };

    setMenuItems(deleteFromItems(menuItems));
  };

  const handleSave = () => {
    if (!menuName || menuItems.length === 0) {
      setError('Add menu name and items first');
      return;
    }
    console.log('Menu:', { name: menuName, items: menuItems });
  };

  return (
    <Container fluid className="p-0">
      <div 
        className="py-4 mb-4 text-white"
        style={{
          background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}
      >
        <h2 className="text-center m-0">
          <span style={{ fontSize: '1.5rem' }}>📱</span> WhatsApp  Menus
        </h2>
      </div>

      <Container>
        <Row>
          <Col md={5} className="mb-4">
            <Card className="border-0 shadow-sm">
              <CardBody className="p-4">
                <Form onSubmit={handleAddItem}>
                  <FormGroup floating>
                    <Input
                      id="menuName"
                      value={menuName}
                      onChange={(e) => setMenuName(e.target.value)}
                      placeholder="Menu Name"
                      className="rounded-pill"
                    />
                    {/* <Label for="menuName">Menu Name</Label> */}
                  </FormGroup>

                  <FormGroup floating className="mt-4">
                    <Input
                      id="menuItem"
                      value={newItem}
                      onChange={(e) => setNewItem(e.target.value)}
                      placeholder="New Item"
                      className="rounded-pill"
                    />
                    {/* <Label for="menuItem">New Menu Item</Label> */}
                  </FormGroup>

                  <Button 
                    color="primary"
                    type="submit"
                    className="w-100 mt-3 rounded-pill"
                    style={{ background: '#25D366', borderColor: '#25D366' }}
                  >
                    + Add Main Item
                  </Button>
                </Form>

                <Button
                  color="success"
                  onClick={handleSave}
                  className="w-100 mt-3 rounded-pill"
                  disabled={!menuName || menuItems.length === 0}
                  style={{ background: '#128C7E', borderColor: '#128C7E' }}
                >
                  💾 Save Menu
                </Button>

                {error && (
                  <Alert color="danger" className="mt-3 mb-0 rounded-3">
                    ⚠️ {error}
                  </Alert>
                )}
              </CardBody>
            </Card>
          </Col>

          <Col md={7}>
            <Card className="border-0 shadow-sm">
              <CardHeader className="bg-white border-0">
                <h4 className="mb-0 text-center">Menu Preview</h4>
              </CardHeader>
              <CardBody className="p-4">
                {menuItems.length > 0 ? (
                  <ListGroup>
                    {menuItems.map(item => (
                      <MenuItem
                        key={item.id}
                        item={item}
                        onDelete={handleDelete}
                        onAddSubmenu={handleAddSubmenu}
                      />
                    ))}
                  </ListGroup>
                ) : (
                  <div className="text-center text-muted py-5">
                    <h5>No items added yet</h5>
                    <p>Add items using the form on the left</p>
                  </div>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </Container>
  );
};

export default WhatsAppMenus;