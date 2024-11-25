import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";

const Header = () => {
  return (
    <>
      <div
        className="header"
        style={{
          background: "linear-gradient(to bottom, #17a2b8, #0d6efd)",
          height: "12vh",
          width: "97%",
          marginLeft: "20px",
          marginTop: "10px",
          marginRight: "10px",
          borderRadius: "10px",
        }}
      ></div>
    </>
  );
};

export default Header;
