import React, { useState } from "react";
import {
  Button,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Row,
  Col,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_ENDPOINT } from "Api/Constant";
import { toast } from "sonner";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const Register = () => {
  const [role, setRole] = useState("individual");
  const [input, setInput] = useState({
    registerFullname: "",
    registerEmail: "",
    registerPassword: "",
    registerPhone: "",
    registerCompanyName: "",
    registerCompanyAddress: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const validateForm = () => {
    if (!input.registerFullname || !input.registerEmail || !input.registerPassword || !input.registerPhone) {
      toast.error("Please fill all required fields.");
      return false;
    }

    if (role === "corporate") {
      if (!input.registerCompanyName || !input.registerCompanyAddress) {
        toast.error("Please fill out both Company Name and Company Address.");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) {
      return;
    }
  
    setLoading(true);
  
    const formData = new FormData();
    formData.append("fullname", input.registerFullname);
    formData.append("email", input.registerEmail);
    formData.append("password", input.registerPassword);
    formData.append("phoneNumber", input.registerPhone);
    formData.append("role", role);
  
    if (role === "corporate") {
      formData.append("companyName", input.registerCompanyName);
      formData.append("companyAddress", input.registerCompanyAddress);
    }
  
    try {
      const res = await axios.post(`${USER_API_ENDPOINT}/register`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (res.data?.success) {
        toast.success(res.data.message || "Registration successful!");
        navigate("/auth/login");
      } else {
        toast.error(res.data.message || "An error occurred. Please try again.");
      }
    } catch (error) {
      console.error(error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
      {loading && (
        <div className="register-loading-overlay">
          <DotLottieReact
            src="https://lottie.host/5060de43-85ac-474a-a85b-892f9730e17a/b3jJ1vGkWh.lottie"
            loop
            autoplay
            className="register-lottie-animation"
          />
        </div>
      )}
      
      <div className="register-page-wrapper">
        <Row className="register-main-row">
          {/* Form Section */}
          <Col lg="6" md="6" className="register-form-section mt-6">
            <div className="register-form-container">
              <div className="register-form-header ">
                <h2 className="register-title">Create Account</h2>
                <p className="register-subtitle">Get started with your free account today</p>
              </div>
              
              <Form role="form" onSubmit={handleSubmit} className="register-form">
                {/* Full Name */}
                <FormGroup className="register-form-group">
                  <InputGroup className="register-input-group">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText className="register-input-icon">
                        <i className="ni ni-single-02" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Full Name"
                      autoComplete="register-name"
                      name="registerFullname"
                      value={input.registerFullname}
                      onChange={handleInputChange}
                      required
                      className="register-form-input"
                    />
                  </InputGroup>
                </FormGroup>

                {/* Email */}
                <FormGroup className="register-form-group">
                  <InputGroup className="register-input-group">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText className="register-input-icon">
                        <i className="ni ni-email-83" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Email"
                      type="email"
                      autoComplete="register-email"
                      name="registerEmail"
                      value={input.registerEmail}
                      onChange={handleInputChange}
                      required
                      className="register-form-input"
                    />
                  </InputGroup>
                </FormGroup>

                {/* Password */}
                <FormGroup className="register-form-group">
                  <InputGroup className="register-input-group">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText className="register-input-icon">
                        <i className="ni ni-lock-circle-open" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Password"
                      type="password"
                      autoComplete="register-password"
                      name="registerPassword"
                      value={input.registerPassword}
                      onChange={handleInputChange}
                      required
                      className="register-form-input"
                    />
                  </InputGroup>
                </FormGroup>

                {/* Phone Number */}
                <FormGroup className="register-form-group">
                  <InputGroup className="register-input-group">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText className="register-input-icon">
                        <i className="ni ni-mobile-button" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Phone Number"
                      type="text"
                      autoComplete="register-phone"
                      name="registerPhone"
                      value={input.registerPhone}
                      onChange={handleInputChange}
                      required
                      className="register-form-input"
                    />
                  </InputGroup>
                </FormGroup>

                {/* Role Dropdown */}
                <FormGroup className="register-form-group">
                  <label className="register-form-label">Account Type *</label>
                  <UncontrolledDropdown className="register-dropdown">
                    <DropdownToggle caret className="register-dropdown-toggle">
                      {role === "individual" ? "Individual Account" : "Corporate Account"}
                    </DropdownToggle>
                    <DropdownMenu className="register-dropdown-menu">
                      <DropdownItem onClick={() => setRole("individual")}>
                        Individual Account
                      </DropdownItem>
                      <DropdownItem onClick={() => setRole("corporate")}>
                        Corporate Account
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </FormGroup>

                {/* Corporate Fields */}
                {role === "corporate" && (
                  <>
                    <FormGroup className="register-form-group">
                      <label className="register-form-label">Company Name *</label>
                      <Input 
                        placeholder="Company Name" 
                        autoComplete="register-company"
                        name="registerCompanyName" 
                        value={input.registerCompanyName} 
                        onChange={handleInputChange} 
                        required 
                        className="register-form-input register-form-input-standalone"
                      />
                    </FormGroup>
                    <FormGroup className="register-form-group">
                      <label className="register-form-label">Company Address *</label>
                      <Input 
                        placeholder="Company Address" 
                        autoComplete="register-address"
                        name="registerCompanyAddress" 
                        value={input.registerCompanyAddress} 
                        onChange={handleInputChange} 
                        required 
                        className="register-form-input register-form-input-standalone"
                      />
                    </FormGroup>
                  </>
                )}

                <Button className="register-submit-btn" type="submit" disabled={loading}>
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>

                <div className="register-login-link">
                  <span>Already have an account? </span>
                  <a
                    href="#login"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/auth/login");
                    }}
                    className="register-link-accent"
                  >
                    Sign in
                  </a>
                </div>
              </Form>
            </div>
          </Col>

          {/* Image Section */}
          <Col lg="6" md="6" className="register-image-section">
            <div className="register-image-content">
              <div className="register-image-icon">
                <i className="ni ni-collection" />
              </div>
              <h3 className="register-image-title">Start Your Journey</h3>
              <p className="register-image-text">
                Join thousands of users who trust our platform. 
                Create your account today and unlock all the features 
                designed to help you succeed.
              </p>
              <div className="register-features">
                <div className="register-feature">
                  <i className="ni ni-check-bold" />
                  <span>Secure & Reliable</span>
                </div>
                <div className="register-feature">
                  <i className="ni ni-check-bold" />
                  <span>Easy to Use</span>
                </div>
                <div className="register-feature">
                  <i className="ni ni-check-bold" />
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>

      <style>
        {`
        .register-page-wrapper {
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          overflow: hidden;
          background: transparent;
        }

        .register-main-row {
          width: 100%;
          height: 100vh;
          margin: 0;
          align-items: stretch;
          border-radius: 0;
          box-shadow: none;
          overflow: hidden;
          background: transparent;
        }

        .register-form-section {
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
        }

        .register-image-section {
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8fafc;
          color: #2d3748;
          border-left: 1px solid #e2e8f0;
        }

        .register-form-container {
          width: 100%;
          max-width: 450px;
          padding: 2.5rem;
          background: transparent;
          overflow-y: auto;
          max-height: 100vh;
        }

        .register-form-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .register-title {
          font-size: 2rem;
          font-weight: 700;
          color: #1a202c;
          margin-bottom: 0.5rem;
        }

        .register-subtitle {
          color: #718096;
          font-size: 1rem;
          margin: 0;
          font-weight: 400;
        }

        .register-form {
          width: 100%;
        }

        .register-form-group {
          margin-bottom: 1.5rem;
        }

        .register-form-label {
          display: block;
          font-size: 0.9rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5rem;
        }

        .register-input-group {
          border: 1.5px solid #e2e8f0;
          border-radius: 8px;
          overflow: hidden;
          transition: all 0.2s ease;
          background: white;
        }

        .register-input-group:focus-within {
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .register-input-icon {
          background: #f8fafc;
          border: none;
          color: #667eea;
          padding: 0.875rem 1rem;
          border-right: 1.5px solid #e2e8f0;
        }

        .register-form-input {
          border: none;
          background: white;
          padding: 0.875rem 1rem;
          font-size: 0.95rem;
          color: #2d3748;
          font-weight: 500;
          width: 100%;
        }

        .register-form-input::placeholder {
          color: #a0aec0;
          font-weight: 400;
        }

        .register-form-input:focus {
          box-shadow: none;
          background: white;
          outline: none;
        }

        .register-form-input-standalone {
          border: 1.5px solid #e2e8f0;
          border-radius: 8px;
          padding: 0.875rem 1rem;
          font-size: 0.95rem;
          transition: all 0.2s ease;
          background: white;
        }

        .register-form-input-standalone:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
          background: white;
        }

        .register-dropdown {
          width: 100%;
        }

        .register-dropdown-toggle {
          width: 100%;
          background: white;
          border: 1.5px solid #e2e8f0;
          color: #374151;
          text-align: left;
          border-radius: 8px;
          padding: 0.875rem 1rem;
          font-size: 0.95rem;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .register-dropdown-toggle:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .register-dropdown-menu {
          width: 100%;
          border: 1.5px solid #e2e8f0;
          border-radius: 8px;
          margin-top: 0.25rem;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }

        .register-dropdown-menu .dropdown-item {
          padding: 0.75rem 1rem;
          font-size: 0.9rem;
          color: #374151;
          transition: all 0.2s ease;
        }

        .register-dropdown-menu .dropdown-item:hover {
          background: #f7fafc;
          color: #667eea;
        }

        .register-submit-btn {
          width: 100%;
          background: #667eea;
          border: none;
          border-radius: 8px;
          padding: 1rem 1.5rem;
          font-weight: 600;
          font-size: 1rem;
          color: white;
          margin-bottom: 2rem;
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .register-submit-btn:hover:not(:disabled) {
          background: #5a67d8;
          transform: translateY(-1px);
        }

        .register-submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .register-login-link {
          text-align: center;
          color: #718096;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .register-link-accent {
          color: #667eea;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.2s ease;
        }

        .register-link-accent:hover {
          color: #5a67d8;
          text-decoration: underline;
        }

        .register-image-content {
          max-width: 400px;
          padding: 2.5rem;
          text-align: center;
        }

        .register-image-icon {
          font-size: 3rem;
          margin-bottom: 1.5rem;
          color: #667eea;
        }

        .register-image-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: #2d3748;
        }

        .register-image-text {
          color: #718096;
          line-height: 1.6;
          margin-bottom: 2rem;
          font-size: 0.95rem;
          font-weight: 400;
        }

        .register-features {
          text-align: left;
        }

        .register-feature {
          display: flex;
          align-items: center;
          margin-bottom: 0.75rem;
          color: #4a5568;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .register-feature i {
          margin-right: 0.75rem;
          font-size: 1rem;
          color: #48bb78;
        }

        .register-loading-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(255, 255, 255, 0.95);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
        }

        .register-lottie-animation {
          width: 120px;
          height: 120px;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .register-page-wrapper {
            padding: 0;
          }

          .register-main-row {
            height: 100vh;
          }

          .register-image-section {
            display: none;
          }

          .register-form-section {
            width: 100%;
          }

          .register-form-container {
            max-width: 100%;
            padding: 2rem 1.5rem;
          }

          .register-title {
            font-size: 1.75rem;
          }
        }

        @media (max-width: 576px) {
          .register-form-container {
            padding: 1.5rem 1rem;
          }

          .register-title {
            font-size: 1.5rem;
          }

          .register-form-input {
            padding: 0.75rem 0.875rem;
            font-size: 0.9rem;
          }

          .register-input-icon {
            padding: 0.75rem 0.875rem;
          }

          .register-form-input-standalone {
            padding: 0.75rem 0.875rem;
            font-size: 0.9rem;
          }

          .register-dropdown-toggle {
            padding: 0.75rem 0.875rem;
            font-size: 0.9rem;
          }

          .register-submit-btn {
            padding: 0.875rem 1.25rem;
            font-size: 0.9rem;
          }
        }
        `}
      </style>
    </>
  );
};

export default Register;