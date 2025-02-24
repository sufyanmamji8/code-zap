import React, { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, CardBody,
  Button, Form, FormGroup, Label, Input, Table,
  Modal, ModalHeader, ModalBody, ModalFooter,
  InputGroup, InputGroupText, Badge,
  Dropdown, DropdownToggle, DropdownMenu, DropdownItem
} from 'reactstrap';
import axios from 'axios';
import { countryList } from '../Pages/countryList';
import { Plus, Edit2, Trash2, Upload, Users, Search, Phone, FileText, ChevronDown } from 'lucide-react';
import { GROUP_ENDPOINTS } from 'Api/Constant';

const WhatsappGroup = () => {
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
  const [formData, setFormData] = useState({
    groupName: '',
    countryCode: pakistanCountry.code,
    phoneNumber: '',
    numbers: []
  });

  useEffect(() => {
    fetchGroups();
  }, []);

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
    try {
      if (editMode) {
        const response = await axios.put(
          GROUP_ENDPOINTS.UPDATE(currentGroupId),
          {
            name: formData.groupName,
            allowedPhoneNumbers: formData.numbers
          }
        );
        if (response.data.success) {
          await fetchGroups();
          toggle();
        }
      } else {
        // Create new group
        const formDataObj = new FormData();
        formDataObj.append('name', formData.groupName);
        
       // With this:
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
              'Content-Type': 'multipart/form-data'
            }
          }
        );

        if (response.data.success) {
          await fetchGroups();
          toggle();
        }
      }
    } catch (error) {
      console.error('Error submitting group:', error);
    }
  };

  const handleEdit = async (groupId) => {
    try {
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
    }
  };

  const handleDelete = async (groupId) => {
    try {
      const response = await axios.delete(GROUP_ENDPOINTS.DELETE(groupId));
      if (response.data.success) {
        await fetchGroups();
      }
    } catch (error) {
      console.error('Error deleting group:', error);
    }
  };

  return (
    <Container fluid className="p-4 bg-light min-vh-100">
      <Row className="mb-4">
        <Col md="6">
          <h2 className="text-primary mb-0">
            <Users className="me-2" size={28} />
            WhatsApp Groups Management
          </h2>
        </Col>
        <Col md="6" className="d-flex justify-content-end align-items-center">
          <Button 
            color="success" 
            className="d-flex align-items-center shadow-sm" 
            onClick={toggle}
          >
            <Plus size={20} className="me-2" />
            Create New Group
          </Button>
        </Col>
      </Row>

      <Card className="shadow-sm border-0 mb-4">
        <CardBody className="p-0">
          <Row className="p-4 align-items-center border-bottom">
            <Col md="6">
              <InputGroup className="search-group">
                <InputGroupText className="bg-white border-end-0">
                  <Search size={18} className="text-muted" />
                </InputGroupText>
                <Input
                  placeholder="Search groups..."
                  className="border-start-0 ps-0"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md="6" className="text-end">
              <Badge color="primary" className="me-2 p-2">
                Total Groups: {groups.length}
              </Badge>
            </Col>
          </Row>
          
          <Table hover borderless className="align-middle mb-0">
            <thead className="bg-light">
              <tr>
                <th className="ps-4">#</th>
                <th>Group Name</th>
                <th>Members</th>
                <th className="text-end pe-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredGroups.map((group, index) => (
                <tr key={group._id}>
                  <td className="ps-4">{index + 1}</td>
                  <td>
                    <div className="d-flex align-items-center">
                      <div className="group-icon me-3 bg-primary text-white rounded-circle p-2">
                        <Users size={20} />
                      </div>
                      <div>
                        <h6 className="mb-0">{group.name}</h6>
                        <small className="text-muted">Created today</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <Badge color="info" pill className="px-3 py-2">
                      {group.allowedPhoneNumbers?.length || 0} members
                    </Badge>
                  </td>
                  <td className="text-end pe-4">
                    <Button 
                      color="light"
                      className="me-2 btn-icon"
                      onClick={() => handleEdit(group._id)}
                    >
                      <Edit2 size={16} />
                    </Button>
                    <Button 
                      color="light" 
                      className="btn-icon text-danger"
                      onClick={() => handleDelete(group._id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </CardBody>
      </Card>

      <Modal 
        isOpen={modal} 
        toggle={toggle} 
        size="lg" 
        className="modal-dialog-centered"
        style={{ maxWidth: '700px' }}
      >
        <Form onSubmit={handleSubmit} className="modal-custom">
          <ModalHeader toggle={toggle} className="bg-light border-bottom-0 p-4">
            <div className="d-flex align-items-center">
              {editMode ? (
                <Edit2 size={24} className="me-2 text-primary" />
              ) : (
                <Plus size={24} className="me-2 text-primary" />
              )}
              <h4 className="mb-0">
                {editMode ? 'Edit Group' : 'Create New Group'}
              </h4>
            </div>
          </ModalHeader>
          <ModalBody className="p-4">
            <FormGroup className="mb-4">
              <Label for="groupName" className="fw-bold mb-2">
                Group Name
              </Label>
              <Input
                type="text"
                name="groupName"
                id="groupName"
                value={formData.groupName}
                onChange={handleInputChange}
                required
                className="form-control-lg border-2"
                placeholder="Enter your group name"
              />
            </FormGroup>
            
            <FormGroup className="mb-4">
              <Label className="fw-bold mb-2 d-flex align-items-center">
                <Phone size={18} className="me-2" />
                Phone Number
              </Label>
              <div className="phone-input-container">
                <div className="country-code-display" onClick={() => setCountryDropdown(!countryDropdown)}>
                  <span className="country-code-flag me-1">{selectedCountry.flag}</span>
                  <span className="country-code-text">
                    {selectedCountry.code.length <= 2 ? `${selectedCountry.code.substring(0, 2)}` : `${selectedCountry.code.substring(0, 2)}..`}
                  </span>
                  <ChevronDown size={16} className="ms-1" />
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
                    Add
                  </Button>
                </div>
                
                {/* Improved Country Dropdown with better CSS and z-index */}
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

            <FormGroup className="mb-4">
              <Label className="fw-bold mb-2 d-flex align-items-center">
                <FileText size={18} className="me-2" />
                Import Numbers (CSV)
              </Label>
              <div className="custom-file-upload border-2 rounded-3">
                <Input
                  type="file"
                  accept=".csv"
                  onChange={handleCSVImport}
                  className="form-control-lg"
                />
              </div>
            </FormGroup>

            <FormGroup>
              <Label className="fw-bold mb-2">Added Numbers</Label>
              <div className="border-2 rounded-3 p-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {formData.numbers.length === 0 ? (
                  <div className="text-center text-muted py-4">
                    <Phone size={24} className="mb-2" />
                    <p className="mb-0">No numbers added yet</p>
                  </div>
                ) : (
                  formData.numbers.map((number, index) => (
                    <div key={index} className="d-flex justify-content-between align-items-center p-2 mb-2 bg-light rounded">
                      <div className="d-flex align-items-center">
                        <Phone size={16} className="me-2 text-primary" />
                        <span>{number}</span>
                      </div>
                      <Button
                        color="danger"
                        size="sm"
                        className="btn-icon"
                        onClick={() => handleRemoveNumber(index)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </FormGroup>
          </ModalBody>
          <ModalFooter className="bg-light border-top-0 p-4">
            <Button color="light" onClick={toggle} className="px-4">
              Cancel
            </Button>
            <Button color="primary" type="submit" className="px-4">
              {editMode ? 'Update Group' : 'Create Group'}
            </Button>
          </ModalFooter>
        </Form>
      </Modal>

      <style jsx>{`
        .modal-custom {
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        .modal-custom .form-control,
        .modal-custom .form-select {
          border-color: #dee2e6;
          transition: all 0.2s;
        }
        .modal-custom .form-control:focus,
        .modal-custom .form-select:focus {
          border-color: #80bdff;
          box-shadow: 0 0 0 0.2rem rgba(0,123,255,.1);
        }
        .phone-input-container {
          display: flex;
          align-items: stretch;
          position: relative;
          border: 2px solid #dee2e6;
          border-radius: 0.375rem;
          overflow: visible;  /* Changed from hidden to visible */
        }
        .country-code-display {
          display: flex;
          align-items: center;
          padding: 0.5rem 1rem;
          background: #f8f9fa;
          border-right: 2px solid #dee2e6;
          cursor: pointer;
          min-width: 100px;
          justify-content: center;
          user-select: none;
        }
        .country-code-flag {
          font-size: 1.2rem;
        }
        .country-code-text {
          font-weight: 500;
          margin-left: 0.5rem;
          margin-right: 0.5rem;
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
          border-radius: 0;
          padding-left: 1.5rem;
          padding-right: 1.5rem;
        }
        .country-dropdown-absolute {
          position: absolute;
          top: 100%;
          left: 0;
          width: 300px;
          max-height: 300px;
          background: white;
          border-radius: 0.5rem;
          border: 1px solid #dee2e6;
          z-index: 9999;  /* Increased z-index */
          margin-top: 0.25rem;
          overflow: visible;  /* Added */
          display: block;  /* Added */
        }
        .country-search-container {
          padding: 0.5rem;
          background: white;
        }
        .country-list-container {
          max-height: 250px;
          overflow-y: auto;
          background: white;  /* Added */
        }
        .country-list-item {
          display: flex;
          align-items: center;
          padding: 0.5rem 1rem;
          cursor: pointer;
          transition: background-color 0.15s ease;
        }
        .country-list-item:hover {
          background-color: #f8f9fa;
        }
        .country-list-item.active {
          background-color: #e9f0ff;
          color: #0d6efd;
        }
        .country-name {
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .country-code {
          margin-left: auto;
          color: #6c757d;
        }
        .btn-icon {
          width: 32px;
          height: 32px;
          padding: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
        }
        .custom-file-upload {
          position: relative;
          overflow: hidden;
          border: 2px dashed #dee2e6;
          background: #f8f9fa;
          transition: all 0.2s;
        }
        .custom-file-upload:hover {
          border-color: #80bdff;
          background: #fff;
        }
        .border-2 {
          border-width: 2px !important;
        }
        .sticky-top {
          position: sticky;
          top: 0;
          z-index: 1020;
        }
      `}</style>
    </Container>
  );
};

export default WhatsappGroup;