import React, { useState } from "react";
import { Modal, Card, CardHeader, CardBody, Form, FormGroup, InputGroup, InputGroupAddon, InputGroupText, Input, Button } from "reactstrap";
import axios from "axios";
import { COMPANY_API_ENDPOINT } from "Api/Constant";

const CreateWhatsappModal = ({ isOpen, toggleModal }) => {
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    status: "",
    description: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Get token from localStorage
    const token = localStorage.getItem('token');

    // Ensure the data is valid before submitting
    if (!formData.name || !formData.phoneNumber || !formData.status) {
      alert("Name, Phone Number, and Status are required.");
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
        alert("WhatsApp account created successfully!");
        toggleModal(); // Close the modal after success
        setFormData({ name: "", phoneNumber: "", status: "", description: "" }); // Reset form
      } else {
        alert("Failed to create WhatsApp account.");
      }
    } catch (error) {
      console.error("Error creating WhatsApp account:", error);
      alert("An error occurred while creating the WhatsApp account.");
    }
  };

  return (
    <>
    <Modal
      className="modal-dialog-centered"
      size="lg" // Adjust size as needed
      isOpen={isOpen}
      toggle={toggleModal}
      style={{
        maxWidth: "700px", // Adjust modal width
        marginx: "400px", // Center modal
        marginTop: "50px", // Center modal
        marginBottom:  "50px", 
        
      }}
    >
      <div className="">
        <Card className="bg-secondary shadow border-0">
          <CardHeader className="bg-transparent">
            <h3 style={{ textAlign: "center", fontWeight: "bold", color: "#333" }}>
              Create Whatsapp
            </h3>
            <p style={{ textAlign: "center", fontSize: "14px", color: "#555" }}>
              Create a new WhatsApp account
            </p>
          </CardHeader>

          <CardBody className="">
            <Form role="form" onSubmit={handleSubmit}>
              {/* Name Field */}
              <FormGroup className="">
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-circle-08" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Name"
                    type="text"
                  />
                </InputGroup>
              </FormGroup>

              {/* Phone Number with Country Selector */}
              <FormGroup className="">
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-mobile-button" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    type="tel"
                    placeholder="Phone Number"
                  />
                </InputGroup>
                <div className="mt-2">
                  <select
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                    }}
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                  >
                    <option value="" disabled selected>
                      Choose Country
                    </option>
                    <option value="us">United States</option>
                    <option value="pk">Pakistan</option>
                    <option value="in">India</option>
                    {/* Add other country options as needed */}
                  </select>
                </div>
              </FormGroup>

              {/* Status Dropdown */}
              <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-check-bold" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                    }}
                  >
                    <option value="" disabled selected>
                      Status
                    </option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </InputGroup>
              </FormGroup>

              {/* Description Field */}
              <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-align-left-2" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    type="textarea"
                    placeholder="Description"
                    rows="3"
                  />
                </InputGroup>
              </FormGroup>

              {/* Save Button */}
              <div className="text-center">
                <Button className="my-4" color="primary" type="submit">
                  Save
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
      </div>
    </Modal>
    </>
  );
};

export default CreateWhatsappModal;
