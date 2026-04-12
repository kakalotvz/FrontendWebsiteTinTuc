const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

export async function apiFetchTongQuat(endpoint, { method = "GET", body, headers = {} } = {}) {
  try {
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers, // merge thêm header nếu cần (vd: Authorization)
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const res = await fetch(`${API_BASE_URL}${endpoint}`, options);

    if (!res.ok) {
      // Nếu backend trả lỗi (status >= 400)
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `Request failed with status ${res.status}`);
    }

    return await res.json(); // dữ liệu JSON trả về
  } catch (error) {
    console.error("API Error:", error.message);
    throw error; // cho component gọi biết lỗi
  }
}
