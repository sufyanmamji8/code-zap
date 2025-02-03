// import React, { useState, useEffect } from 'react'
// import axios from 'axios'
// import { 
//   Card, CardBody, CardTitle, 
//   Button, Row, Col, Modal, 
//   ModalHeader, ModalBody, ModalFooter,
//   Form, FormGroup, Label, Input,
//   Badge, Spinner, Alert
// } from 'reactstrap'
// import { 
//   Edit2, Trash2, PlusCircle, 
//   AlignLeft, FileText, X 
// } from 'lucide-react'
// import { MENU_API_ENDPOINT, MENU_ENDPOINTS } from 'Api/Constant'

// const WhatsAppMenus = () => {
//   const [menus, setMenus] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const [selectedMenu, setSelectedMenu] = useState(null)
//   const [editModalOpen, setEditModalOpen] = useState(false)
//   const [createModalOpen, setCreateModalOpen] = useState(false)
//   const [newMenu, setNewMenu] = useState({
//     menuId: '',
//     menuTitle: '',
//     menuOptions: [
//       { 
//         id: ``, 
//         title: '', 
//         nextMenuId: '', 
//         apiCall: '' 
//       }
//     ]
//   })


//   useEffect(() => {
//     const fetchMenus = async () => {
//       try {
//         const response = await axios.get(`${MENU_API_ENDPOINT}/getAllMenus`)
//         setMenus(response.data.data || [])
//         setLoading(false)
//       } catch (err) {
//         console.error('Fetch Menus Error:', err.response?.data || err.message)
//         setError(err.response?.data?.message || err.message)
//         setLoading(false)
//       }
//     }

//     fetchMenus()
//   }, [])

//   const handleEdit = (menu) => {
//     // Ensure all menu options have the required fields
//     const completeMenuOptions = menu.menuOptions.map(option => ({
//       id: option.id || '',
//       title: option.title || '',
//       nextMenuId: option.nextMenuId || '',
//       apiCall: option.apiCall || ''
//     }))

//     setSelectedMenu({
//       ...menu,
//       menuOptions: completeMenuOptions
//     })
//     setEditModalOpen(true)
//   }

//   const handleDelete = async (menuId) => {
//     try {
//       await axios.delete(`${MENU_API_ENDPOINT}/delete/${menuId}`)
//       setMenus(menus.filter(menu => menu.menuId !== menuId))
//     } catch (err) {
//       setError(err.response?.data?.message || err.message)
//     }
//   }

//   const handleSaveMenu = async () => {
//     try {
//       // Ensure all required fields are included in the update
//       const updatedMenuData = {
//         menuTitle: selectedMenu.menuTitle,
//         menuOptions: selectedMenu.menuOptions.map(option => ({
//           id: option.id || '',
//           title: option.title || '',
//           nextMenuId: option.nextMenuId || '',
//           apiCall: option.apiCall || ''
//         }))
//       }

//       const response = await axios.put(
//         `${MENU_API_ENDPOINT}/update/${selectedMenu.menuId}`, 
//         updatedMenuData
//       )
      
//       const updatedMenus = menus.map(menu => 
//         menu.menuId === selectedMenu.menuId ? response.data.data : menu
//       )
//       setMenus(updatedMenus)
//       setEditModalOpen(false)
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to update menu')
//     }
//   }

//   const handleCreateMenu = async () => {
//     try {
//       // Filter out any empty menu options
//       const validMenuOptions = newMenu.menuOptions.filter(option => 
//         option.title.trim() !== '' || 
//         option.nextMenuId.trim() !== '' || 
//         option.apiCall.trim() !== ''
//       )

//       const response = await axios.post(MENU_ENDPOINTS.CREATE, {
//         menuId: newMenu.menuId,
//         menuTitle: newMenu.menuTitle,
//         menuOptions: validMenuOptions.map(option => ({
//           id: option.id,
//           title: option.title,
//           nextMenuId: option.nextMenuId,
//           apiCall: option.apiCall || ''
//         }))
//       })
      
//       setMenus([...menus, response.data.data])
//       setCreateModalOpen(false)
//       setNewMenu({
//         menuId: '',
//         menuTitle: '',
//         menuOptions: [{ 
//           id: ``, 
//           title: '', 
//           nextMenuId: '', 
//           apiCall: '' 
//         }]
//       })
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to create menu')
//     }
//   }

//   const addMenuOption = (type = 'edit') => {
//     if (type === 'edit') {
//       setSelectedMenu(prev => ({
//         ...prev,
//         menuOptions: [
//           ...prev.menuOptions, 
//           { 
//             id: ``, 
//             title: '', 
//             nextMenuId: '', 
//             apiCall: '' 
//           }
//         ]
//       }))
//     } else {
//       setNewMenu(prev => ({
//         ...prev,
//         menuOptions: [
//           ...prev.menuOptions, 
//           { 
//             id: ``, 
//             title: '', 
//             nextMenuId: '', 
//             apiCall: '' 
//           }
//         ]
//       }))
//     }
//   }

