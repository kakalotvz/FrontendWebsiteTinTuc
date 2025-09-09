import React, { useEffect, useState } from "react";
import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import DashboardPage from "./pages/Admin/DashboardPage";
import TruyenManager from "./pages/Admin/TruyenManager";
import NotFound from "./components/NotFound";
import AdminLayout from "./components/Admin/AdminLayout";
import ClickSpark from "./components/HieuUng/ClickSpark";
import { Outlet } from "react-router-dom";
import GiaoDich from "./pages/Admin/GiaoDich";
import ThongBao from "./pages/Admin/ThongBao";
import NguoiDung from "./pages/Admin/NguoiDung";
import TapDaMua from "./pages/Admin/TapDaMua";
import SoDuVaNapTien from "./pages/Admin/SoDuVaNapTien";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import PublicRoute from "./components/PublicRoute/PublicRoute";
import HeaderApp from "./components/Header/Header";
import FooterApp from "./components/Footer/Footer";
import TrangChiTiet from "./pages/TrangChiTiet";
import { FloatButton, Tooltip } from "antd";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import "./layout.css";
import PostAll from "./pages/PostAll";
import DownloadVideo from "./pages/DownloadVideoTikTok.jsx";
import ChinhSach from "./pages/ChinhSachBaoMat/ChinhSach.jsx";

const SCROLL_THRESHOLD = 80; // px

const Layout = () => {
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

  return (
    <>
      <HeaderApp />
      <Outlet />
      <FooterApp />

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
    </>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "chi-tiet-bai-viet/:category/:slugId",
        element: <TrangChiTiet />,
      },
      {
        path: "tat-ca-bai-viet",
        element: <PostAll />,
      },
      {
        path: "download-video-tiktok",
        element: <DownloadVideo />,
      },
      {
        path: "privacy",
        element: <ChinhSach />,
      },
    ],
  },
  {
    path: "/dang-nhap-quan-ly",
    element: <PublicRoute />, // bọc bằng PublicRoute để ngăn chặn khi đã login thì không thể về trang login
    children: [
      {
        index: true,
        element: <Login />,
      },
    ],
    errorElement: <NotFound />,
  },
  //   {
  //     path: "/admin",
  //     element: <AdminLayout />,
  //     children: [
  //       {
  //         index: true,
  //         element: <DashboardPage />,
  //       },
  //       {
  //         path: "truyen",
  //         element: <TruyenManager />,
  //       },
  //       {
  //         path: "tao-truyen",
  //         element: <CreateTruyen />,
  //       },
  //       {
  //         path: "giao-dich",
  //         element: <GiaoDich />,
  //       },
  //       {
  //         path: "thong-bao",
  //         element: <ThongBao />,
  //       },
  //       {
  //         path: "nguoi-dung",
  //         element: <NguoiDung />,
  //       },
  //       {
  //         path: "tap-da-mua",
  //         element: <TapDaMua />,
  //       },
  //       {
  //         path: "so-du",
  //         element: <SoDuVaNapTien />,
  //       },
  //     ],
  //   },
  {
    path: "/admin",
    element: <ProtectedRoute />, // bọc bằng ProtectedRoute để ngăn chặn khi chưa login
    children: [
      {
        element: <AdminLayout />, // layout admin
        children: [
          { index: true, element: <DashboardPage /> },
          { path: "bai-viet", element: <TruyenManager /> },
          { path: "giao-dich", element: <GiaoDich /> },
          { path: "thong-bao", element: <ThongBao /> },
          { path: "nguoi-dung", element: <NguoiDung /> },
          { path: "tap-da-mua", element: <TapDaMua /> },
          { path: "so-du", element: <SoDuVaNapTien /> },
        ],
      },
    ],
  },
]);

export default router;
