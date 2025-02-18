import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  ListGroup,
  ListGroupItem,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Alert,
  Spinner,
  Toast,
  ToastHeader,
  ToastBody
} from 'reactstrap';
import axios from 'axios';
import { MENU_API_ENDPOINT, MENU_ACCESS_API_ENDPOINT, GROUP_ENDPOINTS } from 'Api/Constant';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const WhatsAppMenuAccess = () => {
  // State for individual menu assignment
  const [individualFormData, setIndividualFormData] = useState({
    phoneNumber: '',
    group: '',
    countryCode: '',
    menuId: ''
  });

  // State for group management
  const [groupFormData, setGroupFormData] = useState({
    name: '',
    menuId: '',
    allowedPhoneNumbers: ['']
  });

  // Shared state
  const [menus, setMenus] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [activeTab, setActiveTab] = useState('individual');
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  // Group management state
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  
  const [phoneDeleteModal, setPhoneDeleteModal] = useState(false);
  const [phoneNumberToDelete, setPhoneNumberToDelete] = useState(null);

  const updateFormRef = useRef(null);


  const loaderStyles = {
    overlay: {
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
    }
  };


  const styles = {
    cardHeader: {
      background: 'linear-gradient(45deg, #25D366, #128C7E)',
      color: 'white',
      borderBottom: 'none',
      borderRadius: '8px 8px 0 0',
      padding: '1.25rem'
    },

    
    card: {
      borderRadius: '8px',
      border: 'none',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      marginBottom: '2rem'
    },
    tabButton: (isActive) => ({
      borderRadius: '50px',
      padding: '0.75rem 1.5rem',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      background: isActive ? '#25D366' : 'white',
      color: isActive ? 'white' : '#666',
      border: `2px solid ${isActive ? '#25D366' : '#ddd'}`,
      marginRight: '1rem',
      boxShadow: isActive ? '0 4px 6px rgba(37, 211, 102, 0.2)' : 'none'
    }),
    submitButton: {
      background: '#25D366',
      border: 'none',
      borderRadius: '50px',
      padding: '0.75rem 2rem',
      fontWeight: '600',
      boxShadow: '0 4px 6px rgba(37, 211, 102, 0.2)',
      transition: 'all 0.3s ease'
    },
    input: {
      borderRadius: '8px',
      padding: '0.75rem',
      border: '2px solid #ddd',
      transition: 'all 0.3s ease'
    },
    listItem: {
      borderRadius: '8px',
      marginBottom: '1rem',
      border: '2px solid #f0f0f0',
      transition: 'all 0.3s ease',
      padding: '1.25rem'
    },
    actionButton: (color) => ({
      borderRadius: '50px',
      padding: '0.5rem 1rem',
      fontWeight: '600',
      transition: 'all 0.3s ease'
    }),
    icon: {
      marginRight: '12px' // Increased spacing for icons
    },
    toast: {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 1050,
        minWidth: '300px',
        maxWidth: '400px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        border: 'none',
        borderRadius: '8px',
        backgroundColor: 'white',
      },
      customToast: (type) => ({
        display: 'flex',
        alignItems: 'center',
        padding: '10px 15px',
        borderRadius: '8px',
        backgroundColor: 'white',
        border: `1px solid ${type === 'success' ? '#25D366' : 
                            type === 'danger' ? '#dc3545' : 
                            type === 'warning' ? '#ffc107' : '#17a2b8'}`,
      }),
      toastIcon: (type) => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        marginRight: '15px',
        backgroundColor: type === 'success' ? '#25D366' : 
                        type === 'danger' ? '#dc3545' : 
                        type === 'warning' ? '#ffc107' : '#17a2b8',
        color: 'white'
      }),
      toastMessage: {
        flex: 1,
        color: '#333',
        fontSize: '14px'
      },
      closeButton: {
        background: 'none',
        border: 'none',
        color: '#999',
        fontSize: '18px',
        cursor: 'pointer',
        padding: '0 0 0 15px'
      }
  };
  
  

  useEffect(() => {
    fetchMenus();
    fetchGroups();
  }, []);

  const showAlert = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const fetchMenus = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${MENU_API_ENDPOINT}/getAllMenus`);
      console.log("Fetched Menus Response:", response.data);
      
      if (response.data?.data) {
        const mainMenus = response.data.data.filter(menu => menu.isMainMenu === true);
        console.log("Filtered Main Menus:", mainMenus);
        setMenus(mainMenus);
      }
    } catch (error) {
      console.error("Error fetching menus:", error);
      showAlert('Failed to fetch menus', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const getMenuNameById = (menuId) => {
    // If menuId is an object, return its title directly
    if (typeof menuId === 'object' && menuId !== null) {
      return menuId.menuTitle || menuId.menuName || 'Unnamed Menu';
    }

    // If menuId is a string, find the menu from menus array
    const menu = menus.find(m => m._id === menuId);
    return menu ? (menu.menuName || menu.menuTitle || 'Unnamed Menu') : 'Not Assigned';
  };




  const fetchGroups = async () => {
    try {
      const response = await axios.get(GROUP_ENDPOINTS.GET_ALL);
      console.log("Fetched Groups:", response.data);
      setGroups(response.data.groups || []);
    } catch (error) {
      console.error("Error fetching groups:", error);
      showAlert('Failed to fetch groups', 'danger');
    }
  };

  // Individual menu assignment handlers
  const handleIndividualSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (!individualFormData.phoneNumber && !individualFormData.group && !individualFormData.countryCode) {
        showAlert('Please provide at least one identifier', 'warning');
        return;
      }
      
      await axios.post(`${MENU_ACCESS_API_ENDPOINT}/create-menu-access`, individualFormData);
      showAlert('Menu assigned successfully', 'success');
      setIndividualFormData({
        phoneNumber: '',
        group: '',
        countryCode: '',
        menuId: ''
      });
    } catch (error) {
      showAlert(error.response?.data?.message || 'Failed to assign menu', 'danger');
    } finally {
      setLoading(false);
    }
  };


  // Group management handlers
  const handleGroupSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editMode) {
        await axios.put(GROUP_ENDPOINTS.UPDATE(editId), groupFormData);
        showAlert('Group updated successfully', 'success');
      } else {
        await axios.post(GROUP_ENDPOINTS.CREATE, groupFormData);
        showAlert('Group created successfully', 'success');
      }
      resetGroupForm();
      fetchGroups();
    } catch (error) {
      showAlert(error.response?.data?.message || 'Operation failed', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGroup = async () => {
    try {
      setLoading(true);
      await axios.delete(GROUP_ENDPOINTS.DELETE(selectedGroupId));
      showAlert('Group deleted successfully', 'success');
      fetchGroups();
      setDeleteModal(false);
    } catch (error) {
      showAlert('Failed to delete group', 'danger');
    } finally {
      setLoading(false);
    }
  };


  const handleEditGroup = (group) => {
    setEditMode(true);
    setEditId(group._id);
    setGroupFormData({
      name: group.name,
      menuId: group.menuId,
      allowedPhoneNumbers: group.allowedPhoneNumbers
    });
    setActiveTab('group');

    // Scroll to update form with a slight delay to ensure tab switch is complete
    setTimeout(() => {
      if (updateFormRef.current) {
        const yOffset = -20; // Offset to account for any fixed headers
        const element = updateFormRef.current;
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

        window.scrollTo({
          top: y,
          behavior: 'smooth'
        });

        // For mobile: Check if element is in viewport
        const rect = element.getBoundingClientRect();
        const isInViewport = rect.top >= 0 &&
                           rect.left >= 0 &&
                           rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                           rect.right <= (window.innerWidth || document.documentElement.clientWidth);

        if (!isInViewport) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }, 100);
  };

  const resetGroupForm = () => {
    setGroupFormData({
      name: '',
      menuId: '',
      allowedPhoneNumbers: ['']
    });
    setEditMode(false);
    setEditId(null);
  };

  const addPhoneNumber = () => {
    setGroupFormData(prev => ({
      ...prev,
      allowedPhoneNumbers: [...prev.allowedPhoneNumbers, '']
    }));
  };

  const removePhoneNumber = (index) => {
    setPhoneNumberToDelete(index);
    setPhoneDeleteModal(true);
  };

  const handlePhoneNumberDelete = () => {
    if (phoneNumberToDelete !== null) {
      setGroupFormData(prev => ({
        ...prev,
        allowedPhoneNumbers: prev.allowedPhoneNumbers.filter((_, i) => i !== phoneNumberToDelete)
      }));
    }
    setPhoneDeleteModal(false);
  };

  return (
    <>
    {loading && (
        <div style={loaderStyles.overlay}>
          <DotLottieReact
            src="https://lottie.host/5060de43-85ac-474a-a85b-892f9730e17a/b3jJ1vGkWh.lottie"
            loop
            autoplay
            style={{ width: "150px", height: "150px" }}
          />
        </div>
      )}

    <Container fluid className="p-4 bg-light min-vh-100">
      {/* Toast Notification */}
      <div style={styles.toast}>
  {toast.show && (
    <div style={styles.customToast(toast.type)}>
      <div style={styles.toastIcon(toast.type)}>
        {toast.type === 'success' && <i className="fas fa-check"></i>}
        {toast.type === 'danger' && <i className="fas fa-times"></i>}
        {toast.type === 'warning' && <i className="fas fa-exclamation"></i>}
        {toast.type === 'info' && <i className="fas fa-info"></i>}
      </div>
      <div style={styles.toastMessage}>
        <div>
          <strong>{toast.type.charAt(0).toUpperCase() + toast.type.slice(1)}!</strong>
        </div>
        <div>{toast.message}</div>
      </div>
      <button 
        style={styles.closeButton}
        onClick={() => setToast({ ...toast, show: false })}
      >
        <i className="fas fa-times"></i>
      </button>
    </div>
  )}
</div>

      <div className="mb-4 d-flex justify-content-center">
        <Button
          style={styles.tabButton(activeTab === 'individual')}
          onClick={() => setActiveTab('individual')}
        >
          <i className="fas fa-user" style={styles.icon}></i>
          Individual Assignment
        </Button>
        <Button
          style={styles.tabButton(activeTab === 'group')}
          onClick={() => setActiveTab('group')}
        >
          <i className="fas fa-users" style={styles.icon}></i>
          Group Management
        </Button>
      </div>

      {activeTab === 'individual' ? (
        <Card style={styles.card}>
          <CardHeader style={styles.cardHeader}>
            <h4 className="mb-0">
              <i className="fas fa-user-plus" style={styles.icon}></i>
              Assign Individual WhatsApp Menu Access
            </h4>
          </CardHeader>
          <CardBody className="p-4">
            <Form onSubmit={handleIndividualSubmit}>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label className="fw-bold">Phone Number</Label>
                    <Input
                      style={styles.input}
                      type="text"
                      value={individualFormData.phoneNumber}
                      onChange={(e) => setIndividualFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                      placeholder="Enter phone number"
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label className="fw-bold">Country Code</Label>
                    <Input
                      style={styles.input}
                      type="text"
                      value={individualFormData.countryCode}
                      onChange={(e) => setIndividualFormData(prev => ({ ...prev, countryCode: e.target.value }))}
                      placeholder="Enter country code"
                    />
                  </FormGroup>
                </Col>
                <Col md={12}>
                  <FormGroup>
                    <Label className="fw-bold">Select Menu</Label>
                    <Input
                      style={styles.input}
                      type="select"
                      value={individualFormData.menuId}
                      onChange={(e) => setIndividualFormData(prev => ({ ...prev, menuId: e.target.value }))}
                    >
                      <option value="">Select a menu...</option>
                      {menus.map((menu) => (
                        <option key={menu._id} value={menu._id}>
                          {menu.menuName || menu.menuTitle || 'Unnamed Menu'}
                        </option>
                      ))}
                    </Input>
                  </FormGroup>
                </Col>
              </Row>
              <div className="text-center mt-4">
                <Button style={styles.submitButton} type="submit" disabled={loading}>
                  {loading ? <Spinner size="sm" className="me-2" /> : <i className="fas fa-check me-2"></i>}
                  Assign Menu
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
      ) :  (
        <Row>
          <Col md={12} lg={5}>
            <Card style={styles.card} ref={updateFormRef}> {/* Add ref here */}
              <CardHeader style={styles.cardHeader}>
                <h4 className="mb-0">
                  <i className={`fas ${editMode ? 'fa-edit' : 'fa-plus-circle'}`} style={styles.icon}></i>
                  {editMode ? 'Edit Group' : 'Create New Group'}
                </h4>
              </CardHeader>

              <CardBody className="p-4">
                <Form onSubmit={handleGroupSubmit}>
                  <FormGroup>
                    <Label className="fw-bold">Group Name</Label>
                    <Input
                      style={styles.input}
                      value={groupFormData.name}
                      onChange={(e) => setGroupFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter group name"
                      required
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label className="fw-bold">Select Menu</Label>
                    <Input
                      style={styles.input}
                      type="select"
                      value={groupFormData.menuId}
                      onChange={(e) => setGroupFormData(prev => ({ ...prev, menuId: e.target.value }))}
                      required
                    >
                      <option value="">Choose menu...</option>
                      {menus.map(menu => (
                        <option key={menu._id} value={menu._id}>
                          {menu.menuTitle || menu.menuName || 'Unnamed Menu'}
                        </option>
                      ))}
                    </Input>
                  </FormGroup>

                  <FormGroup>
                    <Label className="fw-bold">Phone Numbers</Label>
                    {groupFormData.allowedPhoneNumbers.map((number, index) => (
                      <div key={index} className="d-flex mb-3">
                        <Input
                          style={styles.input}
                          value={number}
                          onChange={(e) => {
                            const newNumbers = [...groupFormData.allowedPhoneNumbers];
                            newNumbers[index] = e.target.value;
                            setGroupFormData(prev => ({ ...prev, allowedPhoneNumbers: newNumbers }));
                          }}
                          placeholder="Enter phone number"
                          className="me-2"
                          required
                        />
                        {groupFormData.allowedPhoneNumbers.length > 1 && (
                          <Button
                            color="danger"
                            outline
                            style={styles.actionButton('danger')}
                            onClick={() => removePhoneNumber(index)}
                          >
                            <i className="fas fa-trash"></i>
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      color="secondary"
                      outline
                      style={styles.actionButton('secondary')}
                      onClick={addPhoneNumber}
                    >
                      <i className="fas fa-plus me-2"></i>
                      Add Phone Number
                    </Button>
                  </FormGroup>

                  <div className="d-flex justify-content-center mt-4 gap-3">
                    <Button 
                      style={styles.submitButton}
                      type="submit" 
                      disabled={loading}
                    >
                      {loading ? <Spinner size="sm" className="me-2" /> : 
                        <i className={`fas ${editMode ? 'fa-save' : 'fa-plus'} me-2`}></i>}
                      {editMode ? 'Update Group' : 'Create Group'}
                    </Button>
                    {editMode && (
                      <Button 
                        color="secondary"
                        outline
                        style={styles.actionButton('secondary')}
                        onClick={resetGroupForm}
                        disabled={loading}
                      >
                        <i className="fas fa-times me-2"></i>
                        Cancel
                      </Button>
                    )}
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>

          <Col md={12} lg={7}>
        <Card style={styles.card}>
          <CardHeader style={styles.cardHeader}>
            <h4 className="mb-0">
              <i className="fas fa-users" style={styles.icon}></i>
              Groups List
            </h4>
          </CardHeader>
          <CardBody className="p-4">
            <ListGroup>
            {groups.map(group => (
      <ListGroupItem key={group._id} style={styles.listItem}>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h5 className="mb-2 fw-bold">{group.name}</h5>
            <p className="mb-2 text-muted">
              <i className="fas fa-list-ul" style={styles.icon}></i>
              Menu: {getMenuNameById(group.menuId)}
            </p>
                      <div className="mb-0">
                        <p className="mb-2 fw-bold">
                          <i className="fas fa-phone" style={styles.icon}></i>
                          Phone Numbers:
                        </p>
                        <ul className="list-unstyled ps-4">
                          {group.allowedPhoneNumbers.map((number, index) => (
                            <li key={index} className="mb-1">
                              <i className="fas fa-check-circle text-success" style={styles.icon}></i>
                              {number}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="d-flex gap-2">
                      <Button
                        color="primary"
                        outline
                        style={styles.actionButton('primary')}
                        onClick={() => handleEditGroup(group)}
                        disabled={loading}
                      >
                        <i className="fas fa-edit"></i>
                      </Button>
                      <Button
                        color="danger"
                        outline
                        style={styles.actionButton('danger')}
                        onClick={() => {
                          setSelectedGroupId(group._id);
                          setDeleteModal(true);
                        }}
                        disabled={loading}
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </div>
                  </div>
                </ListGroupItem>
              ))}
                  {!loading && groups.length === 0 && (
            <div className="text-center p-5">
              <i className="fas fa-users fa-3x text-muted mb-3"></i>
              <p className="text-muted">No groups found</p>
            </div>
          )}
        </ListGroup>
      </CardBody>
    </Card>
  </Col>
        </Row>
      )}

       <Modal isOpen={phoneDeleteModal} toggle={() => setPhoneDeleteModal(false)}>
          <ModalHeader style={styles.cardHeader} toggle={() => setPhoneDeleteModal(false)}>
            <i className="fas fa-trash" style={styles.icon}></i>
            Delete Phone Number
          </ModalHeader>
          <ModalBody className="p-4">
            <div className="text-center">
              <i className="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
              <p className="mb-0">Are you sure you want to delete this phone number?</p>
            </div>
          </ModalBody>
          <ModalFooter className="p-3">
            <Button 
              color="secondary" 
              outline
              style={styles.actionButton('secondary')}
              onClick={() => setPhoneDeleteModal(false)}
            >
              <i className="fas fa-times" style={styles.icon}></i>
              Cancel
            </Button>
            <Button 
              color="danger"
              style={{...styles.actionButton('danger'), background: '#dc3545', color: 'white'}}
              onClick={handlePhoneNumberDelete}
            >
              <i className="fas fa-trash" style={styles.icon}></i>
              Delete
            </Button>
          </ModalFooter>
        </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={deleteModal} toggle={() => setDeleteModal(false)}>
        <ModalHeader style={styles.cardHeader} toggle={() => setDeleteModal(false)}>
          <i className="fas fa-trash" style={styles.icon}></i>
          Delete Group
        </ModalHeader>
        <ModalBody className="p-4">
          <div className="text-center">
            <i className="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
            <p className="mb-0">Are you sure you want to delete this group? This action cannot be undone.</p>
          </div>
        </ModalBody>
        <ModalFooter className="p-3">
          <Button 
            color="secondary" 
            outline
            style={styles.actionButton('secondary')}
            onClick={() => setDeleteModal(false)}
          >
            <i className="fas fa-times" style={styles.icon}></i>
            Cancel
          </Button>
          <Button 
            color="danger"
            style={{...styles.actionButton('danger'), background: '#dc3545', color: 'white'}}
            onClick={handleDeleteGroup}
          >
            <i className="fas fa-trash" style={styles.icon}></i>
            Delete
          </Button>
        </ModalFooter>
      </Modal>
    </Container>
    </>
  );
};

export default WhatsAppMenuAccess;