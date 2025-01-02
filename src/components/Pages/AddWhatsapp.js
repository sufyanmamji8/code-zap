
import React, { useState } from "react";
import { Card, CardHeader, CardBody, Form, FormGroup, Label, Input, Button } from "reactstrap";
import axios from "axios";
import { COMPANY_API_ENDPOINT } from "Api/Constant";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const AddWhatsapp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    status: "active",
    description: "",
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

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("No token found, please login again.");
      navigate("/login");
      return;
    }

    const phoneRegex = /^[+]?[0-9]{10,14}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      toast.error("Please enter a valid phone number.");
      return;
    }

    try {
      // Log the payload being sent
      console.log("Payload being sent:", formData);

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
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
          }    }
  };

  return (
    <div>
      {/* <Header /> */}

      <div className="container mt-5">
        <Card className="shadow-lg border-0">
          <CardHeader className="text-black text-center py-3">
            <h3 className="mb-0">Create Company</h3>
            <p className="text-black-50 mb-0">Set up a new company account</p>
          </CardHeader>

          <CardBody
            className="px-lg-3"
            style={{ maxHeight: "900px", overflowY: "auto", paddingTop: "10px", paddingBottom: "20px" }}
          >
            <Form role="form" onSubmit={handleSubmit}>
              <FormGroup className="mb-2">
                <Label className="form-control-label">Name</Label>
                <Input
                  name="name"
                  type="text"
                  placeholder="Enter company name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="form-control-alternative"
                />
              </FormGroup>

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

              <FormGroup className="mb-2">
                <Label className="form-control-label">Description</Label>
                <Input
                  name="description"
                  type="textarea"
                  placeholder="Enter company description (optional)"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="form-control-alternative"
                  rows="2"
                />
              </FormGroup>

              <div className="text-center">
                <Button color="primary" type="submit" className="my-2">
                  Save Company
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
