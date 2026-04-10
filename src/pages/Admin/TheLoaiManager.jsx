import React, { useEffect, useState } from "react";
import { Button, Input, Table, Popconfirm, message, Space, Form, Modal } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { apiFetchTongQuat } from "../../services/apiTongQuat";

export default function TheLoaiManager() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

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
        body: { ten: values.ten },
      });
      if (res.error === 0) {
        message.success("Tạo thể loại thành công");
        form.resetFields();
        setOpen(false);
        fetchData();
      } else {
        message.error(res.message);
      }
    } catch (e) {
      message.error("Lỗi server");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await apiFetchTongQuat(`/bai-viet/delete-the-loai/${id}`, { method: "DELETE" });
      if (res.error === 0) {
        message.success("Đã xóa thể loại");
        fetchData();
      }
    } catch (e) {
      message.error("Lỗi server");
    }
  };

  const columns = [
    { title: "Tên thể loại", dataIndex: "ten", key: "ten" },
    {
      title: "Hành động",
      key: "action",
      width: 100,
      render: (_, record) => (
        <Popconfirm
          title="Xóa thể loại này?"
          okText="Xóa"
          cancelText="Hủy"
          okButtonProps={{ danger: true }}
          onConfirm={() => handleDelete(record._id)}
        >
          <Button type="text" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)}>
          Thêm thể loại
        </Button>
      </Space>

      <Table
        rowKey="_id"
        loading={loading}
        dataSource={data}
        columns={columns}
        pagination={{ pageSize: 20 }}
      />

      <Modal
        title="Thêm thể loại mới"
        open={open}
        onCancel={() => { setOpen(false); form.resetFields(); }}
        footer={null}
      >
        <Form form={form} onFinish={handleCreate} layout="vertical">
          <Form.Item name="ten" label="Tên thể loại" rules={[{ required: true, message: "Nhập tên thể loại" }]}>
            <Input placeholder="VD: Thời sự, Công nghệ..." />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>Tạo</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
