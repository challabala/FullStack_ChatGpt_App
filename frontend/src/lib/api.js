import axios from "axios";

const api = axios.create({
  baseURL: "https://fullstack-chatgpt-app.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to add the token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export async function login(username, password) {
  const res = await api.post("/login/", { username, password });
  return res.data;
}

export async function register(username, email, password) {
  const res = await api.post("/register/", { username, email, password });
  return res.data;
}

export async function getUserChats(search = "") {
  const query = search ? `?search=${encodeURIComponent(search)}` : "";
  const res = await api.get(`/get_user_chats/${query}`);
  return res.data;
}

export async function deleteChat(chatId) {
  const res = await api.delete(`/delete_chat/${chatId}/`);
  return res.data;
}

/* POST: send prompt */
export async function promptGPT(data) {
  try {
    const res = await api.post("/prompt_gpt/", data);
    return res.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error("API error:", err.response?.data);
      throw new Error(err.response?.data?.error || "Server error");
    }
    throw new Error("Unknown error");
  }
}

/* GET: fetch chat history */
export async function getChatMessages(chatId) {
  try {
    const res = await api.get(`/get_chat_messages/${chatId}/`);
    return res.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error("API error:", err.response?.data);
      throw new Error(err.response?.data?.error || "Server error");
    }
    throw new Error("Unknown error");
  }
}
