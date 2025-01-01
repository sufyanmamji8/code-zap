import Header from "components/Headers/Header";
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
import { toast } from "sonner";  // Importing the toast library

const AdminNavbar = (props) => {
  const navigate = useNavigate();

  // Handle the log out process and show the success toast
 const handleLogOut = () => {
  localStorage.removeItem("token"); 
  sessionStorage.removeItem("phoneId"); // Remove configuration data from sessionStorage
  sessionStorage.removeItem("accountId");
  sessionStorage.removeItem("accessToken"); 
  sessionStorage.removeItem("callbackUrl");  // Remove configuration data from sessionStorage
  navigate("/auth/login"); // Redirect to login page
  toast.success("Logout Sucessfully")
};

  return (
    <>
    
      <Navbar className="navbar-top navbar-respons  navbar-dark" expand="md" id="navbar-main">
        <Container fluid>
          <Link
            className="h4 mb-0 text-white text-uppercase  d-lg-inline-block"
            to="/"
          >
            {props.brandText}
          </Link>

          <Nav className="align-items-center  d-md-flex" navbar>
            <UncontrolledDropdown nav>
              <DropdownToggle className="pr-0" nav>
                <Media className="align-items-center">
                  <span className="avatar avatar-sm rounded-circle">
                    <img
                      alt="..."
                      src={require("../../assets/img/theme/team-2-800x800.jpg")}
                    />
                  </span>
                  {/* <Media className="ml-2  d-lg-block">
                    <span className="mb-0 text-sm font-weight-bold">
                     CodoZap
                    </span>
                  </Media> */}
                </Media>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-arrow" right>
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
      
    </>
  );
};

export default AdminNavbar;
