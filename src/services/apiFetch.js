// apiFetch.js
import { getAccessToken, logout, refreshAccessToken } from "../utils/auth";

const BASE_URL = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, "") || "";

/**
 * apiFetch: giống fetch nhưng tự gắn Authorization và tự refresh khi 401.
 * @param {string} path - Path bắt đầu bằng /auth/... /users/...
 * @param {RequestInit} options
 */
export async function apiFetch(path, options = {}) {
    const url = `${BASE_URL}${path}`;
    const headers = new Headers(options.headers || {});
    const token = getAccessToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
    if (!headers.has("Content-Type") && options.body && !(options.body instanceof FormData)) {
        headers.set("Content-Type", "application/json");
    }

    const doFetch = () =>
        fetch(url, {
        ...options,
        headers,
        credentials: "include", // để cookie refresh đi kèm khi cần
        });

    let res = await doFetch();

    // Nếu 401 → thử refresh 1 lần, sau đó retry
    if (res.status === 401) {
        const ok = await refreshAccessToken();
        if (!ok) {
        // gọi logout server (best effort) rồi dọn client
            try { 
                await fetch(`${BASE_URL}/auth/logout`, { 
                    method: "POST", 
                    credentials: "include" 
                }); 
            } catch {}
            logout();
            throw new Error("Unauthorized");
        }
        // có token mới → gắn lại header và retry
        const newHeaders = new Headers(options.headers || {});
        const newToken = getAccessToken();
        if (newToken) newHeaders.set("Authorization", `Bearer ${newToken}`);
        if (!newHeaders.has("Content-Type") && options.body && !(options.body instanceof FormData)) {
            newHeaders.set("Content-Type", "application/json");
        }
        res = await fetch(url, { ...options, headers: newHeaders, credentials: "include" });
    }

    // Chuẩn hóa trả JSON
    const text = await res.text();
    let data = null;
    try { data = text ? JSON.parse(text) : null; } catch { data = text; }

    if (!res.ok) {
        const msg = data?.message || res.statusText || "Request error";
        const err = new Error(msg);
        err.status = res.status;
        err.data = data;
        throw err;
    }
    // API mẫu ở trên trả { success, data } → trả gọn ra data nếu có
    return data && Object.prototype.hasOwnProperty.call(data, "data") ? data.data : data;
}
