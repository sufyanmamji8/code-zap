import React, { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, CardBody,
  Button, Form, FormGroup, Label, Input, Table,
  Modal, ModalHeader, ModalBody, ModalFooter,
  InputGroup, InputGroupText, Badge,
  Dropdown, DropdownToggle, DropdownMenu, DropdownItem
} from 'reactstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { countryList } from '../Pages/countryList';
import { Plus, Edit2, Trash2, Upload, Users, Search, Phone, FileText, ChevronDown, UserPlus } from 'lucide-react';
import { GROUP_ENDPOINTS } from 'Api/Constant';
import { DotLottieReact } from '@lottiefiles/dotlottie-react'; // Import DotLottieReact

const WhatsappGroup = () => {
  const navigate = useNavigate();
  // Find Pakistan in the countryList
  const pakistanCountry = countryList.find(country => country.country === 'Pakistan') || countryList[0];
  
  const [groups, setGroups] = useState([]);
  const [modal, setModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentGroupId, setCurrentGroupId] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [countryDropdown, setCountryDropdown] = useState(false);
  const [searchCountry, setSearchCountry] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(pakistanCountry);
  const [loading, setLoading] = useState(false); // Add loading state
  const [formData, setFormData] = useState({
    groupName: '',
    countryCode: pakistanCountry.code,
    phoneNumber: '',
    numbers: []
  });

  useEffect(() => {
    // Check token on component mount
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('No token found, please login again.');
      navigate('/login');
      return;
    }
    
    fetchGroups();
  }, [navigate]);

  const fetchGroups = async () => {
    setLoading(true); // Show loader when fetching groups
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('No token found, please login again.');
        navigate('/login');
        return;
      }

      const response = await axios.get(GROUP_ENDPOINTS.GET_ALL, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      
      if (response.data.success) {
        setGroups(response.data.groups);
      } else {
        toast.error(response.data.message || 'Failed to fetch groups');
      }
    } catch (error) {
      console.error('Error fetching groups:', error);
      toast.error(error.response?.data?.message || 'An error occurred while fetching groups');
      
      // If token is invalid or expired
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setLoading(false); // Hide loader after fetching completes
    }
  };

  // Fix: Make sure filteredCountries is properly populated
  const filteredCountries = countryList?.filter(country => 
    country?.country?.toLowerCase().includes(searchCountry.toLowerCase()) ||
    country?.code?.includes(searchCountry)
  ) || [];

  const filteredGroups = groups.filter(group => 
    group?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setFormData({
      ...formData,
      countryCode: country.code
    });
    setCountryDropdown(false);
  };
  
  const toggle = () => {
    setModal(!modal);
    if (!modal) {
      setFormData({
        groupName: '',
        countryCode: pakistanCountry.code,
        phoneNumber: '',
        numbers: []
      });
      setEditMode(false);
      // Reset selected country to Pakistan when opening the modal
      setSelectedCountry(pakistanCountry);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddNumber = () => {
    if (formData.phoneNumber && formData.countryCode) {
      // Store the number without the "+" symbol
      const fullNumber = `${formData.countryCode}${formData.phoneNumber}`;
      if (!formData.numbers.includes(fullNumber)) {
        setFormData({
          ...formData,
          numbers: [...formData.numbers, fullNumber],
          phoneNumber: ''
        });
      }
    }
  };

  const handleRemoveNumber = (index) => {
    const updatedNumbers = formData.numbers.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      numbers: updatedNumbers
    });
  };

  const handleCSVImport = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const csvData = event.target.result.split('\n')
          .map(line => line.trim())
          .filter(line => line);
        
        // Process each number to ensure no "+" symbol is stored
        const processedNumbers = csvData.map(number => {
          // Remove any "+" if present in the imported data
          return number.startsWith('+') ? number.substring(1) : number;
        });
        
        setFormData({
          ...formData,
          numbers: [...formData.numbers, ...processedNumbers]
        });
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Show loader when submitting form
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('No token found, please login again.');
        navigate('/login');
        return;
      }

      if (editMode) {
        const response = await axios.put(
          GROUP_ENDPOINTS.UPDATE(currentGroupId),
          {
            name: formData.groupName,
            allowedPhoneNumbers: formData.numbers
          },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            withCredentials: true
          }
        );
        
        if (response.data.success) {
          toast.success('Group updated successfully!');
          await fetchGroups();
          toggle();
        } else {
          toast.error(response.data.message || 'Failed to update group');
        }
      } else {
        // Create new group
        const formDataObj = new FormData();
        formDataObj.append('name', formData.groupName);
        
        if (formData.numbers.length > 0) {
          // Create proper CSV content with header and rows
          const csvHeader = "phoneNumber\n";
          const csvRows = formData.numbers.map(number => number).join("\n");
          const csvContent = csvHeader + csvRows;
          
          // Create a properly formatted CSV file
          const csvFile = new Blob([csvContent], { type: 'text/csv' });
          formDataObj.append('csvFile', csvFile, 'numbers.csv');
        }

        const response = await axios.post(
          GROUP_ENDPOINTS.CREATE,
          formDataObj,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            },
            withCredentials: true
          }
        );

        if (response.data.success) {
          toast.success('Group created successfully!');
          await fetchGroups();
          toggle();
        } else {
          toast.error(response.data.message || 'Failed to create group');
        }
      }
    } catch (error) {
      console.error('Error submitting group:', error);
      toast.error(error.response?.data?.message || 'An error occurred while saving the group');
      
      // If token is invalid or expired
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setLoading(false); // Hide loader after submission completes
    }
  };

  const handleEdit = async (groupId) => {
    setLoading(true); // Show loader when editing
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('No token found, please login again.');
        navigate('/login');
        return;
      }

      const group = groups.find(g => g._id === groupId);
      if (group) {
        setCurrentGroupId(groupId);
        setFormData({
          groupName: group.name,
          countryCode: pakistanCountry.code,
          phoneNumber: '',
          numbers: group.allowedPhoneNumbers || []
        });
        setEditMode(true);
        setModal(true);
        // Reset selected country to Pakistan when editing
        setSelectedCountry(pakistanCountry);
      }
    } catch (error) {
      console.error('Error setting up edit mode:', error);
      toast.error('An error occurred while editing the group');
    } finally {
      setLoading(false); // Hide loader after editing setup completes
    }
  };

  const handleDelete = async (groupId) => {
    setLoading(true); // Show loader when deleting
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('No token found, please login again.');
        navigate('/login');
        return;
      }

      const response = await axios.delete(
        GROUP_ENDPOINTS.DELETE(groupId),
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );
      
      if (response.data.success) {
        toast.success('Group deleted successfully!');
        await fetchGroups();
      } else {
        toast.error(response.data.message || 'Failed to delete group');
      }
    } catch (error) {
      console.error('Error deleting group:', error);
      toast.error(error.response?.data?.message || 'An error occurred while deleting the group');
      
      // If token is invalid or expired
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setLoading(false); // Hide loader after deletion completes
    }
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
      
      <Container fluid className="p-4 min-vh-100">
        {/* Header Section with Gradient Background */}
        <div className="header-section rounded-lg p-4 mb-4 bg-gradient-primary text-white shadow-lg">
          <Row className="align-items-center">
            <Col md="7">
              <h2 className="mb-1 d-flex align-items-center">
                <Users className="me-3" size={32} />
                WhatsApp Groups Management
              </h2>
              <p className="mb-0 text-white-50">Create and manage your WhatsApp groups efficiently</p>
            </Col>
            <Col md="5" className="d-flex justify-content-end align-items-center">
              <Button color="light" className="d-flex align-items-center shadow btn-hover-effect" onClick={toggle}>
                <Plus size={20} className="me-2" />
                <span className="fw-bold">Create New Group</span>
              </Button>
            </Col>
          </Row>
        </div>

        {/* Search and Stats Card */}
        <Card className="shadow-sm border-0 mb-4 search-card overflow-hidden">
          <CardBody className="p-0">
            <Row className="p-4 align-items-center border-bottom">
              <Col lg="8" md="6">
                <InputGroup className="search-group shadow-sm rounded overflow-hidden">
                  <InputGroupText className="bg-white border-0">
                    <Search size={18} className="text-primary" />
                  </InputGroupText>
                  <Input
                    placeholder="Search groups by name..."
                    className="border-0 py-2"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </Col>
              <Col lg="4" md="6" className="mt-3 mt-md-0 d-flex justify-content-md-end">
                <div className="stats-card d-flex align-items-center bg-primary-subtle p-2 px-3 rounded-pill">
                  <div className="stats-icon me-2 bg-primary text-white rounded-circle p-2 d-flex align-items-center justify-content-center">
                    <Users size={16} />
                  </div>
                  <div className="stats-text">
                    <h6 className="mb-0 fw-bold">Total Groups</h6>
                    <h5 className="mb-0 text-primary">{groups.length}</h5>
                  </div>
                </div>
              </Col>
            </Row>
            
            {/* Groups Table */}
            <div className="table-responsive">
              <Table hover borderless className="align-middle mb-0 groups-table">
                <thead className="bg-light">
                  <tr>
                    <th className="ps-4 py-3">#</th>
                    <th className="py-3">Group Information</th>
                    <th className="py-3">Members</th>
                    <th className="text-end pe-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGroups.length > 0 ? (
                    filteredGroups.map((group, index) => (
                      <tr key={group._id} className="group-row">
                        <td className="ps-4">{index + 1}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="group-icon me-3 bg-primary text-white rounded p-2 d-flex align-items-center justify-content-center">
                              <Users size={20} />
                            </div>
                            <div>
                              <h6 className="mb-0 fw-bold">{group.name}</h6>
                              {/* <small className="text-muted d-flex align-items-center">
                                <span className="status-dot bg-success me-1"></span>
                                Active since today
                              </small> */}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="members-badge me-2">
                              <Badge color="primary" pill className="px-3 py-2 d-flex align-items-center">
                                <UserPlus size={14} className="me-1" />
                                <span>{group.allowedPhoneNumbers?.length || 0}</span>
                              </Badge>
                            </div>
                          </div>
                        </td>
                        <td className="text-end pe-4">
                          <Button 
                            color="light"
                            className="me-2 btn-icon btn-action"
                            onClick={() => handleEdit(group._id)}
                          >
                            <Edit2 size={16} className="text-primary" />
                          </Button>
                          <Button 
                            color="light" 
                            className="btn-icon btn-action"
                            onClick={() => handleDelete(group._id)}
                          >
                            <Trash2 size={16} className="text-danger" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center py-5">
                        <div className="empty-state">
                          <div className="empty-icon mb-3 bg-light p-4 rounded-circle mx-auto">
                            <Users size={32} className="text-muted" />
                          </div>
                          <h5>No groups found</h5>
                          <p className="text-muted mb-3">Try creating a new group or adjusting your search</p>
                          <Button color="primary" onClick={toggle}>
                            <Plus size={16} className="me-2" />
                            Create Group
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </CardBody>
        </Card>

        {/* Modal */}
        <Modal 
          isOpen={modal} 
          toggle={toggle} 
          size="lg" 
          className="modal-dialog-centered"
          style={{ maxWidth: '700px' }}
        >
          <Form onSubmit={handleSubmit} className="modal-custom">
            <ModalHeader toggle={toggle} className="bg-gradient-primary text-white border-0 p-4">
              <div className="d-flex align-items-center">
                {editMode ? (
                  <Edit2 size={24} className="me-2" />
                ) : (
                  <Plus size={24} className="me-2" />
                )}
                <div>
                  <h4 className="mb-0">
                    {editMode ? 'Edit WhatsApp Group' : 'Create New WhatsApp Group'}
                  </h4>
                  <p className="mb-0 mt-1 text-white-50 small">
                    {editMode ? 'Update your group details and members' : 'Add a new group with members to your collection'}
                  </p>
                </div>
              </div>
            </ModalHeader>
            <ModalBody className="p-4">
              <FormGroup className="mb-4">
                <Label for="groupName" className="fw-bold mb-2 d-flex align-items-center">
                  <span className="label-icon bg-primary-subtle text-primary rounded p-1 me-3">
                    <Users size={16} />
                  </span>
                  Group Name
                </Label>
                <Input
                  type="text"
                  name="groupName"
                  id="groupName"
                  value={formData.groupName}
                  onChange={handleInputChange}
                  required
                  className="form-control-lg border"
                  placeholder="Enter your group name"
                />
              </FormGroup>
              
              {/* Phone Number Input with Enhanced UI */}
              <FormGroup className="mb-4">
                <Label className="fw-bold mb-2 d-flex align-items-center">
                  <span className="label-icon bg-primary-subtle text-primary rounded p-1 me-2">
                    <Phone size={16} />
                  </span>
                  Phone Number
                </Label>
                <div className="phone-input-container shadow-sm">
                  <div className="country-code-display" onClick={() => setCountryDropdown(!countryDropdown)}>
                    <span className="country-code-flag me-2">{selectedCountry.flag}</span>
                    <span className="country-code-text">
                      {selectedCountry.code.substring(0, 3)}
                    </span>
                    <ChevronDown size={16} className="ms-2" />
                  </div>
                  <div className="phone-input-wrapper">
                    <Input
                      type="text"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="Enter phone number"
                      className="phone-input"
                    />
                    <Button 
                      color="primary" 
                      onClick={handleAddNumber}
                      className="phone-add-btn"
                    >
                      <span className="d-none d-md-inline">Add</span>
                      <Plus size={18} className="d-md-none" />
                    </Button>
                  </div>
                  
                  {/* Country Dropdown */}
                  {countryDropdown && (
                    <div className="country-dropdown-absolute shadow-lg">
                      <div className="country-search-container border-bottom sticky-top">
                        <InputGroup size="sm">
                          <InputGroupText className="bg-light border-0">
                            <Search size={14} />
                          </InputGroupText>
                          <Input
                            placeholder="Search country..."
                            value={searchCountry}
                            onChange={(e) => setSearchCountry(e.target.value)}
                            className="border-0 bg-light"
                          />
                        </InputGroup>
                      </div>
                      <div className="country-list-container">
                        {filteredCountries.length > 0 ? (
                          filteredCountries.map((country) => (
                            <div 
                              key={country.code}
                              onClick={() => handleCountrySelect(country)}
                              className={`country-list-item ${selectedCountry.code === country.code ? 'active' : ''}`}
                            >
                              <span className="me-2">{country.flag}</span>
                              <span className="country-name">{country.country}</span>
                              <span className="country-code">+{country.code}</span>
                            </div>
                          ))
                        ) : (
                          <div className="p-3 text-center text-muted">No countries found</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </FormGroup>

              {/* CSV Import */}
              <FormGroup className="mb-4">
                <Label className="fw-bold mb-2 d-flex align-items-center">
                  <span className="label-icon bg-primary-subtle text-primary rounded p-1 me-2">
                    <FileText size={16} />
                  </span>
                  Import Numbers (CSV)
                </Label>
                <div className="custom-file-upload border rounded-3">
                  <div className="csv-upload-content">
                    <Upload size={24} className="text-primary mb-2" />
                    <p className="mb-1">Drag & drop CSV file or</p>
                    <Button color="primary" size="sm" className="position-relative">
                      Browse Files
                      <Input
                        type="file"
                        accept=".csv"
                        onChange={handleCSVImport}
                        className="file-upload-input"
                      />
                    </Button>
                    <p className="text-muted small mt-2 mb-0">Only CSV files are supported</p>
                  </div>
                </div>
              </FormGroup>

              {/* Added Numbers Section */}
              <FormGroup>
                <Label className="fw-bold mb-2 d-flex align-items-center">
                  <span className="label-icon bg-primary-subtle text-primary rounded p-1 me-2">
                    <UserPlus size={16} />
                  </span>
                  Added Numbers <Badge color="primary" pill className="ms-2">{formData.numbers.length}</Badge>
                </Label>
                <div className="numbers-container border rounded-3 p-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {formData.numbers.length === 0 ? (
                    <div className="text-center text-muted py-4 empty-numbers">
                      <Phone size={32} className="mb-2" />
                      <p className="mb-0">No numbers added yet</p>
                      <small>Add numbers using the form above or import from CSV</small>
                    </div>
                  ) : (
                    <Row className="g-2">
                      {formData.numbers.map((number, index) => (
                        <Col md="6" key={index}>
                          <div className="number-item d-flex justify-content-between align-items-center p-2 bg-light rounded">
                            <div className="d-flex align-items-center">
                              <div className="number-avatar me-2">
                                {number.substring(number.length - 2)}
                              </div>
                              <span className="number-text">{number}</span>
                            </div>
                            <Button
                              color="link"
                              className="p-1 text-danger"
                              onClick={() => handleRemoveNumber(index)}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  )}
                </div>
              </FormGroup>
            </ModalBody>
            <ModalFooter className="bg-light border-top-0 p-4">
              <Button color="light" onClick={toggle} className="px-4 btn-hover-effect">
                Cancel
              </Button>
              <Button color="primary" type="submit" className="px-4 btn-hover-effect">
                {editMode ? 'Update Group' : 'Create Group'}
              </Button>
            </ModalFooter>
          </Form>
      </Modal>

      <style jsx>{`
        /* Base Styling */
        .bg-gradient-light {
          background: linear-gradient(to right, #f8f9fa, #ffffff);
        }
        
        .bg-gradient-primary {
          background: linear-gradient(to right, #4361ee, #3a0ca3);
        }
        
        .shadow-lg {
          box-shadow: 0 10px 25px rgba(0,0,0,0.08) !important;
        }
        
        .rounded-lg {
          border-radius: 12px !important;
        }
        
        .btn-hover-effect {
          transition: all 0.3s ease;
          transform: translateY(0);
        }
        
        .btn-hover-effect:hover {
          transform: translateY(-3px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        /* Search Card Styles */
        .search-card {
          border-radius: 12px;
          transition: all 0.3s ease;
        }
        
        .search-card:hover {
          box-shadow: 0 15px 30px rgba(0,0,0,0.05) !important;
        }
        
        .search-group {
          transition: all 0.3s ease;
        }
        
        .search-group:focus-within {
          box-shadow: 0 5px 15px rgba(0,0,0,0.05) !important;
        }
        
        .bg-primary-subtle {
          background-color: rgba(67, 97, 238, 0.1);
        }
        
        /* Table Styling */
        .groups-table thead th {
          font-weight: 600;
          color: #495057;
          border-bottom: 2px solid #e9ecef;
        }
        
        .group-row {
          transition: all 0.2s ease;
        }
        
        .group-row:hover {
          background-color: #f8f9fa;
        }
        
        .status-dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
        
        .btn-action {
          transition: all 0.2s ease;
          opacity: 0.8;
          background: white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.05);
        }
        
        .btn-action:hover {
          opacity: 1;
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }
        
        .member-avatars {
          display: flex;
          align-items: center;
        }
        
        .member-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 12px;
          font-weight: bold;
          border: 2px solid white;
        }
        
        .member-avatar-more {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #e9ecef;
          color: #495057;
          font-size: 10px;
          font-weight: bold;
          margin-left: -10px;
          border: 2px solid white;
        }
        
        /* Empty State */
        .empty-state {
          padding: 20px;
          text-align: center;
        }
        
        .empty-icon {
          width: 70px;
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        /* Modal Styling */
        .modal-custom {
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 15px 40px rgba(0,0,0,0.12);
        }
        
        .label-icon {
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        /* Phone Input Styling */
        .phone-input-container {
          display: flex;
          align-items: stretch;
          position: relative;
          border: 1px solid #dee2e6;
          border-radius: 8px;
          overflow: visible;
          background: white;
        }
        
        .country-code-display {
          display: flex;
          align-items: center;
          padding: 0.5rem 1rem;
          background: #f8f9fa;
          border-right: 1px solid #dee2e6;
          cursor: pointer;
          min-width: 100px;
          justify-content: center;
          user-select: none;
          transition: all 0.2s ease;
        }
        
        .country-code-display:hover {
          background: #e9ecef;
        }
        
        .country-code-flag {
          font-size: 1.2rem;
        }
        
        .phone-input-wrapper {
          display: flex;
          flex: 1;
        }
        
        .phone-input {
          border: none;
          border-radius: 0;
          padding-left: 1rem;
          height: 100%;
        }
        
        .phone-input:focus {
          box-shadow: none;
        }
        
        .phone-add-btn {
          border-radius: 0 8px 8px 0;
          padding-left: 1.5rem;
          padding-right: 1.5rem;
        }
        
        /* Country Dropdown */
        .country-dropdown-absolute {
          position: absolute;
          top: 100%;
          left: 0;
          width: 300px;
          max-height: 300px;
          background: white;
          border-radius: 12px;
          border: 1px solid #dee2e6;
          z-index: 9999;
          margin-top: 0.5rem;
          overflow: hidden;
          display: block;
          box-shadow: 0 15px 40px rgba(0,0,0,0.12);
        }
        
        .country-search-container {
          padding: 0.75rem;
          background: white;
        }
        
        .country-list-container {
          max-height: 250px;
          overflow-y: auto;
          background: white;
        }
        
        .country-list-item {
          display: flex;
          align-items: center;
          padding: 0.75rem 1rem;
          cursor: pointer;
          transition: background-color 0.15s ease;
        }
        
        .country-list-item:hover {
          background-color: #f8f9fa;
        }
        
        .country-list-item.active {
          background-color: rgba(67, 97, 238, 0.1);
          color: #4361ee;
        }
        
        /* CSV Upload */
        .custom-file-upload {
          position: relative;
          border: 2px dashed #dee2e6;
          background: #f8f9fa;
          transition: all 0.3s ease;
          border-radius: 12px;
        }
        
        .custom-file-upload:hover {
          border-color: #4361ee;
          background: #fff;
        }
        
        .csv-upload-content {
          padding: 2rem;
          text-align: center;
        }
        
        .file-upload-input {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
        }
        
        /* Numbers Container */
        .numbers-container {
          border: 1px solid #dee2e6 !important;
          border-radius: 12px !important;
          background: #fff;
        }
        
        .number-item {
          transition: all 0.2s ease;
          border-radius: 8px;
        }
        
        .number-item:hover {
          background-color: #e9ecef !important;
        }
        
        .number-avatar {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #4361ee;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: bold;
        }
        
        .number-text {
          font-size: 0.85rem;
          max-width: 120px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .empty-numbers {
          opacity: 0.7;
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .country-dropdown-absolute {
            width: 100%;
          }
          
          .header-section {
            padding: 1.5rem !important;
          }
          
          .stats-card {
            margin-top: 1rem;
          }
        }
      `}</style>
    </Container>
    </>
  );
};

export default WhatsappGroup;