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
//   AlignLeft, FileText 
// } from 'lucide-react'
// import { MENU_API_ENDPOINT } from 'Api/Constant'

// const WhatsAppMenus = () => {
//   const [menus, setMenus] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const [selectedMenu, setSelectedMenu] = useState(null)
//   const [modalOpen, setModalOpen] = useState(false)

//   useEffect(() => {
//     const fetchMenus = async () => {
//       try {
//         const response = await axios.get(`${MENU_API_ENDPOINT}/getAllMenus`)
//         console.log('Fetch Menus Response:', response.data)
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
//     console.log('Editing Menu:', menu)
//     setSelectedMenu({...menu})
//     setModalOpen(true)
//   }

//   const handleDelete = async (menuId) => {
//     console.log('Delete Attempt:', {
//       menuId,
//       fullMenu: menus.find(m => m.menuId === menuId)
//     })
  
//     try {
//       const response = await axios.delete(`${MENU_API_ENDPOINT}/delete/${menuId}`)
//       console.log('Delete Response:', response.data)
//       setMenus(menus.filter(menu => menu.menuId !== menuId))
//     } catch (err) {
//       console.error('Delete Error:', {
//         message: err.response?.data,
//         fullError: err
//       })
//       setError(err.response?.data?.message || err.message)
//     }
//   }

//   const handleSaveMenu = async () => {
//     try {
//       const response = await axios.put(
//         `${MENU_API_ENDPOINT}/update/${selectedMenu.menuId}`, 
//         {
//           menuTitle: selectedMenu.menuTitle,
//           menuOptions: selectedMenu.menuOptions.map(option => ({
//             id: option.id,
//             title: option.title,
//             nextMenuId: option.nextMenuId,
//             apiCall: option.apiCall || '' // Provide a default empty string if apiCall is undefined
//           }))
//         }
//       )
      
//       const updatedMenus = menus.map(menu => 
//         menu._id === selectedMenu._id ? selectedMenu : menu
//       )
//       setMenus(updatedMenus)
//       setModalOpen(false)
//     } catch (err) {
//       console.error('Save Menu Error:', err.response?.data || err.message)
//       setError(err.response?.data?.message || 'Failed to update menu')
//     }
//   }

//   const addMenuOption = () => {
//     setSelectedMenu(prev => ({
//       ...prev,
//       menuOptions: [
//         ...prev.menuOptions, 
//         { 
//           id: `new-${Date.now()}`, 
//           title: '', 
//           nextMenuId: '', 
//           apiCall: '' 
//         }
//       ]
//     }))
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
//         </Alert>
//       )}
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
//   color="danger" 
//   outline
//   size="sm" 
//   onClick={() => handleDelete(menu.menuId)}  // Use menuId instead of _id
// >
//   <Trash2 size={16} className="mr-1" /> Delete
// </Button>
//                 </div>
//               </CardBody>
//             </Card>
//           </Col>
//         ))}
//       </Row>

//       <Modal 
//         isOpen={modalOpen} 
//         toggle={() => setModalOpen(false)} 
//         size="lg" 
//         centered
//       >
//         <ModalHeader toggle={() => setModalOpen(false)}>
//           Edit Menu: {selectedMenu?.menuTitle}
//         </ModalHeader>
//         <ModalBody>
//           <Form>
//             <FormGroup>
//               <Label>Menu Title</Label>
//               <Input
//                 type="text"
//                 value={selectedMenu?.menuTitle || ''}
//                 onChange={(e) => setSelectedMenu(prev => ({
//                   ...prev,
//                   menuTitle: e.target.value
//                 }))}
//               />
//             </FormGroup>

//             <div className="d-flex justify-content-between align-items-center mb-3">
//               <h5>Menu Options</h5>
//               <Button 
//                 color="success" 
//                 size="sm" 
//                 onClick={addMenuOption}
//               >
//                 <PlusCircle size={16} className="mr-1" /> Add Option
//               </Button>
//             </div>

