import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthMe } from "../../contexts/AuthMeContext";
import { Spin } from "antd";

const AdminOnlyRoute = () => {
  const { role, loading } = useAuthMe();

  if (loading) return <div style={{ display: "flex", justifyContent: "center", padding: 48 }}><Spin /></div>;

  if (role !== "admin") return <Navigate to="/admin" replace />;

  return <Outlet />;
};

export default AdminOnlyRoute;
