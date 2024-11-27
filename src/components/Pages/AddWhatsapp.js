import React, { useState } from "react";
import { Card, CardHeader, CardBody, Form, FormGroup, Label, Input, Button } from "reactstrap";
import axios from "axios";
import { COMPANY_API_ENDPOINT } from "Api/Constant";
import { toast } from "sonner";
import Header from "components/Headers/Header";
import { useNavigate } from "react-router-dom";

const AddWhatsapp = () => {
     const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    status: "active",
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

    const token = localStorage.getItem('token');

    const phoneRegex = /^[+]?[0-9]{10,14}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      toast.error("Please enter a valid phone number.");
      navigate("/admin/dashboard");
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
        toast.success("WhatsApp account created successfully!");
        setFormData({ name: "", phoneNumber: "", status: "active", description: "" }); 
      } else {
        toast.error("Failed to create WhatsApp account.");
      }
    } catch (error) {
      console.error("Error creating WhatsApp account:", error);
      toast.error("An error occurred while creating the WhatsApp account.");
    }
  };

  return (
    <div>
      <Header />
      
      <div className="container mt-5">
        <Card className="shadow-lg border-0">
          <CardHeader className="text-black text-center py-3">
            <h3 className="mb-0">Create WhatsApp Account</h3>
            <p className="text-black-50 mb-0">Set up a new WhatsApp connection</p>
          </CardHeader>

          <CardBody 
            className="px-lg-3" 
            style={{ maxHeight: "900px", overflowY: "auto", paddingTop: "10px", paddingBottom: "20px" }}
          >
            <Form role="form" onSubmit={handleSubmit}>
              {/* Name Field */}
              <FormGroup className="mb-2">
                <Label className="form-control-label">Name</Label>
                <Input
                  name="name"
                  type="text"
                  placeholder="Enter account name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="form-control-alternative"
                />
              </FormGroup>

              {/* Phone Number Field */}
              <FormGroup className="mb-2">
                <Label className="form-control-label">Phone Number</Label>
                <Input
                  name="phoneNumber"
                  type="tel"
                  placeholder="Enter phone number (e.g., +9234567890)"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  required
                  className="form-control-alternative"
                />
              </FormGroup>

              {/* Status Dropdown */}
              <FormGroup className="mb-2">
                <Label className="form-control-label">Status</Label>
                <Input
                  type="select"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="form-control-alternative"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </Input>
              </FormGroup>

              {/* Description Field */}
              <FormGroup className="mb-2">
                <Label className="form-control-label">Description</Label>
                <Input
                  name="description"
                  type="textarea"
                  placeholder="Enter account description (optional)"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="form-control-alternative"
                  rows="2"
                />
              </FormGroup>

              {/* Submit Button */}
              <div className="text-center">
                <Button color="primary" type="submit" className="my-2">
                  Save WhatsApp Account
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default AddWhatsapp;
