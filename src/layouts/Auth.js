import React from "react";
import { useLocation, Route, Routes, Navigate } from "react-router-dom";

// core components
import AuthNavbar from "components/Navbars/AuthNavbar.js";
import AuthFooter from "components/Footers/AuthFooter.js";

import routes from "routes.js";

const Auth = (props) => {
  const mainContent = React.useRef(null);
  const location = useLocation();

  React.useEffect(() => {
    // Set consistent background for all auth pages
    document.body.classList.add("bg-white");
    document.body.style.background = "#fafbfc";
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.overflow = "hidden";
    
    return () => {
      document.body.classList.remove("bg-white");
      document.body.style.overflow = "auto";
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
      <div 
        className="main-content" 
        ref={mainContent} 
        style={{ 
          background: "#fafbfc",
          minHeight: "100vh",
          height: "100vh",
          width: "100vw",
          margin: 0,
          padding: 0,
          overflow: "hidden"
        }}
      >
        {/* Remove Container component completely to avoid any padding/margin issues */}
        <div style={{ 
          height: "100vh",
          width: "100vw",
          margin: 0,
          padding: 0,
          overflow: "hidden"
        }}>
          <Routes>
            {getRoutes(routes)}
            <Route path="*" element={<Navigate to="/auth/login" replace />} />
          </Routes>
        </div>
      </div>
      
      {/* Remove footer if it's causing layout issues */}
      {/* <AuthFooter /> */}
      
      <style>
        {`
        body {
          margin: 0 !important;
          padding: 0 !important;
          background: #fafbfc !important;
          overflow: hidden !important;
          height: 100vh !important;
          width: 100vw !important;
        }
        
        html, #root {
          margin: 0 !important;
          padding: 0 !important;
          overflow: hidden !important;
          height: 100vh !important;
          width: 100vw !important;
        }
        
        .main-content {
          background: #fafbfc !important;
        }
        
        /* Remove any bootstrap container styles */
        .container, .container-fluid {
          margin: 0 !important;
          padding: 0 !important;
          max-width: none !important;
        }
        `}
      </style>
    </>
  );
};

export default Auth;