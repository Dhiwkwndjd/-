import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    console.log("INTERCEPTOR");
    console.log(error.response?.status);

    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      console.log("REFRESH TOKEN");

      originalRequest._retry = true;

      try {
        const refresh = localStorage.getItem("refresh");

        const response = await axios.post(
          "http://127.0.0.1:8000/api/token/refresh/",
          { refresh }
        );

        console.log("NEW ACCESS", response.data.access);

        localStorage.setItem("access", response.data.access);

        originalRequest.headers.Authorization =
  `Bearer ${response.data.access}`;

console.log("RETRY HEADERS:", originalRequest.headers);

return api(originalRequest);

      } catch (err) {
        console.log("REFRESH ERROR", err.response?.data);

        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        window.location.href = "/login";

        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;