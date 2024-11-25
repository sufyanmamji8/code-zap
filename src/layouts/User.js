import React from "react";
import Sidebar from "components/Sidebar";  // Sidebar component
import userRoutes from "routes/userRoutes";  // User-specific routes
import { Outlet } from "react-router-dom";  // Placeholder for nested routes

function UserLayout({ toggleSidebar }) {
  return (
    <div className="user-layout">
      <Sidebar routes={userRoutes} toggleSidebar={toggleSidebar} />
      <div className="main-content">
        <Outlet /> {/* Render the child routes here */}
      </div>
    </div>
  );
}

export default UserLayout;
