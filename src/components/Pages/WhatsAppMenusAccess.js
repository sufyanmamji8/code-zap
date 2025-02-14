// import React, { useState, useEffect } from 'react';
// import {
//   Card,
//   CardBody,
//   CardHeader,
//   Form,
//   FormGroup,
//   Label,
//   Input,
//   Button,
//   Alert,
//   Spinner
// } from 'reactstrap';
// import axios from 'axios';
// import { MENU_API_ENDPOINT } from 'Api/Constant';
// import { MENU_ACCESS_API_ENDPOINT } from 'Api/Constant';

// const WhatsAppMenusAccess = () => {
//   const [formData, setFormData] = useState({
//     phoneNumber: '',
//     group: '',
//     countryCode: '',
//     menuId: ''
//   });
  
//   const [menus, setMenus] = useState([]);
//   const [alert, setAlert] = useState({ show: false, message: '', type: '' });
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchMenus = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get(`${MENU_API_ENDPOINT}/getAllMenus`);
//         console.log("Full API Response:", response);
//         console.log("Response Data:", response.data);
        
//         if (response.data && response.data.data) {
//           console.log("Before filtering:", response.data.data);
          
//           const sampleMenu = response.data.data[0];
//           console.log("Sample menu object:", sampleMenu);
          
//           const defaultMenus = response.data.data.filter(menu => {
//             console.log("Checking menu:", menu);
//             console.log("isDefault value:", menu.isDefault);
//             return menu.isDefault === true;
//           });
          
//           console.log("After filtering (default menus):", defaultMenus);
//           setMenus(defaultMenus);
//         } else {
//           console.log("No data found in response");
//           setMenus([]);
//           showAlert('No menus found', 'warning');
//         }
//       } catch (error) {
//         console.error('Error details:', error);
//         showAlert('Failed to fetch menus', 'danger');
//         setMenus([]);
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     fetchMenus();
//   }, []);

//   const showAlert = (message, type) => {
//     setAlert({ show: true, message, type });
//     setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);
//   };

//   const handleInputChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       setLoading(true);
//       if (!formData.phoneNumber && !formData.group && !formData.countryCode) {
//         showAlert('Please provide at least one identifier (Phone Number, Group, or Country Code)', 'warning');
//         return;
//       }
      
//       if (!formData.menuId) {
//         showAlert('Please select a menu', 'warning');
//         return;
//       }

//       await axios.post(`${MENU_ACCESS_API_ENDPOINT}/create-menu-access`, formData);
//       showAlert('Menu assigned successfully', 'success');
//       setFormData({
//         phoneNumber: '',
//         group: '',
//         countryCode: '',
//         menuId: ''
//       });
//     } catch (error) {
//       console.error('Error assigning menu:', error);
//       showAlert(error.response?.data?.message || 'Failed to assign menu', 'danger');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
//         <Spinner color="primary" />
//       </div>
//     );
//   }

//   return (
//     <div className="p-4">
//       <Card className="mb-4">
//         <CardHeader className="bg-primary text-white">
//           <h4 className="mb-0">Assign WhatsApp Menu Access</h4>
//         </CardHeader>
//         <CardBody>
//           {alert.show && (
//             <Alert color={alert.type} className="mb-4">
//               {alert.message}
//             </Alert>
//           )}
          
//           <Form onSubmit={handleSubmit}>
//             <FormGroup>
//               <Label for="phoneNumber">Phone Number</Label>
//               <Input
//                 type="text"
//                 name="phoneNumber"
//                 id="phoneNumber"
//                 value={formData.phoneNumber}
//                 onChange={handleInputChange}
//                 placeholder="Enter phone number"
//               />
//             </FormGroup>

//             <FormGroup>
//               <Label for="group">Group</Label>
//               <Input
//                 type="text"
//                 name="group"
//                 id="group"
//                 value={formData.group}
//                 onChange={handleInputChange}
//                 placeholder="Enter group name"
//               />
//             </FormGroup>

//             <FormGroup>
//               <Label for="countryCode">Country Code</Label>
//               <Input
//                 type="text"
//                 name="countryCode"
//                 id="countryCode"
//                 value={formData.countryCode}
//                 onChange={handleInputChange}
//                 placeholder="Enter country code"
//               />
//             </FormGroup>

            // <FormGroup>
            //   <Label for="menuId">Select Default Menu</Label>
            //   <Input
            //     type="select"
            //     name="menuId"
            //     id="menuId"
            //     value={formData.menuId}
            //     onChange={handleInputChange}
            //   >
            //     <option value="">Select a default menu...</option>
            //     {Array.isArray(menus) && menus.length > 0 ? (
            //       menus.map((menu) => {
            //         console.log("Rendering menu:", menu);
            //         return (
            //           <option key={menu._id} value={menu._id}>
            //             {menu.menuName || menu.menuTitle || 'Unnamed Menu'}
            //           </option>
            //         );
            //       })
            //     ) : (
            //       <option value="" disabled>No default menus available</option>
            //     )}
            //   </Input>
            // </FormGroup>

//             <Button color="primary" type="submit" disabled={loading}>
//               {loading ? <Spinner size="sm" /> : 'Assign Menu'}
//             </Button>
//           </Form>
//         </CardBody>
//       </Card>
//     </div>
//   );
// };

// export default WhatsAppMenusAccess;










import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
  Alert,
  ListGroup,
  ListGroupItem
} from 'reactstrap';
import { GROUP_ENDPOINTS } from 'Api/Constant';
import { MENU_ENDPOINTS } from 'Api/Constant';

