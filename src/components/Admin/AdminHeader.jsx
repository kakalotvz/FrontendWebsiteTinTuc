import React from "react";
import { Row, Col, Avatar, Dropdown, Button, Menu } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { logout } from "../../utils/auth";
import { useNavigate } from "react-router-dom";

const AdminHeader = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const doLogout = async () => {
    await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    }).catch(() => {});
    logout();
    navigate("/dang-nhap-quan-ly", { replace: true });
  };
  const accountMenu = (
    <Menu>
      <Menu.Item key="1" icon={<UserOutlined />}>
        Thông tin cá nhân
      </Menu.Item>
      <Menu.Item onClick={() => doLogout()} key="2" icon={<LogoutOutlined />}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );
  return (
    <div style={{ background: "#fff", padding: 20 }}>
      <Row justify="space-between" align="middle" style={{ padding: "0 16px" }}>
        <Col>
          <Button
            size="large"
            type="text"
            icon={
              collapsed ? (
                <MenuUnfoldOutlined style={{ fontSize: "30px" }} />
              ) : (
                <MenuFoldOutlined style={{ fontSize: "30px" }} />
              )
            }
            onClick={() => setCollapsed(!collapsed)}
          />
        </Col>
        <Col>
          <Dropdown overlay={accountMenu} placement="bottomRight">
            <Avatar
              style={{ backgroundColor: "#87d068", cursor: "pointer" }}
              icon={<UserOutlined />}
              size={50}
            />
          </Dropdown>
        </Col>
      </Row>
    </div>
  );
};

export default AdminHeader;
