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
          <Col lg="6" md="6" className="register-form-section">
            <div className="register-form-container">
              <div className="register-form-header">
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
              <div className="floating-shapes">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
                <div className="shape shape-4"></div>
              </div>
              <div className="register-illustration">
                <img 
                                   src="/undraw_authentication_tbfc.svg"

                  alt="Create Account" 
                  className="register-illustration-img"
                />
              </div>
              <h3 className="register-image-title">Start Your Codozap Journey</h3>
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
          width: 100vw;
          margin: 0;
          padding: 0;
          overflow: hidden;
          background: #ffffff;
        }

        .register-main-row {
          width: 100%;
          height: 100vh;
          margin: 0;
          align-items: stretch;
          overflow: hidden;
        }

        .register-form-section {
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #ffffff;
        }

        .register-image-section {
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #47a0dcff 0%, #9599E2 100%);
          color: white;
          position: relative;
          overflow: hidden;
        }

        .floating-shapes {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .shape {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.15);
          animation: float 6s ease-in-out infinite;
        }

        .shape-1 {
          width: 120px;
          height: 120px;
          top: 15%;
          left: 10%;
          animation-delay: 0s;
        }

        .shape-2 {
          width: 80px;
          height: 80px;
          bottom: 25%;
          right: 15%;
          animation-delay: 2s;
        }

        .shape-3 {
          width: 100px;
          height: 100px;
          top: 60%;
          left: 20%;
          animation-delay: 4s;
        }

        .shape-4 {
          width: 60px;
          height: 60px;
          top: 25%;
          right: 25%;
          animation-delay: 1s;
        }

        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
          }
          50% { 
            transform: translateY(-25px) rotate(10deg); 
          }
        }

        .register-form-container {
          width: 100%;
          max-width: 470px;
          padding: 2rem;
          background: #ffffff;
          border-radius: 20px;
          box-shadow: none;
          overflow: hidden;
        }

        .register-form-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .register-title {
          font-size: 2.25rem;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 0.5rem;
          background: linear-gradient(135deg, #47a0dcff 0%, #9599E2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .register-subtitle {
          color: #7f8c8d;
          font-size: 1.1rem;
          margin: 0;
          font-weight: 400;
        }

        .register-form {
          width: 100%;
        }

        .register-form-group {
          margin-bottom: 1.25rem;
        }

        .register-form-label {
          display: block;
          font-size: 0.85rem;
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 0.5rem;
        }

        .register-input-group {
          border: 1.5px solid #e8f4fe;
          border-radius: 10px;
          overflow: hidden;
          transition: all 0.2s ease;
          background: white;
        }

        .register-input-group:focus-within {
          border-color: #8BC6EC;
          box-shadow: 0 0 0 3px rgba(139, 198, 236, 0.15);
        }

        .register-input-icon {
          background: #f8fbfe;
          border: none;
          color: #8BC6EC;
          padding: 0.75rem 1rem;
          border-right: 1.5px solid #e8f4fe;
        }

        .register-form-input {
          border: none;
                    font-size: 1rem;

          background: white;
          padding: 0.75rem 1rem;
          color: #2c3e50;
          font-weight: 500;
          width: 100%;
        }

        .register-form-input::placeholder {
          color: #bdc3c7;
          font-weight: 400;
        }

        .register-form-input:focus {
          box-shadow: none;
          background: white;
          outline: none;
        }

        .register-form-input-standalone {
          border: 1.5px solid #e8f4fe;
          border-radius: 10px;
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          transition: all 0.2s ease;
          background: white;
        }

        .register-form-input-standalone:focus {
          border-color: #8BC6EC;
          box-shadow: 0 0 0 3px rgba(139, 198, 236, 0.15);
          background: white;
        }

        .register-dropdown {
          width: 100%;
        }

        .register-dropdown-toggle {
          width: 100%;
          background: white;
          border: 1.5px solid #e8f4fe;
          color: #2c3e50;
          text-align: left;
          border-radius: 10px;
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .register-dropdown-toggle:focus {
          border-color: #8BC6EC;
          box-shadow: 0 0 0 3px rgba(139, 198, 236, 0.15);
        }

        .register-dropdown-menu {
          width: 100%;
          border: 1.5px solid #e8f4fe;
          border-radius: 10px;
          margin-top: 0.25rem;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }

        .register-dropdown-menu .dropdown-item {
          padding: 0.75rem 1rem;
          font-size: 0.95rem;
          color: #2c3e50;
          transition: all 0.2s ease;
        }

        .register-dropdown-menu .dropdown-item:hover {
          background: #f8fbfe;
          color: #8BC6EC;
        }

        .register-submit-btn {
          width: 100%;
          background: linear-gradient(135deg, #47a0dcff 0%, #9599E2 100%);
          border: none;
          border-radius: 10px;
          padding: 0.875rem 1.5rem;
          font-weight: 600;
          font-size: 1.1rem;
          color: white;
          margin-bottom: 1.5rem;
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .register-submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(139, 198, 236, 0.3);
        }

        .register-submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .register-login-link {
          text-align: center;
          color: #7f8c8d;
          font-size: 0.85rem;
          font-weight: 500;
        }

        .register-link-accent {
          color: #8BC6EC;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.2s ease;
        }

        .register-link-accent:hover {
          color: #7ab5e0;
          text-decoration: underline;
        }

        .register-image-content {
          max-width: 400px;
          padding: 2rem;
          text-align: center;
          position: relative;
          z-index: 2;
        }

.register-illustration {
  margin-bottom: 1.5rem;
}

.register-illustration-img {
  width: 100%;
  max-width: 180px;
  height: auto;
  border-radius: 15px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;
  background: transparent; /* Ensures no background color is applied */
}

.register-illustration-img:hover {
  transform: scale(1.02);
}

        .register-image-title {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: white;
        }

        .register-image-text {
          opacity: 0.95;
          line-height: 1.6;
          margin-bottom: 2rem;
          font-size: 1.05rem;
          font-weight: 400;
        }

        .register-features {
          text-align: left;
        }

        .register-feature {
          display: flex;
          align-items: center;
          margin-bottom: 0.75rem;
          color: white;
          font-size: 1.05rem;
          font-weight: 500;
          transition: transform 0.2s ease;
        }

        .register-feature:hover {
          transform: translateX(5px);
        }

        .register-feature i {
          margin-right: 0.75rem;
          font-size: 0.9rem;
          color: #a8e6cf;
          background: rgba(168, 230, 207, 0.15);
          padding: 0.4rem;
          border-radius: 50%;
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
          width: 100px;
          height: 100px;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .register-page-wrapper {
            height: 100vh;
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
            padding: 1.5rem;
            margin: 1rem;
          }

          .register-title {
            font-size: 1.5rem;
          }
        }

        @media (max-width: 576px) {
          .register-form-container {
            padding: 1.25rem;
          }

          .register-title {
            font-size: 1.375rem;
          }

          .register-form-input {
            padding: 0.675rem 0.875rem;
            font-size: 0.85rem;
          }

          .register-input-icon {
            padding: 0.675rem 0.875rem;
          }

          .register-form-input-standalone {
            padding: 0.675rem 0.875rem;
            font-size: 0.85rem;
          }

          .register-dropdown-toggle {
            padding: 0.675rem 0.875rem;
            font-size: 0.85rem;
          }

          .register-submit-btn {
            padding: 0.75rem 1.25rem;
            font-size: 0.85rem;
          }
        }

        /* Extra small devices */
        @media (max-width: 400px) {
          .register-form-container {
            padding: 1rem;
          }

          .register-title {
            font-size: 1.25rem;
          }

          .register-subtitle {
            font-size: 0.8rem;
          }
        }
        `}
      </style>
    </>
  );
};

export default Register;