//   const removeMenuOption = (index, type = 'edit') => {
//     if (type === 'edit') {
//       setSelectedMenu(prev => ({
//         ...prev,
//         menuOptions: prev.menuOptions.filter((_, i) => i !== index)
//       }))
//     } else {
//       setNewMenu(prev => ({
//         ...prev,
//         menuOptions: prev.menuOptions.filter((_, i) => i !== index)
//       }))
//     }
//   }

//   if (loading) return (
//     <div className="text-center p-5">
//       <Spinner color="primary" />
//       <p className="mt-3">Loading Menus...</p>
//     </div>
//   )

//   return (
//     <div className="p-4 bg-light">
//       {error && (
//         <Alert color="danger" className="mb-3">
//           <AlignLeft className="mr-2" />
//           {error}
//           <Button 
//             close 
//             onClick={() => setError(null)}
//           />
//         </Alert>
//       )}

//       <div className="d-flex justify-content-end mb-3">
//         <Button 
//           color="success" 
//           onClick={() => setCreateModalOpen(true)}
//         >
//           <PlusCircle size={16} className="mr-1" /> Create New Menu
//         </Button>
//       </div>

//       <Row>
//         {menus.map((menu) => (
//           <Col key={menu._id} md="4" sm="6" xs="12" className="mb-4">
//             <Card className="shadow-sm hover:shadow-lg transition-all">
//               <CardBody>
//                 <div className="d-flex justify-content-between align-items-center mb-3">
//                   <CardTitle tag="h5" className="mb-0">
//                     {menu.menuTitle}
//                   </CardTitle>
//                   <Badge color="info">{menu.menuId}</Badge>
//                 </div>

//                 <div className="mb-3">
//                   {menu.menuOptions.slice(0,3).map((option) => (
//                     <div 
//                       key={option.id} 
//                       className="d-flex align-items-center mb-2"
//                     >
//                       <FileText size={16} className="mr-2 text-muted" />
//                       <span>{option.title}</span>
//                     </div>
//                   ))}
//                   {menu.menuOptions.length > 3 && (
//                     <div className="text-muted small">
//                       +{menu.menuOptions.length - 3} more options
//                     </div>
//                   )}
//                 </div>

//                 <div className="d-flex justify-content-between">
//                   <Button 
//                     color="primary" 
//                     outline
//                     size="sm" 
//                     onClick={() => handleEdit(menu)}
//                   >
//                     <Edit2 size={16} className="mr-1" /> Edit
//                   </Button>
//                   <Button 
//                     color="danger" 
//                     outline
//                     size="sm" 
//                     onClick={() => handleDelete(menu.menuId)}
//                   >
//                     <Trash2 size={16} className="mr-1" /> Delete
//                   </Button>
//                 </div>
//               </CardBody>
//             </Card>
//           </Col>
//         ))}
//       </Row>

//       {/* Create Menu Modal */}
//       <Modal 
//     isOpen={createModalOpen} 
//     toggle={() => setCreateModalOpen(false)} 
//     size="lg" 
//     centered
//   >
//     <ModalHeader toggle={() => setCreateModalOpen(false)}>
//       Create New Menu
//     </ModalHeader>
//     <ModalBody>
//       <Form>
//         <FormGroup>
//           <Label>Menu ID</Label>
//           <Input
//             type="text"
//             value={newMenu.menuId}
//             onChange={(e) => setNewMenu(prev => ({
//               ...prev,
//               menuId: e.target.value
//             }))}
//           />
//         </FormGroup>
//         <FormGroup>
//           <Label>Menu Title</Label>
//           <Input
//             type="text"
//             value={newMenu.menuTitle}
//             onChange={(e) => setNewMenu(prev => ({
//               ...prev,
//               menuTitle: e.target.value
//             }))}
//           />
//         </FormGroup>

//         <div className="d-flex justify-content-between align-items-center mb-3">
//           <h5>Menu Options</h5>
//           <Button 
//             color="success" 
//             size="sm" 
//             onClick={() => {
//               const newOption = {
//                 id: ``,
//                 title: '',
//                 nextMenuId: '',
//                 apiCall: ''
//               }
//               setNewMenu(prev => ({
//                 ...prev,
//                 menuOptions: [...prev.menuOptions, newOption]
//               }))
//             }}
//           >
//             <PlusCircle size={16} className="mr-1" /> Add Option
//           </Button>
//         </div>

