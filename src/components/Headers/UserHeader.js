import { Button, Container, Row, Col } from "reactstrap";

const UserHeader = () => {
  return (
    <>
      <div
        className="header pb-8 pt-5 pt-lg-8 d-flex align-items-center"
        style={{
          minHeight: "500px",
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(" + require("../../assets/img/theme/profile-cover.jpg") + ")",
          backgroundSize: "cover",
          backgroundPosition: "center top",
          position: "relative",
          overflow: "hidden"
        }}
      >
        {/* Animated gradient overlay */}
        <div 
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "linear-gradient(135deg, rgba(74, 144, 226, 0.3) 0%, rgba(148, 85, 211, 0.3) 100%)",
            opacity: 0.8
          }}
        />
        
        {/* Floating particles effect */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%)",
          animation: "float 6s ease-in-out infinite"
        }} />

        {/* Header container */}
        <Container className="d-flex align-items-center position-relative" fluid style={{ zIndex: 2 }}>
          <Row className="w-100">
            <Col lg="7" md="10">
              {/* Welcome text with animation */}
              <div style={{ animation: "fadeInUp 0.8s ease-out" }}>
                <h1 className="display-3 text-white fw-bold mb-3" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.3)" }}>
                  Welcome back, <span style={{ color: "#4ade80" }}>Jesse</span>!
                </h1>
                
                <p className="text-white lead mb-4" style={{ 
                  fontSize: "1.25rem",
                  textShadow: "0 1px 5px rgba(0,0,0,0.3)",
                  opacity: 0.9
                }}>
                  This is your personal dashboard. Track your progress, manage projects, 
                  and stay updated with your latest achievements.
                </p>

                {/* Stats preview */}
                <div className="d-flex gap-4 mb-4">
                  <div className="text-white">
                    <div className="h4 mb-1 fw-bold">12</div>
                    <small className="opacity-80">Projects</small>
                  </div>
                  <div className="text-white">
                    <div className="h4 mb-1 fw-bold">47</div>
                    <small className="opacity-80">Tasks</small>
                  </div>
                  <div className="text-white">
                    <div className="h4 mb-1 fw-bold">89%</div>
                    <small className="opacity-80">Progress</small>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="d-flex gap-3 flex-wrap">
                  <Button
                    color="primary"
                    size="lg"
                    style={{
                      background: "linear-gradient(135deg, #667eea, #764ba2)",
                      border: "none",
                      borderRadius: "12px",
                      padding: "12px 30px",
                      fontWeight: "600",
                      boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
                      transition: "all 0.3s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow = "0 8px 25px rgba(102, 126, 234, 0.6)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "0 4px 15px rgba(102, 126, 234, 0.4)";
                    }}
                  >
                    ✏️ Edit Profile
                  </Button>
                  
                  <Button
                    color="light"
                    size="lg"
                    style={{
                      background: "rgba(255, 255, 255, 0.15)",
                      border: "1px solid rgba(255, 255, 255, 0.3)",
                      borderRadius: "12px",
                      padding: "12px 30px",
                      fontWeight: "600",
                      color: "white",
                      backdropFilter: "blur(10px)",
                      transition: "all 0.3s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = "rgba(255, 255, 255, 0.25)";
                      e.target.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "rgba(255, 255, 255, 0.15)";
                      e.target.style.transform = "translateY(0)";
                    }}
                  >
                    📊 View Analytics
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </Container>

        {/* Wave decoration at bottom */}
        <div style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "40px",
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
          clipPath: "polygon(0 100%, 100% 100%, 100% 0, 0 100%)"
        }} />
      </div>

      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }

          @media (max-width: 768px) {
            .display-3 {
              font-size: 2.5rem !important;
            }
          }
        `}
      </style>
    </>
  );
};

export default UserHeader;