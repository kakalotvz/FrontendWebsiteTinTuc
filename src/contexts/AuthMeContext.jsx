// src/contexts/AuthMeContext.jsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { apiFetch } from "../services/apiFetch";
import { getAccessToken } from "../utils/auth";

const Ctx = createContext(null);

export function AuthMeProvider({ children }) {
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setErr] = useState(null);

  const refetch = useCallback(async () => {
    try {
      const hasToken = !!getAccessToken();
      const hasRefresh = !!localStorage.getItem("has_refresh");
      if (!hasToken && !hasRefresh) return; // 👈 KHÔNG gọi /auth/me

      setLoading(true);
      setErr(null);

      const data = await apiFetch("/auth/me", { method: "GET" });
      setMe(data || null);
      return data;
    } catch (e) {
      setMe(null);
      setErr(e);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // fetch lần đầu
  useEffect(() => {
    refetch();
  }, [refetch]);

  // tự cập nhật khi app login/logout (sự kiện bạn đã phát trong handleLoginSuccess / logout)
  useEffect(() => {
    // const onLogin = () => refetch();
    const onLogin = (e) => {
      // nếu handleLoginSuccess đã bắn kèm user thì dùng luôn
      console.log("AuthMeProvider onLogin", e);

      if (e.detail?.user) {
        setMe(e.detail.user);
      } else {
        // fallback: vẫn gọi /auth/me nếu không có user
        refetch();
      }
    };
    const onLogout = () => setMe(null);
    window.addEventListener("auth:login", onLogin);
    window.addEventListener("auth:logout", onLogout);
    return () => {
      window.removeEventListener("auth:login", onLogin);
      window.removeEventListener("auth:logout", onLogout);
    };
  }, [refetch]);

  return (
    <Ctx.Provider
      value={{ me, role: me?.vaiTro || null, loading, error, refetch }}
    >
      {children}
    </Ctx.Provider>
  );
}

export const useAuthMe = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuthMe must be used inside <AuthMeProvider />");
  return ctx;
};
