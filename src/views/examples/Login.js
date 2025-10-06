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
              <div className="floating-shapes">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
                <div className="shape shape-4"></div>
              </div>
             <img
  src="/undraw_sign-in_uva0.svg"
  alt="Create Account"
  className="login-illustration-img" // ← CHANGE FROM register-illustration-img TO login-illustration-img
/>
              <h3 className="login-image-title">Welcome to CodoZap</h3>
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
  width: 100vw;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background: #ffffff;
}


        .login-main-row {
          width: 100%;
          height: 100vh;
          margin: 0;
          align-items: stretch;
          overflow: hidden;
        }
.login-form-section {
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff; /* ← CHANGE FROM #fafbfc TO #ffffff */
}

        .login-image-section {
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

       .login-form-container {
  width: 100%;
  max-width: 500px;
  padding: 3rem;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: none; 
}

        .login-form-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .login-title {
          font-size: 2.25rem;
          font-weight: 700;
          color: #446483ff;
          margin-bottom: 0.75rem;
          background: linear-gradient(135deg, #47a0dcff 0%, #9599E2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .login-subtitle {
          color: #7f8c8d;
          font-size: 1.1rem;
          margin: 0;
          font-weight: 400;
          line-height: 1.6;
        }

        .login-form {
          width: 100%;
        }

        .login-form-group {
          margin-bottom: 1.5rem;
        }

        .login-input-group {
          border: 2px solid #e8f4fe;
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s ease;
          background: white;
        }

        .login-input-group:focus-within {
          border-color: #8BC6EC;
          box-shadow: 0 0 0 4px rgba(139, 198, 236, 0.15);
          transform: translateY(-2px);
        }

        .login-input-icon {
          background: #f8fbfe;
          border: none;
          color: #8BC6EC;
          padding: 1rem 1.25rem;
          border-right: 2px solid #e8f4fe;
        }

        .login-form-input {
          border: none;
          background: white;
          padding: 1rem 1.25rem;
          font-size: 1rem;
          color: #2c3e50;
          font-weight: 500;
          width: 100%;
        }

        .login-form-input::placeholder {
          color: #bdc3c7;
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
          margin-right: 0.75rem;
          transform: scale(1.2);
          accent-color: #8BC6EC;
          cursor: pointer;
        }

        .login-checkbox-label {
          color: #7f8c8d;
          font-size: 0.95rem;
          margin: 0;
          cursor: pointer;
          font-weight: 500;
        }

        .login-forgot-link {
          color: #8BC6EC;
          text-decoration: none;
          font-size: 0.95rem;
          white-space: nowrap;
          font-weight: 500;
          transition: color 0.2s ease;
        }

        .login-forgot-link:hover {
          color: #7ab5e0;
          text-decoration: underline;
        }

        .login-submit-btn {
          width: 100%;
          background: linear-gradient(135deg, #47a0dcff 0%, #9599E2 100%);
          border: none;
          border-radius: 12px;
          padding: 0.7rem 0.7rem;
          font-weight: 600;
          font-size: 1.1rem;
          color: white;
          margin-bottom: 2rem;
          transition: all 0.3s ease;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }

        .login-submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(139, 198, 236, 0.3);
        }

        .login-submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .login-signup-link {
          text-align: center;
          color: #7f8c8d;
          font-size: 1rem;
          font-weight: 500;
        }

        .login-signup-link a {
          color: #8BC6EC;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.2s ease;
        }

        .login-signup-link a:hover {
          color: #7ab5e0;
          text-decoration: underline;
        }

        .login-image-content {
          max-width: 500px;
          padding: 3rem;
          text-align: center;
          position: relative;
          z-index: 2;
        }
.login-illustration {
  margin-bottom: 2rem;
}

.login-illustration-img {
  width: 100%;
  max-width: 300px !important; /* Force this value */
  height: auto;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;
}

.login-illustration-img:hover {
  transform: scale(1.02);
}
        .login-image-title {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          color: white;
        }

        .login-image-text {
          opacity: 0.95;
          line-height: 1.7;
          margin-bottom: 2.5rem;
          font-size: 1.1rem;
          font-weight: 400;
        }

        .login-features {
          text-align: left;
        }

        .login-feature {
          display: flex;
          align-items: center;
          margin-bottom: 1rem;
          opacity: 0.95;
          font-size: 1.05rem;
          transition: transform 0.2s ease;
        }

        .login-feature:hover {
          transform: translateX(5px);
        }

        .login-feature i {
          margin-right: 1rem;
          font-size: 1.2rem;
          color: #a8e6cf;
          background: rgba(168, 230, 207, 0.15);
          padding: 0.5rem;
          border-radius: 50%;
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
            height: 100vh;
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
            padding: 2rem;
            margin: 1rem;
          }

          .login-title {
            font-size: 2rem;
          }

          .login-options {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
        }

        @media (max-width: 576px) {
          .login-form-container {
            padding: 1.5rem;
          }

          .login-title {
            font-size: 1.75rem;
          }

          .login-form-input {
            padding: 0.875rem 1rem;
            font-size: 0.95rem;
          }

          .login-input-icon {
            padding: 0.875rem 1rem;
          }

          .login-submit-btn {
            padding: 1rem 1.25rem;
            font-size: 1rem;
          }
        }
        `}
      </style>
    </>
  );
};

export default Login;