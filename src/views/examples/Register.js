import React, { useState } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  Col,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { USER_API_ENDPOINT } from "Api/Constant";
import { toast } from "sonner";  // Importing toast for notifications

const Register = () => {
  const [role, setRole] = useState("individual");
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    password: "",
    phoneNumber: "",
    companyName: "",
    companyAddress: "",
  });

  const { loading } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const validateForm = () => {
    if (!input.fullname || !input.email || !input.password || !input.phoneNumber) {
      toast.error("Please fill all required fields.");
      return false;
    }
   
    if (role === "corporate") {
      if (!input.companyName || !input.companyAddress) {
        toast.error("Please fill out both Company Name and Company Address.");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // If validation fails, prevent submission
    }

    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("password", input.password);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("role", role);

    if (role === "corporate") {
      formData.append("companyName", input.companyName);
      formData.append("companyAddress", input.companyAddress);
    }

    try {
      const res = await axios.post(`${USER_API_ENDPOINT}/register`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (res.data?.success) {
        toast.success("Registration successful! Welcome.");
        navigate("/auth/login");
      } else {
        toast.error(res.data?.message || "An error occurred. Please try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred during registration. Please try again.");
    }
  };

  return (
    <Col lg="6" md="8" className="mx-auto">
      <Card className="bg-secondary shadow border-0">
        <CardHeader className="bg-transparent pb-5">
          <div className="text-center">
            <h3>Create Account</h3>
          </div>
        </CardHeader>
        <CardBody className="px-lg-5 py-lg-5">
          <Form role="form" onSubmit={handleSubmit}>
            {/* Full Name */}
            <FormGroup>
              <InputGroup className="input-group-alternative mb-3">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="ni ni-hat-3" />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  placeholder="Full Name"
                  name="fullname"
                  value={input.fullname}
                  onChange={handleInputChange}
                  required
                />
              </InputGroup>
            </FormGroup>

            {/* Email */}
            <FormGroup>
              <InputGroup className="input-group-alternative mb-3">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="ni ni-email-83" />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  placeholder="Email"
                  name="email"
                  type="email"
                  value={input.email}
                  onChange={handleInputChange}
                  required
                />
              </InputGroup>
            </FormGroup>

            {/* Password */}
            <FormGroup>
              <InputGroup className="input-group-alternative">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="ni ni-lock-circle-open" />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  placeholder="Password"
                  name="password"
                  type="password"
                  value={input.password}
                  onChange={handleInputChange}
                  required
                />
              </InputGroup>
            </FormGroup>

            {/* Phone Number */}
            <FormGroup>
              <InputGroup className="input-group-alternative">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="ni ni-mobile-button" />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  placeholder="Phone Number"
                  name="phoneNumber"
                  type="text"
                  value={input.phoneNumber}
                  onChange={handleInputChange}
                  required
                />
              </InputGroup>
            </FormGroup>

            {/* Role Dropdown */}
            <FormGroup>
              <InputGroup className="input-group-alternative">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="ni ni-badge" />
                  </InputGroupText>
                </InputGroupAddon>
                <UncontrolledDropdown>
                  <DropdownToggle caret color="secondary">
                    {role === "individual" ? "Individual" : "Corporate"}
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem onClick={() => setRole("individual")}>
                      Individual
                    </DropdownItem>
                    <DropdownItem onClick={() => setRole("corporate")}>
                      Corporate
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </InputGroup>
            </FormGroup>

            {/* Corporate Fields */}
            {role === "corporate" && (
              <>
                <FormGroup>
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-building" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Company Name"
                      name="companyName"
                      value={input.companyName}
                      onChange={handleInputChange}
                      required={role === "corporate"}
                    />
                  </InputGroup>
                </FormGroup>
                <FormGroup>
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-map-big" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Company Address"
                      name="companyAddress"
                      value={input.companyAddress}
                      onChange={handleInputChange}
                      required={role === "corporate"}
                    />
                  </InputGroup>
                </FormGroup>
              </>
            )}

            {/* Submit Button */}
            <div className="text-center">
              <Button color="primary" type="submit" disabled={loading}>
                {loading ? "Please Wait..." : "Create Account"}
              </Button>
            </div>
          </Form>
        </CardBody>
      </Card>
    </Col>
  );
};

export default Register;
