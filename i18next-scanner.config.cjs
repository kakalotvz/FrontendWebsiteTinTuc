module.exports = {
  input: ["src/**/*.{js,jsx,ts,tsx}"], // Quét toàn bộ các file trong thư mục src
  output: "./locales", // Thư mục chứa file dịch
  options: {
    removeUnusedKeys: true, // Xóa các key không dùng
    sort: true, // Sắp xếp key theo thứ tự ABC
    func: {
      list: ["t"] // Quét các hàm sử dụng t() của i18next
    },
    lngs: ["en", "vi"], // Các ngôn ngữ hỗ trợ
    defaultLng: "en", // Ngôn ngữ mặc định
    defaultValue: (lng, ns, key) => key // Nếu chưa có bản dịch, hiển thị key
  }
};
