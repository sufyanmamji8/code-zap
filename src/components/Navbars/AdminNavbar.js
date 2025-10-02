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

const AdminNavbar = ({ brandText }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
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
    toast.success("Logged out successfully");
  };

  // Mobile Hamburger Icon
  const HamburgerIcon = () => (
    <button
      onClick={(e) => {
        e.preventDefault();
        const sidebar = document.querySelector('#sidenav-main');
        const navbarCollapse = sidebar?.querySelector('.navbar-collapse');
        if (navbarCollapse) {
          navbarCollapse.classList.toggle('show');
        }
      }}
      style={{
        background: "rgba(255, 255, 255, 0.1)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        borderRadius: "10px",
        padding: "10px",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "44px",
        height: "44px",
        backdropFilter: "blur(10px)",
        transition: "all 0.3s ease"
      }}
      onMouseEnter={(e) => {
        e.target.style.background = "rgba(255, 255, 255, 0.2)";
        e.target.style.transform = "scale(1.05)";
      }}
      onMouseLeave={(e) => {
        e.target.style.background = "rgba(255, 255, 255, 0.1)";
        e.target.style.transform = "scale(1)";
      }}
      aria-label="Toggle menu"
    >
      <div style={{ width: "20px", height: "14px", position: "relative" }}>
        <span style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "100%",
          height: "2px",
          backgroundColor: "white",
          borderRadius: "2px",
          transition: "all 0.3s ease"
        }} />
        <span style={{
          position: "absolute",
          left: 0,
          top: "6px",
          width: "100%",
          height: "2px",
          backgroundColor: "white",
          borderRadius: "2px",
          transition: "all 0.3s ease"
        }} />
        <span style={{
          position: "absolute",
          left: 0,
          top: "12px",
          width: "100%",
          height: "2px",
          backgroundColor: "white",
          borderRadius: "2px",
          transition: "all 0.3s ease"
        }} />
      </div>
    </button>
  );

  // Profile Avatar Component
  const ProfileAvatar = () => (
    <div
      style={{
        width: "42px",
        height: "42px",
        borderRadius: "50%",
        background: "linear-gradient(135deg, #667eea, #764ba2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        border: "2px solid rgba(255, 255, 255, 0.3)",
        transition: "all 0.3s ease",
        overflow: "hidden"
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = "scale(1.1)";
        e.target.style.borderColor = "rgba(255, 255, 255, 0.6)";
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = "scale(1)";
        e.target.style.borderColor = "rgba(255, 255, 255, 0.3)";
      }}
    >
      <img
        alt="Profile"
        src={require("../../assets/img/theme/team-2-800x800.jpg")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover"
        }}
      />
    </div>
  );

  if (isMobile) {
    return (
      <div style={{
        position: 'fixed',
        top: '0',
        left: '0',
        right: '0',
        height: '70px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 20px',
        zIndex: 1000,
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        <HamburgerIcon />
        
        <h1 style={{
          color: 'white',
          fontSize: '20px',
          fontWeight: '600',
          margin: 0,
          textShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          {brandText}
        </h1>
        
        <UncontrolledDropdown>
          <DropdownToggle nav className="p-0">
            <ProfileAvatar />
          </DropdownToggle>
          <DropdownMenu 
            right 
            style={{
              backgroundColor: 'white',
              border: 'none',
              borderRadius: '12px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
              padding: '8px',
              minWidth: '200px',
              marginTop: '10px'
            }}
          >
            <DropdownItem className="noti-title" header tag="div" style={{ padding: '12px 16px' }}>
              <h6 className="m-0" style={{ color: '#2d3748', fontWeight: '600' }}>Welcome! 👋</h6>
            </DropdownItem>
            <DropdownItem 
              to="/admin/user-profile" 
              tag={Link}
              style={{
                padding: '12px 16px',
                borderRadius: '8px',
                margin: '4px 0',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#f7fafc';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              <i className="ni ni-single-02 mr-2" style={{ color: '#667eea' }} />
              <span style={{ color: '#4a5568', fontWeight: '500' }}>My Profile</span>
            </DropdownItem>
            <DropdownItem divider />
            <DropdownItem 
              onClick={handleLogOut}
              style={{
                padding: '12px 16px',
                borderRadius: '8px',
                margin: '4px 0',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#fed7d7';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              <i className="ni ni-user-run mr-2" style={{ color: '#e53e3e' }} />
              <span style={{ color: '#e53e3e', fontWeight: '500' }}>Logout</span>
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>
    );
  }

  return (
    <Navbar 
      className="navbar-top navbar-dark" 
      expand="md" 
      id="navbar-main" 
      style={{
            backgroundColor: "#ffffff",
    borderBottom: "1px solid #e2e8f0",
    borderTop :  "1px solid #e2e8f0",
    borderRight : "1px solid #e2e8f0",
        borderLeft : "1px solid #e2e8f0",

    
        width: 'calc(100% - 2rem)',
        padding: '0.75rem 1.5rem',
        margin: '1rem',
        borderRadius: '16px',
        zIndex: 1000,
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}
    >
      <Container fluid style={{ padding: 0 }}>
        <Link
          className="h4 mb-0 text-white text-uppercase d-lg-inline-block"
          to="/"
          style={{
            textDecoration: 'none',
            fontWeight: '700',
            fontSize: '1.5rem',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateX(5px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateX(0)';
          }}
        >
          {brandText}
        </Link>

        <Nav className="align-items-center d-md-flex ml-auto" navbar>
          <UncontrolledDropdown nav>
            <DropdownToggle className="pr-0" nav>
              <ProfileAvatar />
            </DropdownToggle>
            <DropdownMenu 
              right 
              style={{
                backgroundColor: 'white',
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                padding: '8px',
                minWidth: '200px',
                marginTop: '10px'
              }}
            >
              <DropdownItem className="noti-title" header tag="div" style={{ padding: '12px 16px' }}>
                <h6 className="m-0" style={{ color: '#2d3748', fontWeight: '600' }}>Welcome! 👋</h6>
                <small style={{ color: '#718096', fontSize: '0.875rem' }}>Administrator</small>
              </DropdownItem>
              <DropdownItem 
                to="/admin/user-profile" 
                tag={Link}
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  margin: '4px 0',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#f7fafc';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                }}
              >
                <i className="ni ni-single-02 mr-2" style={{ color: '#667eea' }} />
                <span style={{ color: '#4a5568', fontWeight: '500' }}>My Profile</span>
              </DropdownItem>
              <DropdownItem divider />
              <DropdownItem 
                onClick={handleLogOut}
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  margin: '4px 0',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#fed7d7';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                }}
              >
                <i className="ni ni-user-run mr-2" style={{ color: '#e53e3e' }} />
                <span style={{ color: '#e53e3e', fontWeight: '500' }}>Logout</span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default AdminNavbar;