const WhatsAppMenusAccess = () => {
  const [groups, setGroups] = useState([]);
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    menuId: '',
    allowedPhoneNumbers: ['']
  });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchGroups();
    fetchMenus();
  }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const response = await axios.get(GROUP_ENDPOINTS.GET_ALL);
      console.log('Groups response:', response.data); // For debugging
      setGroups(response.data.groups || []);
    } catch (err) {
      console.error('Error fetching groups:', err);
      setError('Failed to fetch groups');
    } finally {
      setLoading(false);
    }
  };

  const fetchMenus = async () => {
    try {
      const response = await axios.get(MENU_ENDPOINTS.GET_ALL);
      if (response.data && response.data.data) {
        // Filter menus to only include default menus
        const defaultMenus = response.data.data.filter(menu => menu.isDefault === true);
        setMenus(defaultMenus);
        console.log('Fetched default menus:', defaultMenus);
      }
    } catch (err) {
      console.error('Error fetching menus:', err);
    }
  };

  React.useEffect(() => {
    fetchMenus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editMode) {
        await axios.put(GROUP_ENDPOINTS.UPDATE(editId), formData);
        setSuccess('Group updated successfully');
      } else {
        await axios.post(GROUP_ENDPOINTS.CREATE, formData);
        setSuccess('Group created successfully');
      }
      resetForm();
      fetchGroups();
    } catch (err) {
      console.error('Operation error:', err);
      setError(err.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this group?')) {
      try {
        setLoading(true);
        await axios.delete(GROUP_ENDPOINTS.DELETE(id));
        setSuccess('Group deleted successfully');
        fetchGroups();
      } catch (err) {
        console.error('Delete error:', err);
        setError('Failed to delete group');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEdit = (group) => {
    setEditMode(true);
    setEditId(group._id);
    setFormData({
      name: group.name,
      menuId: group.menuId,
      allowedPhoneNumbers: group.allowedPhoneNumbers
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      menuId: '',
      allowedPhoneNumbers: ['']
    });
    setEditMode(false);
    setEditId(null);
    setError('');
    setSuccess('');
  };

  const addPhoneNumber = () => {
    setFormData({
      ...formData,
      allowedPhoneNumbers: [...formData.allowedPhoneNumbers, '']
    });
  };

  const removePhoneNumber = (index) => {
    const newNumbers = formData.allowedPhoneNumbers.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      allowedPhoneNumbers: newNumbers
    });
  };

  const handlePhoneNumberChange = (index, value) => {
    const newNumbers = [...formData.allowedPhoneNumbers];
    newNumbers[index] = value;
    setFormData({
      ...formData,
      allowedPhoneNumbers: newNumbers
    });
  };

  return (
    <Container fluid className="mt-4">
      <Row>
        <Col md={12} lg={5}>
          <Card>
            <CardHeader>
              <h4 className="mb-0">{editMode ? 'Edit Group' : 'Create New Group'}</h4>
            </CardHeader>
            <CardBody>
              {(error || success) && (
                <Alert color={error ? 'danger' : 'success'} className="mb-4">
                  {error || success}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label for="name">Group Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter group name"
                    required
                  />
                </FormGroup>

                <FormGroup>
      <Label for="menuId">Select Menu</Label>
      <Input
        type="select"
        id="menuId"
        value={formData.menuId}
        onChange={(e) => setFormData({ ...formData, menuId: e.target.value })}
        required
      >
        <option value="">Choose menu...</option>
        {menus && menus.map(menu => (
          <option key={menu._id} value={menu._id}>
            {menu.menuTitle || menu.menuName || 'Unnamed Menu'}
          </option>
        ))}
      </Input>
    </FormGroup>

                <FormGroup>
                  <Label>Phone Numbers</Label>
                  {formData.allowedPhoneNumbers.map((number, index) => (
                    <div key={index} className="d-flex mb-2">
                      <Input
                        value={number}
                        onChange={(e) => handlePhoneNumberChange(index, e.target.value)}
                        placeholder="Enter phone number"
                        className="me-2"
                        required
                      />
                      {formData.allowedPhoneNumbers.length > 1 && (
                        <Button
                          color="danger"
                          outline
                          type="button"
                          onClick={() => removePhoneNumber(index)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    color="secondary"
                    outline
                    type="button"
                    onClick={addPhoneNumber}
                    className="mt-2"
                  >
                    Add Phone Number
                  </Button>
                </FormGroup>

                <div className="mt-4">
                  <Button 
                    color="primary" 
                    type="submit" 
                    className="me-2"
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : editMode ? 'Update Group' : 'Create Group'}
                  </Button>
                  {editMode && (
                    <Button 
                      color="secondary" 
                      onClick={resetForm}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </Form>
            </CardBody>
          </Card>
        </Col>

        <Col md={12} lg={7}>
          <Card>
            <CardHeader>
              <h4 className="mb-0">Groups List</h4>
            </CardHeader>
            <CardBody>
              {loading && <Alert color="info">Loading...</Alert>}
              
              <ListGroup>
                {groups.map(group => (
                  <ListGroupItem key={group._id} className="mb-2">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h5 className="mb-1">{group.name}</h5>
                        <p className="mb-1 text-muted">
                          Menu: {group.menuId?.name || 'Not assigned'}
                        </p>
                        <small>Phone Numbers:</small>
                        <ul className="mb-0">
                          {group.allowedPhoneNumbers.map((number, index) => (
                            <li key={index}>{number}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <Button
                          color="primary"
                          outline
                          size="sm"
                          className="me-2"
                          onClick={() => handleEdit(group)}
                          disabled={loading}
                        >
                          Edit
                        </Button>
                        <Button
                          color="danger"
                          outline
                          size="sm"
                          onClick={() => handleDelete(group._id)}
                          disabled={loading}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </ListGroupItem>
                ))}
                {!loading && groups.length === 0 && (
                  <Alert color="info">No groups found</Alert>
                )}
              </ListGroup>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default WhatsAppMenusAccess;