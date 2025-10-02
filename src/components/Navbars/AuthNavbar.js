import { Link, useLocation } from "react-router-dom";
import {
  UncontrolledCollapse,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col,
} from "reactstrap";

const AdminNavbar = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/auth/login";

  return (
    <>
      <Navbar 
        className="navbar-top navbar-horizontal navbar-dark" 
        expand="md"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          padding: "1rem 0",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
        }}
      >
        <Container className="px-4">
          {/* Brand Logo */}
          <NavbarBrand
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <img
              alt="Company Logo"
              src={require("../../assets/img/brand/LOGO 5.png")}
              style={{
                height: "40px",
                width: "auto",
                filter: "brightness(0) invert(1)"
              }}
            />
            <span 
              className="font-weight-bold" 
              style={{ 
                color: "white",
                fontSize: "1.5rem",
                fontWeight: "700",
                textShadow: "0 2px 4px rgba(0,0,0,0.1)"
              }}
            >
              Your Brand
            </span> 
          </NavbarBrand>

          {/* Mobile Toggle Button */}
          <button 
            className="navbar-toggler" 
            id="navbar-collapse-main"
            style={{
              border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: "8px",
              padding: "8px 12px"
            }}
          >
            <span 
              className="navbar-toggler-icon" 
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba%28255, 255, 255, 1%29' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e")`
              }}
            />
          </button>

          {/* Collapsible Menu */}
          <UncontrolledCollapse navbar toggler="#navbar-collapse-main">
            <div 
              className="navbar-collapse-header d-md-none"
              style={{
                background: "rgba(255,255,255,0.1)",
                borderRadius: "12px",
                margin: "1rem 0",
                padding: "1rem",
                backdropFilter: "blur(10px)"
              }}
            >
              <Row>
                <Col className="collapse-brand" xs="6">
                  <img
                    alt="Mobile Logo"
                    src={require("../../assets/img/brand/free-waba-logo.png")}
                    style={{
                      height: "32px",
                      width: "auto"
                    }}
                  />
                </Col>
                <Col className="collapse-close" xs="6">
                  <button 
                    className="navbar-toggler" 
                    id="navbar-collapse-main"
                    style={{
                      background: "rgba(255,255,255,0.2)",
                      border: "1px solid rgba(255,255,255,0.3)",
                      borderRadius: "8px",
                      padding: "8px 12px",
                      float: "right"
                    }}
                  >
                    <span style={{ color: "white", fontSize: "1.5rem" }}>×</span>
                  </button>
                </Col>
              </Row>
            </div>

            {/* Navigation Links */}
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink 
                  className="nav-link-icon" 
                  tag={Link} 
                  to={isLoginPage ? "/auth/register" : "/auth/login"}
                  style={{
                    background: "rgba(255,255,255,0.15)",
                    borderRadius: "25px",
                    padding: "10px 24px",
                    margin: "0 8px",
                    border: "1px solid rgba(255,255,255,0.3)",
                    backdropFilter: "blur(10px)",
                    transition: "all 0.3s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontWeight: "600"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.25)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 8px 25px rgba(255,255,255,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.15)";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <i 
                    className={`ni ${isLoginPage ? "ni-circle-08" : "ni-key-25"}`}
                    style={{
                      color: "white",
                      fontSize: "1.1rem"
                    }}
                  />
                  <span 
                    className="nav-link-inner--text"
                    style={{
                      color: "white",
                      fontSize: "1rem",
                      textShadow: "0 1px 2px rgba(0,0,0,0.1)"
                    }}
                  >
                    {isLoginPage ? "Create Account" : "Sign In"}
                  </span>
                </NavLink>
              </NavItem>
            </Nav>
          </UncontrolledCollapse>
        </Container>
      </Navbar>

      <style>
        {`
          @media (max-width: 768px) {
            .navbar-collapse {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              border-radius: 16px;
              margin-top: 1rem;
              padding: 1rem;
              box-shadow: 0 8px 32px rgba(0,0,0,0.1);
            }
          }
        `}
      </style>
    </>
  );
};

export default AdminNavbar;