//         {newMenu.menuOptions.map((option, index) => (
//           <div key={option.id} className="mb-3 p-3 border rounded">
//             <FormGroup>
//               <Label>Option ID</Label>
//               <Input
//                 type="text"
//                 value={option.id}
//                 onChange={(e) => {
//                   const updatedOptions = [...newMenu.menuOptions]
//                   updatedOptions[index].id = e.target.value
//                   setNewMenu(prev => ({
//                     ...prev,
//                     menuOptions: updatedOptions
//                   }))
//                 }}
//               />
//             </FormGroup>
//             <FormGroup>
//               <Label>Option Title</Label>
//               <Input
//                 type="text"
//                 value={option.title}
//                 onChange={(e) => {
//                   const updatedOptions = [...newMenu.menuOptions]
//                   updatedOptions[index].title = e.target.value
//                   setNewMenu(prev => ({
//                     ...prev,
//                     menuOptions: updatedOptions
//                   }))
//                 }}
//               />
//             </FormGroup>
//             <FormGroup>
//               <Label>Next Menu ID</Label>
//               <Input
//                 type="text"
//                 value={option.nextMenuId}
//                 onChange={(e) => {
//                   const updatedOptions = [...newMenu.menuOptions]
//                   updatedOptions[index].nextMenuId = e.target.value
//                   setNewMenu(prev => ({
//                     ...prev,
//                     menuOptions: updatedOptions
//                   }))
//                 }}
//               />
//             </FormGroup>
//             <FormGroup>
//               <Label>API Call</Label>
//               <Input
//                 type="text"
//                 value={option.apiCall}
//                 onChange={(e) => {
//                   const updatedOptions = [...newMenu.menuOptions]
//                   updatedOptions[index].apiCall = e.target.value
//                   setNewMenu(prev => ({
//                     ...prev,
//                     menuOptions: updatedOptions
//                   }))
//                 }}
//               />
//             </FormGroup>
//           </div>
//         ))}
//       </Form>
//     </ModalBody>
//     <ModalFooter>
//       <Button color="secondary" onClick={() => setCreateModalOpen(false)}>
//         Cancel
//       </Button>
//       <Button color="primary" onClick={handleCreateMenu}>
//         Create Menu
//       </Button>
//     </ModalFooter>
//   </Modal>

//       {/* Edit Menu Modal */}
//       <Modal 
//     isOpen={editModalOpen} 
//     toggle={() => setEditModalOpen(false)} 
//     size="lg" 
//     centered
//   >
//     <ModalHeader toggle={() => setEditModalOpen(false)}>
//       Edit Menu: {selectedMenu?.menuTitle}
//     </ModalHeader>
//     <ModalBody>
//       <Form>
//         <FormGroup>
//           <Label>Menu ID</Label>
//           <Input
//             type="text"
//             value={selectedMenu?.menuId || ''}
//             disabled
//           />
//         </FormGroup>
//         <FormGroup>
//           <Label>Menu Title</Label>
//           <Input
//             type="text"
//             value={selectedMenu?.menuTitle || ''}
//             onChange={(e) => setSelectedMenu(prev => ({
//               ...prev,
//               menuTitle: e.target.value
//             }))}
//           />
//         </FormGroup>

//         <div className="d-flex justify-content-between align-items-center mb-3">
//           <h5>Menu Options</h5>
//           <Button 
//             color="success" 
//             size="sm" 
//             onClick={() => addMenuOption('edit')}
//           >
//             <PlusCircle size={16} className="mr-1" /> Add Option
//           </Button>
//         </div>

