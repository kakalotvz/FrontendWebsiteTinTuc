// utils/auth.js
import instance from "./axios-customize";

const BASE_URL = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, "") || "";
const ACCESS_KEY = "access_token";
const REFRESH_KEY = "refresh_token";
const HAS_REFRESH_KEY = "has_refresh";

let inMemoryAccessToken = null;
let refreshTimer = null;

function getJwtExp(token, fallbackSec) {
  try {
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return typeof payload.exp === "number" ? payload.exp : null;
  } catch {
    return fallbackSec ? Math.floor(Date.now() / 1000) + fallbackSec : null;
  }
}
function scheduleRefresh(token) {
  const exp = getJwtExp(token);
  if (!exp) return;
  const msUntilRefresh = exp * 1000 - Date.now() - 30_000;
  if (refreshTimer) window.clearTimeout(refreshTimer);
  if (msUntilRefresh > 0) {
    refreshTimer = window.setTimeout(refreshAccessToken, msUntilRefresh);
  }
}

export function getAccessToken() {
  return inMemoryAccessToken;
}

export function restoreSessionFromStorage() {
  const token = localStorage.getItem(ACCESS_KEY);
  if (!token) return false;
  inMemoryAccessToken = token;
  instance.defaults.headers.common.Authorization = `Bearer ${token}`; // 👈 giữ header khi F5
  scheduleRefresh(token);
  return true;
}

export async function handleLoginSuccess({
  accessToken,
  refreshToken,
  remember = true,
  expiresInSeconds,
  hasRefreshCookie = false, // set true khi login thành công (server set cookie)
}) {
  inMemoryAccessToken = accessToken;

  localStorage.setItem(ACCESS_KEY, accessToken);
  if (remember) {
    if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken);
    // 👇 Bật cờ nếu có refreshToken HOẶC biết server đã set cookie
    if (refreshToken || hasRefreshCookie) {
      localStorage.setItem(HAS_REFRESH_KEY, "1");
    } else {
      localStorage.removeItem(HAS_REFRESH_KEY);
    }
  } else {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(HAS_REFRESH_KEY);
  }

  instance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

  const exp = getJwtExp(accessToken, expiresInSeconds);
  if (exp) scheduleRefresh(accessToken);

  try {
    const user = await instance.get("/auth/me").then((r) => r.data);
    window.dispatchEvent(new CustomEvent("auth:login", { detail: { accessToken, user } }));
  } catch {
    window.dispatchEvent(new CustomEvent("auth:login", { detail: { accessToken } }));
  }
}

export function logout() {
  inMemoryAccessToken = null;
  if (refreshTimer) window.clearTimeout(refreshTimer);
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(HAS_REFRESH_KEY);
  delete instance.defaults.headers.common.Authorization; // 👈 remove header
  window.dispatchEvent(new Event("auth:logout"));
}

// ===== Refresh queue =====
let isRefreshing = false;
let refreshWaiters = [];
function notifyWaiters(ok) {
  refreshWaiters.forEach((resolve) => resolve(ok));
  refreshWaiters = [];
}

export async function refreshAccessToken() {
  // ❗ KHÔNG có cờ -> KHÔNG gọi refresh (tránh lỗi và spam)
  if (!localStorage.getItem(HAS_REFRESH_KEY)) return false;

  if (isRefreshing) {
    return new Promise((resolve) => refreshWaiters.push(resolve));
  }
  isRefreshing = true;
  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // gửi cookie httpOnly
    });
    if (!res.ok) throw new Error("refresh failed");
    const data = await res.json();

    const accessToken = data?.data?.accessToken || data?.accessToken;
    const refreshToken = data?.refreshToken;
    if (!accessToken) throw new Error("no accessToken");

    // giữ cờ sau refresh OK
    localStorage.setItem(HAS_REFRESH_KEY, "1");
    await handleLoginSuccess({ accessToken, refreshToken, hasRefreshCookie: true });

    isRefreshing = false;
    notifyWaiters(true);
    return true;
  } catch (e) {
    isRefreshing = false;
    notifyWaiters(false);
    // refresh fail → xoá cờ để không thử lại nữa
    localStorage.removeItem(HAS_REFRESH_KEY);
    delete instance.defaults.headers.common.Authorization;
    return false;
  }
}

export function isAuthenticated() {
  return !!localStorage.getItem(ACCESS_KEY);
}
