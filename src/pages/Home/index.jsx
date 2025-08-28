// import React, { useEffect, useMemo, useState } from "react";
// import {
//   Row,
//   Col,
//   Card,
//   Tag,
//   Avatar,
//   Typography,
//   Skeleton,
//   Empty,
//   Space,
// } from "antd";

// import { EyeOutlined, FireOutlined } from "@ant-design/icons";
// import "./home.css";
// import { apiFetchTongQuat } from "../../services/apiTongQuat";

// const { Title, Paragraph } = Typography;

// const formatDate = (d) => {
//   if (!d) return "";
//   try {
//     const date = new Date(d);
//     return date.toLocaleDateString("vi-VN", {
//       day: "2-digit",
//       month: "2-digit",
//       year: "numeric",
//     });
//   } catch {
//     return "";
//   }
// };

// export default function Home() {
//   const [loading, setLoading] = useState(true);
//   const [posts, setPosts] = useState([]);
//   const [cats, setCats] = useState([]);
//   const [catId, setCatId] = useState(); // chỉ dùng để highlight pill

//   useEffect(() => {
//     (async () => {
//       try {
//         const [tl, bv] = await Promise.all([
//           apiFetchTongQuat("/bai-viet/get-the-loai", { method: "GET" }),
//           apiFetchTongQuat("/bai-viet/get-bai-viet?status=true", {
//             method: "GET",
//           }),
//         ]);
//         setCats(tl?.data || []);
//         setPosts(bv?.data?.data || bv?.data || []);
//       } catch (e) {
//         console.error(e);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, []);

//   // gom bài theo thể loại
//   const byCat = useMemo(() => {
//     const m = new Map();
//     posts.forEach((p) => {
//       const id = p?.theLoai?._id || p?.theLoai;
//       if (!id) return;
//       if (!m.has(id)) m.set(id, []);
//       m.get(id).push(p);
//     });
//     return m;
//   }, [posts]);

//   // lấy 1 bài đinh + 3-4 bài nổi bật bên phải (toàn bộ bài, không lọc theo cat)
//   const featured = posts[0];
//   const picks = posts.slice(1, 10);

//   // scroll mượt tới section; đã set scroll-margin-top trong CSS để tránh bị header che
//   const scrollToId = (id) => {
//     const el = document.getElementById(id);
//     if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
//   };

//   const onPickCat = (id) => {
//     setCatId(id);
//     if (!id) scrollToId("all-sections");
//     else scrollToId(`cat-${id}`);
//   };

//   // bảng màu preset của antd
//   const TAG_HEX = [
//     "#f5222d",
//     "#fa541c",
//     "#fa8c16",
//     "#faad14",
//     "#a0d911",
//     "#52c41a",
//     "#13c2c2",
//     "#1890ff",
//     "#2f54eb",
//     "#722ed1",
//     "#eb2f96",
//   ];
//   const getTagHexColor = (tag = "") =>
//     TAG_HEX[
//       tag.split("").reduce((s, c) => s + c.charCodeAt(0), 0) % TAG_HEX.length
//     ];

//   return (
//     <div className="home">
//       {/* ===== HERO ===== */}
//       <section className="hero">
//         <Row gutter={[24, 24]}>
//           <Col xs={24} lg={16}>
//             {loading ? (
//               <Skeleton.Image active className="heroSk" />
//             ) : featured ? (
//               <a
//                 className="heroBanner"
//                 href={"#"}
//                 style={{ backgroundImage: `url(${featured?.anhBia})` }}
//               >
//                 <div className="heroMask" />
//                 <div className="heroInfo">
//                   <div className="heroTags">
//                     {featured?.theLoai?.ten && (
//                       <Tag className="pill">{featured.theLoai.ten}</Tag>
//                     )}
//                     {featured?.isBreaking && (
//                       <Tag color="error" icon={<FireOutlined />}>
//                         Breaking
//                       </Tag>
//                     )}
//                   </div>
//                   {/* <h1 className="heroTitle">{featured?.title}</h1> */}
//                   {/* {featured?.moTaNgan && (
//                     <p className="heroDesc">{featured?.moTaNgan}</p>
//                   )} */}
//                   <Paragraph
//                     className="heroTitle"
//                     ellipsis={{ rows: 2, tooltip: featured?.title }}
//                   >
//                     {featured?.title}
//                   </Paragraph>
//                   <Paragraph
//                     className="heroDesc"
//                     ellipsis={{ rows: 2, tooltip: featured?.moTaNgan }}
//                   >
//                     {featured?.moTaNgan}
//                   </Paragraph>
//                   <div className="heroMeta">
//                     <div className="mLeft">
//                       <Avatar
//                         size="small"
//                         src={
//                           featured?.nguoiTao?.avatar ||
//                           "https://ktquiz.com/favicon-32x32-removebg-preview.png"
//                         }
//                       />
//                       <span>
//                         {featured?.nguoiTao?.hoTen ||
//                           featured?.nguoiTao?.taiKhoan ||
//                           "Tác giả"}
//                       </span>
//                       <i className="dot" />
//                       <span>
//                         {formatDate(
//                           featured?.ngayDang || featured?.publishedAt
//                         )}
//                       </span>
//                     </div>
//                     <div className="mRight">
//                       <EyeOutlined /> <span>{featured?.views || 0}</span>
//                     </div>
//                   </div>
//                 </div>
//               </a>
//             ) : (
//               <Empty description="Chưa có bài viết" />
//             )}
//           </Col>

