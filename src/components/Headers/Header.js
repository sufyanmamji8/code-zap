import { Container } from "reactstrap";
import "../../assets/css/style.css"

const Header = () => {
  return (
    <>
      <Container>
        <div
          className="header"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            height: "70px",
            width: "100%",
            marginTop: "20px",
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(102, 126, 234, 0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 30px",
            position: "relative",
            overflow: "hidden"
          }}
        >
          {/* Shimmer effect overlay */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "-100%",
              width: "100%",
              height: "100%",
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
              animation: "shimmer 3s infinite"
            }}
          />
          
          {/* Brand/Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <div
              style={{
                width: "45px",
                height: "45px",
                background: "rgba(255, 255, 255, 0.2)",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.3)"
              }}
            >
              <span style={{ color: "white", fontWeight: "bold", fontSize: "20px" }}>
                ★
              </span>
            </div>
            
            <h1
              style={{
                color: "white",
                fontSize: "24px",
                fontWeight: "700",
                margin: 0,
                fontFamily: "'Inter', sans-serif",
                textShadow: "0 2px 4px rgba(0,0,0,0.1)"
              }}
            >
              Your Platform
            </h1>
          </div>

          {/* User Info */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "15px",
              background: "rgba(255, 255, 255, 0.15)",
              padding: "8px 20px",
              borderRadius: "25px",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.25)";
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <div
              style={{
                width: "35px",
                height: "35px",
                background: "linear-gradient(45deg, #ff6b6b, #ffa726)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                color: "white",
                fontSize: "14px"
              }}
            >
              U
            </div>
            
            <span
              style={{
                color: "white",
                fontWeight: "600",
                fontSize: "14px"
              }}
            >
              Welcome back!
            </span>
          </div>
        </div>
      </Container>

      <style>
        {`
          @keyframes shimmer {
            0% { left: -100%; }
            100% { left: 100%; }
          }
          
          @media (max-width: 768px) {
            .header {
              padding: 0 20px !important;
              height: 60px !important;
            }
            
            .header h1 {
              font-size: 20px !important;
            }
          }
        `}
      </style>
    </>
  );
};

export default Header;