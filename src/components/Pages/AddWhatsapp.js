
// import React, { useState } from "react";
// import { Card, CardHeader, CardBody, Form, FormGroup, Label, Input, Button } from "reactstrap";
// import axios from "axios";
// import { COMPANY_API_ENDPOINT } from "Api/Constant";
// import { toast } from "sonner";
// import { useNavigate } from "react-router-dom";

// const AddWhatsapp = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     name: "",
//     phoneNumber: "",
//     status: "active",
//     description: "",
//   });

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const token = localStorage.getItem("token");
//     if (!token) {
//       toast.error("No token found, please login again.");
//       navigate("/login");
//       return;
//     }

//     const phoneRegex = /^[+]?[0-9]{10,14}$/;
//     if (!phoneRegex.test(formData.phoneNumber)) {
//       toast.error("Please enter a valid phone number.");
//       return;
//     }

//     try {
//       // Log the payload being sent
//       console.log("Payload being sent:", formData);

//       const res = await axios.post(
//         `${COMPANY_API_ENDPOINT}/create`,
//         formData,
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           withCredentials: true,
//         }
//       );
      
//       if (res.data.success === false && res.data.message) {
//         toast.error(res.data.message);  
//         return;
//       }

//       if (res.data.success) {
//         toast.success("Company created successfully!");
//         setFormData({
//           name: "",
//           phoneNumber: "",
//           status: "active",
//           description: "",
//         });
//         navigate("/admin/dashboard", { state: { refresh: true } });
//       } else {
//         toast.error("Failed to create company.");
//       }
//     } catch (error) {
//       console.error("Error creating company:", error);
//       if (error.response && error.response.data && error.response.data.message) {
//         toast.error(error.response.data.message);
//           }    }
//   };

//   return (
//     <div>
//       {/* <Header /> */}

//       <div className="container mt-5">
//         <Card className="shadow-lg border-0">
//           <CardHeader className="text-black text-center py-3">
//             <h3 className="mb-0">Create Company</h3>
//             <p className="text-black-50 mb-0">Set up a new company account</p>
//           </CardHeader>

//           <CardBody
//             className="px-lg-3"
//             style={{ maxHeight: "900px", overflowY: "auto", paddingTop: "10px", paddingBottom: "20px" }}
//           >
//             <Form role="form" onSubmit={handleSubmit}>
//               <FormGroup className="mb-2">
//                 <Label className="form-control-label">Name</Label>
//                 <Input
//                   name="name"
//                   type="text"
//                   placeholder="Enter company name"
//                   value={formData.name}
//                   onChange={handleInputChange}
//                   required
//                   className="form-control-alternative"
//                 />
//               </FormGroup>

//               <FormGroup className="mb-2">
//                 <Label className="form-control-label">Phone Number</Label>
//                 <Input
//                   name="phoneNumber"
//                   type="tel"
//                   placeholder="Enter phone number (e.g., +9234567890)"
//                   value={formData.phoneNumber}
//                   onChange={handleInputChange}
//                   required
//                   className="form-control-alternative"
//                 />
//               </FormGroup>

//               <FormGroup className="mb-2">
//                 <Label className="form-control-label">Status</Label>
//                 <Input
//                   type="select"
//                   name="status"
//                   value={formData.status}
//                   onChange={handleInputChange}
//                   className="form-control-alternative"
//                 >
//                   <option value="active">Active</option>
//                   <option value="inactive">Inactive</option>
//                 </Input>
//               </FormGroup>

//               <FormGroup className="mb-2">
//                 <Label className="form-control-label">Description</Label>
//                 <Input
//                   name="description"
//                   type="textarea"
//                   placeholder="Enter company description (optional)"
//                   value={formData.description}
//                   onChange={handleInputChange}
//                   className="form-control-alternative"
//                   rows="2"
//                 />
//               </FormGroup>

//               <div className="text-center">
//                 <Button color="primary" type="submit" className="my-2">
//                   Save Company
//                 </Button>
//               </div>
//             </Form>
//           </CardBody>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default AddWhatsapp;










import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  InputGroup,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";
import axios from "axios";
import { COMPANY_API_ENDPOINT } from "Api/Constant";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { countryList } from "./countryList";
import '../../assets/css/AddWhatsapp.css'; 

