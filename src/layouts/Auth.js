import React from "react";
import { useLocation, Route, Routes, Navigate } from "react-router-dom";
import { Container } from "reactstrap";

// core components
import AuthNavbar from "components/Navbars/AuthNavbar.js";
import AuthFooter from "components/Footers/AuthFooter.js";

import routes from "routes.js";

const Auth = (props) => {
  const mainContent = React.useRef(null);
  const location = useLocation();

  React.useEffect(() => {
    // Remove any background classes that might interfere
    document.body.classList.remove("bg-default");
    document.body.style.background = "transparent";
    document.body.style.overflow = "hidden"; // Prevent body scroll
    
    return () => {
      document.body.style.overflow = "auto"; // Restore scroll when leaving
    };
  }, []);
  
  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    if (mainContent.current) {
      mainContent.current.scrollTop = 0;
    }
  }, [location]);

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/auth") {
        return (
          <Route path={prop.path} element={prop.component} key={key} exact />
        );
      } else {
        return null;
      }
    });
  };

  return (
    <>
      <div className="main-content" ref={mainContent} style={{ 
        background: "transparent", 
        minHeight: "100vh",
        overflow: "hidden"
      }}>
        <AuthNavbar />
        <Container fluid className="auth-container-custom" style={{ 
          padding: 0, 
          margin: 0,
          height: "100vh",
          overflow: "hidden"
        }}>
          <Routes>
            {getRoutes(routes)}
            <Route path="*" element={<Navigate to="/auth/login" replace />} />
          </Routes>
        </Container>
      </div>
      <AuthFooter />
      
      <style>
        {`
        body {
          margin: 0;
          padding: 0;
          background: transparent !important;
          overflow: hidden;
        }
        
        .main-content {
          background: transparent !important;
        }
        
        .auth-container-custom {
          background: transparent !important;
        }
        
        /* Remove any default styles that might be interfering */
        .bg-default {
          background: transparent !important;
        }
        
        .fill-default {
          fill: transparent !important;
        }
        
        /* Ensure no scroll bars */
        html, body, #root {
          overflow: hidden !important;
          height: 100vh !important;
        }
        `}
      </style>
    </>
  );
};

export default Auth;