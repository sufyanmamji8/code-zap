import { useState, useEffect } from "react";
import { NavLink as NavLinkRRD, Link, useLocation, useNavigate } from "react-router-dom";
import { PropTypes } from "prop-types";
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Nav,
  NavItem,
  NavLink,
  Navbar,
  NavbarBrand,
  Container,
} from "reactstrap";
import { toast } from "sonner";

const Sidebar = (props) => {
  const { routes, logo, isSidebarOpen, toggleSidebar } = props;
  const [isWhatsAppView, setIsWhatsAppView] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // WhatsApp specific routes
  const whatsAppRoutes = [
    { name: "Back to Owner", icon: "ni ni-bold-left", path: "/dashboard", layout: "/admin" },
    {
      name: "Menus",
      icon: "ni ni-app",
      path: "/menus",
      layout: "/admin",
      dropdown: true,
      subRoutes: [
        { name: "Menu Assign", path: "/Menus-assign", icon: "ni ni-key-25" },
        { name: "Create Menus", path: "/Create-menus", icon: "ni ni-fat-add" },
      ],
    },
    { name: "Chats", icon: "ni ni-chat-round", path: "/chats", layout: "/admin" },
    {
      name: "Agents",
      icon: "ni ni-circle-08",
      path: "/agents",
      layout: "/admin",
      dropdown: true,
      subRoutes: [
        { name: "List", path: "/agentslist", icon: "fa fa-list" },
        { name: "Create Agent", path: "/createagents", icon: "ni ni-circle-08 text-gray" },
      ],
    },
    {
      name: "Contacts",
      icon: "ni ni-single-02",
      path: "/contacts",
      layout: "/admin",
      dropdown: true,
      subRoutes: [{ name: "Group", path: "/contactsGroup", icon: "fa fa-list" }],
    },
    { name: "Templates", icon: "ni ni-single-copy-04", path: "/templates", layout: "/admin" },
    { name: "Campaign", icon: "ni ni-notification-70", path: "/campaign", layout: "/admin" },
    { name: "ChatBot", icon: "ni ni-settings-gear-65", path: "/chat-bot", layout: "/admin" },
    { name: "Generate Api Key", icon: "ni ni-key-25 text-gray", path: "/Api-key", layout: "/admin" },
  ];

  // Default routes
  const defaultRoutes = [
    { name: "Dashboard", icon: "ni ni-tv-2", path: "/dashboard", layout: "/admin" },
    {
      name: "Whatsapp",
      icon: "ni ni-chat-round",
      path: "/whatsapp",
      layout: "/admin",
      dropdown: true,
      subRoutes: [
        { name: "List", path: "/whatsapplist", icon: "fa fa-list" },
        { name: "Add WhatsApp", path: "/addwhatsapp", icon: "fa fa-plus-circle" },
      ],
    },
    { name: "WhatsApp Web", icon: "ni ni-world-2", path: "/whatsappweb", layout: "/admin" },
    { name: "Profile", icon: "ni ni-single-02", path: "/profile", layout: "/admin" },
    { name: "Login", icon: "ni ni-key-25", path: "/login", layout: "/auth" },
    { name: "Register", icon: "ni ni-circle-08", path: "/register", layout: "/auth" },
  ];

  // Handle logout
  const handleLogOut = () => {
    const itemsToClear = ["token", "phoneId", "accountId", "accessToken", "callbackUrl"];
    itemsToClear.forEach((item) => {
      localStorage.removeItem(item);
      sessionStorage.removeItem(item);
    });

    const token = localStorage.getItem("token");
    if (token) {
      localStorage.removeItem(`${token}_isWhatsAppView`);
    }

    setTimeout(() => {
      navigate("/auth/login");
      toast.success("Logout Successfully");
    }, 200);
  };

  // Check login status and WhatsApp view
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    if (token) {
      const whatsAppView =
        localStorage.getItem(`${token}_isWhatsAppView`) === "true" ||
        location.state?.whatsAppView === true;
      if (whatsAppView) {
        setIsWhatsAppView(true);
        localStorage.setItem(`${token}_isWhatsAppView`, "true");
      }
    }

    if (location.pathname === "/admin/dashboard") {
      setIsWhatsAppView(false);
      if (token) {
        localStorage.removeItem(`${token}_isWhatsAppView`);
      }
    }
  }, [location, navigate]);

  const handleBackToOwner = () => {
    const token = localStorage.getItem("token");
    if (token) {
      localStorage.removeItem(`${token}_isWhatsAppView`);
    }
    setIsWhatsAppView(false);
    navigate("/admin/dashboard");
  };

  const createLinks = (routes) => {
    const currentRoutes = isWhatsAppView ? whatsAppRoutes : routes;

    return currentRoutes
      .filter((prop) => {
        if (isLoggedIn && (prop.name === "Login" || prop.name === "Register")) {
          return false;
        }
        return prop.showInSidebar !== false;
      })
      .map((prop, key) => {
        if (prop.name === "Back to Owner" && isWhatsAppView) {
          return (
            <NavItem key={key}>
              <NavLink
                to={prop.layout + prop.path}
                tag={NavLinkRRD}
                onClick={handleBackToOwner}
                className="text-primary"
              >
                <i className={prop.icon} style={{ marginRight: "0.5rem" }} />
                {prop.name}
              </NavLink>
            </NavItem>
          );
        }

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
                      <i className={subRoute.icon || "fa fa-list mr-2"} /> {subRoute.name}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </UncontrolledDropdown>
            </NavItem>
          );
        }

        return (
          <NavItem key={key}>
            <NavLink to={prop.layout + prop.path} tag={NavLinkRRD}>
              <i className={prop.icon} style={{ marginRight: "0.5rem" }} />
              {prop.name}
            </NavLink>
          </NavItem>
        );
      });
  };

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
    <>
      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999,
          }}
          onClick={toggleSidebar}
        />
      )}
      
      <Navbar
        className="navbar-vertical navbar-light bg-white"
        expand="md"
        id="sidenav-main"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "280px",
          height: "100vh",
          borderRight: "1px solid #e2e8f0",
          zIndex: 1000,
          transform: isSidebarOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s ease",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          overflowY: "auto",
          overflowX: "hidden"
        }}
      >
        <Container fluid style={{ 
          padding: 0, 
          height: "100%", 
          display: "flex", 
          flexDirection: "column",
          overflow: "hidden"
        }}>
          {logo ? (
            <NavbarBrand
              className="pt-0 pb-0"
              {...navbarBrandProps}
              style={{
                height: "60px",
                borderBottom: "1px solid #e2e8f0",
                display: "flex",
                alignItems: "center",
                padding: "0 1rem",
                margin: 0,
                flexShrink: 0, // Prevent brand from shrinking
              }}
            >
              <div className="d-flex align-items-center side-responsive" style={{ marginRight: "0.5rem" }}>
                <img
                  alt={logo.imgAlt}
                  className="navbar-brand-img"
                  src={logo.imgSrc}
                  style={{ height: "32px", width: "auto" }}
                />
              </div>
              <h2 className="mb-0" style={{ fontSize: "1.25rem", fontWeight: "600", lineHeight: "1", color: "#2d3748" }}>
                CodoZap
              </h2>
            </NavbarBrand>
          ) : null}
          
          <Nav
            navbar
            style={{
              flex: 1,
              overflowY: "auto",
              overflowX: "hidden",
              padding: "1rem 0",
              margin: 0,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{
              display: "flex",
              flexDirection: "column",
            }}>
              {createLinks(routes)}
            </div>
          </Nav>
          
          {isLoggedIn && (
            <div style={{
              padding: "1rem",
              borderTop: "1px solid #e2e8f0",
              flexShrink: 0,
            }}>
              <button
                onClick={handleLogOut}
                className="btn  btn-block"
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
background: "linear-gradient(135deg, #3487daff, #8b5cf6)",
                  color: "#ffffff",
                }}
              >
                <i className="ni ni-user-run" />
                Logout
              </button>
            </div>
          )}
        </Container>
      </Navbar>
    </>
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
  isSidebarOpen: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
};

export default Sidebar;