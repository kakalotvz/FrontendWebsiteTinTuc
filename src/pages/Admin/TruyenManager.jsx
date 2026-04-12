import React, { useEffect, useMemo, useState } from "react";
import {
  Row,
  Col,
  Input,
  Select,
  Card,
  Button,
  Space,
  Tag,
  Tooltip,
  message,
  Switch,
  Popconfirm,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import "./TruyenManager.css";
import { deletePost, findAllPost, toggleStatus } from "../../services/apiPost";
import CreateBaiVietModal from "../../components/ModalBaiViet/CreateBaiVietModal";
import UpdateBaiVietModal from "../../components/ModalBaiViet/UpdateBaiVietModal";
import { apiFetch } from "../../services/apiFetch";
import { useAuthMe } from "../../contexts/AuthMeContext";
import { apiFetchTongQuat } from "../../services/apiTongQuat";

const { Option } = Select;

const MOCK_POSTS = [
  {
    id: 1,
    title: "Tổng hợp 7 hằng đẳng thức đáng nhớ",
    author: "Admin",
    status: "approved",
    cover: "https://i.imgur.com/9b5F0sM.jpeg",
    tags: ["hằng đẳng thức"],
    excerpt:
      "7 hằng đẳng thức đáng nhớ là công cụ quan trọng giúp học sinh giải quyết nhiều bài toán trong Toán...",
  },
  {
    id: 2,
    title: "Công thức Vật lý 9 Tổng hợp đầy đủ và chi tiết",
    author: "UserA",
    status: "approved",
    cover: "https://i.imgur.com/nv8yO2h.jpeg",
    tags: ["Vật Lý 9", "Công thức đầy đủ"],
    excerpt:
      "Để giải được các bài tập Vật lý 9 gồm 4 chương về Điện học, Điện từ học, Quang học và Sự bảo toàn...",
  },
  {
    id: 3,
    title: "Các công thức hóa học lớp 9 đầy đủ nhất",
    author: "UserB",
    status: "pending",
    cover: "https://i.imgur.com/4o5zv7J.jpeg",
    tags: ["Hóa học", "Công thức đầy đủ"],
    excerpt:
      "Trong chương trình Hóa học lớp 9, học sinh cần nắm chắc hệ thống công thức cơ bản để làm nền tảng...",
  },
  {
    id: 4,
    title: "Tổng hợp kiến thức Tiếng Anh thi vào 10",
    author: "Admin",
    status: "approved",
    cover: "https://i.imgur.com/Hu2j8B2.jpeg",
    tags: ["Tiếng Anh", "Ôn thi vào 10"],
    excerpt:
      "Kiến thức Tiếng Anh ôn thi vào lớp 10 được chia thành 3 phần: Ngữ âm, Ngữ pháp và Phrasal Verbs...",
  },
];

export default function TruyenManager() {
  //
  const { me, role } = useAuthMe();
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataPost, setDataPost] = useState([]);
  const [dataPostUpdate, setDataPostUpdate] = useState(null);
  const [toggling, setToggling] = useState({});
  const [dataTheLoai, setDataTheLoai] = useState([]);
  const [dataUser, setDataUser] = useState([]);
  // trạng thái lọc
  const [statusFilter, setStatusFilter] = useState("all"); // all | show | hide
  const [valueTL, setValueTL] = useState(null);
  const [search, setSearch] = useState("");
  const [poster, setPoster] = useState();

  useEffect(() => {
    hienThiAllTL();
    hienThiAllUser();
  }, []);

  const hienThiAllTL = async () => {
    try {
      let res = await apiFetchTongQuat("/bai-viet/get-the-loai", {
        method: "GET",
      });
      if (res.data) {
        setDataTheLoai(res.data);
      }
    } catch (error) {}
  };

  const hienThiAllUser = async () => {
    try {
      let res = await apiFetchTongQuat("/user/get-all-user", {
        method: "GET",
      });
      if (res.data) {
        setDataUser(res.data);
      }
    } catch (error) {}
  };

  const onChageTL = (e) => {
    setValueTL(e);
  };
  const setStatus = (e) => {
    setStatusFilter(e);
  };

  useEffect(() => {
    hienThiPost();
  }, [statusFilter, search, valueTL, poster]);

  const hienThiPost = async () => {
    try {
      setLoading(true);
      let queryArr = [];
      if (statusFilter) {
        queryArr.push(`status=${statusFilter}`);
      }
      if (search) {
        queryArr.push(`search=${encodeURIComponent(search)}`);
      }
      if (valueTL) {
        queryArr.push(`valueTL=${valueTL}`);
      }
      if (poster) {
        queryArr.push(`poster=${poster}`);
      }

      let query = queryArr.join("&"); // ghép thành "status=...&search=...&..."
      let res = await apiFetchTongQuat(`/bai-viet/get-bai-viet?${query}`, {
        method: "GET",
      });
      if (res.data) {
        setDataPost(res.data);
      }
      setLoading(false);
    } catch (error) {}
  };
  const hienThiPost1 = async () => {
    try {
      setLoading(true);
      let query = `status=${statusFilter}`;
      const res = await findAllPost(query);
      if (res.data) {
        setDataPost(res.data);
      }
      setLoading(false);
    } catch (error) {
      console.log("error:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      //   const res = await deletePost(id);
      const res = await apiFetchTongQuat(`/bai-viet/delete-bai-viet/${id}`, {
        method: "DELETE",
      });
      if (res.error === 0) {
        message.success(res.message);
        await hienThiPost();
      } else {
        message.error(res.message);
      }
    } catch (error) {}
  };

  const handleToggle = async (post, checked) => {
    const prevStatus = !!post.status;

    // bật loading cho đúng post
    setToggling((m) => ({ ...m, [post._id]: true }));

    // 👉 Optimistic UI: cập nhật trước cho mượt
    setDataPost((prev) =>
      prev.map((p) => (p._id === post._id ? { ...p, status: checked } : p))
    );

    try {
      //   await toggleStatus({ id: post._id, status: checked });
      await apiFetchTongQuat(`/bai-viet/thay-doi-status-bai-viet`, {
        method: "PUT",
        body: { id: post._id, status: checked },
      });
      message.success(checked ? "Đã bật hiển thị" : "Đã ẩn bài viết");
      // await hienThiPost();
    } catch (err) {
      // ❌ lỗi -> rollback về trạng thái cũ
      setDataPost((prev) =>
        prev.map((p) => (p._id === post._id ? { ...p, status: prevStatus } : p))
      );
      message.error("Cập nhật trạng thái thất bại");
    } finally {
      setToggling((m) => ({ ...m, [post._id]: false }));
    }
  };

  const col = { xs: 24, sm: 12, md: 12, lg: 8, xl: 6, xxl: 6 };

  // bảng màu preset của antd
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
  const normalize = (s = "") =>
    s
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  return (
    <div className="pm-wrap">
      {/* Filters */}
      <Row gutter={[16, 16]} className="pm-filters">
        <Col xs={24} md={24} lg={24}>
          <Input
            size="large"
            allowClear
            prefix={<SearchOutlined />}
            placeholder="Từ khóa, tag, tiêu đề…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
        <Col xs={24} md={12} lg={8}>
          <Select
            className="w100"
            size="large"
            allowClear
            showSearch
            placeholder="Lọc theo người đăng"
            value={poster}
            onChange={setPoster}
            suffixIcon={<SearchOutlined />}
            optionFilterProp="children" // hoặc dùng 'searchText' nếu muốn
            filterOption={(input, option) =>
              normalize(option?.children)?.includes(normalize(input))
            }
          >
            {dataUser.map((item) => (
              <Option key={item._id} value={item._id}>
                {item.hoTen}
              </Option>
            ))}
          </Select>
        </Col>
        <Col xs={24} md={12} lg={8}>
          <Select
            className="w100"
            size="large"
            allowClear
            showSearch
            placeholder="Lọc theo thể loại"
            value={valueTL}
            onChange={(e) => onChageTL(e)}
            suffixIcon={<SearchOutlined />}
            optionFilterProp="children" // hoặc dùng 'searchText' nếu muốn
            filterOption={(input, option) =>
              normalize(option?.children)?.includes(normalize(input))
            }
          >
            {dataTheLoai.map((item, index) => (
              <Option key={index} value={item._id}>
                {item.ten}
              </Option>
            ))}
          </Select>
        </Col>
        <Col xs={24} md={12} lg={8}>
          <Select
            className="w100"
            size="large"
            allowClear
            showSearch
            placeholder="Lọc theo trạng thái"
            value={statusFilter}
            onChange={(e) => setStatus(e)}
            suffixIcon={<SearchOutlined />}
            optionFilterProp="children" // hoặc dùng 'searchText' nếu muốn
            filterOption={(input, option) =>
              normalize(option?.children)?.includes(normalize(input))
            }
          >
            <Option value="all">Tất cả trạng thái</Option>
            <Option value="1">Đã duyệt</Option>
            <Option value="0">Chưa duyệt</Option>
          </Select>
        </Col>
      </Row>

      {/* Grid cards */}
      <Row gutter={[20, 20]} className="body-card-bv">
        <Col span={24} className="pm-create-center">
          <Button
            type="primary"
            size="large"
            style={{ backgroundColor: "black" }}
            onClick={() => setOpenCreate(true)}
            icon={<PlusOutlined />}
          >
            Tạo mới bài viết
          </Button>
        </Col>
        {dataPost.map((p) => (
          <Col key={p.id} xs={24} sm={12} md={12} lg={8} xl={6}>
              <Card
                className="pm-card"
                hoverable
                cover={<img className="pm-cover" src={p?.anhBia} alt={p.title} />}
              >
                {/* tags */}
                <Space size={[8, 8]} wrap className="mb8">
                  {(p.tags || []).map((t, i) => (
                    <Tag key={i} color={getTagHexColor(t)}>
                      {t}
                    </Tag>
                  ))}
                  {p.isAiGenerated && (
                    <Tag color="purple" style={{ fontWeight: 'bold' }}>
                      AI ✨
                    </Tag>
                  )}
                </Space>

                {/* title */}
                <h3 className="pm-title">{p.title}</h3>

              {/* excerpt */}
              <p className="pm-excerpt">{p.moTaNgan}</p>

              {/* actions row like ảnh: Show / Sửa / Xóa */}
              <Space className="pm-actions">
                {p?.nguoiTao?._id === me?._id && role === "nguoibt" ? (
                  <>
                    <Space size={10}>
                      <Tooltip
                        title={
                          p.status
                            ? "Bài viết đang hiển thị"
                            : "Bài viết đang ẩn. Chờ admin duyệt!"
                        }
                      >
                        <Switch
                          disabled
                          checked={!!p.status}
                          // onChange={(checked) => handleToggle(p, checked)}
                          checkedChildren="Hiển thị"
                          unCheckedChildren="Không hiển thị"
                          loading={!!toggling[p._id]}
                        />
                      </Tooltip>
                    </Space>
                    <Tooltip title="Sửa">
                      <Button
                        onClick={() => {
                          setOpenUpdate(true);
                          setDataPostUpdate(p);
                        }}
                        className="btn-edit"
                        icon={<EditOutlined />}
                      />
                    </Tooltip>
                    <Tooltip title="Xóa">
                      <Popconfirm
                        title="Xóa bài viết?"
                        description="Hành động này không thể hoàn tác."
                        okText="Xóa"
                        cancelText="Hủy"
                        okButtonProps={{ danger: true }}
                        placement="topRight"
                        onConfirm={() => handleDelete(p._id)}
                      >
                        <Button
                          type="text"
                          danger
                          className="btn-del"
                          icon={<DeleteOutlined />}
                        />
                      </Popconfirm>
                    </Tooltip>
                  </>
                ) : role === "admin" ? (
                  <>
                    <Space size={10}>
                      <Switch
                        checked={!!p.status}
                        onChange={(checked) => handleToggle(p, checked)}
                        checkedChildren="Hiển thị"
                        unCheckedChildren="Không hiển thị"
                        loading={!!toggling[p._id]}
                      />
                    </Space>
                    <Tooltip title="Sửa">
                      <Button
                        onClick={() => {
                          setOpenUpdate(true);
                          setDataPostUpdate(p);
                        }}
                        className="btn-edit"
                        icon={<EditOutlined />}
                      />
                    </Tooltip>
                    <Tooltip title="Xóa">
                      <Popconfirm
                        title="Xóa bài viết?"
                        description="Hành động này không thể hoàn tác."
                        okText="Xóa"
                        cancelText="Hủy"
                        okButtonProps={{ danger: true }}
                        placement="topRight"
                        onConfirm={() => handleDelete(p._id)}
                      >
                        <Button
                          type="text"
                          danger
                          className="btn-del"
                          icon={<DeleteOutlined />}
                        />
                      </Popconfirm>
                    </Tooltip>
                  </>
                ) : (
                  <>
                    <Space size={10}>
                      <Switch
                        disabled
                        checked={!!p.status}
                        // onChange={(checked) => handleToggle(p, checked)}
                        checkedChildren="Hiển thị"
                        unCheckedChildren="Không hiển thị"
                        loading={!!toggling[p._id]}
                      />
                    </Space>
                    <Tooltip title="Không có quyền sửa">
                      <Button
                        disabled
                        onClick={() => {
                          message.warning("Không có quyền truy cập!");
                        }}
                        className="btn-edit"
                        icon={<EditOutlined />}
                      />
                    </Tooltip>
                    <Tooltip title="Không có quyền xóa">
                      <Button
                        disabled
                        onClick={() => {
                          message.warning("Không có quyền truy cập!");
                        }}
                        className="btn-del"
                        icon={<DeleteOutlined />}
                      />
                    </Tooltip>
                  </>
                )}
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      <CreateBaiVietModal
        open={openCreate}
        setOpen={setOpenCreate}
        hienThiPost={hienThiPost}
      />

      <UpdateBaiVietModal
        open={openUpdate}
        setOpen={setOpenUpdate}
        hienThiPost={hienThiPost}
        setDataPostUpdate={setDataPostUpdate}
        dataPostUpdate={dataPostUpdate}
      />
    </div>
  );
}