//         {selectedMenu?.menuOptions.map((option, index) => (
//           <div key={option.id || index} className="mb-3 p-3 border rounded position-relative">
//             {selectedMenu.menuOptions.length > 1 && (
//               <Button 
//                 close 
//                 className="position-absolute top-0 end-0 m-2"
//                 onClick={() => removeMenuOption(index, 'edit')}
//               >
//                 <X size={20} />
//               </Button>
//             )}
//             <FormGroup>
//               <Label>Option ID</Label>
//               <Input
//                 type="text"
//                 value={option.id || ''}
//                 onChange={(e) => {
//                   const updatedOptions = [...selectedMenu.menuOptions]
//                   updatedOptions[index].id = e.target.value
//                   setSelectedMenu(prev => ({
//                     ...prev,
//                     menuOptions: updatedOptions
//                   }))
//                 }}
//               />
//             </FormGroup>
//             <FormGroup>
//               <Label>Option Title</Label>
//               <Input
//                 type="text"
//                 value={option.title || ''}
//                 onChange={(e) => {
//                   const updatedOptions = [...selectedMenu.menuOptions]
//                   updatedOptions[index].title = e.target.value
//                   setSelectedMenu(prev => ({
//                     ...prev,
//                     menuOptions: updatedOptions
//                   }))
//                 }}
//               />
//             </FormGroup>
//             <FormGroup>
//               <Label>Next Menu ID</Label>
//               <Input
//                 type="text"
//                 value={option.nextMenuId || ''}
//                 onChange={(e) => {
//                   const updatedOptions = [...selectedMenu.menuOptions]
//                   updatedOptions[index].nextMenuId = e.target.value
//                   setSelectedMenu(prev => ({
//                     ...prev,
//                     menuOptions: updatedOptions
//                   }))
//                 }}
//               />
//             </FormGroup>
//             <FormGroup>
//               <Label>API Call</Label>
//               <Input
//                 type="text"
//                 value={option.apiCall || ''}
//                 onChange={(e) => {
//                   const updatedOptions = [...selectedMenu.menuOptions]
//                   updatedOptions[index].apiCall = e.target.value
//                   setSelectedMenu(prev => ({
//                     ...prev,
//                     menuOptions: updatedOptions
//                   }))
//                 }}
//               />
//             </FormGroup>
//           </div>
//         ))}
//       </Form>
//     </ModalBody>
//     <ModalFooter>
//       <Button color="secondary" onClick={() => setEditModalOpen(false)}>
//         Cancel
//       </Button>
//       <Button 
//         color="primary" 
//         onClick={handleSaveMenu}
//         disabled={!selectedMenu?.menuTitle}
//       >
//         Save Changes
//       </Button>
//     </ModalFooter>
//   </Modal>
//     </div>
//   )
// }

// export default WhatsAppMenus










// import React, { useState, useEffect } from 'react'
// import axios from 'axios'
// import { 
//   Card, CardBody, CardTitle, 
//   Button, Row, Col, Modal, 
//   ModalHeader, ModalBody, ModalFooter,
//   Form, FormGroup, Label, Input,
//   Badge, Alert
// } from 'reactstrap'
// import { 
//   Edit2, Trash2, PlusCircle, 
//   AlignLeft, FileText, X 
// } from 'lucide-react'
// import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap'
// import { MENU_API_ENDPOINT, MENU_ENDPOINTS } from 'Api/Constant'
// import { DotLottieReact } from '@lottiefiles/dotlottie-react'

// const WhatsAppMenus = () => {
//   const [menus, setMenus] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const [selectedMenu, setSelectedMenu] = useState(null)
//   const [editModalOpen, setEditModalOpen] = useState(false)
//   const [deleteModal, setDeleteModal] = useState(false)
//   const [menuToDelete, setMenuToDelete] = useState(null)
//   const [activeTab, setActiveTab] = useState('basic')
//   const [apiLoading, setApiLoading] = useState(false)

//   const [createModalOpen, setCreateModalOpen] = useState(false)
//   const [newMenu, setNewMenu] = useState({
//     menuId: '',
//     menuTitle: '',
//     menuOptions: [
//       { 
//         id: ``, 
//         title: '', 
//         nextMenuId: '', 
//         apiCall: '' 
//       }
//     ]
//   })

//   useEffect(() => {
//     const fetchMenus = async () => {
//       setLoading(true)
//       try {
//         const response = await axios.get(`${MENU_API_ENDPOINT}/getAllMenus`)
//         setMenus(response.data.data || [])
//       } catch (err) {
//         console.error('Fetch Menus Error:', err.response?.data || err.message)
//         setError(err.response?.data?.message || err.message)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchMenus()
//   }, [])

//   const handleEdit = (menu) => {
//     const completeMenuOptions = menu.menuOptions.map(option => ({
//       id: option.id || '',
//       title: option.title || '',
//       nextMenuId: option.nextMenuId || '',
//       apiCall: option.apiCall || ''
//     }))

//     setSelectedMenu({
//       ...menu,
//       menuOptions: completeMenuOptions
//     })
//     setEditModalOpen(true)
//   }

//   const confirmDelete = (menu) => {
//     setMenuToDelete(menu)
//     setDeleteModal(true)
//   }

//   const handleDelete = async () => {
//     setApiLoading(true)
//     try {
//       await axios.delete(`${MENU_API_ENDPOINT}/delete/${menuToDelete.menuId}`)
//       setMenus(menus.filter(menu => menu.menuId !== menuToDelete.menuId))
//       setDeleteModal(false)
//       setMenuToDelete(null)
//     } catch (err) {
//       setError(err.response?.data?.message || err.message)
//     } finally {
//       setApiLoading(false)
//     }
//   }

//   const handleSaveMenu = async () => {
//     setApiLoading(true)
//     try {
//       const updatedMenuData = {
//         menuTitle: selectedMenu.menuTitle,
//         menuOptions: selectedMenu.menuOptions.map(option => ({
//           id: option.id || '',
//           title: option.title || '',
//           nextMenuId: option.nextMenuId || '',
//           apiCall: option.apiCall || ''
//         }))
//       }