const AddWhatsapp = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(countryList.find(c => c.country === "Pakistan") || countryList[0]);
  
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    status: "active",
    description: "",
  });

  const toggle = () => setDropdownOpen(prevState => !prevState);

  const filteredCountries = countryList.filter(country =>
    country.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
    country.code.includes(searchQuery)
  );

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setDropdownOpen(false);
    
    // Update phone number with new country code
    const phoneWithoutCode = formData.phoneNumber.replace(/^\+\d+/, '');
    setFormData(prev => ({
      ...prev,
      phoneNumber: `+${country.code}${phoneWithoutCode}`
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "phoneNumber") {
      // Keep the country code when updating phone number
      const phoneNumber = value.startsWith('+') ? value : `+${selectedCountry.code}${value.replace(/^\+?\d+/, '')}`;
      setFormData(prev => ({
        ...prev,
        phoneNumber
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("No token found, please login again.");
      navigate("/login");
      return;
    }

    const phoneRegex = /^\+[0-9]{10,14}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      toast.error("Please enter a valid phone number.");
      return;
    }

    try {
      const res = await axios.post(
        `${COMPANY_API_ENDPOINT}/create`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      
      if (res.data.success === false && res.data.message) {
        toast.error(res.data.message);  
        return;
      }

      if (res.data.success) {
        toast.success("Company created successfully!");
        setFormData({
          name: "",
          phoneNumber: "",
          status: "active",
          description: "",
        });
        navigate("/admin/dashboard", { state: { refresh: true } });
      } else {
        toast.error("Failed to create company.");
      }
    } catch (error) {
      console.error("Error creating company:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      }
    }
  };

  useEffect(() => {
    // Initialize phone number with selected country code
    setFormData(prev => ({
      ...prev,
      phoneNumber: `+${selectedCountry.code}`
    }));
  }, []);

  return (
    <div className="add-whatsapp-container">
      <div className="form-container">
        <Card className="form-card">
          {/* Modern Header with Icon */}
          <CardHeader className="modern-header">
            <div className="header-icon">🏢</div>
            <h2>Add New Company</h2>
            <p>Create a new business profile</p>
          </CardHeader>

          <CardBody className="modern-body">
            <Form onSubmit={handleSubmit}>
              {/* Company Name Field */}
              <FormGroup className="modern-form-group">
                <Label className="modern-label">
                  <span className="label-icon">💼</span>
                  Company Name
                </Label>
                <Input
                  name="name"
                  type="text"
                  placeholder="Enter company name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="modern-input"
                />
              </FormGroup>

              {/* Phone Number Field with Country Selector */}
              <FormGroup className="modern-form-group">
                <Label className="modern-label">
                  <span className="label-icon">📱</span>
                  Phone Number
                </Label>
                <InputGroup className="modern-input-group">
                  <Dropdown isOpen={dropdownOpen} toggle={() => setDropdownOpen(!dropdownOpen)} className="country-dropdown">
                    <DropdownToggle caret className="country-toggle">
                      <span className="country-flag">{selectedCountry.flag}</span>
                      <span className="country-code">+{selectedCountry.code}</span>
                    </DropdownToggle>
                    <DropdownMenu className="modern-dropdown-menu">
                      <div className="search-container">
                        <Input
                          type="text"
                          placeholder="🔍 Search countries..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="search-input"
                        />
                      </div>
                      <div className="countries-list">
                        {countryList
                          .filter(country =>
                            country.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            country.code.includes(searchQuery)
                          )
                          .map((country) => (
                            <DropdownItem 
                              key={country.code}
                              onClick={() => handleCountrySelect(country)}
                              className="country-item"
                            >
                              <span className="country-flag">{country.flag}</span>
                              <span className="country-name">{country.country}</span>
                              <span className="country-code">+{country.code}</span>
                            </DropdownItem>
                          ))}
                      </div>
                    </DropdownMenu>
                  </Dropdown>
                  <Input
                    name="phoneNumber"
                    type="tel"
                    placeholder="Enter phone number"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    required
                    className="phone-input"
                  />
                </InputGroup>
              </FormGroup>

              {/* Status Field */}
              <FormGroup className="modern-form-group">
                <Label className="modern-label">
                  <span className="label-icon">🔄</span>
                  Status
                </Label>
                <Input
                  type="select"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="modern-select"
                >
                  <option value="active">✅ Active</option>
                  <option value="inactive">⭕ Inactive</option>
                </Input>
              </FormGroup>

              {/* Description Field */}
              <FormGroup className="modern-form-group">
                <Label className="modern-label">
                  <span className="label-icon">📝</span>
                  Description
                </Label>
                <Input
                  name="description"
                  type="textarea"
                  placeholder="Tell us about the company..."
                  value={formData.description}
                  onChange={handleInputChange}
                  className="modern-textarea"
                  rows="4"
                />
              </FormGroup>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="modern-button"
              >
                Create Company Profile
              </Button>
            </Form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default AddWhatsapp;