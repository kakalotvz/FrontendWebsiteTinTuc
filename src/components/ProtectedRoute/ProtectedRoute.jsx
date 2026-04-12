// components/ProtectedRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../../utils/auth";

const ProtectedRoute = () => {
  console.log("isAuthenticated: ", isAuthenticated());

  if (!isAuthenticated()) {
    // Chưa login → về trang login
    return <Navigate to="/dang-nhap-quan-ly" replace />;
  }
  // Đã login → render tiếp component con
  return <Outlet />;
};

export default ProtectedRoute;