//           {/* ===== TOP PICKS ===== */}
//           <Col xs={24} lg={8}>
//             <div className="topBox">
//               <div className="topTitle">
//                 <FireOutlined /> Nổi bật
//               </div>
//               <div className="topList">
//                 {loading ? (
//                   <>
//                     <Skeleton active paragraph={{ rows: 2 }} />
//                     <Skeleton active paragraph={{ rows: 2 }} />
//                     <Skeleton active paragraph={{ rows: 2 }} />
//                   </>
//                 ) : picks.length ? (
//                   picks.map((it) => (
//                     <a key={it._id} href={`#`} className="topItem">
//                       <div
//                         className="topThumb"
//                         style={{ backgroundImage: `url(${it?.anhBia})` }}
//                       />
//                       <div className="topInfo">
//                         {/* <div className="topCat">{it?.theLoai?.ten}</div> */}
//                         {/* <div className="topText" style={{ marginTop: 10 }}>
//                           {it?.title}
//                         </div> */}
//                         <Paragraph
//                           className="topText"
//                           ellipsis={{ rows: 2, tooltip: it?.title }} // 👈 2 dòng + tooltip đầy đủ
//                           style={{ marginTop: 10 }}
//                         >
//                           {it?.title}
//                         </Paragraph>
//                         <div className="topMeta">
//                           <span>{formatDate(it?.ngayDang)}</span>
//                           <i className="dot" />
//                           <span>
//                             <EyeOutlined /> {it?.views || 0}
//                           </span>
//                         </div>
//                       </div>
//                     </a>
//                   ))
//                 ) : (
//                   <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
//                 )}
//               </div>
//             </div>
//           </Col>
//         </Row>
//       </section>

//       {/* ===== TOPICS NAV ===== */}
//       <section className="topics">
//         <div className="topicsBar">
//           <Space size={[8, 8]} wrap className="topicsSpace">
//             {/* <button
//               className={`topic ${!catId ? "active" : ""}`}
//               onClick={() => onPickCat(undefined)}
//             >
//               Tất cả
//             </button> */}
//             {cats.map((c) => (
//               <button
//                 key={c._id}
//                 className={`topic ${catId === c._id ? "active" : ""}`}
//                 onClick={() => onPickCat(c._id)}
//                 title={c.ten}
//               >
//                 {c.ten}
//               </button>
//             ))}
//           </Space>
//         </div>
//       </section>

//       {/* ===== CÁC SECTION THEO THỂ LOẠI ===== */}
//       <section id="all-sections" className="categories">
//         {cats.map((c) => {
//           const list = byCat.get(c._id) || [];
//           if (!list.length) return null;
//           return (
//             <div key={c._id} id={`cat-${c._id}`} className="category-section">
//               <div className="secHead">
//                 <h2>{c.ten}</h2>
//                 <span className="secLine" />
//               </div>

