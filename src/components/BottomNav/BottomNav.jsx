import {
  HomeOutlined,
  ApartmentOutlined,
  UserOutlined,
  UnorderedListOutlined,
  PlayCircleOutlined,
  BookOutlined,
  DownloadOutlined,
  FormOutlined,
  ReadOutlined,
} from "@ant-design/icons";
import { NavLink } from "react-router-dom";
import styles from "./BottomNav.module.css";

const BottomNav = () => {
  return (
    <div className={styles.bottom_nav}>
      <NavLink
        to="/"
        className={({ isActive }) => (isActive ? styles.active : "")}
      >
        <HomeOutlined />
        <span style={{ fontSize: 13 }}>Trang chủ</span>
      </NavLink>
      <NavLink
        to="/tat-ca-bai-viet"
        className={({ isActive }) => (isActive ? styles.active : "")}
      >
        <ReadOutlined />
        <span style={{ fontSize: 13 }}>Tất cả bài viết</span>
      </NavLink>
      <NavLink
        to="/download-video-tiktok"
        className={({ isActive }) => (isActive ? styles.active : "")}
      >
        <DownloadOutlined />
        <span style={{ fontSize: 13 }}>Download Video</span>
      </NavLink>
      <NavLink
        to="/dang-nhap-quan-ly"
        className={({ isActive }) => (isActive ? styles.active : "")}
      >
        <FormOutlined />
        <span style={{ fontSize: 13 }}>Đăng tin tức</span>
      </NavLink>
    </div>
  );
};

export default BottomNav;