//       const response = await axios.put(
//         `${MENU_API_ENDPOINT}/update/${selectedMenu.menuId}`, 
//         updatedMenuData
//       )
      
//       const updatedMenus = menus.map(menu => 
//         menu.menuId === selectedMenu.menuId ? response.data.data : menu
//       )
//       setMenus(updatedMenus)
//       setEditModalOpen(false)
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to update menu')
//     } finally {
//       setApiLoading(false)
//     }
//   }

//   const handleCreateMenu = async () => {
//     setApiLoading(true)
//     try {
//       const validMenuOptions = newMenu.menuOptions.filter(option => 
//         option.title.trim() !== '' || 
//         option.nextMenuId.trim() !== '' || 
//         option.apiCall.trim() !== ''
//       )

//       const response = await axios.post(MENU_ENDPOINTS.CREATE, {
//         menuId: newMenu.menuId,
//         menuTitle: newMenu.menuTitle,
//         menuOptions: validMenuOptions.map(option => ({
//           id: option.id,
//           title: option.title,
//           nextMenuId: option.nextMenuId,
//           apiCall: option.apiCall || ''
//         }))
//       })
      
//       setMenus([...menus, response.data.data])
//       setCreateModalOpen(false)
//       setNewMenu({
//         menuId: '',
//         menuTitle: '',
//         menuOptions: [{ 
//           id: ``, 
//           title: '', 
//           nextMenuId: '', 
//           apiCall: '' 
//         }]
//       })
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to create menu')
//     } finally {
//       setApiLoading(false)
//     }
//   }

//   const addMenuOption = (type = 'edit') => {
//     if (type === 'edit') {
//       setSelectedMenu(prev => ({
//         ...prev,
//         menuOptions: [
//           ...prev.menuOptions, 
//           { 
//             id: ``, 
//             title: '', 
//             nextMenuId: '', 
//             apiCall: '' 
//           }
//         ]
//       }))
//     } else {
//       setNewMenu(prev => ({
//         ...prev,
//         menuOptions: [
//           ...prev.menuOptions, 
//           { 
//             id: ``, 
//             title: '', 
//             nextMenuId: '', 
//             apiCall: '' 
//           }
//         ]
//       }))
//     }
//   }

//   const removeMenuOption = (index, type = 'edit') => {
//     if (type === 'edit') {
//       setSelectedMenu(prev => ({
//         ...prev,
//         menuOptions: prev.menuOptions.filter((_, i) => i !== index)
//       }))
//     } else {
//       setNewMenu(prev => ({
//         ...prev,
//         menuOptions: prev.menuOptions.filter((_, i) => i !== index)
//       }))
//     }
//   }

//   const MenuModalContent = ({ 
//     menuData, 
//     setMenuData, 
//     type = 'edit',
//     onAddOption,
//     onRemoveOption 
//   }) => {
//     return (
//       <>
//         <Nav tabs className="mb-4">
//           <NavItem>
//             <NavLink
//               className={activeTab === 'basic' ? 'active' : ''}
//               onClick={() => setActiveTab('basic')}
//               style={{ cursor: 'pointer' }}
//             >
//               Basic Info
//             </NavLink>
//           </NavItem>
//           <NavItem>
//             <NavLink
//               className={activeTab === 'options' ? 'active' : ''}
//               onClick={() => setActiveTab('options')}
//               style={{ cursor: 'pointer' }}
//             >
//               Menu Options
//             </NavLink>
//           </NavItem>
//         </Nav>

//         <TabContent activeTab={activeTab}>
//           <TabPane tabId="basic">
//             <Form>
//               <FormGroup>
//                 <Label>Menu ID</Label>
//                 <Input
//                   type="text"
//                   value={menuData.menuId}
//                   onChange={(e) => setMenuData(prev => ({
//                     ...prev,
//                     menuId: e.target.value
//                   }))}
//                   disabled={type === 'edit'}
//                 />
//               </FormGroup>
//               <FormGroup>
//                 <Label>Menu Title</Label>
//                 <Input
//                   type="text"
//                   value={menuData.menuTitle}
//                   onChange={(e) => setMenuData(prev => ({
//                     ...prev,
//                     menuTitle: e.target.value
//                   }))}
//                 />
//               </FormGroup>
//             </Form>
//           </TabPane>

//           <TabPane tabId="options">
//             <div className="d-flex justify-content-between align-items-center mb-3">
//               <h5 className="mb-0">Menu Options</h5>
//               <Button 
//                 color="success" 
//                 size="sm" 
//                 onClick={() => onAddOption()}
//               >
//                 <PlusCircle size={16} className="mr-1" /> Add Option
//               </Button>
//             </div>

