import React, { useState, useEffect, useRef } from "react";
import {
  Layout,
  List,
  Avatar,
  Typography,
  Button,
  Input,
  Card,
  Form,
  message as AntMessage,
  Spin,
} from "antd";
import {
  SendOutlined,
  UploadOutlined,
  LogoutOutlined,
  UserOutlined,
  LockOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { io } from "socket.io-client";

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

const API_BASE_URL = "http://localhost:8880";

let socketRef = null;

// ================== API ==================
async function apiFetchTongQuat(endpoint, options = {}) {
  try {
    const { method = "GET", body, headers = {} } = options;

    const fetchOptions = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    };

    if (body) fetchOptions.body = JSON.stringify(body);

    const res = await fetch(`${API_BASE_URL}${endpoint}`, fetchOptions);
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Request failed with status ${res.status}`
      );
    }
    return await res.json();
  } catch (error) {
    console.error("API Error:", error.message);
    throw error;
  }
}

async function apiUploadFile(file, cuocHoiThoaiId, token) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("cuocHoiThoaiId", cuocHoiThoaiId);

  const res = await fetch(`${API_BASE_URL}/api/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Upload failed");
  }
  return await res.json();
}

// ================== CHAT APP ==================
const ChatApp = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ================== AUTH ==================
  const handleLogin = async () => {
    if (!loginForm.email || !loginForm.password) {
      AntMessage.warning("Vui lòng nhập email và mật khẩu");
      return;
    }

    const payload = { email: loginForm.email, matKhau: loginForm.password };
    setLoading(true);
    try {
      const response = await apiFetchTongQuat("/api/dang-nhap", {
        method: "POST",
        body: payload,
      });
      setToken(response.token);
      setCurrentUser(response.nguoiDung);
      setIsLoggedIn(true);
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.nguoiDung));
      await loadUsers(response.token);
    } catch (error) {
      AntMessage.error("Đăng nhập thất bại: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = async (email, password) => {
    setLoginForm({ email, password });
    setLoading(true);
    try {
      const response = await apiFetchTongQuat("/api/dang-nhap", {
        method: "POST",
        body: { email, matKhau: password },
      });
      setToken(response.token);
      setCurrentUser(response.nguoiDung);
      setIsLoggedIn(true);
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.nguoiDung));
      await loadUsers(response.token);
    } catch (error) {
      AntMessage.error("Đăng nhập thất bại: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      setCurrentUser(JSON.parse(savedUser));
      setIsLoggedIn(true);
      loadUsers(savedToken);
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
    setCurrentUser(null);
    setIsLoggedIn(false);
    setUsers([]);
    setMessages([]);
    setSelectedUser(null);
    setCurrentConversation(null);
    if (socketRef) {
      socketRef.disconnect();
      socketRef = null;
    }
  };

  // ================== USERS ==================
  const loadUsers = async (authToken) => {
    try {
      const response = await apiFetchTongQuat("/api/nguoi-dung", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setUsers(response.nguoiDung);
    } catch (error) {
      console.error("Load users failed:", error);
    }
  };

  const startConversation = async (userId) => {
    setLoading(true);
    try {
      const response = await apiFetchTongQuat("/api/cuoc-hoi-thoai", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: { nguoiNhanId: userId },
      });

      // reset state khi đổi sang chat mới
      setMessages([]);
      setCurrentConversation(response.cuocHoiThoai);
      setSelectedUser(users.find((u) => u._id === userId));
      await loadMessages(response.cuocHoiThoai._id);

      // join room mới
      if (socketRef) {
        socketRef.emit("join_room", response.cuocHoiThoai._id);
      }
    } catch (error) {
      AntMessage.error("Lỗi tạo cuộc hội thoại: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      const response = await apiFetchTongQuat(
        `/api/cuoc-hoi-thoai/${conversationId}/tin-nhan`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages(response.tinNhan);
    } catch (error) {
      console.error("Load messages failed:", error);
    }
  };

  // ================== SOCKET ==================
  useEffect(() => {
    if (isLoggedIn && token) {
      socketRef = io(API_BASE_URL, { auth: { token } });

      socketRef.on("tin_nhan_moi", (msg) => {
        if (msg.cuocHoiThoai === currentConversation?._id) {
          setMessages((prev) => [...prev, msg]);
        }
      });

      return () => {
        socketRef.disconnect();
      };
    }
  }, [isLoggedIn, token, currentConversation?._id]);

  // ================== MESSAGES ==================
  const sendMessage = async () => {
    if (!newMessage.trim() || !currentConversation || loading) return;
    setLoading(true);
    try {
      const response = await apiFetchTongQuat("/api/tin-nhan", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: {
          cuocHoiThoaiId: currentConversation._id,
          noiDung: newMessage,
          loaiTinNhan: "van_ban",
        },
      });
      setMessages((prev) => [...prev, response.tinNhan]);
      setNewMessage("");
    } catch (error) {
      AntMessage.error("Gửi tin nhắn thất bại: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !currentConversation) return;
    setLoading(true);
    try {
      const response = await apiUploadFile(
        file,
        currentConversation._id,
        token
      );
      setMessages((prev) => [...prev, response.tinNhan]);
    } catch (error) {
      AntMessage.error("Upload file thất bại: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = (msg, i) => {
    const isMine = msg.nguoiGui._id === currentUser.id;
    return (
      <div
        key={msg._id || i}
        style={{ textAlign: isMine ? "right" : "left", marginBottom: 8 }}
      >
        <div
          style={{
            display: "inline-block",
            padding: "8px 12px",
            borderRadius: 16,
            background: isMine ? "#1677ff" : "#f0f0f0",
            color: isMine ? "#fff" : "#000",
            maxWidth: "70%",
          }}
        >
          {!isMine && (
            <Text strong>
              {msg.nguoiGui.hoTen}
              <br />
            </Text>
          )}
          {msg.noiDung}
          <div style={{ fontSize: 10, opacity: 0.6 }}>
            {new Date(msg.ngayTao).toLocaleTimeString("vi-VN")}
          </div>
        </div>
      </div>
    );
  };

  // ================== LOGIN UI ==================
  if (!isLoggedIn) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#f5f5f5",
        }}
      >
        <Card style={{ width: 380 }}>
          <Title level={3} style={{ textAlign: "center" }}>
            Đăng nhập Chat
          </Title>
          <Form layout="vertical" onFinish={handleLogin}>
            <Form.Item label="Email">
              <Input
                prefix={<UserOutlined />}
                value={loginForm.email}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, email: e.target.value })
                }
                placeholder="Nhập email"
              />
            </Form.Item>
            <Form.Item label="Mật khẩu">
              <Input.Password
                prefix={<LockOutlined />}
                value={loginForm.password}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, password: e.target.value })
                }
                placeholder="Nhập mật khẩu"
              />
            </Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Đăng nhập
            </Button>
          </Form>
          <div style={{ marginTop: 24 }}>
            <Text strong>Tài khoản test:</Text>
            <Button
              block
              style={{ marginTop: 8 }}
              onClick={() => quickLogin("user1@test.com", "123456")}
            >
              User 1: user1@test.com / 123456
            </Button>
            <Button
              block
              style={{ marginTop: 8 }}
              onClick={() => quickLogin("user2@test.com", "123456")}
            >
              User 2: user2@test.com / 123456
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // ================== CHAT UI ==================
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={260} theme="light">
        <div style={{ padding: 16, borderBottom: "1px solid #eee" }}>
          <Avatar>{currentUser?.hoTen?.[0]}</Avatar>
          <Text style={{ marginLeft: 8 }}>{currentUser?.hoTen}</Text>
          <Button
            type="link"
            danger
            icon={<LogoutOutlined />}
            style={{ float: "right" }}
            onClick={handleLogout}
          />
        </div>
        <List
          dataSource={users}
          renderItem={(user) => (
            <List.Item
              onClick={() => startConversation(user._id)}
              style={{
                cursor: "pointer",
                background:
                  selectedUser?._id === user._id ? "#e6f7ff" : undefined,
                padding: 12,
              }}
            >
              <List.Item.Meta
                avatar={<Avatar>{user.hoTen[0]}</Avatar>}
                title={user.hoTen}
                description={user.email}
              />
            </List.Item>
          )}
        />
      </Sider>

      <Layout>
        <Header style={{ background: "#fff", borderBottom: "1px solid #eee" }}>
          {selectedUser ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <MessageOutlined style={{ color: "#1677ff" }} />
              <Text strong>{selectedUser.hoTen}</Text>
            </div>
          ) : (
            <Text type="secondary">Chọn một người để chat</Text>
          )}
        </Header>

        <Content
          style={{
            display: "flex",
            flexDirection: "column",
            padding: 16,
          }}
        >
          <div style={{ flex: 1, overflowY: "auto", marginBottom: 12 }}>
            {messages.map((m, i) => renderMessage(m, i))}
            <div ref={messagesEndRef} />
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onPressEnter={sendMessage}
              placeholder="Nhập tin nhắn..."
              disabled={loading}
            />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              style={{ display: "none" }}
              accept="image/*,.pdf,.doc,.docx,.txt"
            />
            <Button
              icon={<UploadOutlined />}
              onClick={() => fileInputRef.current?.click()}
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={sendMessage}
              disabled={!newMessage.trim() || loading}
            >
              Gửi
            </Button>
          </div>
          {loading && (
            <div style={{ textAlign: "center", marginTop: 8 }}>
              <Spin size="small" /> Đang xử lý...
            </div>
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default ChatApp;
