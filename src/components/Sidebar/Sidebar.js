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
  Media,
} from "reactstrap";
import { toast } from "sonner";


const styles = {
  sidebarWrapper: {
    position: 'relative',
    zIndex: 999,
  },
  mobileOverlay: {
    position: 'fixed',
    top: '60px',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 998,
    display: 'none',
  },
  mobileSidebarOpen: {
    display: 'block',
  },
  navbar: {
    '@media (max-width: 768px)': {
      position: 'fixed',
      top: '60px',
      left: '-280px',
      bottom: 0,
      width: '280px',
      transition: 'left 0.3s ease',
      overflow: 'auto',
    }
  },
  navbarOpen: {
    '@media (max-width: 768px)': {
      left: 0,
    }
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: '1rem',
  },
  brandImage: {
    height: '40px',
    width: 'auto',
    marginRight: '1rem',
  },
  brandTitle: {
    margin: 0,
    fontSize: '1.5rem',
    color: '#32325d',
  },
  '@media (max-width: 768px)': {
    '.navbar-collapse': {
      position: 'fixed',
      top: '60px',
      left: 0,
      width: '250px',
      height: 'calc(100vh - 60px)',
      backgroundColor: 'white',
      paddingLeft: '15px',
      paddingRight: '15px',
      overflowY: 'auto',
      transition: 'transform 0.3s ease',
      transform: 'translateX(-100%)'
    },
    '.navbar-collapse.show': {
      transform: 'translateX(0)'
    }
  }
  
};

const Sidebar = (props) => {
  const [collapseOpen, setCollapseOpen] = useState(false);
  const [isWhatsAppView, setIsWhatsAppView] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  
  
  // WhatsApp specific routes
  const whatsAppRoutes = [
    { name: "Back to Owner", icon: "ni ni-bold-left", path: "/dashboard", layout: "/admin" },
    { name: "Menus", icon: "ni ni-app", path: "/menus", layout: "/admin", dropdown: true, subRoutes: [
      { name: "Menus Access", path: "/Menus-access", icon: "ni ni-key-25" },
      { name: "Create Menus", path: "/Create-menus", icon: "ni ni-fat-add" }
    ]},
    { name: "Chats", icon: "ni ni-chat-round", path: "/chats", layout: "/admin" },
    { name: "Agents", icon: "ni ni-circle-08", path: "/agents", layout: "/admin", dropdown: true, subRoutes: [
      { name: "List", path: "/agentslist" },
      { name: "Create Agent", path: "/createagents" , icon: "ni ni-circle-08 text-gray" }
    ]},
    { name: "Contacts", icon: "ni ni-single-02", path: "/contacts", layout: "/admin", dropdown: true, subRoutes: [
      { name: "List", path: "/contactslist" },
      { name: "Group", path: "/contactsGroup" },
      { name: "Fields", path: "/contactsFields" },
      { name: "Import Fields", path: "/contactsImport" }
    ]},
    { name: "Templates", icon: "ni ni-single-copy-04", path: "/templates", layout: "/admin" },
    { name: "Campaign", icon: "ni ni-notification-70", path: "/campaign", layout: "/admin" },
    { name: "Generate Api Key", icon: "ni ni-key-25 text-gray", path: "/Api-key", layout: "/admin" },
  ];


  // Default routes
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

  // Handle the log out process and show the success toast
  const handleLogOut = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("phoneId");
    sessionStorage.removeItem("accountId");
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("callbackUrl");

    // Remove WhatsApp view state
    const token = localStorage.getItem('token');
    if (token) {
      localStorage.removeItem(`${token}_isWhatsAppView`);
    }

    // Delay navigation for a short period to ensure session data is cleared first
    setTimeout(() => {
        navigate("/auth/login");
        toast.success("Logout Successfully");
    }, 200);  // 200ms delay should be enough
};


  // Check login status and WhatsApp view on mount or based on app logic
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  
    // Check WhatsApp view state using token-specific key
    if (token) {
      // Check both localStorage and route state
      const whatsAppView = localStorage.getItem(`${token}_isWhatsAppView`) === 'true' || 
                          location.state?.whatsAppView === true;
      
      if (whatsAppView) {
        setIsWhatsAppView(true);
        // Ensure the state is saved in localStorage
        localStorage.setItem(`${token}_isWhatsAppView`, 'true');
      }
    }
  
    // Reset WhatsApp view if on dashboard
    if (location.pathname === '/admin/dashboard') {
      setIsWhatsAppView(false);
      if (token) {
        localStorage.removeItem(`${token}_isWhatsAppView`);
      }
    }
  }, [location, navigate]);


  

  const toggleCollapse = () => {
    setCollapseOpen((data) => !data);
  };

  const closeCollapse = () => {
    setCollapseOpen(false);
  };

  const handleBackToOwner = () => {
    const token = localStorage.getItem('token');
    
    
    // Remove WhatsApp view state
    if (token) {
      localStorage.removeItem(`${token}_isWhatsAppView`);
    }
    
    // Reset WhatsApp view state
    setIsWhatsAppView(false);
    
    // Close the collapse
    closeCollapse();
    
    // Navigate to dashboard
    navigate("/admin/dashboard");
  };

  const createLinks = (routes) => {
    const currentRoutes = isWhatsAppView ? whatsAppRoutes : routes;
  
    return currentRoutes
      .filter((prop) => {
        // Hide Login/Register links when the user is logged in
        if (isLoggedIn && (prop.name === "Login" || prop.name === "Register")) {
          return false;
        }
        
        // Filter out routes marked as not to be shown in sidebar
        return prop.showInSidebar !== false;
      })
      .map((prop, key) => {
        // Handle "Back to Owner" only when in WhatsApp view
        if (prop.name === "Back to Owner" && isWhatsAppView) {
          return (
            <NavItem key={key}>
              <NavLink
                to={prop.layout + prop.path}
                tag={NavLinkRRD}
                onClick={handleBackToOwner}
                className="text-primary"
                        >
                <i className={prop.icon} />
                {prop.name}
              </NavLink>
            </NavItem>
          );
        }
  
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
              <div className="d-flex align-items-center side-responsive">
              <img
                alt={logo.imgAlt}
                className="navbar-brand-img"
                src={require("../../assets/img/brand/free-waba-logo.png")}
                style={{ height: "40px", width: "auto" }}
              />
              <h2 className="ml-3 mb-0">CodoZap</h2>
              </div>
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