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
} from "antd";
import { SearchOutlined, BellOutlined, MenuOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { apiFetchTongQuat } from "../../services/apiTongQuat";
import baomoi24h_logo from "./../../../public/baomoi24h_logo.png";
import "./header.css";

const { Header } = Layout;

const HeaderApp = () => {
  const [cats, setCats] = useState([]);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

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
          className="text-menu"
          onClick={() => {
            navigate("/");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          Trang chủ
        </a>
      ),
    };
    const catItems = (cats || []).slice(0, 10).map((c) => ({
      key: c._id || c.slug || slugify(c.ten),
      label: (
        <a className="text-menu" onClick={() => goCat(c._id)}>
          {c.ten}
        </a>
      ),
    }));
    return [home, ...catItems];
  }, [cats]);

  const itemsMobile = useMemo(() => {
    const home = {
      key: "home",
      label: (
        <a
          className="text-menu"
          onClick={() => {
            navigate("/");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          Trang chủ
        </a>
      ),
    };
    const catItems = (cats || []).map((c) => ({
      key: c._id || c.slug || slugify(c.ten),
      label: (
        <a className="text-menu" onClick={() => goCat(c._id)}>
          {c.ten}
        </a>
      ),
    }));
    return [home, ...catItems];
  }, [cats]);

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
            placeholder="Tìm nhanh tin nóng, chủ đề, tác giả…"
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
        width={320}
        className="nav-drawer"
        title={
          <div className="drawer-head">
            <img className="brand-logo" src={baomoi24h_logo} alt="BAOMOI24H" />
          </div>
        }
      >
        <div className="drawer-search">
          <Input
            size="large"
            placeholder="Tìm bài viết…"
            prefix={<SearchOutlined />}
            allowClear
            onPressEnter={(e) => doSearch(e.target.value)}
          />
        </div>
        <Menu
          mode="inline"
          items={itemsMobile}
          selectable={false}
          className="drawer-menu"
        />
      </Drawer>
    </Header>
  );
};

export default HeaderApp;
