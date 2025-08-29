import React, { useEffect, useState } from "react";
import { FloatButton, Layout, Menu, Tooltip } from "antd";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  BookOutlined,
  DollarOutlined,
  HomeOutlined,
  NotificationOutlined,
  UserOutlined,
} from "@ant-design/icons";
import AdminHeader from "./AdminHeader";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import AppFooter from "../Footer/Footer";
import baomoi24h_logo from "./../../../public/baomoi24h_logo.png";

const { Sider, Content } = Layout;
const SCROLL_THRESHOLD = 80; // px

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [atTop, setAtTop] = useState(true);

  useEffect(() => {
    const onScroll = () => {
      const y = window.pageYOffset || document.documentElement.scrollTop;
      setAtTop(y <= SCROLL_THRESHOLD);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const scrollToBottom = () => {
    const doc = document.documentElement;
    window.scrollTo({
      top: doc.scrollHeight - doc.clientHeight,
      behavior: "smooth",
    });
  };

  // Lấy key hiện tại theo path URL
  const selectedKey = () => {
    if (location.pathname.includes("/admin/bai-viet")) return "1";
    if (location.pathname.includes("/admin/giao-dich")) return "2";
    if (location.pathname.includes("/admin/thong-bao")) return "3";
    if (location.pathname.includes("/admin/nguoi-dung")) return "4";
    if (location.pathname.includes("/admin/tap-da-mua")) return "5";
    if (location.pathname.includes("/admin/so-du")) return "6";
    return "0"; // default
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div
          style={{
            height: 64,
            margin: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#001529",
            borderRadius: 8,
            fontWeight: "bold",
            fontSize: 18,
          }}
        >
          <img
            height={100}
            style={{
              objectFit: "contain",
              cursor: "pointer",
              display: "block",
              margin: "20px auto",
            }}
            src={baomoi24h_logo}
            alt="BAOMOI24H"
          />
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey()]}
          onClick={({ key }) => {
            if (key === "0") navigate("/admin");
            if (key === "1") navigate("/admin/bai-viet");
            if (key === "2") navigate("/admin/giao-dich");
            if (key === "3") navigate("/admin/thong-bao");
            if (key === "4") navigate("/admin/nguoi-dung");
            if (key === "5") navigate("/admin/tap-da-mua");
            if (key === "6") navigate("/admin/so-du");
          }}
        >
          <Menu.Item key="0" icon={<HomeOutlined />}>
            Trang chủ
          </Menu.Item>
          <Menu.Item key="1" icon={<BookOutlined />}>
            Quản lý bài viết
          </Menu.Item>
          <Menu.Item key="2" icon={<DollarOutlined />}>
            Giao dịch
          </Menu.Item>
          <Menu.Item key="5" icon={<BookOutlined />}>
            Tập đã mua
          </Menu.Item>
          <Menu.Item key="6" icon={<DollarOutlined />}>
            Số dư tài khoản
          </Menu.Item>
          <Menu.Item key="3" icon={<NotificationOutlined />}>
            Thông báo
          </Menu.Item>
          <Menu.Item key="4" icon={<UserOutlined />}>
            Người dùng
          </Menu.Item>
        </Menu>
      </Sider>

      {/* Main */}
      <Layout>
        <AdminHeader collapsed={collapsed} setCollapsed={setCollapsed} />
        <Content style={{ margin: "16px" }}>
          <Outlet /> {/* Render các component con */}
        </Content>
        {/* <AppFooter /> */}
        {/* FAB cuộn nhanh */}
        <Tooltip
          title={atTop ? "Xuống chân trang" : "Lên đầu trang"}
          color="#7F00FF"
        >
          <FloatButton
            className="fab-scroll btn-cuon-trang" // 👈 thêm class riêng
            type="default" // 👈 KHÔNG dùng primary
            shape="circle" // hoặc "square"
            icon={atTop ? <ArrowDownOutlined /> : <ArrowUpOutlined />}
            //   tooltip={atTop ? "Xuống chân trang" : "Lên đầu trang"}
            onClick={atTop ? scrollToBottom : scrollToTop}
            style={{ right: 24, bottom: 24 }}
          />
        </Tooltip>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
