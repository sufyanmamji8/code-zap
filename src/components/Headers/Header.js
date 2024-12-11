import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";
import "../../assets/css/style.css"

const Header = () => {
  return (
    <>
    <Container>
      <div
        className="header header-responsive"
        style={{
          background: "linear-gradient(to bottom, #17a2b8, #0d6efd)",
          height: "55px",
          width: "100%",
          
          marginTop: "10px",
          
          borderRadius: "10px",          
        }}    
        
      ></div>

      </Container>
    </>
  );
};

export default Header;
