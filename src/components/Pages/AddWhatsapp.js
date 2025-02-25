
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
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { COMPANY_API_ENDPOINT } from "Api/Constant";
import { countryList } from "./countryList";

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
      // Remove any plus sign from the input
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

    // Modified phone validation regex to not require a plus sign
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

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-white border-0 p-4">
            <div className="text-center">
              {/* <div className="text-4xl mb-2">🏢</div> */}
              <h2 className="text-2xl font-bold mb-1">Create New Company</h2>
              <p className="text-gray-600">Let's set up your business profile</p>
              <Progress
                value={formProgress}
                className="mt-4"
                style={{
                  height: "8px",
                  backgroundColor: "#f0f0f0",
                }}
                color="info"
              />
            </div>
          </CardHeader>

          <CardBody className="p-4">
            <Form onSubmit={handleSubmit}>
              <FormGroup className="mb-4">
                <Label className="font-semibold mb-2 flex items-center">
                  {/* <span className="mr-2">💼</span> */}
                  Company Name
                </Label>
                <Input
                  name="name"
                  type="text"
                  placeholder="Enter your company name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="border-2 p-2 rounded-lg focus:border-blue-500 transition-all"
                />
              </FormGroup>

              <FormGroup className="mb-4">
                <Label className="font-semibold mb-2 flex items-center">
                  {/* <span className="mr-2">📱</span> */}
                  Phone Number
                </Label>
                <InputGroup>
                  <Dropdown
                    isOpen={dropdownOpen}
                    toggle={() => setDropdownOpen(!dropdownOpen)}
                  >
                    <DropdownToggle
                      caret
                      className="bg-white text-dark border-2 rounded-l-lg px-3"
                    >
                      {selectedCountry.flag} {selectedCountry.code}
                    </DropdownToggle>
                    <DropdownMenu className="p-0 border-2">
                      <div className="p-2 border-b">
                        <Input
                          type="text"
                          placeholder="🔍 Search countries..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="border rounded"
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
                              className="p-2 hover:bg-gray-100"
                            >
                              <span className="mr-2">{country.flag}</span>
                              <span className="mr-2">{country.country}</span>
                              <span className="text-gray-600">
                                {country.code}
                              </span>
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
                    className="border-2 rounded-r-lg"
                  />
                </InputGroup>
              </FormGroup>

              <FormGroup className="mb-4">
                <Label className="font-semibold mb-2 flex items-center">
                  {/* <span className="mr-2">🔄</span> */}
                  Status
                </Label>
                <Input
                  type="select"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="border-2 rounded-lg"
                >
                  <option value="active"> Active</option>
                  <option value="inactive"> Inactive</option>
                </Input>
              </FormGroup>

              <FormGroup className="mb-4">
                <Label className="font-semibold mb-2 flex items-center">
                  {/* <span className="mr-2">📝</span> */}
                  Description
                </Label>
                <Input
                  name="description"
                  type="textarea"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="border-2 rounded-lg"
                  rows="4"
                />
              </FormGroup>

              <Button
                type="submit"
                color="primary"
                className=" p-3 rounded-lg"
                disabled={isSubmitting || formProgress < 100}
              >
                {isSubmitting ? (
                  <span>Creating Profile...</span>
                ) : (
                  <span>Create Company Profile</span>
                )}
              </Button>
            </Form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default AddWhatsapp;