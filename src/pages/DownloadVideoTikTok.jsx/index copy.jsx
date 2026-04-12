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

const { Title, Paragraph, Text } = Typography;

/* =======================
   API helper (self-contained)
   ======================= */
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "";

async function apiFetchTongQuat(
  endpoint,
  { method = "GET", body, headers = {} } = {}
) {
  try {
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    };
    if (body) options.body = JSON.stringify(body);

    const res = await fetch(`${API_BASE_URL}${endpoint}`, options);

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `Request failed with ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.error("API Error:", err.message);
    throw err;
  }
}

/* =======================
   Utils
   ======================= */
const isSupportedUrl = (url) =>
  /tiktok\.com|facebook\.com|fb\.watch|instagram\.com|reels|youtube\.com|youtu\.be/i.test(
    url || ""
  );

const fmtTime = (sec) => {
  if (!sec && sec !== 0) return "";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
};

/* =======================
   Component
   ======================= */
export default function DownloadVideo() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  /**
   * result:
   *  {
   *    title, author, duration, thumbnail,
   *    mp4 (server proxy download),
   *    music (server proxy download),
   *    directVideo (cdnhost)?, directMusic?
   *  }
   */
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
    if (!raw) return message.warning("Dán link video trước đã nhé!");
    if (!isSupportedUrl(raw)) {
      return message.error("Link không hợp lệ hoặc chưa được hỗ trợ.");
    }

    setLoading(true);
    setResult(null);
    try {
      // Gọi API backend: /api/tiktok/info?url=...
      const data = await apiFetchTongQuat(
        `/tiktok/info?url=${encodeURIComponent(raw)}`
      );

      if (!data?.ok || !data?.data) {
        throw new Error(data?.message || "Không lấy được metadata");
      }
      const meta = data.data;

      // Tạo link tải qua server (tránh CORS/hết hạn link)
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
        thumbnail: meta.cover,
        mp4: videoDl,
        music: audioDl,
        directVideo: meta.videoHD || meta.videoNoWM || "",
        directMusic: meta.music || "",
      });
      message.success("Lấy link tải thành công!");
    } catch (e) {
      console.error(e);
      message.error(e.message || "Không lấy được link tải. Thử link khác nhé!");
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
      <div className="dv-hero">
        <div className="dv-hero-inner">
          <Space direction="vertical" size={8}>
            <Title level={2} className="dv-title">
              Tải video mạng xã hội <span>không logo</span>
            </Title>
            <Paragraph className="dv-sub">
              Hỗ trợ TikTok / Reels / Facebook / YouTube (Shorts)… Tốc độ cao,
              miễn phí.
            </Paragraph>
          </Space>

          <Row gutter={[12, 12]} className="dv-input-row">
            <Col xs={24} md={18}>
              <Input
                size="large"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onPressEnter={handleDownload}
                placeholder="Dán link video (TikTok, Reels, FB, YouTube…) vào đây"
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
            <Tag color="blue">Facebook</Tag>
            <Tag color="purple">Instagram Reels</Tag>
            <Tag color="red">YouTube Shorts</Tag>
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
                  description="Dán link video và bấm 'Tải xuống' để nhận file MP4/Music."
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

                  {result?.title && (
                    <>
                      <Title level={5} style={{ marginTop: 12 }}>
                        {result.title}
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

                      {/* Tuỳ chọn nâng cao: copy link trực tiếp từ CDN (nếu có) */}
                      {(result.directVideo || result.directMusic) && (
                        <>
                          <Divider style={{ margin: "10px 0" }} />
                          <Text type="secondary">
                            Tuỳ chọn nâng cao (link trực tiếp, có thể hết hạn):
                          </Text>
                          {result.directVideo && (
                            <div className="dv-download-row">
                              <Text>Link MP4 trực tiếp</Text>
                              <Space>
                                <Button
                                  icon={<CopyOutlined />}
                                  onClick={() => copy(result.directVideo)}
                                >
                                  Copy
                                </Button>
                                <Button
                                  href={result.directVideo}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  Mở
                                </Button>
                              </Space>
                            </div>
                          )}
                          {result.directMusic && (
                            <div className="dv-download-row">
                              <Text>Link MP3 trực tiếp</Text>
                              <Space>
                                <Button
                                  icon={<CopyOutlined />}
                                  onClick={() => copy(result.directMusic)}
                                >
                                  Copy
                                </Button>
                                <Button
                                  href={result.directMusic}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  Mở
                                </Button>
                              </Space>
                            </div>
                          )}
                        </>
                      )}
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
                  desc="Loại bỏ watermark (nếu nền tảng cho phép)."
                />
                <Feature
                  icon={<SafetyCertificateOutlined />}
                  title="An toàn"
                  desc="Xử lý qua HTTPS, không lưu video của bạn trên máy chủ lâu dài."
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
                    title: "Sao chép liên kết",
                    description:
                      "Trong ứng dụng (TikTok/Reels/FB/Shorts) → Chia sẻ → Sao chép liên kết.",
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
                  Có thể video đã bị xoá, đặt riêng tư, hoặc link không hợp lệ.
                  Hãy mở video trong app chính chủ và sao chép lại liên kết.
                </Collapse.Panel>
                <Collapse.Panel
                  header="Có bị giới hạn dung lượng không?"
                  key="2"
                >
                  Tùy nền tảng gốc. Video quá dài lớn có thể mất thời gian xử
                  lý.
                </Collapse.Panel>
                <Collapse.Panel
                  header="Có lưu dữ liệu người dùng không?"
                  key="3"
                >
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
