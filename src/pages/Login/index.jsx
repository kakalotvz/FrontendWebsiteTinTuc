import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  Checkbox,
  Typography,
  Divider,
  message,
  Tooltip,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  LoginOutlined,
} from "@ant-design/icons";
import "./login.css";
import {
  restoreSessionFromStorage,
  handleLoginSuccess,
} from "../../utils/auth";
import { apiFetch } from "../../services/apiFetch";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  useEffect(() => {
    restoreSessionFromStorage();

    const savedUser = localStorage.getItem("login_username");
    const savedRemember = localStorage.getItem("login_remember") === "true";

    form.setFieldsValue({
      username: savedUser || "",
      remember: savedRemember,
      password: "", // luôn reset password cho an toàn
    });
  }, [form]);

  useEffect(() => {
    restoreSessionFromStorage();
  }, []);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      // Gọi /auth/login
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL.replace(/\/$/, "")}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // để server set cookie refresh
          body: JSON.stringify({
            taiKhoan: values.username,
            password: values.password,
          }),
        }
      );
      const json = await res.json();
      if (!res.ok || !json?.success)
        throw new Error(json?.message || "Đăng nhập thất bại");

      const { accessToken, user, refreshToken, expiresInSeconds } =
        json.data || json;

      console.log("accessToken: ", accessToken);

      handleLoginSuccess({
        accessToken,
        refreshToken,
        expiresInSeconds,
        remember: values.remember, // ✅ check ở đây
      });

      if (values.remember) {
        localStorage.setItem("login_username", values.username);
        localStorage.setItem("login_remember", "true");
      } else {
        localStorage.removeItem("login_username");
        localStorage.setItem("login_remember", "false");
      }
      message.success(`Xin chào, ${user?.hoTen || values?.username}!`);
      navigate("/admin");
    } catch (e) {
      message.error(e.message || "Đăng nhập thất bại!");
    } finally {
      setLoading(false);
    }
  };

  // Ví dụ: gọi /auth/me bằng apiFetch
  const testMe = async () => {
    try {
      const me = await apiFetch("/auth/me", { method: "GET" });
      message.success(`Bạn là: ${me?.taiKhoan || "unknown"}`);
    } catch (e) {
      message.error(e.message);
    }
  };

  return (
    <div className="login-wrap">
      <div className="login-bg" />
      <Row justify="center" align="middle" className="login-row">
        <Col xs={22} sm={20} md={16} lg={10} xl={8}>
          <Card
            className="login-card"
            bordered={false}
            // title={
            //   <div className="brand">
            //     <img
            //       src="https://cdn.jsdelivr.net/gh/twitter/twemoji/assets/svg/1f393.svg"
            //       alt="logo"
            //       style={{ width: 32, height: 32, marginRight: 8 }}
            //     />
            //     <div>
            //       <Title level={3} style={{ marginBottom: 0 }}>
            //         Admin
            //       </Title>
            //       <Text type="secondary">Đăng nhập để đăng tin tức</Text>
            //     </div>
            //   </div>
            // }
          >
            <div className="brand">
              <img
                src="https://cdn.jsdelivr.net/gh/twitter/twemoji/assets/svg/1f393.svg"
                alt="logo"
              />
              <div>
                <Title level={3} style={{ marginBottom: 0 }}>
                  Admin
                </Title>
                <Text type="secondary">Đăng nhập để đăng tin tức</Text>
              </div>
            </div>

            <Divider className="divider" />

            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              size="large"
              initialValues={{ remember: true }}
            >
              <Form.Item
                label="Tên đăng nhập"
                name="username"
                rules={[
                  { required: true, message: "Vui lòng nhập tên đăng nhập!" },
                ]}
              >
                <Input
                  prefix={<UserOutlined className="field-icon" />}
                  placeholder="vd: khactu"
                  allowClear
                />
              </Form.Item>

              <Form.Item
                label="Mật khẩu"
                name="password"
                rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
              >
                <Input.Password
                  prefix={<LockOutlined className="field-icon" />}
                  placeholder="••••••••"
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                />
              </Form.Item>

              <Row justify="space-between" align="middle">
                <Col>
                  <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox>Nhớ đăng nhập</Checkbox>
                  </Form.Item>
                </Col>
              </Row>
              <br />

              <Button
                type="primary"
                htmlType="submit"
                icon={<LoginOutlined />}
                loading={loading}
                block
                className="submit-btn"
              >
                Đăng nhập
              </Button>
            </Form>

            <Divider />
            <Tooltip
              title="Bấm vào đây để vào trang quản lý (nếu đã đăng nhập mà chưa zô )"
              color="orange"
            >
              <Button onClick={() => navigate("/admin")} block danger>
                Bấm vào đây để vào trang quản lý - Click vài lần nếu chưa vào
                được
              </Button>
            </Tooltip>

            {/* <Button onClick={testMe} block>
              Thử gọi /auth/me
            </Button> */}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
