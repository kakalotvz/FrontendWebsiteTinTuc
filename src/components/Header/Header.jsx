import React, { useEffect, useMemo, useState } from "react";
import {
  Layout,
  Input,
  Menu,
  Button,
  Drawer,
  Space,
  message,
  Divider,
  Tooltip,
} from "antd";
import {
  SearchOutlined,
  MenuOutlined,
  AndroidOutlined,
} from "@ant-design/icons";
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
  const [q, setQ] = useState("");

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
      const sp = new URLSearchParams(location.search);
      sp.set("theloai", c._id);
      sp.delete("page");
      const href = `/tat-ca-bai-viet?${sp.toString()}`;
      const isActive = currentCat === c._id;

      return {
        key: c._id,
        label: (
          <Link
            to={href}
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
      <div className="header-inner">
        {/* logo */}
        <div className="brand">
          <a href="/" className="logo-wrap" aria-label="BAOMOI24H">
            <img className="brand-logo" src={baomoi24h_logo} alt="BAOMOI24H" />
          </a>
        </div>

        {/* search */}
        <div className="header-search">
          <Input
            size="large"
            placeholder="Tìm nhanh tin nóng, chủ đề, tags, mô tả…"
            prefix={<SearchOutlined />}
            allowClear
            onChange={(e) => setQ(e.target.value)}
            onPressEnter={(e) => doSearch(e.target.value)}
          />
        </div>

        {/* right icons */}
        <Space className="header-right">
          {/* Nút tải app Android */}
          <Tooltip title="Tải app Tinhay trên Google Play" color="#22d3ee">
            <Button
              size="large"
              className="android-btn"
              type="#"
              //   shape="circle"
              icon={<AndroidOutlined style={{ fontSize: 25 }} />}
              onClick={() =>
                window.open(
                  "https://play.google.com/store/apps/details?id=com.dokhactu.storymix",
                  "_blank"
                )
              }
            />
          </Tooltip>

          {/* Nút menu mobile */}
          <Button
            className="burger"
            type="#"
            icon={<MenuOutlined size={50} />}
            onClick={() => setOpen(true)}
          />
        </Space>
      </div>

      {/* Nav desktop */}
      <div className="nav-wrap">
        <Menu mode="horizontal" className="nav-menu" items={items} />
      </div>

      {/* Drawer mobile */}
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        placement="left"
        width={400}
        className="nav-drawer"
        title={null}
      >
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

        {/* Nút tải app trong drawer */}
        <div className="drawer-quick">
          <Button
            className="quick-btn"
            icon={<AndroidOutlined />}
            onClick={() =>
              window.open(
                "https://play.google.com/store/apps/details?id=com.dokhactu.storymix",
                "_blank"
              )
            }
          >
            Tải app Tinhay
          </Button>
          <Button
            className="quick-btn"
            onClick={() => {
              navigate("/download-video-tiktok");
              setOpen(false);
            }}
          >
            Tool download TikTok
          </Button>
        </div>

        <Divider className="drawer-divider">Danh mục</Divider>

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

        <Divider className="drawer-divider" />

        <div className="drawer-footer">
          <div className="df-line">
            © {new Date().getFullYear()} DANTRI24H.COM
          </div>
        </div>
      </Drawer>
    </Header>
  );
};

export default HeaderApp;
