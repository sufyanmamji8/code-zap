// // import React, { useState, useEffect } from 'react';
// // import {
// //   Card,
// //   CardBody,
// //   CardHeader,
// //   Form,
// //   FormGroup,
// //   Label,
// //   Input,
// //   Button,
// //   Alert,
// //   Spinner
// // } from 'reactstrap';
// // import axios from 'axios';
// // import { MENU_API_ENDPOINT } from 'Api/Constant';
// // import { MENU_ACCESS_API_ENDPOINT } from 'Api/Constant';

// // const WhatsAppMenusAccess = () => {
// //   const [formData, setFormData] = useState({
// //     phoneNumber: '',
// //     group: '',
// //     countryCode: '',
// //     menuId: ''
// //   });
  
// //   const [menus, setMenus] = useState([]);
// //   const [alert, setAlert] = useState({ show: false, message: '', type: '' });
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     const fetchMenus = async () => {
// //       try {
// //         setLoading(true);
// //         const response = await axios.get(`${MENU_API_ENDPOINT}/getAllMenus`);
// //         console.log("Full API Response:", response);
// //         console.log("Response Data:", response.data);
        
// //         if (response.data && response.data.data) {
// //           console.log("Before filtering:", response.data.data);
          
// //           const sampleMenu = response.data.data[0];
// //           console.log("Sample menu object:", sampleMenu);
          
// //           const defaultMenus = response.data.data.filter(menu => {
// //             console.log("Checking menu:", menu);
// //             console.log("isDefault value:", menu.isDefault);
// //             return menu.isDefault === true;
// //           });
          
// //           console.log("After filtering (default menus):", defaultMenus);
// //           setMenus(defaultMenus);
// //         } else {
// //           console.log("No data found in response");
// //           setMenus([]);
// //           showAlert('No menus found', 'warning');
// //         }
// //       } catch (error) {
// //         console.error('Error details:', error);
// //         showAlert('Failed to fetch menus', 'danger');
// //         setMenus([]);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };
    
// //     fetchMenus();
// //   }, []);

// //   const showAlert = (message, type) => {
// //     setAlert({ show: true, message, type });
// //     setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);
// //   };

// //   const handleInputChange = (e) => {
// //     setFormData({ ...formData, [e.target.name]: e.target.value });
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     try {
// //       setLoading(true);
// //       if (!formData.phoneNumber && !formData.group && !formData.countryCode) {
// //         showAlert('Please provide at least one identifier (Phone Number, Group, or Country Code)', 'warning');
// //         return;
// //       }
      
// //       if (!formData.menuId) {
// //         showAlert('Please select a menu', 'warning');
// //         return;
// //       }

// //       await axios.post(`${MENU_ACCESS_API_ENDPOINT}/create-menu-access`, formData);
// //       showAlert('Menu assigned successfully', 'success');
// //       setFormData({
// //         phoneNumber: '',
// //         group: '',
// //         countryCode: '',
// //         menuId: ''
// //       });
// //     } catch (error) {
// //       console.error('Error assigning menu:', error);
// //       showAlert(error.response?.data?.message || 'Failed to assign menu', 'danger');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   if (loading) {
// //     return (
// //       <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
// //         <Spinner color="primary" />
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="p-4">
// //       <Card className="mb-4">
// //         <CardHeader className="bg-primary text-white">
// //           <h4 className="mb-0">Assign WhatsApp Menu Access</h4>
// //         </CardHeader>
// //         <CardBody>
// //           {alert.show && (
// //             <Alert color={alert.type} className="mb-4">
// //               {alert.message}
// //             </Alert>
// //           )}
          
// //           <Form onSubmit={handleSubmit}>
// //             <FormGroup>
// //               <Label for="phoneNumber">Phone Number</Label>
// //               <Input
// //                 type="text"
// //                 name="phoneNumber"
// //                 id="phoneNumber"
// //                 value={formData.phoneNumber}
// //                 onChange={handleInputChange}
// //                 placeholder="Enter phone number"
// //               />
// //             </FormGroup>

// //             <FormGroup>
// //               <Label for="group">Group</Label>
// //               <Input
// //                 type="text"
// //                 name="group"
// //                 id="group"
// //                 value={formData.group}
// //                 onChange={handleInputChange}
// //                 placeholder="Enter group name"
// //               />
// //             </FormGroup>

// //             <FormGroup>
// //               <Label for="countryCode">Country Code</Label>
// //               <Input
// //                 type="text"
// //                 name="countryCode"
// //                 id="countryCode"
// //                 value={formData.countryCode}
// //                 onChange={handleInputChange}
// //                 placeholder="Enter country code"
// //               />
// //             </FormGroup>

// //             <FormGroup>
// //               <Label for="menuId">Select Default Menu</Label>
// //               <Input
// //                 type="select"
// //                 name="menuId"
// //                 id="menuId"
// //                 value={formData.menuId}
// //                 onChange={handleInputChange}
// //               >
// //                 <option value="">Select a default menu...</option>
// //                 {Array.isArray(menus) && menus.length > 0 ? (
// //                   menus.map((menu) => {
// //                     console.log("Rendering menu:", menu);
// //                     return (
// //                       <option key={menu._id} value={menu._id}>
// //                         {menu.menuName || menu.menuTitle || 'Unnamed Menu'}
// //                       </option>
// //                     );
// //                   })
// //                 ) : (
// //                   <option value="" disabled>No default menus available</option>
// //                 )}
// //               </Input>
// //             </FormGroup>

// //             <Button color="primary" type="submit" disabled={loading}>
// //               {loading ? <Spinner size="sm" /> : 'Assign Menu'}
// //             </Button>
// //           </Form>
// //         </CardBody>
// //       </Card>
// //     </div>
// //   );
// // };

// // export default WhatsAppMenusAccess;
























// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import {
//   Container,
//   Row,
//   Col,
//   Card,
//   CardBody,
//   CardHeader,
//   Form,
//   FormGroup,
//   Label,
//   Input,
//   Button,
//   ListGroup,
//   ListGroupItem,
//   Modal,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
//   Toast,
//   ToastHeader,
//   ToastBody
// } from 'reactstrap';
// import { GROUP_ENDPOINTS, MENU_ENDPOINTS } from 'Api/Constant';

// const WhatsAppMenusAccess = () => {
//   const [groups, setGroups] = useState([]);
//   const [menus, setMenus] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [deleteModal, setDeleteModal] = useState(false);
//   const [selectedGroupId, setSelectedGroupId] = useState(null);
//   const [toast, setToast] = useState({
//     show: false,
//     message: '',
//     type: 'success'
//   });
//   const [formData, setFormData] = useState({
//     name: '',
//     menuId: '',
//     allowedPhoneNumbers: ['']
//   });
//   const [editMode, setEditMode] = useState(false);
//   const [editId, setEditId] = useState(null);

//   useEffect(() => {
//     fetchGroups();
//     fetchMenus();
//   }, []);

//   const showToast = (message, type = 'success') => {
//     setToast({
//       show: true,
//       message,
//       type
//     });
//     // Auto hide toast after 3 seconds
//     setTimeout(() => {
//       setToast(prev => ({ ...prev, show: false }));
//     }, 3000);
//   };

//   const fetchGroups = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(GROUP_ENDPOINTS.GET_ALL);
//       setGroups(response.data.groups || []);
//     } catch (err) {
//       console.error('Error fetching groups:', err);
//       showToast('Failed to fetch groups', 'danger');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchMenus = async () => {
//     try {
//       const response = await axios.get(MENU_ENDPOINTS.GET_ALL);
//       if (response.data && response.data.data) {
//         const defaultMenus = response.data.data.filter(menu => menu.isDefault === true);
//         setMenus(defaultMenus);
//       }
//     } catch (err) {
//       console.error('Error fetching menus:', err);
//       showToast('Failed to fetch menus', 'danger');
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       setLoading(true);
//       if (editMode) {
//         await axios.put(GROUP_ENDPOINTS.UPDATE(editId), formData);
//         showToast('Group updated successfully');
//       } else {
//         await axios.post(GROUP_ENDPOINTS.CREATE, formData);
//         showToast('Group created successfully');
//       }
//       resetForm();
//       fetchGroups();
//     } catch (err) {
//       console.error('Operation error:', err);
//       showToast(err.response?.data?.message || 'Operation failed', 'danger');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteClick = (id) => {
//     setSelectedGroupId(id);
//     setDeleteModal(true);
//   };

//   const handleDelete = async () => {
//     try {
//       setLoading(true);
//       await axios.delete(GROUP_ENDPOINTS.DELETE(selectedGroupId));
//       showToast('Group deleted successfully');
//       fetchGroups();
//       setDeleteModal(false);
//     } catch (err) {
//       console.error('Delete error:', err);
//       showToast('Failed to delete group', 'danger');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (group) => {
//     setEditMode(true);
//     setEditId(group._id);
//     setFormData({
//       name: group.name,
//       menuId: group.menuId,
//       allowedPhoneNumbers: group.allowedPhoneNumbers
//     });
//   };

//   const resetForm = () => {
//     setFormData({
//       name: '',
//       menuId: '',
//       allowedPhoneNumbers: ['']
//     });
//     setEditMode(false);
//     setEditId(null);
//   };

//   const addPhoneNumber = () => {
//     setFormData({
//       ...formData,
//       allowedPhoneNumbers: [...formData.allowedPhoneNumbers, '']
//     });
//   };

//   const removePhoneNumber = (index) => {
//     const newNumbers = formData.allowedPhoneNumbers.filter((_, i) => i !== index);
//     setFormData({
//       ...formData,
//       allowedPhoneNumbers: newNumbers
//     });
//   };

//   const handlePhoneNumberChange = (index, value) => {
//     const newNumbers = [...formData.allowedPhoneNumbers];
//     newNumbers[index] = value;
//     setFormData({
//       ...formData,
//       allowedPhoneNumbers: newNumbers
//     });
//   };

//   return (
//     <Container fluid className="mt-4">
//       {/* Toast */}
//       <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1050 }}>
//         <Toast isOpen={toast.show}>
//           <ToastHeader icon={toast.type}>
//             {toast.type === 'danger' ? 'Error' : 'Success'}
//           </ToastHeader>
//           <ToastBody>
//             {toast.message}
//           </ToastBody>
//         </Toast>
//       </div>

//       {/* Delete Confirmation Modal */}
//       <Modal isOpen={deleteModal} toggle={() => setDeleteModal(false)}>
//         <ModalHeader toggle={() => setDeleteModal(false)}>Delete Group</ModalHeader>
//         <ModalBody>
//           Are you sure you want to delete this group? This action cannot be undone.
//         </ModalBody>
//         <ModalFooter>
//           <Button color="secondary" onClick={() => setDeleteModal(false)}>
//             Cancel
//           </Button>
//           <Button color="danger" onClick={handleDelete}>
//             Delete
//           </Button>
//         </ModalFooter>
//       </Modal>

//       <Row>
//         <Col md={12} lg={5}>
//           <Card>
//             <CardHeader>
//               <h4 className="mb-0">{editMode ? 'Edit Group' : 'Create New Group'}</h4>
//             </CardHeader>
//             <CardBody>
//               <Form onSubmit={handleSubmit}>
//                 <FormGroup>
//                   <Label for="name">Group Name</Label>
//                   <Input
//                     id="name"
//                     value={formData.name}
//                     onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                     placeholder="Enter group name"
//                     required
//                   />
//                 </FormGroup>

//                 <FormGroup>
//                   <Label for="menuId">Select Menu</Label>
//                   <Input
//                     type="select"
//                     id="menuId"
//                     value={formData.menuId}
//                     onChange={(e) => setFormData({ ...formData, menuId: e.target.value })}
//                     required
//                   >
//                     <option value="">Choose menu...</option>
//                     {menus.map(menu => (
//                       <option key={menu._id} value={menu._id}>
//                         {menu.menuTitle || menu.menuName || 'Unnamed Menu'}
//                       </option>
//                     ))}
//                   </Input>
//                 </FormGroup>

//                 <FormGroup>
//                   <Label>Phone Numbers</Label>
//                   {formData.allowedPhoneNumbers.map((number, index) => (
//                     <div key={index} className="d-flex mb-2">
//                       <Input
//                         value={number}
//                         onChange={(e) => handlePhoneNumberChange(index, e.target.value)}
//                         placeholder="Enter phone number"
//                         className="me-2"
//                         required
//                       />
//                       {formData.allowedPhoneNumbers.length > 1 && (
//                         <Button
//                           color="danger"
//                           outline
//                           type="button"
//                           onClick={() => removePhoneNumber(index)}
//                         >
//                           Remove
//                         </Button>
//                       )}
//                     </div>
//                   ))}
//                   <Button
//                     color="secondary"
//                     outline
//                     type="button"
//                     onClick={addPhoneNumber}
//                     className="mt-2"
//                   >
//                     Add Phone Number
//                   </Button>
//                 </FormGroup>

//                 <div className="mt-4">
//                   <Button 
//                     color="primary" 
//                     type="submit" 
//                     className="me-2"
//                     disabled={loading}
//                   >
//                     {loading ? 'Processing...' : editMode ? 'Update Group' : 'Create Group'}
//                   </Button>
//                   {editMode && (
//                     <Button 
//                       color="secondary" 
//                       onClick={resetForm}
//                       disabled={loading}
//                     >
//                       Cancel
//                     </Button>
//                   )}
//                 </div>
//               </Form>
//             </CardBody>
//           </Card>
//         </Col>

//         <Col md={12} lg={7}>
//           <Card>
//             <CardHeader>
//               <h4 className="mb-0">Groups List</h4>
//             </CardHeader>
//             <CardBody>
//               <ListGroup>
//                 {groups.map(group => (
//                   <ListGroupItem key={group._id} className="mb-2">
//                     <div className="d-flex justify-content-between align-items-start">
//                       <div>
//                         <h5 className="mb-1">{group.name}</h5>
//                         <p className="mb-1 text-muted">
//                           Menu: {group.menuId?.name || 'Not assigned'}
//                         </p>
//                         <small>Phone Numbers:</small>
//                         <ul className="mb-0">
//                           {group.allowedPhoneNumbers.map((number, index) => (
//                             <li key={index}>{number}</li>
//                           ))}
//                         </ul>
//                       </div>
//                       <div>
//                         <Button
//                           color="primary"
//                           outline
//                           size="sm"
//                           className="me-2"
//                           onClick={() => handleEdit(group)}
//                           disabled={loading}
//                         >
//                           Edit
//                         </Button>
//                         <Button
//                           color="danger"
//                           outline
//                           size="sm"
//                           onClick={() => handleDeleteClick(group._id)}
//                           disabled={loading}
//                         >
//                           Delete
//                         </Button>
//                       </div>
//                     </div>
//                   </ListGroupItem>
//                 ))}
//                 {!loading && groups.length === 0 && (
//                   <p className="text-center text-muted">No groups found</p>
//                 )}
//               </ListGroup>
//             </CardBody>
//           </Card>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default WhatsAppMenusAccess;


























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
      if (response.data?.data) {
        const mainMenus = response.data.data.filter(menu => menu.isMainMenu === true);
        setMenus(mainMenus);
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
    setGroupFormData(prev => ({
      ...prev,
      allowedPhoneNumbers: prev.allowedPhoneNumbers.filter((_, i) => i !== index)
    }));
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
                            Menu: {menus.find(m => m._id === group.menuId)?.menuName || 'Not Assign'}
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