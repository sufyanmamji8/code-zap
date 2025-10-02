import { USER_API_ENDPOINT } from "Api/Constant";
import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Button,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
} from "reactstrap";
import { toast } from "sonner";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const Login = () => {
  const [input, setInput] = useState({
    loginEmail: "",
    loginPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const ChangeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    if (!input.loginEmail || !input.loginPassword) {
      toast.error("Email and password are required.");
      setLoading(false);
      return;
    }
  
    try {
      const res = await axios.post(`${USER_API_ENDPOINT}/login`, {
        email: input.loginEmail,
        password: input.loginPassword
      }, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
  
      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("fullName", res.data.user.fullname);
        toast.success(res.data.message);
        navigate("/dashboard");
      } else {
        toast.success(res.data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error('Error during login:', error);
      if (error.response) {
        if (error.response.status === 500) {
          toast.error("Internal Server Error. Please try again later.");
        } else {
          toast.error(error.response.data.message || "An error occurred. Please try again.");
        }
      } else if (error.request) {
        toast.error("No response from server.");
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && (
        <div className="login-loading-overlay">
          <DotLottieReact
            src="https://lottie.host/5060de43-85ac-474a-a85b-892f9730e17a/b3jJ1vGkWh.lottie"
            loop
            autoplay
            className="login-lottie-animation"
          />
        </div>
      )}
      
      <div className="login-page-wrapper">
        <Row className="login-main-row">
          {/* Form Section */}
          <Col lg="6" md="6" className="login-form-section">
            <div className="login-form-container">
              <div className="login-form-header">
                <h2 className="login-title">Welcome Back</h2>
                <p className="login-subtitle">Sign in to your account to continue</p>
              </div>
              
              <Form role="form" onSubmit={submitHandler} className="login-form">
                <FormGroup className="login-form-group">
                  <InputGroup className="login-input-group">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText className="login-input-icon">
                        <i className="ni ni-email-83" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Email"
                      type="email"
                      autoComplete="login-email"
                      name="loginEmail"
                      value={input.loginEmail}
                      onChange={ChangeEventHandler}
                      className="login-form-input"
                    />
                  </InputGroup>
                </FormGroup>

                <FormGroup className="login-form-group">
                  <InputGroup className="login-input-group">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText className="login-input-icon">
                        <i className="ni ni-lock-circle-open" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Password"
                      type="password"
                      autoComplete="login-password"
                      name="loginPassword"
                      value={input.loginPassword}
                      onChange={ChangeEventHandler}
                      className="login-form-input"
                    />
                  </InputGroup>
                </FormGroup>

                <div className="login-options">
                  <div className="login-remember">
                    <input
                      className="login-checkbox"
                      id="rememberLogin"
                      type="checkbox"
                    />
                    <label className="login-checkbox-label" htmlFor="rememberLogin">
                      Remember me
                    </label>
                  </div>
                  <a href="#forgot" className="login-forgot-link">
                    Forgot password?
                  </a>
                </div>

                <Button className="login-submit-btn" type="submit" disabled={loading}>
                  {loading ? "Signing In..." : "Sign In"}
                </Button>

                <div className="login-signup-link">
                  <span>Don't have an account? </span>
                  <a 
                    href="#signup" 
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/auth/register");
                    }}
                  >
                    Create account
                  </a>
                </div>
              </Form>
            </div>
          </Col>

          {/* Image Section */}
          <Col lg="6" md="6" className="login-image-section">
            <div className="login-image-content">
              <div className="login-image-icon">
                <i className="ni ni-lock-circle-open" />
              </div>
              <h3 className="login-image-title">Secure Access</h3>
              <p className="login-image-text">
                Access your account securely with our enterprise-grade authentication system. 
                Your data is protected with the highest security standards.
              </p>
              <div className="login-features">
                <div className="login-feature">
                  <i className="ni ni-check-bold" />
                  <span>Bank-level security</span>
                </div>
                <div className="login-feature">
                  <i className="ni ni-check-bold" />
                  <span>24/7 monitoring</span>
                </div>
                <div className="login-feature">
                  <i className="ni ni-check-bold" />
                  <span>Data encryption</span>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>

      <style>
        {`
        .login-page-wrapper {
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

        .login-main-row {
          width: 100%;
          height: 100vh;
          margin: 0;
          align-items: stretch;
          border-radius: 0;
          box-shadow: none;
          overflow: hidden;
          background: transparent;
        }

        .login-form-section {
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
        }

        .login-image-section {
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8fafc;
          color: #2d3748;
          border-left: 1px solid #e2e8f0;
        }

        .login-form-container {
          width: 100%;
          max-width: 400px;
          padding: 2.5rem;
          background: transparent;
        }

        .login-form-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .login-title {
          font-size: 2rem;
          font-weight: 700;
          color: #1a202c;
          margin-bottom: 0.5rem;
        }

        .login-subtitle {
          color: #718096;
          font-size: 1rem;
          margin: 0;
          font-weight: 400;
        }

        .login-form {
          width: 100%;
        }

        .login-form-group {
          margin-bottom: 1.5rem;
        }

        .login-input-group {
          border: 1.5px solid #e2e8f0;
          border-radius: 8px;
          overflow: hidden;
          transition: all 0.2s ease;
          background: white;
        }

        .login-input-group:focus-within {
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .login-input-icon {
          background: #f8fafc;
          border: none;
          color: #667eea;
          padding: 0.875rem 1rem;
          border-right: 1.5px solid #e2e8f0;
        }

        .login-form-input {
          border: none;
          background: white;
          padding: 0.875rem 1rem;
          font-size: 0.95rem;
          color: #2d3748;
          font-weight: 500;
          width: 100%;
        }

        .login-form-input::placeholder {
          color: #a0aec0;
          font-weight: 400;
        }

        .login-form-input:focus {
          box-shadow: none;
          outline: none;
          background: white;
        }

        .login-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .login-remember {
          display: flex;
          align-items: center;
        }

        .login-checkbox {
          margin-right: 0.5rem;
          transform: scale(1.1);
          accent-color: #667eea;
          cursor: pointer;
        }

        .login-checkbox-label {
          color: #4a5568;
          font-size: 0.9rem;
          margin: 0;
          cursor: pointer;
          font-weight: 500;
        }

        .login-forgot-link {
          color: #667eea;
          text-decoration: none;
          font-size: 0.9rem;
          white-space: nowrap;
          font-weight: 500;
          transition: color 0.2s ease;
        }

        .login-forgot-link:hover {
          color: #5a67d8;
          text-decoration: underline;
        }

        .login-submit-btn {
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

        .login-submit-btn:hover:not(:disabled) {
          background: #5a67d8;
          transform: translateY(-1px);
        }

        .login-submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .login-signup-link {
          text-align: center;
          color: #718096;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .login-signup-link a {
          color: #667eea;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.2s ease;
        }

        .login-signup-link a:hover {
          color: #5a67d8;
          text-decoration: underline;
        }

        .login-image-content {
          max-width: 380px;
          padding: 2.5rem;
          text-align: center;
        }

        .login-image-icon {
          font-size: 3rem;
          margin-bottom: 1.5rem;
          color: #667eea;
        }

        .login-image-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: #2d3748;
        }

        .login-image-text {
          color: #718096;
          line-height: 1.6;
          margin-bottom: 2rem;
          font-size: 0.95rem;
          font-weight: 400;
        }

        .login-features {
          text-align: left;
        }

        .login-feature {
          display: flex;
          align-items: center;
          margin-bottom: 0.75rem;
          color: #4a5568;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .login-feature i {
          margin-right: 0.75rem;
          font-size: 1rem;
          color: #48bb78;
        }

        .login-loading-overlay {
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

        .login-lottie-animation {
          width: 120px;
          height: 120px;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .login-page-wrapper {
            padding: 0;
          }

          .login-main-row {
            height: 100vh;
          }

          .login-image-section {
            display: none;
          }

          .login-form-section {
            width: 100%;
          }

          .login-form-container {
            max-width: 100%;
            padding: 2rem 1.5rem;
          }

          .login-title {
            font-size: 1.75rem;
          }

          .login-options {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
        }

        @media (max-width: 576px) {
          .login-form-container {
            padding: 1.5rem 1rem;
          }

          .login-title {
            font-size: 1.5rem;
          }

          .login-form-input {
            padding: 0.75rem 0.875rem;
            font-size: 0.9rem;
          }

          .login-input-icon {
            padding: 0.75rem 0.875rem;
          }

          .login-submit-btn {
            padding: 0.875rem 1.25rem;
            font-size: 0.9rem;
          }
        }
        `}
      </style>
    </>
  );
};

export default Login;