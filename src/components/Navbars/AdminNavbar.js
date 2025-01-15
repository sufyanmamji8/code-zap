import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Navbar,
  Nav,
  Container,
  Media,
} from "reactstrap";
import { toast } from "sonner";
import { useState, useEffect } from "react";

const styles = {
  avatar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    padding: '2px',
    borderRadius: '50%',
    cursor: 'pointer'
  },
  mobileNavbarContainer: {
    position: 'fixed',
    top: '0',
    left: '0',
    right: '0',
    height: '60px',
    background: 'white',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 1rem',
    zIndex: 1000,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  navbarContainer: {
    background: 'linear-gradient(180deg, #00BCD4 0%, #2196F3 100%)',
    width: 'calc(100% - 2rem)',
    padding: '0.5rem',
    position: 'sticky',
    margin: '0.5rem',
    borderRadius: '12px',
    zIndex: 1000
    
  },
  mobileMenu: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  
  dropdownMenu: {
    zIndex: 1050,
    position: 'absolute',
    minWidth: '160px',
    right: 0,
    top: '100%',
    backgroundColor: 'white',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
    borderRadius: '4px',
    padding: '0.5rem 0'
  },
  avatarImage: {
    maxWidth: '100%',
    height: 'auto',
    borderRadius: '50%',
    objectFit: 'cover'
  },
  hamburgerIcon: {
    width: '24px',
    height: '24px',
    position: 'relative',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around'
  },
  hamburgerBar: {
    width: '100%',
    height: '2px',
    backgroundColor: '#000',
    position: 'absolute',
    left: 0,
    transition: 'all 0.3s ease-in-out'
  }
  
  
};

const AdminNavbar = ({ brandText }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogOut = () => {
    const itemsToClear = [
      "token",
      "phoneId",
      "accountId",
      "accessToken",
      "callbackUrl"
    ];
    
    itemsToClear.forEach(item => {
      localStorage.removeItem(item);
      sessionStorage.removeItem(item);
    });

    navigate("/auth/login");
    toast.success("Logout Successfully");
  };

  const handleToggleSidebar = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // Get sidebar element
    const sidebarElement = document.querySelector('#sidenav-main');
    const navbarCollapse = sidebarElement.querySelector('.navbar-collapse');
    
    // Toggle collapse class
    if (navbarCollapse) {
      if (navbarCollapse.classList.contains('show')) {
        navbarCollapse.classList.remove('show');
      } else {
        navbarCollapse.classList.add('show');
      }
    }
  };

  const HamburgerIcon = () => (
    <button
      onClick={handleToggleSidebar}
      style={{
        background: 'none',
        border: 'none',
        padding: '10px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '40px',
        height: '40px'
      }}
      aria-label="Toggle menu"
    >
      <div style={styles.hamburgerIcon}>
        <span style={{
          ...styles.hamburgerBar,
          top: sidebarOpen ? '50%' : '0',
          transform: sidebarOpen ? 'rotate(45deg) translateY(-50%)' : 'none'
        }} />
        <span style={{
          ...styles.hamburgerBar,
          top: '50%',
          opacity: sidebarOpen ? '0' : '1',
          transform: 'translateY(-50%)'
        }} />
        <span style={{
          ...styles.hamburgerBar,
          bottom: sidebarOpen ? '50%' : '0',
          transform: sidebarOpen ? 'rotate(-45deg) translateY(50%)' : 'none'
        }} />
      </div>
    </button>
  );

  if (isMobile) {
    return (
      <div style={styles.mobileNavbarContainer}>
        <HamburgerIcon />
        
        <div style={styles.mobileMenu}>
          <UncontrolledDropdown>
            <DropdownToggle nav className="p-0">
              <Media className="align-items-center">
                <span style={styles.avatar}>
                  <img
                    alt="Profile"
                    src={require("../../assets/img/theme/team-2-800x800.jpg")}
                    style={styles.avatarImage}
                  />
                </span>
              </Media>
            </DropdownToggle>
            <DropdownMenu right style={styles.dropdownMenu}>
              <DropdownItem className="noti-title" header tag="div">
                <h6 className="text-overflow m-0">Welcome!</h6>
              </DropdownItem>
              <DropdownItem to="/admin/user-profile" tag={Link}>
                <i className="ni ni-single-02" />
                <span>My profile</span>
              </DropdownItem>
              <DropdownItem divider />
              <DropdownItem onClick={handleLogOut}>
                <i className="ni ni-user-run" />
                <span>Logout</span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
      </div>
    );
  }

  return (
    <Navbar 
      className="navbar-top navbar-dark" 
      expand="md" 
      id="navbar-main" 
      style={styles.navbarContainer}
    >
      <Container fluid style={{ padding: 0 }}>
        <Link
          className="h4 mb-0 text-white text-uppercase d-lg-inline-block"
          to="/"
        >
          {brandText}
        </Link>

        <Nav className="align-items-center d-md-flex ml-auto" navbar>
          <UncontrolledDropdown nav>
            <DropdownToggle className="pr-0" nav>
              <Media className="align-items-center">
                <span style={styles.avatar}>
                  <img
                    alt="Profile"
                    src={require("../../assets/img/theme/team-2-800x800.jpg")}
                    style={styles.avatarImage}
                  />
                </span>
              </Media>
            </DropdownToggle>
            <DropdownMenu right style={styles.dropdownMenu}>
              <DropdownItem className="noti-title" header tag="div">
                <h6 className="text-overflow m-0">Welcome!</h6>
              </DropdownItem>
              <DropdownItem to="/admin/user-profile" tag={Link}>
                <i className="ni ni-single-02" />
                <span>My profile</span>
              </DropdownItem>
              <DropdownItem divider />
              <DropdownItem onClick={handleLogOut}>
                <i className="ni ni-user-run" />
                <span>Logout</span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default AdminNavbar;