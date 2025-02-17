import React, { useState, useEffect } from 'react';
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
  ToastBody,
  InputGroup,
  InputGroupText,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import axios from 'axios';
import { MENU_API_ENDPOINT, MENU_ACCESS_API_ENDPOINT, GROUP_ENDPOINTS } from 'Api/Constant';
import { countryList } from './countryList'; // Import the country list

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

  // Country code dropdown state
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [groupCountryCodes, setGroupCountryCodes] = useState([null]);

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
      top: '20px',
      right: '20px',
      zIndex: 1050,
      minWidth: '300px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      border: 'none',
      borderRadius: '8px'
    },
    toastHeader: (type) => ({
      background: type === 'success' ? '#25D366' : 
                 type === 'danger' ? '#dc3545' : 
                 type === 'warning' ? '#ffc107' : '#17a2b8',
      color: 'white',
      borderRadius: '8px 8px 0 0'
    }),
    countryDropdown: {
      maxHeight: '250px',
      overflowY: 'auto',
      width: '100%'
    },
    countryItem: {
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
      padding: '8px 12px'
    },
    countryFlag: {
      fontSize: '20px',
      marginRight: '8px'
    },
    searchInput: {
      padding: '8px 12px',
      borderBottom: '1px solid #ddd',
      position: 'sticky',
      top: 0,
      backgroundColor: 'white',
      zIndex: 1
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
      if (response.data?.data) {
        const defaultMenus = response.data.data.filter(menu => menu.isDefault === true);
        setMenus(defaultMenus);
      }
    } catch (error) {
      showAlert('Failed to fetch menus', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const fetchGroups = async () => {
    try {
      const response = await axios.get(GROUP_ENDPOINTS.GET_ALL);
      setGroups(response.data.groups || []);
    } catch (error) {
      showAlert('Failed to fetch groups', 'danger');
    }
  };

  // Toggle dropdown
  const toggleDropdown = () => setDropdownOpen(prevState => !prevState);

  // Filter countries based on search term
  const filteredCountries = countryList.filter(country => 
    country.country.toLowerCase().includes(searchTerm.toLowerCase()) || 
    country.code.includes(searchTerm)
  );

  // Handle country selection
  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setIndividualFormData(prev => ({ ...prev, countryCode: country.code }));
    setDropdownOpen(false);
  };

  // Handle group country selection
  const handleGroupCountrySelect = (country, index) => {
    const newGroupCountryCodes = [...groupCountryCodes];
    newGroupCountryCodes[index] = country;
    setGroupCountryCodes(newGroupCountryCodes);
    
    const newPhoneNumbers = [...groupFormData.allowedPhoneNumbers];
    if (newPhoneNumbers[index]) {
      // Remove any existing country code (+ followed by digits)
      const phoneWithoutCode = newPhoneNumbers[index].replace(/^\+\d+\s*/, '');
      newPhoneNumbers[index] = `+${country.code} ${phoneWithoutCode}`;
    } else {
      newPhoneNumbers[index] = `+${country.code} `;
    }
    
    setGroupFormData(prev => ({
      ...prev,
      allowedPhoneNumbers: newPhoneNumbers
    }));
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
      setSelectedCountry(null);
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
    
    // Set country codes for existing phone numbers
    const newGroupCountryCodes = group.allowedPhoneNumbers.map(phoneNumber => {
      const codeMatch = phoneNumber.match(/^\+(\d+)/);
      if (codeMatch) {
        const matchedCountry = countryList.find(country => country.code === codeMatch[1]);
        return matchedCountry || null;
      }
      return null;
    });
    
    setGroupCountryCodes(newGroupCountryCodes);
    setActiveTab('group');
  };

  const resetGroupForm = () => {
    setGroupFormData({
      name: '',
      menuId: '',
      allowedPhoneNumbers: ['']
    });
    setGroupCountryCodes([null]);
    setEditMode(false);
    setEditId(null);
  };

  const addPhoneNumber = () => {
    setGroupFormData(prev => ({
      ...prev,
      allowedPhoneNumbers: [...prev.allowedPhoneNumbers, '']
    }));
    setGroupCountryCodes(prev => [...prev, null]);
  };

  const removePhoneNumber = (index) => {
    setGroupFormData(prev => ({
      ...prev,
      allowedPhoneNumbers: prev.allowedPhoneNumbers.filter((_, i) => i !== index)
    }));
    setGroupCountryCodes(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Container fluid className="p-4 bg-light min-vh-100">
      {/* Toast Notification */}
      <div style={styles.toast}>
        <Toast isOpen={toast.show}>
          <ToastHeader 
            style={styles.toastHeader(toast.type)}
            toggle={() => setToast({ ...toast, show: false })}
          >
            {toast.type === 'success' && <i className="fas fa-check-circle" style={styles.icon}></i>}
            {toast.type === 'danger' && <i className="fas fa-exclamation-circle" style={styles.icon}></i>}
            {toast.type === 'warning' && <i className="fas fa-exclamation-triangle" style={styles.icon}></i>}
            {toast.type.charAt(0).toUpperCase() + toast.type.slice(1)}
          </ToastHeader>
          <ToastBody>
            {toast.message}
          </ToastBody>
        </Toast>
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
                    <InputGroup>
                      <InputGroupText>
                        <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                          <DropdownToggle color="light" className="text-start" style={{ minWidth: '120px' }}>
                            {selectedCountry ? 
                              <span>{selectedCountry.flag} +{selectedCountry.code}</span> : 
                              <span>Country <i className="fas fa-caret-down ms-1"></i></span>
                            }
                          </DropdownToggle>
                          <DropdownMenu style={styles.countryDropdown}>
                            <div style={styles.searchInput}>
                              <Input
                                type="text"
                                placeholder="Search country or code..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>
                            {filteredCountries.map((country) => (
                              <DropdownItem 
                                key={`${country.code}-${country.country}`}
                                onClick={() => handleCountrySelect(country)}
                                style={styles.countryItem}
                              >
                                <span style={styles.countryFlag}>{country.flag}</span>
                                <span>{country.country} (+{country.code})</span>
                              </DropdownItem>
                            ))}
                          </DropdownMenu>
                        </Dropdown>
                      </InputGroupText>
                      <Input
                        style={styles.input}
                        type="text"
                        value={individualFormData.phoneNumber}
                        onChange={(e) => setIndividualFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                        placeholder="Enter phone number"
                      />
                    </InputGroup>
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label className="fw-bold">Country Code</Label>
                    <Input
                      style={styles.input}
                      type="text"
                      value={individualFormData.countryCode ? `+${individualFormData.countryCode}` : ''}
                      disabled
                      placeholder="Selected from dropdown"
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
            <Card style={styles.card}>
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
                        <InputGroup>
                          <InputGroupText>
                            <Dropdown isOpen={dropdownOpen === `group-${index}`} toggle={() => setDropdownOpen(prev => prev === `group-${index}` ? false : `group-${index}`)}>
                              <DropdownToggle color="light" className="text-start" style={{ minWidth: '90px' }}>
                                {groupCountryCodes[index] ? 
                                  <span>{groupCountryCodes[index].flag}</span> : 
                                  <span><i className="fas fa-globe-americas"></i></span>
                                }
                              </DropdownToggle>
                              <DropdownMenu style={styles.countryDropdown}>
                                <div style={styles.searchInput}>
                                  <Input
                                    type="text"
                                    placeholder="Search country or code..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                </div>
                                {filteredCountries.map((country) => (
                                  <DropdownItem 
                                    key={`${country.code}-${country.country}-${index}`}
                                    onClick={() => handleGroupCountrySelect(country, index)}
                                    style={styles.countryItem}
                                  >
                                    <span style={styles.countryFlag}>{country.flag}</span>
                                    <span>{country.country} (+{country.code})</span>
                                  </DropdownItem>
                                ))}
                              </DropdownMenu>
                            </Dropdown>
                          </InputGroupText>
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
                        </InputGroup>
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
                            Menu: {menus.find(m => m._id === group.menuId)?.menuName || 'Not Assign'}
                          </p>
                          <div className="mb-0">
                            <p className="mb-2 fw-bold">
                              <i className="fas fa-phone" style={styles.icon}></i>
                              Phone Numbers:
                            </p>
                            <ul className="list-unstyled ps-4">
                              {group.allowedPhoneNumbers.map((number, index) => {
                                // Get country info based on phone number
                                const codeMatch = number.match(/^\+?(\d+)/);
                                let flagEmoji = '';
                                if (codeMatch) {
                                  const matchedCountry = countryList.find(c => c.code === codeMatch[1]);
                                  if (matchedCountry) {
                                    flagEmoji = matchedCountry.flag;
                                  }
                                }
                                
                                return (
                                  <li key={index} className="mb-1">
                                    <span className="me-2">{flagEmoji}</span>
                                    {number}
                                  </li>
                                );
                              })}
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
  );
};

export default WhatsAppMenuAccess;