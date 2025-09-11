import React, { useEffect, useMemo, useState } from "react";
import {
  Layout,
  Input,
  Menu,
  Badge,
  Button,
  Drawer,
  Space,
  message,
  Divider,
  Tooltip,
} from "antd";
import { SearchOutlined, BellOutlined, MenuOutlined } from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { apiFetchTongQuat } from "../../services/apiTongQuat";
import baomoi24h_logo from "./../../../public/baomoi24h_logo.png";
import "./header.css";

const { Header } = Layout;

const HeaderApp = () => {
  const [cats, setCats] = useState([]);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Lấy id thể loại hiện tại từ URL
  const currentCat = useMemo(() => {
    const sp = new URLSearchParams(location.search);
    return sp.get("theloai") || "";
  }, [location.search]);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiFetchTongQuat("/bai-viet/get-the-loai", {
          method: "GET",
        });
        setCats(res?.data || []);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const slugify = (s = "") =>
    s
      .toString()
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const goCat = (c) => {
    navigate(`/tat-ca-bai-viet?theloai=${encodeURIComponent(c)}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setOpen(false);
  };

  const items = useMemo(() => {
    const home = {
      key: "home",
      label: (
        <a
          className={`text-menu ${
            location.pathname === "/" ? "active_menu" : ""
          }`}
          onClick={() => {
            navigate("/");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          Trang chủ
        </a>
      ),
    };
    const catItems = (cats || []).slice(0, 10).map((c) => {
      // build URL mới, giữ lại các query khác nếu có
      const sp = new URLSearchParams(location.search);
      sp.set("theloai", c._id);
      sp.delete("page"); // (tuỳ) reset phân trang khi đổi TL
      const href = `/tat-ca-bai-viet?${sp.toString()}`;

      const isActive = currentCat === c._id;

      return {
        key: c._id,
        label: (
          <Link
            to={href} // 👉 KHÔNG reload trang
            className={`text-menu ${isActive ? "active_menu" : ""}`}
            onClick={() => {
              navigate(href);
              window.scrollTo({ top: 0, behavior: "smooth" });
              setOpen(false);
              goCat(c._id);
            }}
          >
            {c.ten}
          </Link>
        ),
      };
    });
    return [home, ...catItems];
  }, [cats, location.search, location.pathname, currentCat, navigate]);

  const doSearch = (v) => {
    if (!v?.trim()) {
      message.warning("Nhập từ khoá tìm kiếm");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    navigate({
      pathname: "/tat-ca-bai-viet",
      search: v ? `?search=${encodeURIComponent(v)}` : "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Header className="header-app">
      {/* Top row */}
      <div className="header-inner">
        <div className="brand">
          <a href="/" className="logo-wrap" aria-label="BAOMOI24H">
            <img className="brand-logo" src={baomoi24h_logo} alt="BAOMOI24H" />
          </a>
        </div>

        {/* Desktop search */}
        <div className="header-search">
          <Input
            size="large"
            placeholder="Tìm nhanh tin nóng, chủ đề, tags, mô tả…"
            prefix={<SearchOutlined />}
            allowClear
            onChange={(e) => {
              const v = e.target.value;

              setQ(v);

              if (v === "" && pathname !== "/tat-ca-bai-viet") {
                // chỉ điều hướng khi bấm clear/xóa hết
                navigate("/tat-ca-bai-viet", { replace: true });
              }
            }}
            onPressEnter={(e) => doSearch(e.target.value)}
          />
        </div>

        <Space className="header-right">
          {/* <Badge dot>
            <BellOutlined className="header-icon" />
          </Badge> */}
          <Button
            className="burger"
            type="#"
            icon={<MenuOutlined size={50} />}
            onClick={() => setOpen(true)}
          />
        </Space>
      </div>

      {/* Desktop nav */}
      <div className="nav-wrap">
        <Menu mode="horizontal" className="nav-menu" items={items} />
      </div>

      {/* Mobile drawer */}
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        placement="left"
        width={400}
        className="nav-drawer"
        title={null} // tự làm header custom bên trong body
      >
        {/* Header của Drawer */}
        <img
          height={200}
          style={{
            objectFit: "contain",
            cursor: "pointer",
            display: "block",
            margin: "0 auto 12px",
          }}
          onClick={() => {
            navigate("/");
            window.scrollTo({ top: 0, behavior: "smooth" });
            setOpen(false);
          }}
          className="drawer-logo"
          src={baomoi24h_logo}
          alt="DANTRI24H"
        />

        {/* Ô tìm kiếm sticky */}
        <div className="drawer-search">
          <Tooltip
            title="Gõ từ khóa (tiêu đề, chủ đề, tag, mô tả) rồi nhấn Enter để xem kết quả nha!"
            color="#7F00FF"
          >
            <Input
              size="large"
              placeholder="Tìm bài viết…"
              prefix={<SearchOutlined />}
              allowClear
              onPressEnter={(e) => {
                const v = e.target.value;
                if (v?.trim()) {
                  navigate(
                    `/tat-ca-bai-viet?search=${encodeURIComponent(v.trim())}`
                  );
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  setOpen(false);
                }
              }}
              onChange={(e) => {
                if (e.target.value === "") {
                  navigate("/tat-ca-bai-viet");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
            />
          </Tooltip>
        </div>

        {/* Link nhanh */}
        <div className="drawer-quick">
          <Button
            size="middle"
            type="#"
            className="quick-btn"
            onClick={() => {
              navigate("/");
              window.scrollTo({ top: 0, behavior: "smooth" });
              setOpen(false);
            }}
          >
            Trang chủ
          </Button>
          <Button
            size="middle"
            type="#"
            className="quick-btn"
            onClick={() => {
              navigate("/tat-ca-bai-viet");
              window.scrollTo({ top: 0, behavior: "smooth" });
              setOpen(false);
            }}
          >
            Tất cả bài viết
          </Button>
          <Button
            size="middle"
            type="#"
            className="quick-btn"
            onClick={() => {
              navigate("/dang-nhap-quan-ly");
              window.scrollTo({ top: 0, behavior: "smooth" });
              setOpen(false);
            }}
          >
            Đăng tin tức
          </Button>
          <Button
            size="middle"
            type="#"
            className="quick-btn"
            onClick={() => {
              navigate("/download-video-tiktok");
              window.scrollTo({ top: 0, behavior: "smooth" });
              setOpen(false);
            }}
          >
            Tool download TikTok
          </Button>
        </div>

        <Divider className="drawer-divider">Danh mục</Divider>

        {/* Danh sách thể loại */}
        <nav className="drawer-list">
          {(cats || []).map((c, idx) => {
            const sp = new URLSearchParams(location.search);
            sp.set("theloai", c._id);
            sp.delete("page");
            const href = `/tat-ca-bai-viet?${sp.toString()}`;
            const isActive = currentCat === c._id;

            return (
              <Link
                key={c._id}
                to={href}
                className={`drawer-item ${isActive ? "active" : ""}`}
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  setOpen(false);
                }}
              >
                <span className="di-index">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <span className="di-text">{c.ten}</span>
                <span className="di-arrow">›</span>
              </Link>
            );
          })}
        </nav>

        <Divider className="drawer-divider">Chủ đề nổi bật</Divider>

        {/* Chips chủ đề (tận dụng 8 thể loại đầu) */}
        <div className="drawer-chips">
          {(cats || []).slice(0, 8).map((c) => {
            const sp = new URLSearchParams(location.search);
            sp.set("theloai", c._id);
            const href = `/tat-ca-bai-viet?${sp.toString()}`;
            const isActive = currentCat === c._id;

            return (
              <Link
                key={`chip-${c._id}`}
                to={href}
                className={`chip ${isActive ? "active" : ""}`}
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  setOpen(false);
                }}
              >
                {c.ten}
              </Link>
            );
          })}
        </div>

        <Divider className="drawer-divider" />

        {/* Footer Drawer */}
        <div className="drawer-footer">
          <div className="df-line">
            © {new Date().getFullYear()} DANTRI24H.COM
          </div>
          {/* <div className="df-line">
            <a
              onClick={() => {
                navigate("/dieu-khoan");
                setOpen(false);
              }}
            >
              Điều khoản
            </a>
            <span className="dot" />
            <a
              onClick={() => {
                navigate("/bao-mat");
                setOpen(false);
              }}
            >
              Bảo mật
            </a>
          </div> */}
        </div>
      </Drawer>
    </Header>
  );
};

export default HeaderApp;
