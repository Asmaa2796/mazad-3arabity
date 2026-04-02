import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  timeout: 15000,
});

apiClient.interceptors.request.use((config) => {
  const lang = localStorage.getItem("ui_lang") === "en" ? "en" : "ar";
  config.headers = config.headers || {};
  config.headers["Accept-Language"] = lang;
  return config;
});

export const api = {
  get: (url, config = {}) => apiClient.get(url, config),
  post: (url, data, config = {}) => apiClient.post(url, data, config),
  put: (url, data, config = {}) => apiClient.put(url, data, config),
  patch: (url, data, config = {}) => apiClient.patch(url, data, config),
  delete: (url, config = {}) => apiClient.delete(url, config),
};

export default apiClient;