//             <div style={{ maxHeight: '400px', overflowY: 'auto', padding: '1px' }}>
//               {menuData.menuOptions.map((option, index) => (
//                 <Card key={option.id || index} className="mb-3">
//                   <CardBody className="position-relative">
//                     {menuData.menuOptions.length > 1 && (
//                       <Button 
//                         close 
//                         className="position-absolute"
//                         style={{ top: '10px', right: '10px' }}
//                         onClick={() => onRemoveOption(index)}
//                       >
//                         <X size={20} />
//                       </Button>
//                     )}
                    
//                     <Row>
//                       <Col md={6}>
//                         <FormGroup>
//                           <Label>Option ID</Label>
//                           <Input
//                             type="text"
//                             value={option.id}
//                             onChange={(e) => {
//                               const updatedOptions = [...menuData.menuOptions]
//                               updatedOptions[index].id = e.target.value
//                               setMenuData(prev => ({
//                                 ...prev,
//                                 menuOptions: updatedOptions
//                               }))
//                             }}
//                           />
//                         </FormGroup>
//                       </Col>
//                       <Col md={6}>
//                         <FormGroup>
//                           <Label>Option Title</Label>
//                           <Input
//                             type="text"
//                             value={option.title}
//                             onChange={(e) => {
//                               const updatedOptions = [...menuData.menuOptions]
//                               updatedOptions[index].title = e.target.value
//                               setMenuData(prev => ({
//                                 ...prev,
//                                 menuOptions: updatedOptions
//                               }))
//                             }}
//                           />
//                         </FormGroup>
//                       </Col>
//                       <Col md={6}>
//                         <FormGroup>
//                           <Label>Next Menu ID</Label>
//                           <Input
//                             type="text"
//                             value={option.nextMenuId}
//                             onChange={(e) => {
//                               const updatedOptions = [...menuData.menuOptions]
//                               updatedOptions[index].nextMenuId = e.target.value
//                               setMenuData(prev => ({
//                                 ...prev,
//                                 menuOptions: updatedOptions
//                               }))
//                             }}
//                           />
//                         </FormGroup>
//                       </Col>
//                       <Col md={6}>
//                         <FormGroup>
//                           <Label>API Call</Label>
//                           <Input
//                             type="text"
//                             value={option.apiCall}
//                             onChange={(e) => {
//                               const updatedOptions = [...menuData.menuOptions]
//                               updatedOptions[index].apiCall = e.target.value
//                               setMenuData(prev => ({
//                                 ...prev,
//                                 menuOptions: updatedOptions
//                               }))
//                             }}
//                           />
//                         </FormGroup>
//                       </Col>
//                     </Row>
//                   </CardBody>
//                 </Card>
//               ))}
//             </div>
//           </TabPane>
//         </TabContent>
//       </>
//     )
//   }

//   return (
//     <>
//       {/* Loading Overlay */}
//       {(loading || apiLoading) && (
//         <div
//           style={{
//             position: "fixed",
//             top: 0,
//             left: 0,
//             width: "100%",
//             height: "100%",
//             backgroundColor: "rgba(255, 255, 255, 0.8)",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             zIndex: 9999,
//           }}
//         >
//           <DotLottieReact
//             src="https://lottie.host/5060de43-85ac-474a-a85b-892f9730e17a/b3jJ1vGkWh.lottie"
//             loop
//             autoplay
//             style={{ width: "150px", height: "150px" }}
//           />
//         </div>
//       )}

//       <div className="p-4 bg-light">
//         {error && (
//           <Alert color="danger" className="mb-3">
//             <AlignLeft className="mr-2" />
//             {error}
//             <Button 
//               close 
//               onClick={() => setError(null)}
//             />
//           </Alert>
//         )}

//         <div className="d-flex justify-content-end mb-3">
//           <Button 
//             color="success" 
//             onClick={() => setCreateModalOpen(true)}
//           >
//             <PlusCircle size={16} className="mr-1" /> Create New Menu
//           </Button>
//         </div>

//         <Row>
//           {menus.map((menu) => (
//             <Col key={menu._id} md="4" sm="6" xs="12" className="mb-4">
//               <Card className="shadow-sm hover:shadow-lg transition-all">
//                 <CardBody>
//                   <div className="d-flex justify-content-between align-items-center mb-3">
//                     <CardTitle tag="h5" className="mb-0">
//                       {menu.menuTitle}
//                     </CardTitle>
//                     <Badge color="info">{menu.menuId}</Badge>
//                   </div>

