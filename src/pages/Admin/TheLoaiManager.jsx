import React, { useEffect, useState } from "react";
import { Button, Form, Input, Modal, Popconfirm, Table, message, Space } from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { apiFetchTongQuat } from "../../services/apiTongQuat";

// Chuyển "Thời Sự" -> "thoi-su"
const toSlug = (str = "") =>
  str.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

export default function TheLoaiManager() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [formCreate] = Form.useForm();
  const [formEdit] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await apiFetchTongQuat("/bai-viet/get-the-loai", { method: "GET" });
      if (res.data) setData(res.data);
    } catch (e) {}
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async (values) => {
    try {
      const res = await apiFetchTongQuat("/bai-viet/create-the-loai", {
        method: "POST",
        body: { ten: values.ten, slug: values.slug || toSlug(values.ten) },
      });
      if (res.error === 0) {
        message.success("Tạo thể loại thành công");
        formCreate.resetFields();
        setOpenCreate(false);
        fetchData();
      } else { message.error(res.message); }
    } catch (e) { message.error("Lỗi server"); }
  };

  const handleEdit = async (values) => {
    try {
      const res = await apiFetchTongQuat(`/bai-viet/update-the-loai/${editRecord._id}`, {
        method: "PUT",
        body: { ten: values.ten, slug: values.slug },
      });
      if (res.error === 0) {
        message.success("Cập nhật thành công");
        setOpenEdit(false);
        fetchData();
      } else { message.error(res.message); }
    } catch (e) { message.error("Lỗi server"); }
  };

  const handleDelete = async (id) => {
    try {
      const res = await apiFetchTongQuat(`/bai-viet/delete-the-loai/${id}`, { method: "DELETE" });
      if (res.error === 0) { message.success("Đã xóa thể loại"); fetchData(); }
    } catch (e) { message.error("Lỗi server"); }
  };

  const openEditModal = (record) => {
    setEditRecord(record);
    formEdit.setFieldsValue({ ten: record.ten, slug: record.slug || toSlug(record.ten) });
    setOpenEdit(true);
  };

  const columns = [
    { title: "Tên thể loại", dataIndex: "ten", key: "ten" },
    { title: "Đường dẫn (slug)", dataIndex: "slug", key: "slug", render: (v, r) => v || toSlug(r.ten) },
    {
      title: "Thao tác", key: "action", width: 140,
      render: (_, record) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => openEditModal(record)}>Sửa</Button>
          <Popconfirm title="Xóa thể loại này?" okText="Xóa" cancelText="Hủy" okButtonProps={{ danger: true }} onConfirm={() => handleDelete(record._id)}>
            <Button size="small" type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpenCreate(true)} style={{ marginBottom: 16 }}>
        Thêm thể loại
      </Button>

      <Table rowKey="_id" loading={loading} dataSource={data} columns={columns} pagination={{ pageSize: 20 }} />

      {/* Modal tạo mới */}
      <Modal title="Thêm thể loại mới" open={openCreate} onCancel={() => { setOpenCreate(false); formCreate.resetFields(); }} footer={null}>
        <Form form={formCreate} onFinish={handleCreate} layout="vertical">
          <Form.Item name="ten" label="Tên thể loại" rules={[{ required: true, message: "Nhập tên thể loại" }]}>
            <Input placeholder="VD: Thời sự" onChange={(e) => formCreate.setFieldValue("slug", toSlug(e.target.value))} />
          </Form.Item>
          <Form.Item name="slug" label="Đường dẫn (slug)" rules={[{ required: true, message: "Nhập đường dẫn" }]}>
            <Input placeholder="VD: thoi-su" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>Tạo</Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal sửa */}
      <Modal title="Sửa thể loại" open={openEdit} onCancel={() => setOpenEdit(false)} footer={null}>
        <Form form={formEdit} onFinish={handleEdit} layout="vertical">
          <Form.Item name="ten" label="Tên thể loại" rules={[{ required: true }]}>
            <Input onChange={(e) => formEdit.setFieldValue("slug", toSlug(e.target.value))} />
          </Form.Item>
          <Form.Item name="slug" label="Đường dẫn (slug)" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>Lưu</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