//             {selectedMenu?.menuOptions.map((option, index) => (
//               <div key={option.id} className="mb-3 p-3 border rounded">
//                 <FormGroup>
//                   <Label>Option Title</Label>
//                   <Input
//                     type="text"
//                     value={option.title}
//                     onChange={(e) => {
//                       const updatedOptions = [...selectedMenu.menuOptions]
//                       updatedOptions[index].title = e.target.value
//                       setSelectedMenu(prev => ({
//                         ...prev,
//                         menuOptions: updatedOptions
//                       }))
//                     }}
//                   />
//                 </FormGroup>
//                 <FormGroup>
//                   <Label>Next Menu ID</Label>
//                   <Input
//                     type="text"
//                     value={option.nextMenuId}
//                     onChange={(e) => {
//                       const updatedOptions = [...selectedMenu.menuOptions]
//                       updatedOptions[index].nextMenuId = e.target.value
//                       setSelectedMenu(prev => ({
//                         ...prev,
//                         menuOptions: updatedOptions
//                       }))
//                     }}
//                   />
//                 </FormGroup>
//               </div>
//             ))}
//           </Form>
//         </ModalBody>
//         <ModalFooter>
//           <Button color="secondary" onClick={() => setModalOpen(false)}>
//             Cancel
//           </Button>
//           <Button color="primary" onClick={handleSaveMenu}>
//             Save Changes
//           </Button>
//         </ModalFooter>
//       </Modal>
//     </div>
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
  Badge, Spinner, Alert
} from 'reactstrap'
import { 
  Edit2, Trash2, PlusCircle, 
  AlignLeft, FileText, X 
} from 'lucide-react'
import { MENU_API_ENDPOINT, MENU_ENDPOINTS } from 'Api/Constant'