//                   <div className="mb-3">
//                     {menu.menuOptions.slice(0,3).map((option) => (
//                       <div 
//                         key={option.id} 
//                         className="d-flex align-items-center mb-2"
//                       >
//                         <FileText size={16} className="mr-2 text-muted" />
//                         <span>{option.title}</span>
//                       </div>
//                     ))}
//                     {menu.menuOptions.length > 3 && (
//                       <div className="text-muted small">
//                         +{menu.menuOptions.length - 3} more options
//                       </div>
//                     )}
//                   </div>

//                   <div className="d-flex justify-content-between">
//                     <Button 
//                       color="primary" 
//                       outline
//                       size="sm" 
//                       onClick={() => handleEdit(menu)}
//                     >
//                       <Edit2 size={16} className="mr-1" /> Edit
//                     </Button>
//                     <Button 
//                       color="danger" 
//                       outline
//                       size="sm" 
//                       onClick={() => confirmDelete(menu)}
//                     >
//                       <Trash2 size={16} className="mr-1" /> Delete
//                     </Button>
//                   </div>
//                 </CardBody>
//               </Card>
//             </Col>
//           ))}
//         </Row>
//         {/* Create Menu Modal */}
//         <Modal 
//           isOpen={createModalOpen} 
//           toggle={() => setCreateModalOpen(false)} 
//           size="lg" 
//         >
//           <ModalHeader toggle={() => setCreateModalOpen(false)}>
//             Create New Menu
//           </ModalHeader>
//           <ModalBody>
//             <MenuModalContent 
//               menuData={newMenu}
//               setMenuData={setNewMenu}
//               type="create"
//               onAddOption={() => addMenuOption('create')}
//               onRemoveOption={(index) => removeMenuOption(index, 'create')}
//             />
//           </ModalBody>
//           <ModalFooter>
//             <Button color="secondary" onClick={() => setCreateModalOpen(false)}>
//               Cancel
//             </Button>
//             <Button color="primary" onClick={handleCreateMenu}>
//               Create Menu
//             </Button>
//           </ModalFooter>
//         </Modal>

//         {/* Delete Confirmation Modal */}
//         <Modal isOpen={deleteModal} toggle={() => setDeleteModal(false)}>
//           <ModalHeader toggle={() => setDeleteModal(false)}>
//             Confirm Delete
//           </ModalHeader>
//           <ModalBody>
//             Are you sure you want to delete the menu "{menuToDelete?.menuTitle}"? This action cannot be undone.
//           </ModalBody>
//           <ModalFooter>
//             <Button color="secondary" onClick={() => setDeleteModal(false)}>
//               Cancel
//             </Button>
//             <Button color="danger" onClick={handleDelete}>
//               Yes, Delete
//             </Button>
//           </ModalFooter>
//         </Modal>

//         {/* Edit Menu Modal */}
//         <Modal 
//           isOpen={editModalOpen} 
//           toggle={() => setEditModalOpen(false)} 
//           size="lg" 
//         >
//           <ModalHeader toggle={() => setEditModalOpen(false)}>
//             Edit Menu: {selectedMenu?.menuTitle}
//           </ModalHeader>
//           <ModalBody>
//             <MenuModalContent 
//               menuData={selectedMenu || {}}
//               setMenuData={setSelectedMenu}
//               type="edit"
//               onAddOption={() => addMenuOption('edit')}
//               onRemoveOption={(index) => removeMenuOption(index, 'edit')}
//             />
//           </ModalBody>
//           <ModalFooter>
//             <Button color="secondary" onClick={() => setEditModalOpen(false)}>
//               Cancel
//             </Button>
//             <Button 
//               color="primary" 
//               onClick={handleSaveMenu}
//               disabled={!selectedMenu?.menuTitle}
//             >
//               Save Changes
//             </Button>
//           </ModalFooter>
//         </Modal>
//       </div>
//     </>
//   )
// }

// export default WhatsAppMenus






import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { 
  Card, CardBody, CardTitle, 
  Button, Row, Col, Modal, 
  ModalHeader, ModalBody, ModalFooter,
  Form, FormGroup, Label, Input,
  Badge, Alert
} from 'reactstrap'
import { 
  Edit2, Trash2, PlusCircle, 
  AlignLeft, FileText, X 
} from 'lucide-react'
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap'
import { MENU_API_ENDPOINT, MENU_ENDPOINTS } from 'Api/Constant'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import "../../assets/css/WhatsAppMenus.css";  // Import the new CSS file

