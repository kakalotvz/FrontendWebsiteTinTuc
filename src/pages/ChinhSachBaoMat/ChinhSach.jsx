import React from "react";

const ChinhSach = () => {
  const APP_NAME = "VidDown"; // đổi nếu cần
  const LAST_UPDATED = "02/09/2025"; // cập nhật khi chỉnh sửa
  const CONTACT_EMAIL = "support@yourdomain.com"; // thay email liên hệ

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "24px" }}>
      <h1 style={{ marginBottom: 8 }}>
        Chính sách quyền riêng tư & Điều khoản sử dụng
      </h1>
      <p style={{ color: "#6b7280", marginTop: 0 }}>
        Cập nhật lần cuối: {LAST_UPDATED}
      </p>

      <section>
        <h2>1. Giới thiệu</h2>
        <p>
          {APP_NAME} là công cụ giúp bạn tạo liên kết tải{" "}
          <strong>video/âm thanh</strong> từ các nền tảng được hỗ trợ để sử dụng
          cho mục đích cá nhân. Bằng việc cài đặt và sử dụng {APP_NAME}, bạn
          đồng ý với các điều khoản và chính sách dưới đây.
        </p>
      </section>

      <section>
        <h2>2. Dữ liệu chúng tôi thu thập</h2>
        <ul>
          <li>
            <strong>URL</strong> bạn nhập vào để xử lý tải.
          </li>
          <li>
            Một số <strong>thông tin thiết bị cơ bản</strong> (loại thiết bị,
            phiên bản hệ điều hành, ngôn ngữ, quốc gia) nhằm chẩn đoán lỗi và
            cải thiện hiệu năng.
          </li>
          <li>
            <strong>Nhật ký lỗi</strong> ẩn danh khi ứng dụng gặp sự cố.
          </li>
        </ul>
        <p>
          Chúng tôi <strong>không</strong> tải về hay lưu trữ nội dung video/âm
          thanh của bạn trên máy chủ sau khi xử lý xong; file đầu ra được lưu
          cục bộ trên thiết bị của bạn hoặc tại vị trí bạn chọn.
        </p>
      </section>

      <section>
        <h2>3. Mục đích xử lý dữ liệu</h2>
        <ul>
          <li>Thực hiện chức năng tạo liên kết tải và tải file về thiết bị.</li>
          <li>
            Cải thiện chất lượng dịch vụ, phân tích lỗi, ngăn chặn lạm dụng.
          </li>
          <li>Hiển thị nội dung/đề xuất phù hợp ngôn ngữ – khu vực của bạn.</li>
        </ul>
      </section>

      <section>
        <h2>4. Lưu trữ & bảo mật</h2>
        <p>
          Dữ liệu tối thiểu cần thiết có thể được lưu tạm thời để xử lý yêu cầu.
          Chúng tôi áp dụng biện pháp kỹ thuật hợp lý nhằm bảo vệ dữ liệu, nhưng
          <strong> không thể bảo đảm an toàn tuyệt đối</strong> trước mọi rủi ro
          trên Internet. Bạn nên cập nhật thiết bị và ứng dụng thường xuyên.
        </p>
      </section>

      <section>
        <h2>5. Quyền của người dùng</h2>
        <ul>
          <li>
            Yêu cầu truy cập, chỉnh sửa hoặc xóa các thông tin cá nhân có thể
            định danh (nếu có).
          </li>
          <li>
            Từ chối một số quyền cấp cho ứng dụng (vị trí/ảnh/tệp…); lưu ý điều
            này có thể làm gián đoạn tính năng.
          </li>
        </ul>
        {/* <p>
          Liên hệ: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </p> */}
      </section>

      <section>
        <h2>6. Quyền truy cập trên thiết bị</h2>
        <ul>
          <li>
            <strong>Bộ nhớ/Tệp</strong>: lưu file tải về vào thư mục bạn chọn.
          </li>
          <li>
            <strong>Mạng</strong>: kết nối máy chủ để phân tích URL và tạo liên
            kết tải.
          </li>
        </ul>
        <p>Bạn có thể thay đổi quyền trong phần cài đặt của hệ điều hành.</p>
      </section>

      <section>
        <h2>7. Cookie & công nghệ tương tự (trên web)</h2>
        <p>
          Phiên bản web của {APP_NAME} có thể sử dụng cookie để ghi nhớ tùy chọn
          ngôn ngữ, đo lường hiệu năng và chống lạm dụng. Bạn có thể tắt cookie
          trong trình duyệt nhưng một số chức năng có thể bị ảnh hưởng.
        </p>
      </section>

      <section>
        <h2>8. Chia sẻ dữ liệu với bên thứ ba</h2>
        <p>
          Chúng tôi <strong>không bán</strong> dữ liệu cá nhân. Một số dịch vụ
          hạ tầng/analytics/hiển thị quảng cáo (nếu có) có thể nhận dữ liệu ẩn
          danh để vận hành:
        </p>
        <ul>
          <li>Nhà cung cấp máy chủ/VPS, CDN.</li>
          <li>Công cụ phân tích hiệu năng/lỗi.</li>
          <li>
            Nền tảng quảng cáo (ví dụ: Google AdSense) – có thể dùng cookie hoặc
            mã định danh để cá nhân hóa quảng cáo theo chính sách của họ.
          </li>
        </ul>
      </section>

      <section>
        <h2>9. Bản quyền & nội dung người dùng</h2>
        <p>
          Bạn chỉ nên tải nội dung khi có quyền hợp pháp hoặc được phép theo
          điều khoản của nền tảng gốc. Mọi trách nhiệm liên quan đến việc sử
          dụng, chia sẻ, phân phối nội dung đã tải thuộc về <strong>bạn</strong>
          . {APP_NAME} không liên kết hay đại diện cho các nền tảng mạng xã hội
          bên thứ ba.
        </p>
      </section>

      <section>
        <h2>10. Trách nhiệm người dùng</h2>
        <ul>
          <li>
            Không sử dụng ứng dụng cho mục đích thương mại trái phép hoặc vi
            phạm pháp luật.
          </li>
          <li>Không khai thác, tấn công, can thiệp trái phép vào hệ thống.</li>
          <li>
            Tuân thủ điều khoản sử dụng của nền tảng nguồn (ví dụ: điều khoản
            của mạng xã hội bạn lấy liên kết).
          </li>
        </ul>
      </section>

      <section>
        <h2>11. Quảng cáo & đo lường</h2>
        <p>
          Nếu chúng tôi hiển thị quảng cáo (ví dụ AdSense), một số đối tác có
          thể tự thu thập dữ liệu ẩn danh theo chính sách riêng của họ. Bạn có
          thể tham khảo và quản lý tùy chọn cá nhân hóa quảng cáo trực tiếp trên
          nền tảng của đối tác đó.
        </p>
      </section>

      <section>
        <h2>12. Liên kết ngoài</h2>
        <p>
          {APP_NAME} có thể chứa liên kết tới website/dịch vụ của bên thứ ba.
          Chúng tôi không chịu trách nhiệm về nội dung hay chính sách của các
          bên này. Bạn nên đọc kỹ điều khoản và chính sách riêng tư của họ.
        </p>
      </section>

      <section>
        <h2>13. Người dùng dưới 13 tuổi</h2>
        <p>
          {APP_NAME} không hướng tới người dùng dưới 13 tuổi. Nếu phát hiện thu
          thập dữ liệu từ người dùng chưa đủ tuổi theo luật áp dụng, chúng tôi
          sẽ xóa thông tin đó.
        </p>
      </section>

      <section>
        <h2>14. Thay đổi chính sách/điều khoản</h2>
        <p>
          Chúng tôi có thể cập nhật tài liệu này theo thời gian. Khi có thay đổi
          quan trọng, chúng tôi sẽ điều chỉnh ngày “Cập nhật lần cuối” ở đầu
          trang. Tiếp tục sử dụng {APP_NAME} đồng nghĩa bạn chấp nhận phiên bản
          cập nhật.
        </p>
      </section>

      {/* <section>
        <h2>15. Liên hệ</h2>
        <p>
          Nếu có câu hỏi, vui lòng liên hệ{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </section> */}

      <hr style={{ margin: "24px 0" }} />
      <p style={{ fontSize: 12, color: "#6b7280" }}>
        *Tài liệu này nhằm mục đích cung cấp thông tin và không phải tư vấn pháp
        lý. Tùy tình huống (ví dụ triển khai quảng cáo, xử lý dữ liệu người dùng
        EU/EEA), bạn nên tham vấn luật sư để bổ sung các mục tuân thủ
        (GDPR/CCPA, cơ chế đồng ý cookie, DPA, v.v.).
      </p>
    </main>
  );
};

export default ChinhSach;
