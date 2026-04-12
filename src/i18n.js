// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import các file JSON
import en from "../locales/i18n/en/translation.json";
import vi from "../locales/i18n/vi/translation.json";

i18n
  .use(initReactI18next) // Tích hợp i18n với React
  .init({
    // Định nghĩa tài nguyên (resources) cho từng ngôn ngữ
    resources: {
      en: { translation: en },
      vi: { translation: vi },
    },
    lng: "vi", // Ngôn ngữ mặc định khi chạy lần đầu
    fallbackLng: "en", // Nếu không tìm thấy ngôn ngữ thì dùng tiếng Anh
    interpolation: {
      escapeValue: false // React đã xử lý XSS rồi
    }
  });

export default i18n;
