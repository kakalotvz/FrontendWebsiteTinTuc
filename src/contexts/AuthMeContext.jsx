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
      setLoading(true);
      setErr(null);

      // 👉 Chỉ gọi khi đã có accessToken (đã login)
      const hasToken =
        !!getAccessToken() || !!localStorage.getItem("access_token");
      if (!hasToken) {
        setMe(null);
        return null; // KHÔNG gọi /auth/me
      }

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

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    const onLogin = (e) => {
      if (e.detail?.user) setMe(e.detail.user);
      else refetch();
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
