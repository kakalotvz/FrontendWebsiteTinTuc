import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Tag,
  message,
  Popconfirm,
  Card,
} from "antd";
import {
  getThongBao,
  createThongBao,
  updateThongBao,
  deleteThongBao,
  updateTTDocThongBao,
} from "../../services/apiThongBao";
import { BellOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

export default function ThongBao() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [form] = Form.useForm();

  const [editingRecord, setEditingRecord] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editForm] = Form.useForm();

  const handleEdit = (record) => {
    setEditingRecord(record);
    setOpenEditModal(true);
    editForm.setFieldsValue({
      title: record.title,
      message: record.message,
    });
  };

  // load data
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getThongBao();
      if (res?.success) setData(res.data);
    } catch (err) {
      message.error("Không tải được dữ liệu!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // create new
  const handleCreate = async (values) => {
    try {
      await createThongBao(values);
      message.success("Tạo thông báo thành công!");
      setOpenModal(false);
      form.resetFields();
      fetchData();
    } catch {
      message.error("Không tạo được thông báo");
    }
  };

  // mark as read
  const handleRead = async (record) => {
    try {
      await updateTTDocThongBao(record._id, { read: true });
      message.success("Đã đánh dấu đã đọc");
      fetchData();
    } catch {
      message.error("Không cập nhật được!");
    }
  };

  // update
  const handleUpdate = async (values) => {
    try {
      await updateThongBao(editingRecord._id, values);
      message.success("Cập nhật thông báo thành công!");
      setOpenEditModal(false);
      fetchData();
    } catch {
      message.error("Không thể cập nhật!");
    }
  };

  // delete
  const handleDelete = async (id) => {
    try {
      await deleteThongBao(id);
      message.success("Đã xóa thông báo");
      fetchData();
    } catch {
      message.error("Không thể xóa!");
    }
  };

  const columns = [
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      render: (text) => <b style={{ color: "#1890ff" }}>{text}</b>,
    },
    {
      title: "Nội dung",
      dataIndex: "message",
      key: "message",
      //   ellipsis: true,
    },
    {
      title: "Trạng thái",
      dataIndex: "read",
      key: "read",
      render: (read) =>
        read ? (
          <Tag color="green">✅ Đã đọc</Tag>
        ) : (
          <Tag color="red">📌 Chưa đọc</Tag>
        ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleString("vi-VN"),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space>
          {!record.read && (
            <Button size="small" onClick={() => handleRead(record)}>
              Đánh dấu đã đọc
            </Button>
          )}
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xoá thông báo?"
            okText="Xóa"
            cancelText="Hủy"
            onConfirm={() => handleDelete(record._id)}
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, background: "#f5f7fa", minHeight: "100vh" }}>
      <Card
        title={
          <span style={{ fontSize: 20, fontWeight: "600" }}>
            <BellOutlined style={{ color: "#faad14", marginRight: 8 }} />
            Quản lý Thông Báo
          </span>
        }
        extra={
          <Button type="primary" onClick={() => setOpenModal(true)}>
            + Tạo thông báo
          </Button>
        }
        bordered={false}
        style={{ borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
      >
        <Table
          rowKey="_id"
          loading={loading}
          columns={columns}
          dataSource={data}
          pagination={{ pageSize: 100 }}
          bordered
        />
      </Card>

      {/* Modal edit */}
      <Modal
        title="✏️ Chỉnh sửa thông báo"
        open={openEditModal}
        onCancel={() => setOpenEditModal(false)}
        onOk={() => editForm.submit()}
        okText="Cập nhật"
        cancelText="Hủy"
        maskClosable={false}
      >
        <Form form={editForm} layout="vertical" onFinish={handleUpdate}>
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[{ required: true, message: "Nhập tiêu đề!" }]}
          >
            <Input placeholder="Nhập tiêu đề" />
          </Form.Item>
          <Form.Item
            name="message"
            label="Nội dung"
            rules={[{ required: true, message: "Nhập nội dung!" }]}
          >
            <Input.TextArea rows={3} placeholder="Nhập nội dung thông báo" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal create */}
      <Modal
        title="➕ Tạo thông báo mới"
        open={openModal}
        onCancel={() => setOpenModal(false)}
        onOk={() => form.submit()}
        okText="Tạo"
        cancelText="Hủy"
        maskClosable={false}
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[{ required: true, message: "Nhập tiêu đề!" }]}
          >
            <Input placeholder="Nhập tiêu đề" />
          </Form.Item>
          <Form.Item
            name="message"
            label="Nội dung"
            rules={[{ required: true, message: "Nhập nội dung!" }]}
          >
            <Input.TextArea rows={3} placeholder="Nhập nội dung thông báo" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
