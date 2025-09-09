import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Row,
  Col,
  Card,
  Select,
  Input,
  Tag,
  Avatar,
  Typography,
  Skeleton,
  Empty,
  Space,
  Button,
  Pagination,
} from "antd";
import {
  FilterOutlined,
  EyeOutlined,
  CalendarOutlined,
  ReloadOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import { apiFetchTongQuat } from "../../services/apiTongQuat";
import "./PostAll.css";
import LikeHearts from "../TrangChiTiet/LikeHearts";
import PageTitle from "../../components/PageTitle/PageTitle";
import slugify from "slugify";

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

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

export default function PostAll() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [cats, setCats] = useState([]);
  const [posts, setPosts] = useState([]);

  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const theloai = searchParams.get("theloai") || "";

  // filters
  const [q, setQ] = useState("");
  const [catId, setCatId] = useState();
  const [sortKey, setSortKey] = useState("newest");

  // paging
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(30);
  const listTopRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        let query = "";
        if (sortKey) {
          query = `&sort=${sortKey}`;
        }
        if (search) {
          query += `&search=${encodeURIComponent(search)}`;
          setQ(search);
        }
        if (theloai) {
          query += `&valueTL=${encodeURIComponent(theloai)}`;
          setCatId(theloai);
        }
        setLoading(true);
        const [tl, bv] = await Promise.all([
          apiFetchTongQuat("/bai-viet/get-the-loai", { method: "GET" }),
          apiFetchTongQuat(`/bai-viet/get-bai-viet?status=true${query}`, {
            method: "GET",
          }),
        ]);
        setCats(tl?.data || []);
        setPosts(bv?.data?.data || bv?.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [sortKey, search, theloai]);

  // map catId -> name
  const catMap = useMemo(() => {
    const m = new Map();
    cats.forEach((c) => m.set(c._id, c.ten));
    return m;
  }, [cats]);

  // filter + sort
  const filtered = useMemo(() => {
    let data = [...posts];

    if (catId) {
      data = data.filter(
        (p) => p?.theLoai?._id === catId || p?.theLoai === catId
      );
    }

    if (q.trim()) {
      const s = q.trim().toLowerCase();
      data = data.filter(
        (p) =>
          p?.title?.toLowerCase().includes(s) ||
          p?.moTaNgan?.toLowerCase().includes(s) ||
          (p?.tags || []).some((t) => String(t).toLowerCase().includes(s))
      );
    }

    // if (sortKey === "newest") {
    //   data.sort(
    //     (a, b) =>
    //       new Date(b?.ngayDang || 0).getTime() -
    //       new Date(a?.ngayDang || 0).getTime()
    //   );
    // } else if (sortKey === "views") {
    //   data.sort((a, b) => (b?.views || 0) - (a?.views || 0));
    // } else if (sortKey === "az") {
    //   data.sort((a, b) => (a?.title || "").localeCompare(b?.title || ""));
    // }

    return data;
  }, [posts, catId, q]);

  // paging slice
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const current = filtered.slice(start, end);

  const resetFilters = () => {
    setQ("");
    setCatId(undefined);
    setSortKey("newest");
    navigate("/tat-ca-bai-viet");
    setPage(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onCardClick = (post) => {
    const slug = slugify(post.title, { lower: true, locale: "vi" });
    const category = slugify(post.theLoai.ten, {
      lower: true,
      locale: "vi",
    });
    navigate(`/chi-tiet-bai-viet/${category}/${slug}-${post?._id}`);
    // navigate(`/chi-tiet-bai-viet?id=${id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    // cuộn lên đầu list khi đổi trang
    listTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [page, pageSize]);

  // màu tag “đẹp hơn”
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
  const getTagHexColor = (tag = "") =>
    TAG_HEX[
      tag.split("").reduce((s, c) => s + c.charCodeAt(0), 0) % TAG_HEX.length
    ];

  return (
    <div className="postall">
      {/* Header section */}
      <PageTitle title="Tất cả bài viết mới nhất trên DANTRI24H: tin nóng, phân tích sâu và đa chủ đề (Thời sự, Thể thao, Giải trí, Công nghệ), cập nhật nhanh 24/7." />
      <div className="page-head">
        <div className="ph-left">
          <Title level={2} className="ph-title">
            <AppstoreOutlined /> Tất cả bài viết
          </Title>
          <Text className="ph-sub">
            Kho nội dung mới nhất, chọn lọc theo nhu cầu của bạn.
          </Text>
        </div>
        <div className="ph-right">
          <span className="count-badge">{filtered.length}</span>{" "}
          <span style={{ fontFamily: "Arial", fontSize: 18 }}>bài viết</span>
        </div>
      </div>

      <Row gutter={[24, 24]} className="postall-row">
        {/* LEFT: Filters */}
        <Col xs={24} md={7} lg={6}>
          <div className="filter-card sticky">
            <div className="fc-head">
              <FilterOutlined /> Bộ lọc
            </div>

            <div className="fc-body">
              <div className="fc-field">
                <div className="fc-label">Tìm kiếm</div>
                <Input.Search
                  placeholder="Từ khóa, tag, tiêu đề…"
                  allowClear
                  value={q}
                  onChange={(e) => {
                    setQ(e.target.value);
                    setPage(1);
                  }}
                />
              </div>
              {!theloai && (
                <div className="fc-field">
                  <div className="fc-label">Thể loại</div>
                  <Select
                    size="large"
                    className="w100"
                    allowClear
                    showSearch
                    optionFilterProp="children"
                    placeholder="Tất cả thể loại"
                    value={catId}
                    onChange={(val) => {
                      setCatId(val);
                      setPage(1);
                    }}
                  >
                    {cats.map((c) => (
                      <Option key={c._id} value={c._id}>
                        {c.ten}
                      </Option>
                    ))}
                  </Select>
                </div>
              )}

              <div className="fc-field">
                <div className="fc-label">Sắp xếp</div>
                <Select
                  size="large"
                  className="w100"
                  value={sortKey}
                  onChange={(v) => {
                    setSortKey(v);
                    setPage(1);
                  }}
                  options={[
                    { value: "newest", label: "Mới nhất" },
                    { value: "oldest", label: "Cũ hơn" },
                  ]}
                />
              </div>

              <div className="fc-actions">
                <Button block icon={<ReloadOutlined />} onClick={resetFilters}>
                  Đặt lại lọc
                </Button>
              </div>
            </div>
          </div>
        </Col>

        {/* RIGHT: List */}
        <Col xs={24} md={17} lg={18}>
          <div ref={listTopRef} />

          {loading ? (
            <Row gutter={[24, 24]}>
              {Array.from({ length: 8 }).map((_, i) => (
                <Col key={i} xs={24} sm={12} lg={8} xl={8}>
                  <Card className="post-card">
                    <div className="pc-cover sk" />
                    <div className="pc-body">
                      <Skeleton active title paragraph={{ rows: 3 }} />
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : filtered.length === 0 ? (
            <Empty description="Không tìm thấy bài viết phù hợp" />
          ) : (
            <>
              <Row gutter={[24, 24]}>
                {current.map((p) => {
                  const catName =
                    p?.theLoai?.ten || catMap.get(p?.theLoai) || "Chung";
                  return (
                    <Col key={p._id} xs={24} sm={12} lg={8} xl={8}>
                      <Card
                        className="post-card"
                        hoverable
                        onClick={() => onCardClick(p)}
                        bodyStyle={{ padding: 14 }}
                      >
                        <div
                          className="pc-cover"
                          style={{ backgroundImage: `url(${p?.anhBia})` }}
                        >
                          <span className="pc-cat">{catName}</span>
                        </div>

                        <div className="pc-body">
                          <Paragraph
                            style={{ fontWeight: "700", fontSize: 18 }}
                            ellipsis={{ rows: 3, tooltip: p?.title }}
                          >
                            {p?.title}
                          </Paragraph>
                          {/* <Title level={4} className="pc-title">
                            {p?.title}
                          </Title> */}
                          {p?.moTaNgan && (
                            <Paragraph
                              className="pc-desc"
                              ellipsis={{ rows: 2, tooltip: p?.moTaNgan }}
                            >
                              {p?.moTaNgan}
                            </Paragraph>
                          )}

                          <div className="pc-meta">
                            {/* <div className="meta-left">
                              <Avatar
                                size="small"
                                src={
                                  p?.nguoiTao?.avatar ||
                                  "https://ktquiz.com/favicon-32x32-removebg-preview.png"
                                }
                              />
                              <Text className="author">
                                {p?.nguoiTao?.hoTen || "Tác giả"}
                              </Text>
                            </div> */}
                            <div className="meta-right">
                              <CalendarOutlined /> {formatDate(p?.ngayDang)}
                              <span className="dot" />
                              {/* <EyeOutlined /> {p?.views || 0} */}
                              <LikeHearts
                                postId={p?._id}
                                initialCount={p?.likeCount}
                                iconSize={15} // px
                                countSize={14} // px
                                btnPadding={[2, 2]} // [py, px] px
                                particleSize={20} // px
                                style={{ marginLeft: 8 }} // style cho wrapper
                                className="my-like"
                              />
                            </div>
                          </div>

                          {(p?.tags || []).slice(0, 3).map((t) => (
                            <Tag
                              key={t}
                              //   className="tag-pill"
                              style={{
                                borderRadius: 999,
                                border: 0,
                                background: getTagHexColor(t),
                                color: "#fff",
                              }}
                            >
                              {t}
                            </Tag>
                          ))}
                        </div>
                      </Card>
                    </Col>
                  );
                })}
              </Row>

              <div className="list-foot">
                <Pagination
                  current={page}
                  pageSize={pageSize}
                  total={filtered.length}
                  showSizeChanger
                  pageSizeOptions={["8", "12", "16", "24"]}
                  onChange={(p, ps) => {
                    setPage(p);
                    setPageSize(ps);
                  }}
                />
              </div>
            </>
          )}
        </Col>
      </Row>
    </div>
  );
}
