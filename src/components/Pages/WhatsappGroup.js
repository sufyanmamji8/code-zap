import React, { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, CardBody,
  Button, Form, FormGroup, Label, Input, Table,
  Modal, ModalHeader, ModalBody, ModalFooter,
  InputGroup, InputGroupText, Badge
} from 'reactstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { countryList } from '../Pages/countryList';
import { Plus, Edit2, Trash2, Upload, Users, Search, Phone, FileText, ChevronDown, UserPlus } from 'lucide-react';
import { GROUP_ENDPOINTS } from 'Api/Constant';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const WhatsappGroup = () => {
  const navigate = useNavigate();
  const pakistanCountry = countryList.find(country => country.country === 'Pakistan') || countryList[0];
  
  const [groups, setGroups] = useState([]);
  const [modal, setModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentGroupId, setCurrentGroupId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [countryDropdown, setCountryDropdown] = useState(false);
  const [searchCountry, setSearchCountry] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(pakistanCountry);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    groupName: '',
    countryCode: pakistanCountry.code,
    phoneNumber: '',
    numbers: []
  });

  // Your existing useEffect and functions remain the same...
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('No token found, please login again.');
      navigate('/login');
      return;
    }
    
    fetchGroups();
  }, [navigate]);

  const fetchGroups = async () => {
    setLoading(true);
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
      
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

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
        
        const processedNumbers = csvData.map(number => {
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
    setLoading(true);
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
        const formDataObj = new FormData();
        formDataObj.append('name', formData.groupName);
        
        if (formData.numbers.length > 0) {
          const csvHeader = "phoneNumber\n";
          const csvRows = formData.numbers.map(number => number).join("\n");
          const csvContent = csvHeader + csvRows;
          
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
      
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (groupId) => {
    setLoading(true);
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
        setSelectedCountry(pakistanCountry);
      }
    } catch (error) {
      console.error('Error setting up edit mode:', error);
      toast.error('An error occurred while editing the group');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (groupId) => {
    setLoading(true);
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
      
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && (
        <div className="loading-overlay">
          <DotLottieReact
            src="https://lottie.host/5060de43-85ac-474a-a85b-892f9730e17a/b3jJ1vGkWh.lottie"
            loop
            autoplay
            className="loading-animation"
          />
        </div>
      )}
      
      <Container fluid className="whatsapp-groups-container" style={{ paddingTop: '90px' }}>
        {/* Header Section with Gradient */}
   {/* Header Section with Gradient and Spacing */}
<div className="header-section" style={{ marginTop: '30px',marginLeft:'0px' }}>
  <Row className="align-items-center justify-content-between">
    <Col xs="12" md="8">
      <div className="header-content">
        <div className="header-icon">
          <Users size={28} />
        </div>
        <div>
          <h1 className="header-title">WhatsApp Groups</h1>
          <p className="header-subtitle">Create and manage your WhatsApp groups efficiently</p>
        </div>
      </div>
    </Col>
    <Col xs="12" md="4" className="text-md-end mt-3 mt-md-0">
      <Button className="create-group-btn" onClick={toggle}>
        <Plus size={20} className="me-2" />
        Create New Group
      </Button>
    </Col>
  </Row>
</div>

        {/* Rest of the content with white background */}
        <div className="content-section">
          {/* Stats Cards */}
          <Row className="stats-row">
            <Col md="3" className="mb-4">
              <Card className="stat-card">
                <CardBody>
                  <div className="stat-content">
                    <div className="stat-icon-wrapper" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
                      <Users size={20} color="#3B82F6" />
                    </div>
                    <div className="stat-details">
                      <h3 className="stat-number">{groups.length}</h3>
                      <p className="stat-label">Total Groups</p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
            
            <Col md="3" className="mb-4">
              <Card className="stat-card">
                <CardBody>
                  <div className="stat-content">
                    <div className="stat-icon-wrapper" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                      <UserPlus size={20} color="#10B981" />
                    </div>
                    <div className="stat-details">
                      <h3 className="stat-number">
                        {groups.reduce((acc, group) => acc + (group.allowedPhoneNumbers?.length || 0), 0)}
                      </h3>
                      <p className="stat-label">Total Members</p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          {/* Search and Filter Section */}
          <Card className="search-filter-card">
            <CardBody>
              <Row className="align-items-center">
                <Col md="6" className="mb-3 mb-md-0">
                  <div className="search-container">
                    <Search size={20} className="search-icon" />
                    <Input
                      type="text"
                      placeholder="Search groups by name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="search-input"
                    />
                  </div>
                </Col>
                <Col md="6" className="text-md-end">
                  <div className="filter-actions">
                    <Badge color="light" className="filter-badge">
                      {filteredGroups.length} groups found
                    </Badge>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>

          {/* Groups Table */}
          <Card className="groups-table-card">
            <CardBody className="p-0">
              <div className="table-container">
                <table className="modern-table">
                  <thead>
                    <tr>
                      <th className="column-index">#</th>
                      <th className="column-group">Group Information</th>
                      <th className="column-members">Members</th>
                      <th className="column-actions">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredGroups.length > 0 ? (
                      filteredGroups.map((group, index) => (
                        <tr key={group._id} className="table-row">
                          <td className="column-index">
                            <div className="index-badge">{index + 1}</div>
                          </td>
                          <td className="column-group">
                            <div className="group-info">
                              <div className="group-avatar">
                                <Users size={20} />
                              </div>
                              <div className="group-details">
                                <h6 className="group-name">{group.name}</h6>
                                <span className="group-id">ID: {group._id?.substring(0, 8)}...</span>
                              </div>
                            </div>
                          </td>
                          <td className="column-members">
                            <div className="members-count">
                              <UserPlus size={16} className="me-2" />
                              <span>{group.allowedPhoneNumbers?.length || 0} members</span>
                            </div>
                          </td>
                          <td className="column-actions">
                            <div className="action-buttons">
                              <Button 
                                className="btn-edit"
                                onClick={() => handleEdit(group._id)}
                              >
                                <Edit2 size={16} />
                              </Button>
                              <Button 
                                className="btn-delete"
                                onClick={() => handleDelete(group._id)}
                              >
                                <Trash2 size={16} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="empty-state">
                          <div className="empty-content">
                            <Users size={48} className="empty-icon" />
                            <h5>No groups found</h5>
                            <p className="text-muted">Try creating a new group or adjusting your search</p>
                            <Button className="create-group-btn outline" onClick={toggle}>
                              <Plus size={16} className="me-2" />
                              Create Your First Group
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Create/Edit Group Modal */}
        <Modal 
          isOpen={modal} 
          toggle={toggle} 
          className="modern-modal"
          size="lg"
        >
          <Form onSubmit={handleSubmit}>
            <ModalHeader toggle={toggle} className="modal-header-custom">
              <div className="modal-title-content">
                {editMode ? <Edit2 size={24} /> : <Plus size={24} />}
                <div>
                  <h4>{editMode ? 'Edit Group' : 'Create New Group'}</h4>
                  <p>{editMode ? 'Update group details' : 'Add a new WhatsApp group'}</p>
                </div>
              </div>
            </ModalHeader>
            <ModalBody className="modal-body-custom">
              <FormGroup className="form-group-custom">
                <Label className="form-label">Group Name</Label>
                <Input
                  type="text"
                  name="groupName"
                  value={formData.groupName}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                  placeholder="Enter group name"
                />
              </FormGroup>

              <FormGroup className="form-group-custom">
                <Label className="form-label">Add Phone Number</Label>
                <div className="phone-input-group">
                  <div 
                    className="country-selector"
                    onClick={() => setCountryDropdown(!countryDropdown)}
                  >
                    <span className="country-flag">{selectedCountry.flag}</span>
                    <span className="country-code">+{selectedCountry.code}</span>
                    <ChevronDown size={16} />
                  </div>
                  <Input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="phone-input"
                    placeholder="Enter phone number"
                  />
                  <Button className="add-number-btn" onClick={handleAddNumber}>
                    <Plus size={16} />
                  </Button>
                </div>

                {countryDropdown && (
                  <div className="country-dropdown">
                    <div className="country-search">
                      <Search size={16} />
                      <Input
                        placeholder="Search country..."
                        value={searchCountry}
                        onChange={(e) => setSearchCountry(e.target.value)}
                        className="border-0"
                      />
                    </div>
                    <div className="country-list">
                      {filteredCountries.map((country) => (
                        <div 
                          key={country.code}
                          className={`country-item ${selectedCountry.code === country.code ? 'active' : ''}`}
                          onClick={() => handleCountrySelect(country)}
                        >
                          <span className="country-flag">{country.flag}</span>
                          <span className="country-name">{country.country}</span>
                          <span className="country-code">+{country.code}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </FormGroup>

              <FormGroup className="form-group-custom">
                <Label className="form-label">Import from CSV</Label>
                <div className="csv-upload-area">
                  <Upload size={24} />
                  <p>Drop your CSV file here or click to browse</p>
                  <Input
                    type="file"
                    accept=".csv"
                    onChange={handleCSVImport}
                    className="file-input"
                  />
                </div>
              </FormGroup>

              <FormGroup className="form-group-custom">
                <Label className="form-label">
                  Added Numbers <Badge color="primary" className="ms-2">{formData.numbers.length}</Badge>
                </Label>
                <div className="numbers-list">
                  {formData.numbers.length === 0 ? (
                    <div className="empty-numbers">
                      <Phone size={32} />
                      <p>No numbers added yet</p>
                    </div>
                  ) : (
                    <div className="numbers-grid">
                      {formData.numbers.map((number, index) => (
                        <div key={index} className="number-item">
                          <span className="number-text">{number}</span>
                          <Button
                            color="link"
                            className="remove-number"
                            onClick={() => handleRemoveNumber(index)}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </FormGroup>
            </ModalBody>
            <ModalFooter className="modal-footer-custom">
              <Button className="btn-cancel" onClick={toggle}>
                Cancel
              </Button>
              <Button className="btn-submit" type="submit">
                {editMode ? 'Update Group' : 'Create Group'}
              </Button>
            </ModalFooter>
          </Form>
        </Modal>
      </Container>

      <style jsx>{`
        .whatsapp-groups-container {
          padding: 0 2rem 2rem 2rem;
          background: #f8fafc;
          min-height: 100vh;
        }

        /* Header Section with Gradient */
        .header-section {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 2rem;
          border-radius: 16px;
          margin: 0 -2rem 2rem -2rem;
        }

        .header-content {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .header-icon {
          background: rgba(255, 255, 255, 0.2);
          padding: 12px;
          border-radius: 12px;
          backdrop-filter: blur(10px);
        }

        .header-title {
          font-size: 2rem;
          font-weight: 700;
          margin: 0;
          color: white;
        }

        .header-subtitle {
          opacity: 0.9;
          margin: 0.5rem 0 0 0;
          font-size: 1.1rem;
        }

        .create-group-btn {
          background: rgba(255, 255, 255, 0.2);
          border: 2px solid rgba(255, 255, 255, 0.3);
          color: white;
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 600;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
          
        }

        .create-group-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(255, 255, 255, 0.2);
        }

        .create-group-btn.outline {
          background: transparent;
          border: 2px solid #3B82F6;
          color: #3B82F6;
        }

        .create-group-btn.outline:hover {
          background: #3B82F6;
          color: white;
        }

        /* Content Section with White Background */
        .content-section {
          background: #f8fafc;
        }

        /* Loading Overlay */
        .loading-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(255, 255, 255, 0.9);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
        }

        .loading-animation {
          width: 150px;
          height: 150px;
        }

        /* Rest of your existing CSS styles remain the same */
        .stats-row {
          margin-bottom: 2rem;
        }

        .stat-card {
          border: none;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          height: 100%;
        }

        .stat-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }

        .stat-content {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
        }

        .stat-icon-wrapper {
          padding: 12px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-details {
          flex: 1;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
          line-height: 1;
        }

        .stat-label {
          font-size: 0.9rem;
          color: #64748b;
          margin: 0.25rem 0;
          font-weight: 500;
        }

        /* Search Card */
        .search-filter-card {
          border: none;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .search-container {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          color: #64748b;
          z-index: 2;
        }

        .search-input {
          padding-left: 3rem;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          height: 50px;
          font-size: 1rem;
        }

        .search-input:focus {
          border-color: #3B82F6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .filter-badge {
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: 600;
          background: #f1f5f9;
          color: #475569;
        }

        /* Modern Table */
        .groups-table-card {
          border: none;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .table-container {
          overflow-x: auto;
        }

        .modern-table {
          width: 100%;
          border-collapse: collapse;
        }

        .modern-table thead {
          background: #f8fafc;
        }

        .modern-table th {
          padding: 1.25rem 1rem;
          font-weight: 600;
          color: #475569;
          text-align: left;
          border-bottom: 2px solid #e2e8f0;
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .table-row {
          transition: all 0.2s ease;
          border-bottom: 1px solid #f1f5f9;
        }

        .table-row:hover {
          background: #f8fafc;
        }

        .table-row td {
          padding: 1.25rem 1rem;
        }

        .index-badge {
          background: #f1f5f9;
          color: #475569;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.875rem;
        }

        .group-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .group-avatar {
          background: #3B82F6;
          color: white;
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .group-name {
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 0.25rem 0;
        }

        .group-id {
          font-size: 0.75rem;
          color: #64748b;
        }

        .members-count {
          display: flex;
          align-items: center;
          color: #475569;
          font-weight: 500;
          font-size: 0.875rem;
        }

        .action-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .btn-edit, .btn-delete {
          padding: 8px 12px;
          border-radius: 8px;
          border: none;
          transition: all 0.2s ease;
        }

        .btn-edit {
          background: #e0f2fe;
          color: #0369a1;
        }

        .btn-edit:hover {
          background: #bae6fd;
        }

        .btn-delete {
          background: #fecaca;
          color: #dc2626;
        }

        .btn-delete:hover {
          background: #fca5a5;
        }

        /* Empty State */
        .empty-state {
          padding: 4rem 2rem;
          text-align: center;
        }

        .empty-content {
          max-width: 400px;
          margin: 0 auto;
        }

        .empty-icon {
          color: #cbd5e1;
          margin-bottom: 1rem;
        }

        /* Modal Styles */
        .modern-modal :global(.modal-content) {
          border: none;
          border-radius: 16px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .modal-header-custom {
          background: #f8fafc;
          border: none;
          padding: 1.5rem 2rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .modal-title-content {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .modal-title-content h4 {
          margin: 0;
          font-weight: 600;
          color: #1e293b;
        }

        .modal-title-content p {
          margin: 0.25rem 0 0 0;
          color: #64748b;
          font-size: 0.9rem;
        }

        .modal-body-custom {
          padding: 2rem;
        }

        .form-group-custom {
          margin-bottom: 1.5rem;
          position: relative;
        }

        .form-label {
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5rem;
          display: block;
          font-size: 0.875rem;
        }

        .form-input {
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 12px 16px;
          font-size: 1rem;
          transition: all 0.2s ease;
        }

        .form-input:focus {
          border-color: #3B82F6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .phone-input-group {
          display: flex;
          gap: 0.5rem;
          align-items: stretch;
        }

        .country-selector {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0 1rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          cursor: pointer;
          min-width: 120px;
          transition: all 0.2s ease;
        }

        .country-selector:hover {
          border-color: #3B82F6;
        }

        .phone-input {
          flex: 1;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 12px 16px;
        }

        .add-number-btn {
          background: #10b981;
          border: none;
          border-radius: 8px;
          padding: 0 1rem;
          color: white;
          transition: all 0.2s ease;
        }

        .add-number-btn:hover {
          background: #059669;
        }

        .country-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          margin-top: 0.5rem;
          z-index: 1000;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .country-search {
          padding: 1rem;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .country-list {
          max-height: 200px;
          overflow-y: auto;
        }

        .country-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem 1rem;
          cursor: pointer;
          transition: all 0.2s ease;
          border-bottom: 1px solid #f1f5f9;
        }

        .country-item:hover {
          background: #f8fafc;
        }

        .country-item.active {
          background: #e0f2fe;
        }

        .country-name {
          flex: 1;
          font-size: 0.875rem;
        }

        .country-code {
          color: #64748b;
          font-size: 0.75rem;
        }

        .csv-upload-area {
          border: 2px dashed #cbd5e1;
          border-radius: 8px;
          padding: 2rem;
          text-align: center;
          transition: all 0.2s ease;
          position: relative;
          cursor: pointer;
        }

        .csv-upload-area:hover {
          border-color: #3B82F6;
          background: #f8fafc;
        }

        .file-input {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
        }

        .numbers-list {
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 1rem;
          max-height: 200px;
          overflow-y: auto;
        }

        .empty-numbers {
          text-align: center;
          padding: 2rem;
          color: #64748b;
        }

        .numbers-grid {
          display: grid;
          gap: 0.5rem;
        }

        .number-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 1rem;
          background: #f8fafc;
          border-radius: 6px;
          transition: all 0.2s ease;
        }

        .number-item:hover {
          background: #e2e8f0;
        }

        .number-text {
          font-size: 0.875rem;
          font-family: monospace;
        }

        .remove-number {
          color: #ef4444;
          padding: 4px;
        }

        .modal-footer-custom {
          border: none;
          padding: 1.5rem 2rem;
          background: #f8fafc;
          border-top: 1px solid #e2e8f0;
        }

        .btn-cancel {
          background: #64748b;
          border: none;
          border-radius: 8px;
          padding: 10px 20px;
          color: white;
          transition: all 0.2s ease;
        }

        .btn-cancel:hover {
          background: #475569;
        }

        .btn-submit {
          background: #3B82F6;
          border: none;
          border-radius: 8px;
          padding: 10px 20px;
          color: white;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .btn-submit:hover {
          background: #2563eb;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .whatsapp-groups-container {
            padding: 0 1rem 1rem 1rem;
          }

          .header-section {
            padding: 1.5rem;
            margin: 0 -1rem 1.5rem -1rem;
          }

          .header-content {
            flex-direction: column;
            text-align: center;
            gap: 1rem;
          }

          .header-title {
            font-size: 1.5rem;
          }

          .phone-input-group {
            flex-direction: column;
          }

          .country-selector {
            min-width: auto;
            justify-content: center;
          }

          .action-buttons {
            flex-direction: column;
          }

          .stat-content {
            flex-direction: column;
            text-align: center;
            gap: 0.75rem;
          }

          .stat-icon-wrapper {
            align-self: center;
          }
        }
      `}</style>
    </>
  );
};

export default WhatsappGroup;