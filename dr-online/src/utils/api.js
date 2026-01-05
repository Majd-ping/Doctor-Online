const API = "http://localhost:5000/api";

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

// AUTH ENDPOINTS
export async function register(name, email, password, role) {
  return authFetch("/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password, role }),
  });
}

export async function login(email, password) {
  return authFetch("/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

// SERVICES ENDPOINTS
export async function getServices() {
  return authFetch("/services", { method: "GET" });
}

// DOCTORS ENDPOINTS
export async function getDoctors() {
  return authFetch("/doctors", { method: "GET" });
}

export async function getDoctorById(id) {
  return authFetch(`/doctors/${id}`, { method: "GET" });
}

// APPOINTMENTS ENDPOINTS
export async function createAppointment(doctor_id, patient_id, appointment_date, reason) {
  return authFetch("/appointments", {
    method: "POST",
    body: JSON.stringify({ doctor_id, patient_id, appointment_date, reason }),
  });
}

export async function getPatientAppointments(patient_id) {
  return authFetch(`/appointments/patient/${patient_id}`, { method: "GET" });
}

export async function getDoctorAppointments(doctor_id) {
  return authFetch(`/appointments/doctor/${doctor_id}`, { method: "GET" });
}

export async function updateAppointment(id, status) {
  return authFetch(`/appointments/${id}`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
}

// POSTS/DISCUSSIONS ENDPOINTS
export async function getPosts() {
  return authFetch("/posts", { method: "GET" });
}

export async function getPostById(id) {
  return authFetch(`/posts/${id}`, { method: "GET" });
}

export async function deletePost(id) {
  return authFetch(`/posts/${id}`, { method: "DELETE" });
}

export async function getDiscussions() {
  return authFetch("/discussions", { method: "GET" });
}

export async function createDiscussion(topic, content) {
  return authFetch("/discussions", {
    method: "POST",
    body: JSON.stringify({ topic, content }),
  });
}

// COMMENTS ENDPOINTS
export async function getComments(postId) {
  return authFetch(`/comments/${postId}`, { method: "GET" });
}

export async function createComment(postId, content) {
  return authFetch(`/comments/${postId}`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });
}

export async function deleteComment(commentId) {
  return authFetch(`/comments/${commentId}`, { method: "DELETE" });
}

// CONTACT ENDPOINT
export async function sendContact(name, email, subject, message) {
  return authFetch("/contact", {
    method: "POST",
    body: JSON.stringify({ name, email, subject, message }),
  });
}

export default API;
