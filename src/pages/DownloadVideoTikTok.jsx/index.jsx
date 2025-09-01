import React, { useState } from "react";
import {
  Row,
  Col,
  Card,
  Input,
  Button,
  Typography,
  Space,
  Tag,
  Alert,
  Steps,
  Collapse,
  Tooltip,
  message,
  Divider,
} from "antd";
import {
  DownloadOutlined,
  ScissorOutlined,
  ThunderboltOutlined,
  PlayCircleOutlined,
  LinkOutlined,
  CheckCircleTwoTone,
  CopyOutlined,
  MobileOutlined,
  SafetyCertificateOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import "./download-video.css";
import PageTitle from "../../components/PageTitle/PageTitle";

const { Title, Paragraph, Text } = Typography;

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "";

// API helper
async function apiFetch(endpoint, { method = "GET", body, headers = {} } = {}) {
  const opts = {
    method,
    headers: { "Content-Type": "application/json", ...headers },
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${API_BASE_URL}${endpoint}`, opts);
  if (!res.ok) {
    const e = await res.json().catch(() => ({}));
    throw new Error(e.message || `Request failed ${res.status}`);
  }
  return res.json();
}

// chỉ cho phép TikTok
const isSupportedUrl = (url) =>
  /(?:^|\.)tiktok\.com|vt\.tiktok\.com/i.test(url || "");

const fmtTime = (sec) => {
  if (!sec && sec !== 0) return "";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
};

export default function DownloadVideo() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  // { title, author, duration, thumbnail, mp4, music }
  const [result, setResult] = useState(null);

  const pasteFromClipboard = async () => {
    try {
      const clip = await navigator.clipboard.readText();
      setUrl(clip || "");
      if (!clip) message.info("Clipboard trống 🙈");
    } catch {
      message.warning("Trình duyệt chặn đọc clipboard.");
    }
  };

  const handleDownload = async () => {
    const raw = url?.trim();
    if (!raw) return message.warning("Dán link TikTok trước đã nhé!");
    if (!isSupportedUrl(raw)) {
      return message.error("Chỉ hỗ trợ link TikTok.");
    }

    setLoading(true);
    setResult(null);
    try {
      // gọi backend riêng TikTok
      const data = await apiFetch(
        `/tiktok/info?url=${encodeURIComponent(raw)}`
      );
      if (!data?.ok || !data?.data) throw new Error("Không lấy được metadata");
      const meta = data.data;

      const videoDl = `${API_BASE_URL}/tiktok/download?type=video&url=${encodeURIComponent(
        raw
      )}`;
      const audioDl = `${API_BASE_URL}/tiktok/download?type=audio&url=${encodeURIComponent(
        raw
      )}`;

      setResult({
        title: meta.title,
        author: meta.author,
        duration: meta.duration,
        thumbnail: meta.thumbnail || meta.cover,
        mp4: videoDl,
        music: audioDl,
      });
      message.success("Lấy link tải thành công!");
    } catch (e) {
      message.error(e.message || "Không lấy được link tải.");
    } finally {
      setLoading(false);
    }
  };

  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      message.success("Đã copy vào clipboard!");
    } catch {
      message.warning("Copy thất bại.");
    }
  };

  return (
    <div className="dv-wrap">
      {/* HERO */}
      <PageTitle title="Tải video TikTok không logo (no watermark)" />
      <div className="dv-hero">
        <div className="dv-hero-inner">
          <Space direction="vertical" size={8}>
            <Title level={2} className="dv-title">
              Tải video <span>TikTok</span> không logo
            </Title>
            <Paragraph className="dv-sub">
              Hỗ trợ MP4 (không watermark) &amp; nhạc nền MP3. Nhanh, miễn phí.
            </Paragraph>
          </Space>

          <Row gutter={[12, 12]} className="dv-input-row">
            <Col xs={24} md={18}>
              <Input
                size="large"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onPressEnter={handleDownload}
                placeholder="Dán link TikTok hoặc vt.tiktok.com…"
                prefix={<LinkOutlined />}
                allowClear
              />
            </Col>
            <Col xs={12} md={3}>
              <Button
                size="large"
                block
                onClick={pasteFromClipboard}
                icon={<CopyOutlined />}
              >
                Dán
              </Button>
            </Col>
            <Col xs={12} md={3}>
              <Button
                type="primary"
                size="large"
                block
                icon={<DownloadOutlined />}
                loading={loading}
                onClick={handleDownload}
              >
                Tải xuống
              </Button>
            </Col>
          </Row>

          <div className="dv-supported">
            <span>Hỗ trợ: </span>
            <Tag color="magenta">TikTok</Tag>
          </div>
        </div>
      </div>

      <div className="dv-container">
        {/* KẾT QUẢ */}
        <Row gutter={[16, 16]}>
          <Col xs={24} md={14}>
            <Card
              className="dv-card"
              title={
                <Space>
                  <PlayCircleOutlined />
                  <span>Link tải của bạn</span>
                </Space>
              }
              extra={
                result?.duration ? (
                  <Space>
                    <InfoCircleOutlined />
                    <Text type="secondary">
                      {fmtTime(result.duration)} · {result?.author || "video"}
                    </Text>
                  </Space>
                ) : null
              }
            >
              {!result ? (
                <Alert
                  type="info"
                  showIcon
                  message="Chưa có kết quả"
                  description="Dán link TikTok và bấm 'Tải xuống' để nhận file MP4/Music."
                />
              ) : (
                <div className="dv-results">
                  {result.thumbnail && (
                    <img
                      className="dv-thumb"
                      src={result.thumbnail}
                      alt="thumbnail"
                    />
                  )}

                  {(result.title || result.author) && (
                    <>
                      <Title level={5} style={{ marginTop: 12 }}>
                        {result.title || "TikTok video"}
                      </Title>
                      <Text type="secondary">{result.author}</Text>
                      <Divider style={{ margin: "12px 0" }} />
                    </>
                  )}

                  <div className="dv-downloads">
                    <Title level={5}>Tải file</Title>
                    <Space
                      direction="vertical"
                      size={10}
                      style={{ width: "100%" }}
                    >
                      <div className="dv-download-row">
                        <Text>MP4 (không logo)</Text>
                        <Space>
                          <Tooltip title="Sao chép link tải (qua server)">
                            <Button
                              icon={<CopyOutlined />}
                              onClick={() => copy(result.mp4)}
                            />
                          </Tooltip>
                          <Button
                            type="primary"
                            icon={<DownloadOutlined />}
                            href={result.mp4}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Download
                          </Button>
                        </Space>
                      </div>

                      <div className="dv-download-row">
                        <Text>Nhạc nền (MP3)</Text>
                        <Space>
                          <Tooltip title="Sao chép link tải (qua server)">
                            <Button
                              icon={<CopyOutlined />}
                              onClick={() => copy(result.music)}
                            />
                          </Tooltip>
                          <Button
                            icon={<DownloadOutlined />}
                            href={result.music}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Download
                          </Button>
                        </Space>
                      </div>
                    </Space>
                  </div>
                </div>
              )}
            </Card>
          </Col>

          {/* TÍNH NĂNG */}
          <Col xs={24} md={10}>
            <Card
              className="dv-card"
              title={
                <Space>
                  <ThunderboltOutlined />
                  <span>Tính năng nổi bật</span>
                </Space>
              }
            >
              <Space direction="vertical" size={14} className="dv-features">
                <Feature
                  icon={<CheckCircleTwoTone twoToneColor="#52c41a" />}
                  title="Nhanh & miễn phí"
                  desc="Tải tốc độ cao, không giới hạn lượt, không cần đăng nhập."
                />
                <Feature
                  icon={<ScissorOutlined />}
                  title="Không logo"
                  desc="Loại bỏ watermark video TikTok (no WM)."
                />
                <Feature
                  icon={<SafetyCertificateOutlined />}
                  title="An toàn"
                  desc="Xử lý qua HTTPS, không lưu video của bạn lâu dài trên máy chủ."
                />
                <Feature
                  icon={<MobileOutlined />}
                  title="Mọi thiết bị"
                  desc="Hoạt động tốt trên cả điện thoại và máy tính."
                />
              </Space>
            </Card>
          </Col>
        </Row>

        {/* HƯỚNG DẪN + FAQ */}
        <Row gutter={[16, 16]} className="dv-section">
          <Col xs={24} md={12}>
            <Card className="dv-card" title="Cách dùng (3 bước)">
              <Steps
                direction="vertical"
                items={[
                  {
                    title: "Sao chép liên kết TikTok",
                    description:
                      "Trong app TikTok → Chia sẻ → Sao chép liên kết.",
                  },
                  {
                    title: "Dán vào hộp nhập",
                    description:
                      "Quay lại trang này → dán link vào ô phía trên rồi nhấn 'Tải xuống'.",
                  },
                  {
                    title: "Chọn file & lưu",
                    description:
                      "Chọn MP4 hoặc Nhạc nền → tải về thiết bị của bạn.",
                  },
                ]}
              />
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card className="dv-card" title="Câu hỏi thường gặp">
              <Collapse ghost>
                <Collapse.Panel header="Vì sao báo link lỗi?" key="1">
                  Có thể video đã bị xoá, để riêng tư, hoặc link không hợp lệ.
                  Hãy mở video trong app TikTok và sao chép lại liên kết.
                </Collapse.Panel>
                <Collapse.Panel header="Có giới hạn dung lượng?" key="2">
                  Phụ thuộc video gốc. Video quá dài có thể mất thời gian xử lý.
                </Collapse.Panel>
                <Collapse.Panel header="Có lưu dữ liệu người dùng?" key="3">
                  Không. Hệ thống chỉ xử lý tạm thời để tạo link tải.
                </Collapse.Panel>
              </Collapse>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}

function Feature({ icon, title, desc }) {
  return (
    <div className="dv-feature">
      <div className="dv-feature-ic">{icon}</div>
      <div>
        <div className="dv-feature-title">{title}</div>
        <div className="dv-feature-desc">{desc}</div>
      </div>
    </div>
  );
}
