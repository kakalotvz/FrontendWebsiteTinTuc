import React, { useEffect, useState } from "react";
import {
  Button, Form, Input, Modal, Popconfirm,
  Select, Table, Tag, message, Space
} from "antd";
import { PlusOutlined, DeleteOutlined, KeyOutlined } from "@ant-design/icons";
import { apiFetchTongQuat } from "../../services/apiTongQuat";

export default function NguoiDung() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [openReset, setOpenReset] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formCreate] = Form.useForm();
  const [formReset] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await apiFetchTongQuat("/user/get-all-user", { method: "GET" });
      if (res.data) setData(res.data);
    } catch (e) {}
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async (values) => {
    try {
      const res = await apiFetchTongQuat("/user/admin-create-user", {
        method: "POST",
        body: { taiKhoan: values.taiKhoan, matKhau: values.matKhau, vaiTro: values.vaiTro, hoTen: values.hoTen || "" },
      });
      if (res.errCode === 0) {
        message.success("Tạo tài khoản thành công");
        formCreate.resetFields();
        setOpenCreate(false);
        fetchData();
      } else {
        message.error(res.message);
      }
    } catch (e) { message.error("Lỗi server"); }
  };

  const handleResetPassword = async (values) => {
    try {
      const res = await apiFetchTongQuat("/user/admin-reset-password", {
        method: "PUT",
        body: { userId: selectedUser._id, newPassword: values.newPassword },
      });
      if (res.errCode === 0) {
        message.success("Đổi mật khẩu thành công");
        formReset.resetFields();
        setOpenReset(false);
      } else {
        message.error(res.message);
      }
    } catch (e) { message.error("Lỗi server"); }
  };

  const handleDelete = async (id) => {
    try {
      const res = await apiFetchTongQuat(`/user/admin-delete-user/${id}`, { method: "DELETE" });
      if (res.errCode === 0) {
        message.success("Đã xóa tài khoản");
        fetchData();
      } else {
        message.error(res.message);
      }
    } catch (e) { message.error("Lỗi server"); }
  };

  const isDefaultAdmin = (record) => record.vaiTro === "admin" && record.taiKhoan === "admin";

  const columns = [
    { title: "Tài khoản", dataIndex: "taiKhoan", key: "taiKhoan" },
    { title: "Họ tên", dataIndex: "hoTen", key: "hoTen" },
    {
      title: "Vai trò", dataIndex: "vaiTro", key: "vaiTro",
      render: (v) => <Tag color={v === "admin" ? "red" : "blue"}>{v === "admin" ? "Admin" : "Người dùng"}</Tag>
    },
    {
      title: "Thao tác", key: "action",
      render: (_, record) => (
        <Space>
          <Button
            icon={<KeyOutlined />}
            size="small"
            onClick={() => { setSelectedUser(record); setOpenReset(true); }}
          >
            Đổi mật khẩu
          </Button>
          <Popconfirm
            title="Xóa tài khoản này?"
            okText="Xóa" cancelText="Hủy"
            okButtonProps={{ danger: true }}
            disabled={isDefaultAdmin(record)}
            onConfirm={() => handleDelete(record._id)}
          >
            <Button
              danger icon={<DeleteOutlined />} size="small"
              disabled={isDefaultAdmin(record)}
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: 24 }}>
      <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpenCreate(true)} style={{ marginBottom: 16 }}>
        Tạo tài khoản
      </Button>

      <Table rowKey="_id" loading={loading} dataSource={data} columns={columns} pagination={{ pageSize: 20 }} />

      {/* Modal tạo tài khoản */}
      <Modal title="Tạo tài khoản mới" open={openCreate} onCancel={() => { setOpenCreate(false); formCreate.resetFields(); }} footer={null}>
        <Form form={formCreate} onFinish={handleCreate} layout="vertical">
          <Form.Item name="taiKhoan" label="Tài khoản" rules={[{ required: true, message: "Nhập tài khoản" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="hoTen" label="Họ tên">
            <Input />
          </Form.Item>
          <Form.Item name="matKhau" label="Mật khẩu" rules={[{ required: true, message: "Nhập mật khẩu" }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item name="vaiTro" label="Vai trò" initialValue="nguoibt" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="nguoibt">Người dùng</Select.Option>
              <Select.Option value="admin">Admin</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>Tạo</Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal đổi mật khẩu */}
      <Modal
        title={`Đổi mật khẩu: ${selectedUser?.taiKhoan}`}
        open={openReset}
        onCancel={() => { setOpenReset(false); formReset.resetFields(); }}
        footer={null}
      >
        <Form form={formReset} onFinish={handleResetPassword} layout="vertical">
          <Form.Item name="newPassword" label="Mật khẩu mới" rules={[{ required: true, message: "Nhập mật khẩu mới" }, { min: 6, message: "Tối thiểu 6 ký tự" }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>Cập nhật</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
