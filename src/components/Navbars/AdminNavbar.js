import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Navbar,
  Nav,
  Container,
  Badge,
} from "reactstrap";
import { toast } from "sonner";
import { useState, useEffect } from "react";

const AdminNavbar = ({ brandText }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const mainContent = document.querySelector('.main-content');
    const sidebar = document.querySelector('#sidenav-main');
    if (mainContent && sidebar) {
      mainContent.style.transition = 'margin-left 0.3s ease';
      sidebar.style.transition = 'transform 0.3s ease';
      if (isSidebarOpen) {
        mainContent.style.marginLeft = isMobile ? '0' : '280px';
        sidebar.style.transform = 'translateX(0)';
      } else {
        mainContent.style.marginLeft = '0';
        sidebar.style.transform = 'translateX(-100%)';
      }
    }
  }, [isSidebarOpen, isMobile]);

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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const HamburgerIcon = () => (
    <button
      onClick={toggleSidebar}
      style={{
        background: "#f8f9fa",
        border: "1px solid #e2e8f0",
        borderRadius: "6px",
        padding: "8px",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "36px",
        height: "36px",
        transition: "all 0.3s ease"
      }}
      onMouseEnter={(e) => {
        e.target.style.background = "#e2e8f0";
      }}
      onMouseLeave={(e) => {
        e.target.style.background = "#f8f9fa";
      }}
      aria-label="Toggle menu"
    >
      {!isSidebarOpen ? (
        <div style={{ width: "18px", height: "18px", position: "relative" }}>
          <span style={{
            position: "absolute",
            left: 0,
            top: "8px",
            width: "100%",
            height: "2px",
            backgroundColor: "#4a5568",
            borderRadius: "2px",
            transform: "rotate(45deg)"
          }} />
          <span style={{
            position: "absolute",
            left: 0,
            top: "8px",
            width: "100%",
            height: "2px",
            backgroundColor: "#4a5568",
            borderRadius: "2px",
            transform: "rotate(-45deg)"
          }} />
        </div>
      ) : (
        <div style={{ width: "18px", height: "12px", position: "relative" }}>
          <span style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: "2px",
            backgroundColor: "#4a5568",
            borderRadius: "2px"
          }} />
          <span style={{
            position: "absolute",
            left: 0,
            top: "5px",
            width: "100%",
            height: "2px",
            backgroundColor: "#4a5568",
            borderRadius: "2px"
          }} />
          <span style={{
            position: "absolute",
            left: 0,
            top: "10px",
            width: "100%",
            height: "2px",
            backgroundColor: "#4a5568",
            borderRadius: "2px"
          }} />
        </div>
      )}
    </button>
  );

  const NotificationIcon = () => (
    <UncontrolledDropdown nav inNavbar>
      <DropdownToggle 
        nav 
        style={{
          background: "transparent",
          border: "none",
          borderRadius: "6px",
          padding: "6px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "36px",
          height: "36px",
          transition: "all 0.3s ease",
          position: "relative",
          marginRight: "8px"
        }}
        onMouseEnter={(e) => {
          e.target.style.background = "#f7fafc";
        }}
        onMouseLeave={(e) => {
          e.target.style.background = "transparent";
        }}
      >
        <i className="ni ni-bell-55" style={{ color: "#4a5568", fontSize: "16px" }} />
        <Badge 
          color="danger" 
          style={{
            position: "absolute",
            top: "2px",
            right: "2px",
            fontSize: "10px",
            padding: "2px 4px",
            minWidth: "16px",
            height: "16px",
            borderRadius: "8px",
            border: "2px solid white"
          }}
        >
          3
        </Badge>
      </DropdownToggle>
      <DropdownMenu 
        right 
        style={{
          backgroundColor: "white",
          border: "none",
          borderRadius: "12px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
          padding: "8px",
          minWidth: "280px",
          marginTop: "8px"
        }}
      >
        <DropdownItem header tag="div" style={{ padding: '12px 16px', borderBottom: '1px solid #e2e8f0' }}>
          <h6 className="m-0" style={{ color: '#2d3748', fontWeight: '600', fontSize: '14px' }}>Notifications</h6>
          <small style={{ color: '#718096', fontSize: '0.75rem' }}>You have 3 new notifications</small>
        </DropdownItem>
        <DropdownItem 
          style={{
            padding: '10px 16px',
            borderRadius: '6px',
            margin: '2px 0',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#f7fafc';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <div style={{ 
              width: '8px', 
              height: '8px', 
              borderRadius: '50%', 
              backgroundColor: '#667eea',
              marginTop: '6px',
              marginRight: '12px'
            }} />
            <div>
              <div style={{ color: '#2d3748', fontWeight: '500', fontSize: '14px' }}>New message received</div>
              <div style={{ color: '#718096', fontSize: '12px' }}>Just now</div>
            </div>
          </div>
        </DropdownItem>
        <DropdownItem divider />
        <DropdownItem 
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            textAlign: 'center',
            color: '#667eea',
            fontWeight: '500',
            fontSize: '14px'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#f7fafc';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
          }}
        >
          View all notifications
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  );

  const ProfileAvatar = () => (
    <div
      style={{
        width: "36px",
        height: "36px",
        borderRadius: "50%",
        background: "linear-gradient(135deg, #667eea, #764ba2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        border: "2px solid rgba(102, 126, 234, 0.2)",
        transition: "all 0.3s ease",
        overflow: "hidden"
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = "scale(1.05)";
        e.target.style.borderColor = "rgba(102, 126, 234, 0.4)";
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = "scale(1)";
        e.target.style.borderColor = "rgba(102, 126, 234, 0.2)";
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

  return (
    <Navbar 
      className="navbar-top navbar-light" 
      expand="md" 
      id="navbar-main" 
      style={{
        width: '100%',
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e2e8f0",
        padding: "0",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        margin: 0,
        minHeight: '60px'
      }}
    >
      <Container fluid style={{
        padding: '0.75rem 2rem',
        height: '75px',
        display: 'flex',
        alignItems: 'center'
      }}>
        {/* Main horizontal layout */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          width: '100%'
        }}>
          
          {/* Left Section: Hamburger + Dashboard Text */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px'
          }}>
            <HamburgerIcon />
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <h1 style={{
                color: '#2d3748',
                fontSize: '1.25rem',
                fontWeight: '600',
                margin: 0,
                marginRight: '0.5rem'
              }}>
                Dashboard
              </h1>
              <span style={{ 
                color: '#718096', 
                fontSize: '1.25rem',
                margin: '0 0.5rem'
              }}></span>
              <span style={{ 
                color: '#4a5568', 
                fontSize: '1rem',
                fontWeight: '500'
              }}>
                
              </span>
            </div>
          </div>

          {/* Right Section: Notification + Profile */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px'
          }}>
            <NotificationIcon />
            <UncontrolledDropdown nav inNavbar>
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
                  marginTop: '8px'
                }}
              >
                <DropdownItem className="noti-title" header tag="div" style={{ padding: '12px 16px' }}>
                  <h6 className="m-0" style={{ color: '#2d3748', fontWeight: '600', fontSize: '14px' }}>Welcome! 👋</h6>
                  <small style={{ color: '#718096', fontSize: '0.75rem' }}>Administrator</small>
                </DropdownItem>
                <DropdownItem 
                  to="/admin/user-profile" 
                  tag={Link}
                  style={{
                    padding: '10px 16px',
                    borderRadius: '6px',
                    margin: '2px 0',
                    transition: 'all 0.2s ease',
                    fontSize: '14px'
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
                    padding: '10px 16px',
                    borderRadius: '6px',
                    margin: '2px 0',
                    transition: 'all 0.2s ease',
                    fontSize: '14px'
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
        </div>
      </Container>
    </Navbar>
  );
};

export default AdminNavbar;