import { USER_API_ENDPOINT } from "Api/Constant";
import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
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
  Row,
  Col,
} from "reactstrap";
import { toast } from "sonner"; // Make sure you're using sonner for toast notifications
import { DotLottieReact } from '@lottiefiles/dotlottie-react'; // Import DotLottieReact

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false); // Loading state to track the API request status
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const ChangeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when the API request starts
  
    // Validate Email and Password
    if (!input.email || !input.password) {
      toast.error("Email and password are required.");
      setLoading(false);
      return;
    }
  
    try {
      const res = await axios.post(`${USER_API_ENDPOINT}/login`, input, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      console.log('API Response:', res);
  
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
  
      // Handle server errors more specifically
      if (error.response) {
        // Server responded with a status other than 2xx
        if (error.response.status === 500) {
          toast.error("Internal Server Error. Please try again later.");
        } else {
          toast.error(error.response.data.message || "An error occurred. Please try again.");
        }
      } else if (error.request) {
        // The request was made but no response was received
        toast.error("No response from server.");
      } else {
        // Something else happened while setting up the request
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false); // Set loading to false after the request completes
    }
  };
  

  return (
    <>
      {/* Show loading animation while the API request is in progress */}
      {loading ? (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <DotLottieReact
            src="https://lottie.host/5060de43-85ac-474a-a85b-892f9730e17a/b3jJ1vGkWh.lottie" // Replace with your Lottie animation URL
            loop
            autoplay
            style={{ width: "150px", height: "150px" }}
          />
        </div>
      ) : (
        <Col lg="5" md="7">
          <Card className="bg-secondary shadow border-0">
            <CardHeader className="bg-transparent pb-5">
              <div className="btn-wrapper text-center"></div>
            </CardHeader>
            <CardBody className="px-lg-5 py-lg-5">
              <Form role="form" onSubmit={submitHandler}>
                <FormGroup className="mb-3">
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-email-83" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Email"
                      type="email"
                      autoComplete="new-email"
                      name="email"
                      value={input.email} // Bind state to input field
                      onChange={ChangeEventHandler}
                    />
                  </InputGroup>
                </FormGroup>

                <FormGroup>
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-lock-circle-open" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Password"
                      type="password"
                      autoComplete="new-password"
                      name="password"
                      value={input.password} // Bind state to input field
                      onChange={ChangeEventHandler}
                    />
                  </InputGroup>
                </FormGroup>

                <div className="custom-control custom-control-alternative custom-checkbox">
                  <input
                    className="custom-control-input"
                    id="customCheckLogin"
                    type="checkbox"
                  />
                  <label
                    className="custom-control-label"
                    htmlFor="customCheckLogin"
                  >
                    <span className="text-muted">Remember me</span>
                  </label>
                </div>

                <div className="text-center">
                  <Button className="my-4" color="primary" type="submit">
                    Sign in
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>

          {/* Links for Forgot Password and Create New Account */}
          <Row className="mt-3">
            <Col xs="6">
              <a
                className="text-light"
                href="#pablo"
                onClick={(e) => e.preventDefault()}
              >
                <small>Forgot password?</small>
              </a>
            </Col>
            <Col className="text-right" xs="6">
              <a
                className="text-light"
                href="#pablo"
                onClick={(e) => e.preventDefault(navigate("/auth/register"))}
              >
                <small>Create new account</small>
              </a>
            </Col>
          </Row>
        </Col>
      )}
    </>
  );
};

export default Login;