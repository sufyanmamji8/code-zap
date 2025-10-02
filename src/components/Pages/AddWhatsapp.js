
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
  DropdownItem,
  Progress,
  Container,
  Row,
  Col
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { COMPANY_API_ENDPOINT } from "Api/Constant";
import { countryList } from "./countryList";
import { Building2, Phone, FileText, ArrowLeft } from 'lucide-react';

const AddWhatsapp = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [formProgress, setFormProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(
    countryList.find((c) => c.country === "Pakistan") || countryList[0]
  );

  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    status: "active",
    description: "",
  });

  // Calculate form completion progress
  useEffect(() => {
    let progress = 0;
    if (formData.name) progress += 25;
    if (formData.phoneNumber.length > 5) progress += 25;
    if (formData.status) progress += 25;
    if (formData.description) progress += 25;
    setFormProgress(progress);
  }, [formData]);

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setDropdownOpen(false);
    const phoneWithoutCode = formData.phoneNumber.replace(/^\+?\d+/, "");
    setFormData((prev) => ({
      ...prev,
      phoneNumber: `${country.code}${phoneWithoutCode}`,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "phoneNumber") {
      const cleanValue = value.replace(/\+/g, "");
      const phoneNumber = cleanValue.startsWith(selectedCountry.code)
        ? cleanValue
        : `${selectedCountry.code}${cleanValue.replace(/^\d+/, "")}`;
      setFormData((prev) => ({
        ...prev,
        phoneNumber,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("No token found, please login again.");
      navigate("/login");
      return;
    }

    const phoneRegex = /^[0-9]{10,14}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      toast.error("Please enter a valid phone number.");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await axios.post(`${COMPANY_API_ENDPOINT}/create`, formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success("✨ Company profile created successfully!");
        navigate("/admin/dashboard", { state: { refresh: true } });
      } else {
        toast.error(res.data.message || "Failed to create company.");
      }
    } catch (error) {
      console.error("Error creating company:", error);
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Inline CSS styles
  const styles = `
    .add-whatsapp-page {
      background: #f8fafc;
      min-height: 100vh;
      padding-top: 2rem;
    }

    .company-card {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
    }

    .card-header-custom {
      background: linear-gradient(90deg, #25D366, #128C7E);
      color: white;
      border-radius: 12px 12px 0 0;
      border: none;
    }

    .progress-bar-custom {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 10px;
      overflow: hidden;
    }

    .progress-fill {
      background: linear-gradient(90deg, #25D366, #128C7E);
      border-radius: 10px;
      transition: width 0.5s ease-in-out;
    }

    .form-control-custom {
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 12px 16px;
      font-size: 14px;
    }

    .form-control-custom:focus {
      border-color: #25D366;
      box-shadow: 0 0 0 0.2rem rgba(37, 211, 102, 0.25);
    }

    .dropdown-toggle-custom {
      background: white;
      border: 1px solid #cbd5e1;
      border-right: none;
      border-radius: 8px 0 0 8px;
      color: #374151;
      font-weight: 500;
    }

    .phone-input-custom {
      border-radius: 0 8px 8px 0;
      border-left: none;
    }

    .btn-primary-custom {
      background: #25D366;
      border: none;
      border-radius: 8px;
      font-weight: 500;
      padding: 12px 24px;
    }

    .btn-primary-custom:hover:not(:disabled) {
      background: #128C7E;
      transform: translateY(-1px);
    }

    .btn-primary-custom:disabled {
      background: #cbd5e1;
      cursor: not-allowed;
    }

    .btn-outline-custom {
      background: #f8fafc;
      color: #475569;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      font-weight: 500;
    }

    .dropdown-menu-custom {
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }

    .form-icon {
      color: #075E54;
      margin-right: 12px;
    }
  `;

  return (
    <div className="add-whatsapp-page">
      <style>{styles}</style>
      <Container style={{ marginTop: '5rem' }}>
        {/* Back Button - Mobile */}
        <Row className="d-md-none mb-3">
          <Col>
            <Button
              className="btn-outline-custom w-100 d-flex align-items-center justify-content-center"
              onClick={() => navigate("/admin/dashboard")}
            >
              <ArrowLeft size={18} className="me-2" />
              Back to Dashboard
            </Button>
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col md="10" lg="8" xl="6">
            <Card className="company-card shadow-sm">
              <CardHeader className="card-header-custom p-4">
                <div className="text-center">
                  <div className="d-flex justify-content-center mb-3">
                    <div 
                      style={{
                        background: "rgba(255, 255, 255, 0.2)",
                        borderRadius: "12px",
                        padding: "16px",
                        display: "inline-flex"
                      }}
                    >
                      <Building2 size={28} color="white" />
                    </div>
                  </div>
                  <h3 className="fw-bold mb-2">Create WhatsApp Account</h3>
                  <p className="mb-0 opacity-90">Add a new business account to your dashboard</p>
                  
                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="d-flex justify-content-between text-white mb-2 small">
                      <span>Form Progress</span>
                      <span>{formProgress}%</span>
                    </div>
                    <div className="progress-bar-custom">
                      <div 
                        className="progress-fill"
                        style={{ height: "8px", width: `${formProgress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardBody className="p-4">
                <Form onSubmit={handleSubmit}>
                  {/* Company Name */}
                  <FormGroup className="mb-4">
                    <Label className="fw-bold mb-2 d-flex align-items-center">
                      <Building2 size={20} className="form-icon" />
                      Company Name
                    </Label>
                    <Input
                      name="name"
                      type="text"
                      placeholder="Enter company name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="form-control-custom"
                    />
                  </FormGroup>

                  {/* Phone Number */}
                  <FormGroup className="mb-4">
                    <Label className="fw-bold mb-2 d-flex align-items-center">
                      <Phone size={20} className="form-icon" />
                      Phone Number
                    </Label>
                    <InputGroup>
                      <Dropdown
                        isOpen={dropdownOpen}
                        toggle={() => setDropdownOpen(!dropdownOpen)}
                      >
                        <DropdownToggle className="dropdown-toggle-custom px-3">
                          {selectedCountry.flag} +{selectedCountry.code}
                        </DropdownToggle>
                        <DropdownMenu className="dropdown-menu-custom">
                          <div className="p-3 border-bottom">
                            <Input
                              type="text"
                              placeholder="Search countries..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="form-control-custom"
                            />
                          </div>
                          <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                            {countryList
                              .filter(
                                (country) =>
                                  country.country
                                    .toLowerCase()
                                    .includes(searchQuery.toLowerCase()) ||
                                  country.code.includes(searchQuery)
                              )
                              .map((country) => (
                                <DropdownItem
                                  key={country.code}
                                  onClick={() => handleCountrySelect(country)}
                                  className="px-3 py-2"
                                >
                                  <div className="d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-center">
                                      <span className="me-3">{country.flag}</span>
                                      <span className="fw-medium">{country.country}</span>
                                    </div>
                                    <span className="text-muted">+{country.code}</span>
                                  </div>
                                </DropdownItem>
                              ))}
                          </div>
                        </DropdownMenu>
                      </Dropdown>
                      <Input
                        name="phoneNumber"
                        type="tel"
                        placeholder="Enter phone number"
                        value={formData.phoneNumber.replace(selectedCountry.code, '')}
                        onChange={handleInputChange}
                        required
                        className="form-control-custom phone-input-custom"
                      />
                    </InputGroup>
                  </FormGroup>

                  {/* Status */}
                  <FormGroup className="mb-4">
                    <Label className="fw-bold mb-2 d-flex align-items-center">
                      <FileText size={20} className="form-icon" />
                      Status
                    </Label>
                    <Input
                      type="select"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="form-control-custom"
                      style={{ height: '48px' }}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </Input>
                  </FormGroup>

                  {/* Description */}
                  <FormGroup className="mb-4">
                    <Label className="fw-bold mb-2 d-flex align-items-center">
                      <FileText size={20} className="form-icon" />
                      Description
                    </Label>
                    <Input
                      name="description"
                      type="textarea"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="4"
                      placeholder="Enter company description"
                      className="form-control-custom"
                      style={{ resize: 'vertical' }}
                    />
                  </FormGroup>

                  {/* Submit Button */}
                  <div className="d-flex flex-column flex-md-row justify-content-between gap-3 mt-4">
                    <Button
                      className="btn-outline-custom order-2 order-md-1 w-100 w-md-auto px-4 d-none d-md-flex align-items-center justify-content-center"
                      onClick={() => navigate("/admin/dashboard")}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="btn-primary-custom order-1 order-md-2 w-100 w-md-auto px-4 d-flex align-items-center justify-content-center"
                      type="submit"
                      disabled={isSubmitting || formProgress < 100}
                    >
                      {isSubmitting ? (
                        <div className="d-flex align-items-center">
                          <div className="spinner-border spinner-border-sm me-2" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                          Creating Account...
                        </div>
                      ) : (
                        <div className="d-flex align-items-center">
                          <Building2 size={18} className="me-2 " />
                          Create Account
                        </div>
                      )}
                    </Button>
                  </div>

                  {/* Mobile cancel button */}
                  <Button
                    className="btn-outline-custom w-100 mt-3 d-md-none d-flex align-items-center justify-content-center"
                    onClick={() => navigate("/admin/dashboard")}
                  >
                    Cancel
                  </Button>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AddWhatsapp;