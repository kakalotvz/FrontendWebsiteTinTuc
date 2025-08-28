import instance from "./axios-customize";

// auth.js
const BASE_URL = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, "") || "";
const ACCESS_KEY = "access_token";
const REFRESH_KEY = "refresh_token"; // nếu backend trả về
let inMemoryAccessToken = null;
let refreshTimer = null;

// ==== util ====
function getJwtExp(token, fallbackSec) {
  try {
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return typeof payload.exp === "number" ? payload.exp : null; // seconds
  } catch {
    return fallbackSec ? Math.floor(Date.now() / 1000) + fallbackSec : null;
  }
}
function scheduleRefresh(token) {
  const exp = getJwtExp(token);
  if (!exp) return;
  const msUntilRefresh = exp * 1000 - Date.now() - 30_000; // refresh sớm 30s
  if (refreshTimer) window.clearTimeout(refreshTimer);
  if (msUntilRefresh > 0) {
    refreshTimer = window.setTimeout(refreshAccessToken, msUntilRefresh);
  }
}

// ==== public helpers ====
export function getAccessToken() {
  return inMemoryAccessToken;
}

export function restoreSessionFromStorage() {
  const token = localStorage.getItem(ACCESS_KEY);
  if (!token) return false;
  inMemoryAccessToken = token;
  scheduleRefresh(token);
  return true;
}

export function handleLoginSuccess({
  accessToken,
  refreshToken,
  remember = true,
  expiresInSeconds
}) {
  // 1) Lưu token
  inMemoryAccessToken = accessToken;

  if (remember) {
    localStorage.setItem(ACCESS_KEY, accessToken);
    if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken);
  } else {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  }

  // 2) Set header mặc định
  instance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

  // 3) Hẹn giờ auto refresh
  const exp = getJwtExp(accessToken, expiresInSeconds);
  if (exp) scheduleRefresh(accessToken);

  // 4) Phát event
  window.dispatchEvent(
    new CustomEvent("auth:login", { detail: { accessToken } })
  );
}


export function logout() {
  inMemoryAccessToken = null;
  if (refreshTimer) window.clearTimeout(refreshTimer);
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  window.dispatchEvent(new Event("auth:logout"));
}

// ==== Refresh queue (tránh gọi refresh nhiều lần) ====
let isRefreshing = false;
let refreshWaiters = [];

function notifyWaiters(ok) {
  refreshWaiters.forEach((resolve) => resolve(ok));
  refreshWaiters = [];
}

// Gọi refresh token tới /auth/refresh (cookie httpOnly sẽ tự gửi kèm)
export async function refreshAccessToken() {
  if (isRefreshing) {
    // chờ lần refresh đang chạy
    return new Promise((resolve) => refreshWaiters.push(resolve));
  }
  isRefreshing = true;
  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // gửi cookie refresh
    });
    if (!res.ok) throw new Error("refresh failed");
    const data = await res.json(); // { success, data: { accessToken } }
    console.log("data: ",data);
    
    const accessToken = data?.data?.accessToken || data?.accessToken;
    const refreshToken = data?.refreshToken;
    if (!accessToken) throw new Error("no accessToken");

    handleLoginSuccess({ accessToken, refreshToken });
    isRefreshing = false;
    notifyWaiters(true);
    return true;
  } catch (e) {
    isRefreshing = false;
    notifyWaiters(false);
    return false;
  }
}

export function isAuthenticated() {
  return !!localStorage.getItem("access_token"); 
  // hoặc kiểm tra inMemoryAccessToken
}