const WhatsAppMenus = () => {
  const [menus, setMenus] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedMenu, setSelectedMenu] = useState(null)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [menuToDelete, setMenuToDelete] = useState(null)
  const [activeTab, setActiveTab] = useState('basic')
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
    setApiLoading(true)
    try {
      const validMenuOptions = newMenu.menuOptions.filter(option => 
        option.title.trim() !== '' || 
        option.nextMenuId.trim() !== '' || 
        option.apiCall.trim() !== ''
      )

      const response = await axios.post(MENU_ENDPOINTS.CREATE, {
        menuId: newMenu.menuId,
        menuTitle: newMenu.menuTitle,
        menuOptions: validMenuOptions.map(option => ({
          id: option.id,
          title: option.title,
          nextMenuId: option.nextMenuId,
          apiCall: option.apiCall || ''
        }))
      })
      
      setMenus([...menus, response.data.data])
      setCreateModalOpen(false)
      setNewMenu({
        menuId: '',
        menuTitle: '',
        menuOptions: [{ 
          id: ``, 
          title: '', 
          nextMenuId: '', 
          apiCall: '' 
        }]
      })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create menu')
    } finally {
      setApiLoading(false)
    }
  }

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
    <>
      {/* Loading Overlay */}
      {(loading || apiLoading) && (
        <div className="loading-overlay">
          <DotLottieReact
            src="https://lottie.host/5060de43-85ac-474a-a85b-892f9730e17a/b3jJ1vGkWh.lottie"
            loop
            autoplay
            style={{ width: "150px", height: "150px" }}
          />
        </div>
      )}

      <div className="p-4 bg-light">
        {error && (
          <Alert color="danger" className="mb-3">
            <AlignLeft className="mr-2" />
            {error}
            <Button 
              close 
              onClick={() => setError(null)}
            />
          </Alert>
        )}

        <div className="d-flex justify-content-end mb-3">
          <Button 
            color="success" 
            onClick={() => setCreateModalOpen(true)}
          >
            <PlusCircle size={16} className="mr-1" /> Create New Menu
          </Button>
        </div>

        <Row>
          {menus.map((menu) => (
            <Col key={menu._id} md="4" sm="6" xs="12" className="mb-4">
              <Card className="shadow-sm hover-shadow">
                <CardBody>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <CardTitle tag="h5" className="mb-0">
                      {menu.menuTitle}
                    </CardTitle>
                    <Badge color="info">{menu.menuId}</Badge>
                  </div>

                  <div className="mb-3">
                    {menu.menuOptions.slice(0,3).map((option) => (
                      <div 
                        key={option.id} 
                        className="d-flex align-items-center mb-2"
                      >
                        <FileText size={16} className="mr-2 text-muted" />
                        <span>{option.title}</span>
                      </div>
                    ))}
                    {menu.menuOptions.length > 3 && (
                      <div className="text-muted small">
                        +{menu.menuOptions.length - 3} more options
                      </div>
                    )}
                  </div>

                  <div className="d-flex justify-content-between">
                    <Button 
                      color="primary" 
                      outline
                      size="sm" 
                      onClick={() => handleEdit(menu)}
                    >
                      <Edit2 size={16} className="mr-1" /> Edit
                    </Button>
                    <Button 
                      color="danger" 
                      outline
                      size="sm" 
                      onClick={() => confirmDelete(menu)}
                    >
                      <Trash2 size={16} className="mr-1" /> Delete
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
        >
          <ModalHeader toggle={() => setCreateModalOpen(false)}>
            Create New Menu
          </ModalHeader>
          <ModalBody>
            <MenuModalContent 
              menuData={newMenu}
              setMenuData={setNewMenu}
              type="create"
              onAddOption={() => addMenuOption('create')}
              onRemoveOption={(index) => removeMenuOption(index,'create')}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button color="primary" onClick={handleCreateMenu}>
              Create Menu
            </Button>
          </ModalFooter>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal isOpen={deleteModal} toggle={() => setDeleteModal(false)}>
          <ModalHeader toggle={() => setDeleteModal(false)}>
            Confirm Delete
          </ModalHeader>
          <ModalBody>
            Are you sure you want to delete the menu "{menuToDelete?.menuTitle}"? This action cannot be undone.
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={() => setDeleteModal(false)}>
              Cancel
            </Button>
            <Button color="danger" onClick={handleDelete}>
              Yes, Delete
            </Button>
          </ModalFooter>
        </Modal>

        {/* Edit Menu Modal */}
        <Modal 
          isOpen={editModalOpen} 
          toggle={() => setEditModalOpen(false)} 
          size="lg" 
        >
          <ModalHeader toggle={() => setEditModalOpen(false)}>
            Edit Menu: {selectedMenu?.menuTitle}
          </ModalHeader>
          <ModalBody>
            <MenuModalContent 
              menuData={selectedMenu || {}}
              setMenuData={setSelectedMenu}
              type="edit"
              onAddOption={() => addMenuOption('edit')}
              onRemoveOption={(index) => removeMenuOption(index, 'edit')}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={() => setEditModalOpen(false)}>
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
      </div>
    </>
  )
}

export default WhatsAppMenus