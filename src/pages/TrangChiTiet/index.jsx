import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Row,
  Col,
  Tag,
  Avatar,
  Typography,
  Skeleton,
  Empty,
  Divider,
  Space,
  Button,
  Tooltip,
  Anchor,
  Breadcrumb,
  message,
  Card,
} from "antd";
import {
  EyeOutlined,
  ShareAltOutlined,
  ClockCircleOutlined,
  ArrowUpOutlined,
  TagOutlined,
  FireOutlined,
  HomeOutlined,
  UnorderedListOutlined,
  HeartFilled,
  HeartOutlined,
} from "@ant-design/icons";
import { useParams, useNavigate, Link } from "react-router-dom";
import { apiFetchTongQuat } from "../../services/apiTongQuat";
import "./trangchitiet.css";
import LikeHearts from "./LikeHearts";
import PageTitle from "../../components/PageTitle/PageTitle";
import avt from "./../../../public/logo_app.png";
const { Title, Paragraph, Text } = Typography;

const formatDate = (d) => {
  if (!d) return "";
  try {
    const date = new Date(d);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return "";
  }
};

export default function TrangChiTiet() {
  const { postId: paramId } = useParams(); // hỗ trợ route "/:postId" hoặc "/tin/:postId"
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState(null);
  const [related, setRelated] = useState([]);
  const [hot, setHot] = useState([]);
  const [progress, setProgress] = useState(0);
  const contentRef = useRef(null);
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);

  console.log("detail: ", detail);

  const queryId = useMemo(() => {
    const s = new URLSearchParams(window.location.search).get("id");
    return s || null;
  }, []);
  const id = new URLSearchParams(window.location.search).get("id");
  //   const id = paramId || queryId;

  const getDetailPost = async (postId) => {
    const res = await apiFetchTongQuat(
      `/bai-viet/get-detail-bai-viet?id=${postId}`,
      { method: "GET" }
    );
    return res?.data || null;
  };

  const getRelated = async (theLoaiId, currentId) => {
    // lấy 8 bài cùng thể loại, loại trừ bài hiện tại
    const res = await apiFetchTongQuat(
      `/bai-viet/get-bai-viet?status=true&valueTL=${theLoaiId}&limit=12`,
      { method: "GET" }
    );
    const raw = res?.data?.data || res?.data || [];
    return raw.filter((p) => p?._id !== currentId).slice(0, 8);
  };

  const getHot = async () => {
    // lấy top đọc nhiều (tùy API bạn có thể thay bằng ?sort=views)
    const res = await apiFetchTongQuat(
      `/bai-viet/get-bai-viet?status=true&limit=10`,
      { method: "GET" }
    );
    const arr = res?.data?.data || res?.data || [];
    return arr.slice(0, 10);
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        if (!id) return;
        const data = await getDetailPost(id);
        setDetail(data);
        document.title = data?.title
          ? `${data.title} – KTNews`
          : "Chi tiết bài viết – KTNews";
        // liên quan + hot
        const [rel, h] = await Promise.all([
          data?.theLoai?._id || data?.theLoai
            ? getRelated(data?.theLoai?._id || data?.theLoai, id)
            : Promise.resolve([]),
          getHot(),
        ]);
        setRelated(rel);
        setHot(h);
      } catch (e) {
        console.error(e);
        message.error("Không tải được bài viết");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // tạo mục lục từ h2/h3 trong nội dung
  const [toc, setToc] = useState([]);
  console.log("toc: ", toc);

  useEffect(() => {
    if (loading || !detail?.noiDungChinh) {
      setToc([]);
      return;
    }

    let cancelled = false;

    const build = () => {
      const root = contentRef.current;
      if (!root) {
        // đợi frame kế tiếp cho chắc DOM đã mount
        if (!cancelled) requestAnimationFrame(build);
        return;
      }

      // ✅ tới đây chắc chắn root đã có
      const nodes = [
        ...root.querySelectorAll("h1, h2, h3"),
        // ...root.querySelectorAll(
        //   "p>strong:first-child, li>strong:first-child, .toc-bold"
        // ),
      ];

      const items = [];
      const seen = new Set();
      let currentTop = null;

      nodes.forEach((el, i) => {
        const text = (el.textContent || "").trim();
        if (!text) return;

        // nếu là thẻ inline (strong/b) thì gắn id lên block cha để cuộn chuẩn
        let target = el;
        if (!/^H[1-3]$/.test(el.tagName)) {
          target = el.closest("h1,h2,h3,p,li,div") || el;
        }
        if (!target.id) {
          const slug = text.toLowerCase().replace(/\s+/g, "-").slice(0, 60);
          target.id = `h-${i}-${slug}`;
        }
        if (seen.has(target.id)) return;
        seen.add(target.id);

        const level = /^H[1-3]$/.test(el.tagName) ? Number(el.tagName[1]) : 3;
        const node = { key: target.id, href: `#${target.id}`, title: text };

        if (level <= 2) {
          currentTop = { ...node, children: [] };
          items.push(currentTop);
        } else if (currentTop) {
          currentTop.children.push(node);
        } else {
          items.push(node);
        }
      });

      setToc(items);
    };

    // chạy sau khi DOM commit
    requestAnimationFrame(build);
    return () => {
      cancelled = true;
    };
  }, [loading, detail?.noiDungChinh]);

  // thanh tiến độ đọc
  useEffect(() => {
    const onScroll = () => {
      const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const p =
        height > 0 ? Math.min(100, Math.max(0, (scrollTop / height) * 100)) : 0;
      setProgress(p);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      message.success("Đã sao chép liên kết");
    } catch {
      message.info("Không sao chép được. Hãy copy trên thanh địa chỉ.");
    }
  };

  // màu tag preset
  const TAG_HEX = [
    "#f5222d",
    "#fa541c",
    "#fa8c16",
    "#faad14",
    "#a0d911",
    "#52c41a",
    "#13c2c2",
    "#1890ff",
    "#2f54eb",
    "#722ed1",
    "#eb2f96",
  ];
  const getTagHex = (t = "") =>
    TAG_HEX[
      t.split("").reduce((s, c) => s + c.charCodeAt(0), 0) % TAG_HEX.length
    ];

  const likePost = async (id) => {
    // backend: POST /api/bai-viet/:id/like
    const res = await apiFetchTongQuat(`/bai-viet/${id}/like`, {
      method: "POST",
    });
    return res?.data; // { likeCount, _id }
  };

  const getLikes = async (id) => {
    const res = await apiFetchTongQuat(`/bai-viet/${id}/likes`, {
      method: "GET",
    });
    return res?.data; // { likeCount }
  };

  return (
    <div className="detail-page">
      <PageTitle title={`${detail?.title}`} />
      {/* progress */}
      <div className="read-progress" style={{ width: `${progress}%` }} />

      {/* HERO */}
      <section
        className="hero-detail"
        style={{
          backgroundImage: detail?.anhBia ? `url(${detail.anhBia})` : "none",
        }}
      >
        <div className="hero-mask" />
        <div className="hero-inner">
          {/* <Breadcrumb className="breadcrumb">
            <Breadcrumb.Item href="/">
              <HomeOutlined /> <span>Trang chủ</span>
            </Breadcrumb.Item>
            {detail?.theLoai?.ten && (
              <Breadcrumb.Item>
                <Link
                  to={`/the-loai/${
                    detail?.theLoai?.slug || detail?.theLoai?._id
                  }`}
                >
                  {detail.theLoai.ten}
                </Link>
              </Breadcrumb.Item>
            )}
            <Breadcrumb.Item>Chi tiết</Breadcrumb.Item>
          </Breadcrumb> */}

          <div className="hero-tags">
            {detail?.theLoai?.ten && (
              <Tag className="pill">{detail.theLoai.ten}</Tag>
            )}
          </div>
          <Paragraph
            // className="leadTitle"
            style={{ color: "white" }}
            ellipsis={{ rows: 3, tooltip: detail?.title }}
          >
            <Title level={1} className="hero-title">
              {loading ? (
                <Skeleton active title paragraph={false} />
              ) : (
                detail?.title || "—"
              )}
            </Title>
          </Paragraph>

          <div className="hero-meta">
            <div className="meta-left">
              <Paragraph
                // className="leadTitle"
                style={{ color: "white" }}
                ellipsis={{ rows: 2, tooltip: detail?.moTaNgan }}
              >
                <Title level={5} className="hero-title">
                  {loading ? (
                    <Skeleton active title paragraph={false} />
                  ) : (
                    detail?.moTaNgan || "—"
                  )}
                </Title>
              </Paragraph>
            </div>
            <div className="meta-right">
              <Tooltip
                title={liked ? "Bỏ thích" : "Yêu thích"}
                color={liked ? "gray" : "red"}
              >
                {/* <Button
                  className={`heartBtn ${liked ? "on" : ""}`}
                  type="default"
                  shape="circle"
                  size="large"
                  icon={
                    liked ? (
                      <HeartFilled size={30} />
                    ) : (
                      <HeartOutlined size={30} />
                    )
                  }
                  onClick={() => setLiked((v) => !v)}
                /> */}
                {/* {liked ? (
                  <HeartFilled
                    style={{ color: "red", fontSize: 30, cursor: "pointer" }}
                    size={50}
                  />
                ) : (
                  <HeartOutlined
                    style={{ color: "white", fontSize: 30, cursor: "pointer" }}
                    size={50}
                  />
                )} */}
                {/* <LikeHearts
                  postId={detail?._id}
                  initialCount={detail?.likeCount}
                /> */}
                <LikeHearts
                  postId={detail?._id}
                  initialCount={detail?.likeCount}
                  iconSize={25} // px
                  countSize={20} // px
                  btnPadding={[2, 2]} // [py, px] px
                  particleSize={24} // px
                  style={{ marginLeft: 8 }} // style cho wrapper
                  className="my-like"
                />
              </Tooltip>
              &nbsp; &nbsp; &nbsp;
              <Tooltip color="green" title="Sao chép URL">
                <Button
                  className="backPage"
                  icon={<ShareAltOutlined />}
                  onClick={copyLink}
                >
                  Chia sẻ
                </Button>
              </Tooltip>
              {/* <Button
                  type="#"
                  className="backPage"
                  ghost
                  onClick={() => {
                    navigate(-1);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  Quay lại
                </Button> */}
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT + SIDEBAR */}
      <section className="container">
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={17}>
            <div className="article">
              {loading ? (
                <>
                  <Skeleton active paragraph={{ rows: 6 }} />
                  <Skeleton active paragraph={{ rows: 6 }} />
                </>
              ) : detail ? (
                <>
                  {/* tags */}
                  {(detail?.tags || []).length > 0 && (
                    <div className="tag-cloud">
                      <Tag icon={<TagOutlined />} color="purple">
                        Tags
                      </Tag>
                      {(detail?.tags || []).map((t, i) => (
                        <Tag
                          key={i}
                          style={{
                            background: getTagHex(t),
                            color: "#fff",
                            border: 0,
                            borderRadius: 999,
                          }}
                        >
                          {t}
                        </Tag>
                      ))}
                    </div>
                  )}

                  {/* mô tả ngắn */}
                  {detail?.moTaNgan && (
                    <Paragraph className="desc">{detail.moTaNgan}</Paragraph>
                  )}

                  {/* nội dung HTML */}
                  <div
                    ref={contentRef}
                    className="article-html"
                    dangerouslySetInnerHTML={{
                      __html: detail?.noiDungChinh || "",
                    }}
                  />

                  {/* khung tác giả */}
                  <div className="author-box">
                    <Avatar size={56} src={detail?.nguoiTao?.avatar || avt} />
                    <div className="author-meta">
                      <div className="author-name">
                        {detail?.nguoiTao?.hoTen ||
                          detail?.nguoiTao?.taiKhoan ||
                          "Tác giả"}
                      </div>
                      <div className="author-note">
                        Theo dõi chúng tôi để cập nhật tin nóng mỗi ngày.
                      </div>
                      <Space size="small" wrap>
                        <Button
                          size="small"
                          type="primary"
                          ghost
                          icon={<ShareAltOutlined />}
                          onClick={copyLink}
                        >
                          Chia sẻ bài viết
                        </Button>
                      </Space>
                    </div>
                  </div>

                  <Divider />

                  {/* liên quan */}
                  <div className="secHead" style={{ padding: 8 }}>
                    <h2>Bài viết liên quan</h2>
                    <span className="secLine" />
                  </div>
                  {related.length === 0 ? (
                    <Empty description="Chưa có bài liên quan" />
                  ) : (
                    <Row gutter={[16, 16]}>
                      {related.map((it) => (
                        <Col key={it._id} xs={24} sm={12} md={12} lg={12}>
                          <Link
                            to={`/chi-tiet-bai-viet?id=${it?._id}`}
                            onClick={() => {
                              navigate(`/chi-tiet-bai-viet?id=${it?._id}`);
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                            className="rel-card"
                          >
                            <div
                              className="rel-media"
                              style={{ backgroundImage: `url(${it?.anhBia})` }}
                            />
                            <div className="rel-body">
                              <Paragraph
                                // className="rel-title"
                                style={{ fontSize: 16, fontWeight: 700 }}
                                ellipsis={{ rows: 2, tooltip: it?.title }}
                              >
                                {it?.title}
                              </Paragraph>
                              <div className="rel-meta">
                                <span>{formatDate(it?.ngayDang)}</span>
                                <i className="dot" />
                                {/* <i className="dot" />
                                <span>
                                  <EyeOutlined /> {it?.views || 0}
                                </span> */}
                                <LikeHearts
                                  postId={it?._id}
                                  initialCount={it?.likeCount}
                                  iconSize={18} // px
                                  countSize={16} // px
                                  btnPadding={[2, 2]} // [py, px] px
                                  particleSize={20} // px
                                  style={{ marginLeft: 8 }} // style cho wrapper
                                  className="my-like"
                                />
                              </div>
                            </div>
                          </Link>
                        </Col>
                      ))}
                    </Row>
                  )}
                </>
              ) : (
                <Empty description="Không tìm thấy bài viết" />
              )}
            </div>
          </Col>

          <Col xs={24} lg={7}>
            <aside className="sidebar">
              {/* mục lục */}
              <Card className="box">
                <div className="boxTitle">
                  <span className="tocIcon">
                    <UnorderedListOutlined />
                  </span>
                  Mục lục bài viết
                </div>
                {toc.length ? (
                  <div className="tocScroll">
                    <Anchor
                      items={toc}
                      affix={false}
                      getContainer={() => document.querySelector(".article")}
                    />
                  </div>
                ) : (
                  <Text type="secondary">Không có mục lục</Text>
                )}
              </Card>

              {/* đọc nhiều */}
              <Card className="box">
                <div className="boxTitle">
                  <FireOutlined /> Đọc nhiều
                </div>
                {loading ? (
                  <>
                    <Skeleton active paragraph={{ rows: 2 }} />
                    <Skeleton active paragraph={{ rows: 2 }} />
                  </>
                ) : (
                  <div className="hot-list">
                    {hot.map((h, idx) => (
                      <Link
                        key={h._id}
                        to={`/chi-tiet-bai-viet?id=${h?._id}`}
                        className="hot-item"
                        onClick={() => {
                          navigate(`/chi-tiet-bai-viet?id=${h?._id}`);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                      >
                        <div className="hot-rank">{idx + 1}</div>
                        <div className="hot-info">
                          <Paragraph
                            // className="hot-title"
                            style={{ fontSize: 14, fontWeight: 700 }}
                            ellipsis={{ rows: 2, tooltip: h?.title }}
                          >
                            {h?.title}
                          </Paragraph>
                          <div className="hot-meta">
                            {/* <EyeOutlined /> {h?.views || "100+"} */}
                            {/* <LikeHearts
                              postId={h?._id}
                              initialCount={h?.likeCount}
                            /> */}
                            {/* <LikeHearts
                              postId={h?._id}
                              initialCount={h?.likeCount}
                              iconSize={18} // px
                              countSize={15} // px
                              btnPadding={[2, 2]} // [py, px] px
                              particleSize={24} // px
                              style={{ marginLeft: 8 }} // style cho wrapper
                              className="my-like"
                            /> */}
                          </div>
                        </div>
                        <div
                          className="hot-thumb"
                          style={{ backgroundImage: `url(${h?.anhBia})` }}
                        />
                      </Link>
                    ))}
                  </div>
                )}
              </Card>

              <Button
                className="backTop"
                type="primary"
                shape="round"
                icon={<ArrowUpOutlined />}
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                Lên đầu trang
              </Button>
            </aside>
          </Col>
        </Row>
      </section>
    </div>
  );
}
