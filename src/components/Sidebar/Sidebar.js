import { useState, useEffect } from "react";
import { NavLink as NavLinkRRD, Link } from "react-router-dom";
import { PropTypes } from "prop-types";
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Nav,
  NavItem,
  NavLink,
  NavbarBrand,
  Navbar,
  Container,
  Row,
  Col,
  Media,
  Collapse,
} from "reactstrap";

const Sidebar = (props) => {
  const [collapseOpen, setCollapseOpen] = useState(false);
  const [activeWhatsapp, setActiveWhatsapp] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login status
  useEffect(() => {
    const token = localStorage.getItem("token"); // Replace 'authToken' with your token key
    setIsLoggedIn(!!token);
  }, []);

  const activeRoute = (routeName) => {
    return props.location.pathname.indexOf(routeName) > -1 ? "active" : "";
  };

  const toggleCollapse = () => {
    setCollapseOpen((data) => !data);
  };

  const closeCollapse = () => {
    setCollapseOpen(false);
  };

  const createLinks = (routes) => {
    return routes
      .filter((prop) => {
        if (!isLoggedIn && (prop.name === "Login" || prop.name === "Register")) {
          return true; // Show login/register if not logged in
        }
        if (isLoggedIn && (prop.name === "Login" || prop.name === "Register")) {
          return false; // Hide login/register if logged in
        }
        return prop.showInSidebar !== false; // Include visible routes
      })
      .map((prop, key) => {
        if (prop.name === "Whatsapp") {
          return (
            <NavItem key={key}>
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle
                  nav
                  className={`d-flex align-items-center ${activeWhatsapp ? "text-success" : "text-muted"}`}
                  onClick={() => {
                    setActiveWhatsapp(!activeWhatsapp);
                  }}
                  onMouseEnter={() => setActiveWhatsapp(true)}
                  onMouseLeave={() => setActiveWhatsapp(false)}
                >
                  <i className={prop.icon} /> {prop.name}
                  <i className="fa fa-caret-down ml-2" />
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-arrow" right>
                  <DropdownItem to="/admin/whatsapplist" tag={Link}>
                    <i className="fa fa-list mr-2" /> List
                  </DropdownItem>
                  <DropdownItem to="/admin/AddWhatsapp" tag={Link}>
                    <i className="fa fa-plus-circle mr-2" /> Add WhatsApp
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </NavItem>
          );
        }

        return (
          <NavItem key={key}>
            <NavLink
              to={prop.layout + prop.path}
              tag={NavLinkRRD}
              onClick={closeCollapse}
            >
              <i className={prop.icon} />
              {prop.name}
            </NavLink>
          </NavItem>
        );
      });
  };

  const { bgColor, routes, logo } = props;
  let navbarBrandProps;
  if (logo && logo.innerLink) {
    navbarBrandProps = {
      to: logo.innerLink,
      tag: Link,
    };
  } else if (logo && logo.outterLink) {
    navbarBrandProps = {
      href: logo.outterLink,
      target: "_blank",
    };
  }

  return (
    <Navbar
      className="navbar-vertical fixed-left navbar-light bg-white"
      expand="md"
      id="sidenav-main"
    >
      <Container fluid>
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleCollapse}
        >
          <span className="navbar-toggler-icon" />
        </button>

        {logo ? (
          <NavbarBrand className="pt-0" {...navbarBrandProps}>
            <div className="d-flex align-items-center">
              <img
                alt={logo.imgAlt}
                className="navbar-brand-img"
                src={require("../../assets/img/brand/free-waba-logo.png")}
                style={{ height: "40px", width: "auto" }}
              />
              <h2 className="ml-3 mb-0">Free Waba</h2>
            </div>
          </NavbarBrand>
        ) : null}

        <Collapse navbar isOpen={collapseOpen}>
          <div className="navbar-collapse-header d-md-none">
            <Row>
              <Col className="collapse-close" xs="6">
                <button
                  className="navbar-toggler"
                  type="button"
                  onClick={toggleCollapse}
                >
                  <span />
                  <span />
                </button>
              </Col>
            </Row>
          </div>

          <Nav navbar>{createLinks(routes)}</Nav>
        </Collapse>
      </Container>
    </Navbar>
  );
};

Sidebar.defaultProps = {
  routes: [{}],
};

Sidebar.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.object),
  logo: PropTypes.shape({
    innerLink: PropTypes.string,
    outterLink: PropTypes.string,
    imgSrc: PropTypes.string.isRequired,
    imgAlt: PropTypes.string.isRequired,
  }),
};

export default Sidebar;