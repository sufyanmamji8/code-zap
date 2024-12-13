
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

  return (
    <>
      <Navbar className="navbar-top navbar-horizontal navbar-dark" expand="md">
        <Container className="px-4">
          <NavbarBrand
          
          
          
          >
            <img
              alt="..."
              src={require("../../assets/img/brand/free-waba-logo.png")}
            />
            <span className="ml-3 mb-0 font-weight-bold" style={{ color: "white" }}>
                CodoZap
              </span> 
          </NavbarBrand>
          <button className="navbar-toggler" id="navbar-collapse-main">
            <span className="navbar-toggler-icon" />
          </button>
          <UncontrolledCollapse navbar toggler="#navbar-collapse-main">
            <div className="navbar-collapse-header d-md-none">
              <Row>
                <Col className="collapse-brand" xs="6">
                  
                    <img
                      alt="..."
                      src={require("../../assets/img/brand/free-waba-logo.png")}
                    />
                 
                </Col>
                <Col className="collapse-close" xs="6">
                  <button className="navbar-toggler" id="navbar-collapse-main">
                    <span />
                    <span />
                  </button>
                </Col>
              </Row>
            </div>
            <Nav className="ml-auto" navbar>
              
            <NavItem>
      <NavLink className="nav-link-icon" tag={Link} to={location.pathname === "/auth/login" ? "/auth/register" : "/auth/login"}>
        <i className="ni ni-circle-08" />
        <span className="nav-link-inner--text">
          {location.pathname === "/auth/login" ? "Register" : "Login"}
        </span>
      </NavLink>
    </NavItem>
              
             
            </Nav>
          </UncontrolledCollapse>
        </Container>
      </Navbar>
    </>
  );
};

export default AdminNavbar;