//               <Row gutter={[24, 32]} style={{ padding: "0 16px" }}>
//                 {list.map((item) => (
//                   <Col key={item._id} xs={24} sm={12} lg={8} xl={6}>
//                     <a
//                       className="card"
//                       href={`/tin/${item?.theLoai?.slug || "the-loai"}/${
//                         item?.slug || item?._id
//                       }`}
//                     >
//                       <div
//                         className="cardMedia"
//                         style={{ backgroundImage: `url(${item?.anhBia})` }}
//                       >
//                         {/* <div className="ribbon">
//                           {item?.theLoai?.ten || "Chung"}
//                         </div> */}
//                       </div>
//                       <div className="cardBody">
//                         <Paragraph
//                           className="cardTitle"
//                           ellipsis={{ rows: 3, tooltip: item?.title }} // 👈 2 dòng + tooltip đầy đủ
//                           style={{ marginTop: 10 }}
//                         >
//                           <Title level={4} className="cardTitle">
//                             {item?.title}
//                           </Title>
//                         </Paragraph>

//                         {item?.moTaNgan && (
//                           <Paragraph
//                             className="cardDesc"
//                             ellipsis={{ rows: 2, tooltip: item?.moTaNgan }}
//                           >
//                             {item?.moTaNgan}
//                           </Paragraph>
//                         )}
//                         <div className="cardMeta">
//                           <div className="mLeft">
//                             <Avatar
//                               size="small"
//                               src={
//                                 item?.nguoiTao?.avatar ||
//                                 "https://ktquiz.com/favicon-32x32-removebg-preview.png"
//                               }
//                             />
//                             <span className="author">
//                               {item?.nguoiTao?.hoTen || "Tác giả"}
//                             </span>
//                             <i className="dot" />
//                             <span>{formatDate(item?.ngayDang)}</span>
//                           </div>
//                           <div className="mRight">
//                             <EyeOutlined /> <span>{item?.views || 0}</span>
//                           </div>
//                         </div>
//                         {/* {(item?.tags || []).slice(0, 3).map((t) => (
//                           <Tag key={t} className="pill">
//                             {t}
//                           </Tag>

//                         ))} */}

//                         {(item.tags || []).map((t, i) => (
//                           <Tag
//                             // className="pill"
//                             key={i}
//                             color={getTagHexColor(t)}
//                           >
//                             {t}
//                           </Tag>
//                         ))}
//                       </div>
//                     </a>
//                   </Col>
//                 ))}
//               </Row>
//             </div>
//           );
//         })}
//       </section>
//     </div>
//   );
// }

