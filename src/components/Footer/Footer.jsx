import React, { useState } from "react";
import { Layout, Input, Space, Modal, Typography } from "antd";
import {
  FacebookFilled,
  InstagramFilled,
  TwitterOutlined,
  YoutubeFilled,
} from "@ant-design/icons";
import "./Footer.css";

const { Footer } = Layout;
const { Search } = Input;
const { Title, Paragraph } = Typography;

const FooterApp = () => {
  const [openTerms, setOpenTerms] = useState(false);
  const [openPrivacy, setOpenPrivacy] = useState(false);

  const onSubscribe = (email) => {
    if (!email) return;
    // TODO: call API subscribe ở đây
    console.log("subscribe:", email);
  };

  const openLink = (e, which) => {
    e.preventDefault();
    if (which === "terms") setOpenTerms(true);
    if (which === "privacy") setOpenPrivacy(true);
  };

  return (
    <>
      <Footer className="footer-app">
        <div className="foot-container">
          {/* GRID */}
          <div className="footer-grid">
            {/* Brand */}
            <div className="foot-col">
              <div className="foot-brand">
                <span className="brand-badge">24g</span>
                <span className="brand-text">BAOMOI24G</span>
              </div>
              <p className="foot-text">
                Bản tin nhanh – chính xác – giàu góc nhìn. Cập nhật 24/7.
              </p>

              <div className="socials">
                <a href="https://facebook.com" aria-label="Facebook">
                  <FacebookFilled />
                </a>
                <a href="https://instagram.com" aria-label="Instagram">
                  <InstagramFilled />
                </a>
                <a href="https://twitter.com" aria-label="Twitter / X">
                  <TwitterOutlined />
                </a>
                <a href="https://youtube.com" aria-label="YouTube">
                  <YoutubeFilled />
                </a>
              </div>
            </div>

            {/* Chuyên mục */}
            <div className="foot-col">
              <div className="foot-title">Chuyên mục</div>
              <ul className="foot-links">
                <li>
                  <a href="#">Thời sự</a>
                </li>
                <li>
                  <a href="#">Thể thao</a>
                </li>
                <li>
                  <a href="#">Giải trí</a>
                </li>
                <li>
                  <a href="#">Công nghệ</a>
                </li>
                <li>
                  <a href="#">Giáo dục</a>
                </li>
              </ul>
            </div>

            {/* Hỗ trợ */}
            <div className="foot-col">
              <div className="foot-title">Hỗ trợ</div>
              <ul className="foot-links">
                <li>
                  <a href="#">Về chúng tôi</a>
                </li>
                <li>
                  <a href="#">Liên hệ</a>
                </li>
                <li>
                  <a href="#">Quảng cáo</a>
                </li>
                <li>
                  <a href="#">Tuyển dụng</a>
                </li>
                <li>
                  <a href="#" onClick={(e) => openLink(e, "terms")}>
                    Điều khoản
                  </a>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div className="foot-col">
              <div className="foot-title">Nhận bản tin</div>
              <p className="foot-text small">
                Mỗi sáng một email: tin nổi bật, phân tích súc tích.
              </p>
              <Space.Compact style={{ width: "100%" }}>
                <Search
                  placeholder="Nhập email của bạn"
                  allowClear
                  enterButton="Đăng ký"
                  size="large"
                  onSearch={onSubscribe}
                />
              </Space.Compact>
              <p className="foot-hint">
                Khi đăng ký, bạn đồng ý với{" "}
                <a href="#" onClick={(e) => openLink(e, "terms")}>
                  Điều khoản
                </a>{" "}
                &{" "}
                <a href="#" onClick={(e) => openLink(e, "privacy")}>
                  Bảo mật
                </a>
                .
              </p>
            </div>
          </div>

          {/* Bottom */}
          <div className="foot-bottom">
            <span>
              © {new Date().getFullYear()} BAOMOI24G.COM - All rights reserved.
            </span>
            <span className="foot-bottom-links">
              <a href="#" onClick={(e) => openLink(e, "terms")}>
                Điều khoản
              </a>
              <span className="dot" />
              <a href="#" onClick={(e) => openLink(e, "privacy")}>
                Bảo mật
              </a>
            </span>
          </div>
        </div>
      </Footer>

      {/* Modal Điều khoản */}
      <Modal
        open={openTerms}
        onCancel={() => setOpenTerms(false)}
        footer={null}
        title="Điều khoản sử dụng"
        className="legal-modal"
        width={880}
        centered
        destroyOnClose
      >
        <div className="legal-content">
          <Title level={4}>1. Chấp nhận điều khoản</Title>
          <Paragraph style={{ color: "#cfe0ff" }}>
            Khi truy cập và sử dụng BAOMOI24G.COM, bạn đồng ý tuân thủ các điều
            khoản sau đây.
          </Paragraph>

          <Title level={4}>2. Quyền & trách nhiệm người dùng</Title>
          <ul>
            <li>
              Không đăng tải nội dung vi phạm pháp luật, bản quyền, hoặc xâm
              phạm quyền riêng tư.
            </li>
            <li>
              Không dùng các công cụ gây ảnh hưởng đến hệ thống (spam, tấn công
              DDoS...).
            </li>
            <li>
              Chịu trách nhiệm về thông tin cung cấp khi bình luận/đăng ký.
            </li>
          </ul>

          <Title level={4}>3. Nội dung & bản quyền</Title>
          <Paragraph style={{ color: "#cfe0ff" }}>
            Tất cả bài viết, hình ảnh, đồ hoạ thuộc quyền sở hữu của BAOMOI24G
            hoặc theo thoả thuận với tác giả/đối tác. Vui lòng ghi nguồn khi
            trích dẫn.
          </Paragraph>

          <Title level={4}>4. Miễn trừ trách nhiệm</Title>
          <Paragraph style={{ color: "#cfe0ff" }}>
            Chúng tôi nỗ lực đảm bảo độ chính xác nhưng không cam kết tuyệt đối.
            BAOMOI24G không chịu trách nhiệm đối với thiệt hại phát sinh từ việc
            sử dụng thông tin trên trang.
          </Paragraph>

          <Title level={4}>5. Sửa đổi điều khoản</Title>
          <Paragraph style={{ color: "#cfe0ff" }}>
            Điều khoản có thể được cập nhật theo thời gian. Tiếp tục sử dụng
            đồng nghĩa bạn chấp nhận các thay đổi.
          </Paragraph>
        </div>
      </Modal>

      {/* Modal Bảo mật */}
      <Modal
        open={openPrivacy}
        onCancel={() => setOpenPrivacy(false)}
        footer={null}
        title="Chính sách bảo mật"
        className="legal-modal"
        width={880}
        centered
        destroyOnClose
      >
        <div className="legal-content">
          <Title level={4}>1. Thông tin thu thập</Title>
          <ul>
            <li>Email khi đăng ký nhận bản tin.</li>
            {/* <li>
              Dữ liệu kỹ thuật: IP, loại thiết bị, trình duyệt, cookie,
              analytics.
            </li> */}
          </ul>

          <Title level={4}>2. Mục đích sử dụng</Title>
          <ul>
            <li>Gửi bản tin, nội dung gợi ý phù hợp.</li>
            <li>Cải thiện chất lượng dịch vụ & trải nghiệm người dùng.</li>
          </ul>

          <Title level={4}>3. Chia sẻ dữ liệu</Title>
          <Paragraph style={{ color: "#cfe0ff" }}>
            Chúng tôi không bán dữ liệu cá nhân. Dữ liệu có thể được chia sẻ với
            đối tác xử lý (email service, analytics) theo hợp đồng bảo mật.
          </Paragraph>

          <Title level={4}>4. Quyền của bạn</Title>
          <ul>
            <li>Yêu cầu truy cập, sửa, xoá dữ liệu cá nhân.</li>
            <li>Huỷ đăng ký nhận bản tin bất kỳ lúc nào.</li>
          </ul>

          <Title level={4}>5. Bảo mật</Title>
          <Paragraph style={{ color: "#cfe0ff" }}>
            Áp dụng các biện pháp kỹ thuật và tổ chức để bảo vệ dữ liệu. Tuy
            nhiên, không hệ thống nào an toàn tuyệt đối.
          </Paragraph>

          <Title level={4}>6. Liên hệ</Title>
          <Paragraph style={{ color: "#cfe0ff" }}>
            Email: support@baomoi24g.com để gửi yêu cầu về dữ liệu cá nhân.
          </Paragraph>
        </div>
      </Modal>
    </>
  );
};

export default FooterApp;
