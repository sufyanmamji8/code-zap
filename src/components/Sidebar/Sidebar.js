import { useState, useEffect } from "react";
import { NavLink as NavLinkRRD, Link, useLocation, useNavigate, } from "react-router-dom";
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
  Collapse,
} from "reactstrap";

const Sidebar = (props) => {
  const [collapseOpen, setCollapseOpen] = useState(false);
  const [isWhatsAppView, setIsWhatsAppView] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
const navigate = useNavigate()
  // Check login status and WhatsApp view on mount or based on app logic
  useEffect(() => {
    const userLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    setIsLoggedIn(userLoggedIn);

    const phoneId = sessionStorage.getItem('phoneId');
    const accountId = sessionStorage.getItem('accountId');
    
    if (phoneId && accountId) {
      setIsWhatsAppView(true);  // User is in WhatsApp view
    } else {
      setIsWhatsAppView(false);  // Default view
    }

    if (location.state?.whatsAppView) {
      setIsWhatsAppView(true);
      navigate("/admin/chats");
    }
  }, [location, navigate]);

  const whatsAppRoutes = [
    { name: "Back to Owner", icon: "ni ni-bold-left", path: "/dashboard", layout: "/admin" },
    { name: "Stats", icon: "ni ni-chart-bar-32", path: "/stats", layout: "/admin" },
    { name: "Chats", icon: "ni ni-chat-round", path: "/chats", layout: "/admin" },
    { name: "Agents", icon: "ni ni-circle-08", path: "/agents", layout: "/admin", dropdown: true, subRoutes: [
      { name: "List", path: "/agentslist" },
      { name: "Create Agent", path: "/createagents" }
    ]},
    { name: "Contacts", icon: "ni ni-single-02", path: "/contacts", layout: "/admin", dropdown: true, subRoutes: [
      { name: "List", path: "/contactslist" },
      { name: "Group", path: "/contactsGroup" },
      { name: "Fields", path: "/contactsFields" },
      { name: "Import Fields", path: "/contactsImport" }
    ]},
    { name: "Templates", icon: "ni ni-single-copy-04", path: "/templates", layout: "/admin" },
    { name: "Campaign", icon: "ni ni-notification-70", path: "/campaign", layout: "/admin" },
    { name: "Settings", icon: "fa fa-cog", path: "/settings", layout: "/admin" },
  ];

  const defaultRoutes = [
    { name: "Dashboard", icon: "ni ni-tv-2", path: "/dashboard", layout: "/admin" },
    { name: "Whatsapp", icon: "ni ni-chat-round", path: "/whatsapp", layout: "/admin", dropdown: true, subRoutes: [
      { name: "List", path: "/whatsapplist" },
      { name: "Add WhatsApp", path: "/addwhatsapp" }
    ]},
    { name: "Profile", icon: "ni ni-single-02", path: "/profile", layout: "/admin" },
    { name: "Login", icon: "ni ni-key-25", path: "/login", layout: "/auth" },
    { name: "Register", icon: "ni ni-circle-08", path: "/register", layout: "/auth" }
  ];

  const toggleCollapse = () => {
    setCollapseOpen((data) => !data);
  };

  const closeCollapse = () => {
    setCollapseOpen(false);
  };

  const createLinks = (routes) => {
    const currentRoutes = isWhatsAppView ? whatsAppRoutes : routes;
  
    return currentRoutes
      .filter((prop) => prop.showInSidebar !== false)
      .map((prop, key) => {
        // Handle "Back to Owner" only when in WhatsApp view
        if (prop.name === "Back to Owner" && isWhatsAppView) {
          return (
            <NavItem key={key}>
              <NavLink
                to={prop.layout + prop.path}
                tag={NavLinkRRD}
                onClick={() => {
                  closeCollapse();
                  setIsWhatsAppView(false);  // Reset to default view
                  // Use setTimeout to delay navigation after state update
                  setTimeout(() => {
                    navigate("/admin/dashboard");
                  }, 100); // Small delay to ensure state update before navigation
                }}
                className="text-primary"
              >
                <i className={prop.icon} />
                {prop.name}
              </NavLink>
            </NavItem>
          );
        }
  
        // Hide Login/Register links when the user is logged in
        if (isLoggedIn && (prop.name === "Login" || prop.name === "Register")) return null;
  
        // Handle "Whatsapp" dropdown routes when not in WhatsApp view
        if (prop.name === "Whatsapp" && !isWhatsAppView) {
          return (
            <NavItem key={key}>
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav className="d-flex align-items-center">
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
  
        // Handle dropdown routes (Contacts, Agents, etc.)
        if (prop.dropdown) {
          return (
            <NavItem key={key}>
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav className="d-flex align-items-center">
                  <i className={prop.icon} /> {prop.name}
                  <i className="fa fa-caret-down ml-2" />
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-arrow" right>
                  {prop.subRoutes.map((subRoute, subKey) => (
                    <DropdownItem to={prop.layout + subRoute.path} tag={Link} key={subKey}>
                      <i className="fa fa-list mr-2" /> {subRoute.name}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </UncontrolledDropdown>
            </NavItem>
          );
        }
  
        // For all other regular routes
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

  const { bgColor, routes = defaultRoutes, logo } = props;
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
              <h2 className="ml-3 mb-0">CodoZap</h2>
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