const WhatsAppMenus = () => {
  const [menus, setMenus] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedMenu, setSelectedMenu] = useState(null)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [newMenu, setNewMenu] = useState({
    menuId: '',
    menuTitle: '',
    menuOptions: [
      { 
        id: `initial-${Date.now()}`, 
        title: '', 
        nextMenuId: '', 
        apiCall: '' 
      }
    ]
  })


  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await axios.get(`${MENU_API_ENDPOINT}/getAllMenus`)
        setMenus(response.data.data || [])
        setLoading(false)
      } catch (err) {
        console.error('Fetch Menus Error:', err.response?.data || err.message)
        setError(err.response?.data?.message || err.message)
        setLoading(false)
      }
    }

    fetchMenus()
  }, [])

  const handleEdit = (menu) => {
    setSelectedMenu({...menu})
    setEditModalOpen(true)
  }

  const handleDelete = async (menuId) => {
    try {
      await axios.delete(`${MENU_API_ENDPOINT}/delete/${menuId}`)
      setMenus(menus.filter(menu => menu.menuId !== menuId))
    } catch (err) {
      setError(err.response?.data?.message || err.message)
    }
  }

  const handleSaveMenu = async () => {
    try {
      const response = await axios.put(
        `${MENU_API_ENDPOINT}/update/${selectedMenu.menuId}`, 
        {
          menuTitle: selectedMenu.menuTitle,
          menuOptions: selectedMenu.menuOptions.map(option => ({
            id: option.id,
            title: option.title,
            nextMenuId: option.nextMenuId,
            apiCall: option.apiCall || ''
          }))
        }
      )
      
      const updatedMenus = menus.map(menu => 
        menu._id === selectedMenu._id ? selectedMenu : menu
      )
      setMenus(updatedMenus)
      setEditModalOpen(false)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update menu')
    }
  }

  const handleCreateMenu = async () => {
    try {
      // Filter out any empty menu options
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
          id: `initial-${Date.now()}`, 
          title: '', 
          nextMenuId: '', 
          apiCall: '' 
        }]
      })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create menu')
    }
  }

  const addMenuOption = (type = 'edit') => {
    if (type === 'edit') {
      setSelectedMenu(prev => ({
        ...prev,
        menuOptions: [
          ...prev.menuOptions, 
          { 
            id: `new-${Date.now()}`, 
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
            id: `new-${Date.now()}`, 
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

  if (loading) return (
    <div className="text-center p-5">
      <Spinner color="primary" />
      <p className="mt-3">Loading Menus...</p>
    </div>
  )

  return (
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
            <Card className="shadow-sm hover:shadow-lg transition-all">
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
                    onClick={() => handleDelete(menu.menuId)}
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
    centered
  >
    <ModalHeader toggle={() => setCreateModalOpen(false)}>
      Create New Menu
    </ModalHeader>
    <ModalBody>
      <Form>
        <FormGroup>
          <Label>Menu ID</Label>
          <Input
            type="text"
            value={newMenu.menuId}
            onChange={(e) => setNewMenu(prev => ({
              ...prev,
              menuId: e.target.value
            }))}
          />
        </FormGroup>
        <FormGroup>
          <Label>Menu Title</Label>
          <Input
            type="text"
            value={newMenu.menuTitle}
            onChange={(e) => setNewMenu(prev => ({
              ...prev,
              menuTitle: e.target.value
            }))}
          />
        </FormGroup>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5>Menu Options</h5>
          <Button 
            color="success" 
            size="sm" 
            onClick={() => {
              const newOption = {
                id: `new-${Date.now()}`,
                title: '',
                nextMenuId: '',
                apiCall: ''
              }
              setNewMenu(prev => ({
                ...prev,
                menuOptions: [...prev.menuOptions, newOption]
              }))
            }}
          >
            <PlusCircle size={16} className="mr-1" /> Add Option
          </Button>
        </div>

        {newMenu.menuOptions.map((option, index) => (
          <div key={option.id} className="mb-3 p-3 border rounded">
            <FormGroup>
              <Label>Option ID</Label>
              <Input
                type="text"
                value={option.id}
                onChange={(e) => {
                  const updatedOptions = [...newMenu.menuOptions]
                  updatedOptions[index].id = e.target.value
                  setNewMenu(prev => ({
                    ...prev,
                    menuOptions: updatedOptions
                  }))
                }}
              />
            </FormGroup>
            <FormGroup>
              <Label>Option Title</Label>
              <Input
                type="text"
                value={option.title}
                onChange={(e) => {
                  const updatedOptions = [...newMenu.menuOptions]
                  updatedOptions[index].title = e.target.value
                  setNewMenu(prev => ({
                    ...prev,
                    menuOptions: updatedOptions
                  }))
                }}
              />
            </FormGroup>
            <FormGroup>
              <Label>Next Menu ID</Label>
              <Input
                type="text"
                value={option.nextMenuId}
                onChange={(e) => {
                  const updatedOptions = [...newMenu.menuOptions]
                  updatedOptions[index].nextMenuId = e.target.value
                  setNewMenu(prev => ({
                    ...prev,
                    menuOptions: updatedOptions
                  }))
                }}
              />
            </FormGroup>
            <FormGroup>
              <Label>API Call</Label>
              <Input
                type="text"
                value={option.apiCall}
                onChange={(e) => {
                  const updatedOptions = [...newMenu.menuOptions]
                  updatedOptions[index].apiCall = e.target.value
                  setNewMenu(prev => ({
                    ...prev,
                    menuOptions: updatedOptions
                  }))
                }}
              />
            </FormGroup>
          </div>
        ))}
      </Form>
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

      {/* Edit Menu Modal */}
      <Modal 
        isOpen={editModalOpen} 
        toggle={() => setEditModalOpen(false)} 
        size="lg" 
        centered
      >
        <ModalHeader toggle={() => setEditModalOpen(false)}>
          Edit Menu: {selectedMenu?.menuTitle}
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label>Menu Title</Label>
              <Input
                type="text"
                value={selectedMenu?.menuTitle || ''}
                onChange={(e) => setSelectedMenu(prev => ({
                  ...prev,
                  menuTitle: e.target.value
                }))}
              />
            </FormGroup>

            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5>Menu Options</h5>
              <Button 
      color="success" 
      size="sm" 
      onClick={() => {
        const newOption = {
          id: `option-${Date.now()}`,
          title: '',
          nextMenuId: '',
          apiCall: ''
        }
        setNewMenu(prev => ({
          ...prev,
          menuOptions: [...prev.menuOptions, newOption]
        }))
      }}
    >
      <PlusCircle size={16} className="mr-1" /> Add Option
    </Button>
            </div>

            {selectedMenu?.menuOptions.map((option, index) => (
              <div key={option.id} className="mb-3 p-3 border rounded position-relative">
                {selectedMenu.menuOptions.length > 1 && (
                  <Button 
                    close 
                    className="position-absolute top-0 end-0 m-2"
                    onClick={() => removeMenuOption(index, 'edit')}
                  >
                    <X size={20} />
                  </Button>
                )}
                <FormGroup>
                  <Label>Option Title</Label>
                  <Input
                    type="text"
                    value={option.title}
                    onChange={(e) => {
                      const updatedOptions = [...selectedMenu.menuOptions]
                      updatedOptions[index].title = e.target.value
                      setSelectedMenu(prev => ({
                        ...prev,
                        menuOptions: updatedOptions
                      }))
                    }}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Next Menu ID</Label>
                  <Input
                    type="text"
                    value={option.nextMenuId}
                    onChange={(e) => {
                      const updatedOptions = [...selectedMenu.menuOptions]
                      updatedOptions[index].nextMenuId = e.target.value
                      setSelectedMenu(prev => ({
                        ...prev,
                        menuOptions: updatedOptions
                      }))
                    }}
                  />
                </FormGroup>
              </div>
            ))}
          </Form>
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
  )
}

export default WhatsAppMenus
                      