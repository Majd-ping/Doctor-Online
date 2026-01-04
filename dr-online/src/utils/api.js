const API = process.env.REACT_APP_API_URL || "https://doctor-online-backend.onrender.com/api";

export async function authFetch(path, options = {}) {
  const token = localStorage.getItem("token");
  const headers = options.headers ? { ...options.headers } : {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (!headers["Content-Type"]) headers["Content-Type"] = "application/json";

  const res = await fetch(`${API}${path}`, { ...options, headers });
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (err) {
    data = text;
  }
  if (!res.ok) {
    const error = new Error(`API Error: ${res.status}`);
    error.status = res.status;
    error.data = data;
    throw error;
  }
  return data;
}

export default API;