import React, { useEffect, useMemo, useState } from "react";
import {
  Row,
  Col,
  Tag,
  Avatar,
  Typography,
  Skeleton,
  Empty,
  Space,
  Button,
  Card,
  Tooltip,
  Divider,
  Drawer,
  Descriptions,
} from "antd";
import { EyeOutlined, FireOutlined } from "@ant-design/icons";
import "./home.css";
import { apiFetchTongQuat } from "../../services/apiTongQuat";
import { useNavigate } from "react-router-dom";
import LikeHearts from "../TrangChiTiet/LikeHearts";
import PageTitle from "../../components/PageTitle/PageTitle";

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

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [cats, setCats] = useState([]);
  const [catId, setCatId] = useState(); // chỉ để highlight pill
  const [dataDetailPost, setDataDetailPost] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const navigate = useNavigate();

  const openQuick = async (id) => {
    try {
      setOpenDrawer(true);
      setDrawerLoading(true);
      await getDetailPost(id); // đã có sẵn hàm này
    } finally {
      setDrawerLoading(false);
    }
  };

  const onClickDetailPost = (id) => {
    navigate(`/chi-tiet-bai-viet?id=${id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeQuick = () => {
    setOpenDrawer(false);
    setDataDetailPost(null);
  };

  const getDetailPost = async (postId) => {
    try {
      const res = await apiFetchTongQuat(
        `/bai-viet/get-detail-bai-viet?id=${postId}`,
        {
          method: "GET",
        }
      );
      setDataDetailPost(res?.data || null);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const [tl, bv] = await Promise.all([
          apiFetchTongQuat("/bai-viet/get-the-loai", { method: "GET" }),
          apiFetchTongQuat("/bai-viet/get-bai-viet?status=true", {
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
  }, [openDrawer]);

  // nhóm theo thể loại
  const byCat = useMemo(() => {
    const m = new Map();
    posts.forEach((p) => {
      const id = p?.theLoai?._id || p?.theLoai;
      if (!id) return;
      if (!m.has(id)) m.set(id, []);
      m.get(id).push(p);
    });
    return m;
  }, [posts]);

  // lead + tiles + minis
  const lead = posts[0]; // bài ĐINH (to nhất) = phần tử đầu tiên (index 0)
  const minis = posts.slice(1, 3); // 2 bài tiếp theo: index 1 và 2 (end-exclusive)
  const rest = posts.slice(3, 8); // còn lại từ index 3 - 7

  // trending (đọc nhiều)
  const trending = useMemo(() => {
    const arr = [...posts];
    arr.sort((a, b) => (b?.views || 0) - (a?.views || 0));
    return arr.slice(0, 10);
  }, [posts]);

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

  // scroll tới section
  const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const onPickCat = (id) => {
    setCatId(id);
    if (!id) scrollToId("all-sections");
    else scrollToId(`cat-${id}`);
  };

  return (
    <div className="home">
      <PageTitle title="Tin tức mới nhất 24/7 hôm nay | BAOMOI24G" />

      {/* ========= MAGAZINE STRIP ========= */}
      <section className="magWrap">
        {loading ? (
          <div className="magGrid">
            <div className="leadSk">
              <Skeleton.Image
                active
                style={{ width: "100%", height: "100%" }}
              />
            </div>
            <div className="tileSk">
              <Skeleton.Image
                active
                style={{ width: "100%", height: "100%" }}
              />
            </div>
            <div className="tileSk">
              <Skeleton.Image
                active
                style={{ width: "100%", height: "100%" }}
              />
            </div>
            <div className="miniSk">
              <Skeleton active paragraph={{ rows: 2 }} />
            </div>
            <div className="miniSk">
              <Skeleton active paragraph={{ rows: 2 }} />
            </div>
          </div>
        ) : (
          <div className="magGrid">
            {/* Lead big */}
            {lead ? (
              <a
                className="leadCard"
                // onClick={() => onClickDetailPost(lead?._id)}
                style={{
                  backgroundImage: `url(${lead?.anhBia})`,
                  cursor: "pointer",
                }}
              >
                <div className="mask" />
                <div className="leadInfo">
                  <div className="tagRow">
                    {/* {lead?.theLoai?.ten && (
                      <Tag className="pill">{lead?.theLoai?.ten}</Tag>
                    )} */}
                    {lead?.isBreaking && (
                      <Tag color="error" icon={<FireOutlined />}>
                        Breaking
                      </Tag>
                    )}
                  </div>

                  <h1
                    className="leadTitle"
                    onClick={() => onClickDetailPost(lead?._id)}
                  >
                    {lead?.title}
                  </h1>
                  <Paragraph
                    // className="leadTitle"
                    style={{ color: "white" }}
                    ellipsis={{ rows: 3, tooltip: lead?.moTaNgan }}
                  >
                    {lead?.moTaNgan && (
                      <p
                        className="leadDesc"
                        onClick={() => onClickDetailPost(lead?._id)}
                      >
                        {lead?.moTaNgan}
                      </p>
                    )}
                  </Paragraph>
                  <div className="metaRow">
                    <div className="mLeft">
                      <Avatar size="small" src={lead?.nguoiTao?.avatar} />
                      <span>{lead?.nguoiTao?.hoTen || "Tác giả"}</span>
                      <i className="dot" />
                      <span>{formatDate(lead?.ngayDang)}</span>
                      <i className="dot" />
                      <LikeHearts
                        postId={lead?._id}
                        initialCount={lead?.likeCount}
                        iconSize={18} // px
                        countSize={16} // px
                        btnPadding={[2, 2]} // [py, px] px
                        particleSize={20} // px
                        style={{ marginLeft: 8 }} // style cho wrapper
                        className="my-like"
                      />
                    </div>
                    <div className="mRight">
                      <Tooltip title="Xem nhanh" color="#108ee9">
                        <EyeOutlined
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            openQuick(lead?._id);
                          }}
                          style={{ fontSize: 20 }}
                        />
                      </Tooltip>
                      {/* <span>{lead?.views || 0}</span> */}
                    </div>
                  </div>
                </div>
              </a>
            ) : (
              <Empty />
            )}

            {/* 2 minis (text-first) */}
            {minis.map((m) => (
              <a
                key={m._id}
                className="miniCard"
                onClick={() => onClickDetailPost(m?._id)}
                style={{ cursor: "pointer" }}
              >
                <div className="miniInfo">
                  <div className="miniCat">{/* {m?.theLoai?.ten} */}</div>
                  <Paragraph
                    // className="miniTitle"
                    style={{ fontWeight: "700", fontSize: 18 }}
                    ellipsis={{ rows: 3, tooltip: m?.title }}
                  >
                    {m?.title}
                  </Paragraph>
                  {(m?.tags || []).slice(0, 2).map((t, i) => (
                    <Tag
                      key={i}
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
                  <div
                    className="metaRow xs"
                    style={{
                      marginTop: 5,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>{formatDate(m?.ngayDang)}</span>
                    {/* <i className="dot" />
                    <span>
                      <EyeOutlined /> {m?.views || 0}
                    </span> */}
                    {/* <i className="dot" />
                    <Tooltip title="Xem nhanh" color="#108ee9">
                      <EyeOutlined
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          openQuick(m?._id);
                        }}
                        style={{ fontSize: 16 }}
                      />
                    </Tooltip> */}
                    <LikeHearts
                      postId={m?._id}
                      initialCount={m?.likeCount}
                      iconSize={15} // px
                      countSize={14} // px
                      btnPadding={[2, 2]} // [py, px] px
                      particleSize={20} // px
                      style={{ marginLeft: 8 }} // style cho wrapper
                      className="my-like"
                    />
                  </div>
                </div>
                <div
                  className="miniThumb"
                  style={{ backgroundImage: `url(${m?.anhBia})` }}
                />
              </a>
            ))}
          </div>
        )}
      </section>

      {/* ========= CONTENT + STICKY SIDEBAR ========= */}
      <section className="contentWrap">
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={17}>
            {/* Topics */}
            <div className="topicsBar">
              <Space size={[8, 8]} wrap>
                {/* <button
                  className={`topic ${!catId ? "active" : ""}`}
                  onClick={() => onPickCat(undefined)}
                >
                  Tất cả
                </button> */}
                {cats.map((c) => (
                  <button
                    key={c._id}
                    className={`topic ${catId === c._id ? "active" : ""}`}
                    onClick={() => onPickCat(c._id)}
                  >
                    {c.ten}
                  </button>
                ))}
              </Space>
            </div>

            {/* Masonry Latest */}
            <div className="secHead">
              <h2 style={{ padding: 10 }}>Tin mới nhất</h2>
              <span className="secLine" />
            </div>
            {loading ? (
              <div className="fiveBlock">
                <div className="fiveLeft">
                  <div className="fiveBig sk">
                    <Skeleton active paragraph={{ rows: 6 }} />
                  </div>
                </div>
                <div className="fiveRight">
                  <Row gutter={[16, 16]}>
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Col key={i} xs={12}>
                        <div className="fiveItem sk">
                          <Skeleton active paragraph={{ rows: 3 }} />
                        </div>
                      </Col>
                    ))}
                  </Row>
                </div>
              </div>
            ) : rest.length ? (
              (() => {
                const take = rest.slice(0, 5);
                const big = take[0];
                const smalls = take.slice(1, 5);

                return (
                  <div className="fiveBlock">
                    {/* Trái: 1 bài to */}
                    <div className="fiveLeft">
                      {big ? (
                        <a
                          className="fiveBig"
                          onClick={() => onClickDetailPost(big?._id)}
                          style={{ cursor: "pointer" }}
                        >
                          {/* <div
                            className="fiveBigMedia"
                            style={{ backgroundImage: `url(${big?.anhBia})` }}
                          /> */}
                          <div
                            className="fiveBigMedia"
                            style={{ backgroundImage: `url(${big?.anhBia})` }}
                          >
                            <div className="media-like-btn">
                              <Tooltip title="Xem nhanh" color="#108ee9">
                                <EyeOutlined
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    openQuick(big?._id);
                                  }}
                                  style={{
                                    fontSize: 30,
                                    color: "blueviolet",
                                    fontWeight: "bold",
                                  }}
                                />
                              </Tooltip>
                            </div>
                          </div>

                          {/* <div
                            className="cardMedia"
                            style={{ backgroundImage: `url(${big?.anhBia})` }}
                          >
                            <div className="ribbon">
                              {big?.theLoai?.ten || "Chung"}
                            </div>
                          </div> */}
                          <div className="fiveBigBody">
                            <Paragraph
                              className="fiveBigDesc"
                              ellipsis={{ rows: 3, tooltip: big?.title }}
                            >
                              <Title level={3} className="fiveBigTitle">
                                {big?.title}
                              </Title>
                            </Paragraph>
                            {big?.moTaNgan && (
                              <Paragraph
                                className="fiveBigDesc"
                                ellipsis={{ rows: 3, tooltip: big?.moTaNgan }}
                              >
                                {big?.moTaNgan}
                              </Paragraph>
                            )}
                            {(big?.tags || []).slice(0, 2).map((t, i) => (
                              <Tag
                                key={i}
                                style={{
                                  borderRadius: 999,
                                  border: 0,
                                  background: getTagHexColor(t),
                                  color: "#fff",
                                  marginTop: 6,
                                }}
                              >
                                {t}
                              </Tag>
                            ))}
                            <div
                              className="metaRow xs"
                              style={{
                                marginTop: 12,
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <span>{formatDate(big?.ngayDang)}</span>
                              {/* <i className="dot" />
                              <span>
                                <EyeOutlined /> {big?.views || 0}
                              </span> */}
                              <i className="dot" />
                              <LikeHearts
                                postId={big?._id}
                                initialCount={big?.likeCount}
                                iconSize={16} // px
                                countSize={16} // px
                                btnPadding={[2, 2]} // [py, px] px
                                particleSize={20} // px
                                style={{ marginLeft: 8 }} // style cho wrapper
                                className="my-like"
                              />
                            </div>
                          </div>
                        </a>
                      ) : (
                        <Empty />
                      )}
                    </div>

                    {/* Phải: 2 hàng x 2 bài */}
                    <div className="fiveRight">
                      <Row gutter={[16, 16]}>
                        {smalls.map((item) => (
                          <Col key={item._id} xs={12}>
                            <a
                              className="fiveItem"
                              onClick={() => onClickDetailPost(item?._id)}
                              style={{ cursor: "pointer" }}
                            >
                              {/* <div
                                className="fiveItemMedia"
                                style={{
                                  backgroundImage: `url(${item?.anhBia})`,
                                }}
                              /> */}
                              <div
                                className="fiveBigMedia"
                                style={{
                                  backgroundImage: `url(${item?.anhBia})`,
                                }}
                              >
                                <div className="media-like-btn">
                                  <Tooltip title="Xem nhanh" color="#108ee9">
                                    <EyeOutlined
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        openQuick(item?._id);
                                      }}
                                      style={{
                                        fontSize: 30,
                                        color: "blueviolet",
                                        fontWeight: "bold",
                                      }}
                                    />
                                  </Tooltip>
                                </div>
                              </div>
                              <div className="fiveItemBody">
                                <Paragraph
                                  style={{ fontWeight: "700", fontSize: 18 }}
                                  ellipsis={{ rows: 3, tooltip: item?.title }}
                                >
                                  {item?.title}
                                </Paragraph>
                                {item?.moTaNgan && (
                                  <Paragraph
                                    className="fiveBigDesc"
                                    ellipsis={{
                                      rows: 3,
                                      tooltip: item?.moTaNgan,
                                    }}
                                  >
                                    {item?.moTaNgan}
                                  </Paragraph>
                                )}
                                {(item?.tags || []).slice(0, 2).map((t, i) => (
                                  <Tag
                                    key={i}
                                    style={{
                                      borderRadius: 999,
                                      border: 0,
                                      background: getTagHexColor(t),
                                      color: "#fff",
                                      marginTop: 6,
                                    }}
                                  >
                                    {t}
                                  </Tag>
                                ))}
                                <div
                                  className="metaRow xs"
                                  style={{
                                    marginTop: 12,
                                    display: "flex",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <span>{formatDate(item?.ngayDang)}</span>

                                  <LikeHearts
                                    postId={item?._id}
                                    initialCount={item?.likeCount}
                                    iconSize={16} // px
                                    countSize={16} // px
                                    btnPadding={[2, 2]} // [py, px] px
                                    particleSize={20} // px
                                    style={{ marginLeft: 8 }} // style cho wrapper
                                    className="my-like"
                                  />
                                </div>
                              </div>
                            </a>
                          </Col>
                        ))}
                      </Row>
                    </div>
                  </div>
                );
              })()
            ) : (
              <Empty />
            )}

            {/* Category Rails */}
            <div id="all-sections" className="catRails">
              {cats.map((c) => {
                const list = byCat.get(c._id) || [];
                if (!list.length) return null;
                return (
                  <div key={c._id} id={`cat-${c._id}`} className="catRail">
                    <div className="secHead">
                      <h2 style={{ padding: "10px" }}>{c.ten}</h2>
                      <span className="secLine" />
                      <Button type="link" href={`#`} className="viewAll">
                        Xem tất cả
                      </Button>
                    </div>
                    <div className="railTrack">
                      {list.map((item) => (
                        <a
                          key={item._id}
                          className="railItem"
                          onClick={() => onClickDetailPost(item?._id)}
                          style={{ cursor: "pointer" }}
                        >
                          {/* <div
                            className="railMedia"
                            style={{ backgroundImage: `url(${item?.anhBia})` }}
                          /> */}
                          <div
                            className="fiveBigMedia"
                            style={{ backgroundImage: `url(${item?.anhBia})` }}
                          >
                            <div className="media-like-btn">
                              <Tooltip title="Xem nhanh" color="#108ee9">
                                <EyeOutlined
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    openQuick(item?._id);
                                  }}
                                  style={{
                                    fontSize: 30,
                                    color: "blueviolet",
                                    fontWeight: "bold",
                                  }}
                                />
                              </Tooltip>
                            </div>
                          </div>
                          <div className="railBody">
                            <Paragraph
                              //   className="railTitle"
                              style={{ fontWeight: "700", fontSize: 18 }}
                              ellipsis={{ rows: 3, tooltip: item?.title }}
                            >
                              {item?.title}
                            </Paragraph>
                            <Paragraph
                              //   className="railTitle"
                              ellipsis={{ rows: 2, tooltip: item?.title }}
                            >
                              {item?.moTaNgan}
                            </Paragraph>
                            <div
                              className="metaRow xs"
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <span>{formatDate(item?.ngayDang)}</span>
                              {/* <i className="dot" />
                             <span>
                                <EyeOutlined /> {item?.views || 0}
                              </span> */}
                              <LikeHearts
                                postId={item?._id}
                                initialCount={item?.likeCount}
                                iconSize={16} // px
                                countSize={16} // px
                                btnPadding={[2, 2]} // [py, px] px
                                particleSize={20} // px
                                style={{ marginLeft: 8 }} // style cho wrapper
                                className="my-like"
                              />
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </Col>

          {/* Sticky sidebar */}
          <Col xs={24} lg={7}>
            <aside className="sticky">
              <div className="box">
                <div className="boxTitle">
                  <FireOutlined /> Top 10 Đọc nhiều nhất
                </div>
                {loading ? (
                  <>
                    <Skeleton active paragraph={{ rows: 2 }} />
                    <Skeleton active paragraph={{ rows: 2 }} />
                  </>
                ) : (
                  trending.map((t, idx) => (
                    <a
                      key={t._id}
                      className="rankItem"
                      onClick={() => onClickDetailPost(t?._id)}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="rankNum">{idx + 1}</div>
                      <div className="rankText">
                        {/* <div className="rankCat">{t?.theLoai?.ten}</div> */}
                        <Paragraph
                          style={{ fontWeight: "700" }}
                          ellipsis={{ rows: 2, tooltip: t?.title }}
                        >
                          {t?.title}
                        </Paragraph>
                        <div className="metaRow xs">
                          <span>
                            {/* <EyeOutlined /> {t?.views || `+99`} */}
                            {/* <Tooltip title="Xem nhanh" color="#108ee9">
                              <EyeOutlined style={{ fontSize: 18 }} /> Xem nhanh
                            </Tooltip> */}
                          </span>
                        </div>
                      </div>
                      <div
                        className="rankThumb"
                        style={{ backgroundImage: `url(${t?.anhBia})` }}
                      />
                    </a>
                  ))
                )}
              </div>

              <div className="box promo">
                <div className="promoInner">
                  <h3>Nhận tin nóng mỗi ngày</h3>
                  <p>Cập nhật nhanh, chọn lọc và giàu góc nhìn.</p>
                  <Button type="primary" ghost>
                    Đăng ký bản tin
                  </Button>
                </div>
              </div>
            </aside>
          </Col>
        </Row>
      </section>

      <Drawer
        title={
          drawerLoading ? (
            "Đang tải…"
          ) : dataDetailPost?.theLoai?.ten ? (
            <span>
              <Tag color="purple">{dataDetailPost.theLoai.ten}</Tag>{" "}
              <span style={{ fontSize: 18 }}>{dataDetailPost?.title}</span>
            </span>
          ) : (
            dataDetailPost?.title || "Chi tiết bài viết"
          )
        }
        open={openDrawer}
        onClose={closeQuick}
        width={Math.min(
          860,
          typeof window !== "undefined" ? window.innerWidth - 24 : 960
        )}
        destroyOnClose
        styles={{ header: { paddingRight: 16 } }}
      >
        {drawerLoading ? (
          <>
            <Skeleton.Image
              active
              style={{ width: "100%", height: 220, borderRadius: 12 }}
            />
            <Skeleton
              active
              paragraph={{ rows: 6 }}
              style={{ marginTop: 16 }}
            />
          </>
        ) : dataDetailPost ? (
          <div className="drawer-content">
            {/* Ảnh bìa */}
            {dataDetailPost?.anhBia && (
              <div
                className="drawer-cover"
                style={{ backgroundImage: `url(${dataDetailPost.anhBia})` }}
              />
            )}

            {/* Meta */}
            <div className="drawer-meta">
              <div className="left">
                <Avatar
                  size="small"
                  src={
                    dataDetailPost?.nguoiTao?.avatar ||
                    "https://ktquiz.com/favicon-32x32-removebg-preview.png"
                  }
                />
                <span className="author">
                  {dataDetailPost?.nguoiTao?.hoTen ||
                    dataDetailPost?.nguoiTao?.taiKhoan ||
                    "Tác giả"}
                </span>
                <i className="dot" />
                <span className="date">
                  {formatDate(dataDetailPost?.ngayDang)}
                </span>
                <i className="dot" />
                <LikeHearts
                  postId={dataDetailPost?._id}
                  initialCount={dataDetailPost?.likeCount}
                  iconSize={16} // px
                  countSize={16} // px
                  btnPadding={[2, 2]} // [py, px] px
                  particleSize={20} // px
                  style={{ marginLeft: 8 }} // style cho wrapper
                  className="my-like"
                />
              </div>
              <div className="right">
                {(dataDetailPost?.tags || []).map((t, i) => (
                  <Tag
                    key={i}
                    color="processing"
                    style={{
                      borderRadius: 999,
                      border: 0,
                      background: getTagHexColor(t),
                      color: "#fff",
                      marginTop: 6,
                    }}
                  >
                    {t}
                  </Tag>
                ))}
              </div>
            </div>

            {/* Mô tả ngắn */}
            {dataDetailPost?.moTaNgan && (
              <>
                <Divider />
                <Paragraph className="drawer-desc">
                  {dataDetailPost.moTaNgan}
                </Paragraph>
              </>
            )}

            {/* Nội dung chính (HTML) */}
            {dataDetailPost?.noiDungChinh && (
              <>
                <Divider />
                <div
                  className="drawer-html"
                  dangerouslySetInnerHTML={{
                    __html: dataDetailPost.noiDungChinh,
                  }}
                />
              </>
            )}

            {/* Thông tin thêm (nếu muốn) */}
            <Divider />
            <Descriptions column={1} size="small" labelStyle={{ width: 120 }}>
              <Descriptions.Item label="Thể loại">
                {dataDetailPost?.theLoai?.ten || dataDetailPost?.theLoai || "—"}
              </Descriptions.Item>
              <Descriptions.Item label="Người tạo">
                {dataDetailPost?.nguoiTao?.hoTen ||
                  dataDetailPost?.nguoiTao?.taiKhoan ||
                  "—"}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày đăng">
                {formatDate(dataDetailPost?.ngayDang)}
              </Descriptions.Item>
              {/* <Descriptions.Item label="Trạng thái">
                {dataDetailPost?.status ? "Hiển thị" : "Nháp"}
              </Descriptions.Item> */}
            </Descriptions>
          </div>
        ) : (
          <Empty description="Không tìm thấy bài viết" />
        )}
      </Drawer>
    </div>
  );
}
