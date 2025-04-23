import axios from "axios";

const backenduri = import.meta.env.VITE_BACKEND_URL;

// Create an axios instance
const api = axios.create({
  baseURL: backenduri,
});

api.defaults.withCredentials = true;

api.interceptors.request.use(
  async (config) => {
    const token =
      localStorage.getItem("userToken") || localStorage.getItem("token");

      
    const allowedRoutes = [
      "/user/auth/login",
      "/admin/auth/login",
      "/user/signup",
      "/user/auth/google/callback",
      "/user/auth/googleLogin/callback",
      "/user/verifyOtp",
      "/user/forgotEmail",
      "/user/resendOtp",
      "/user/verfyOtpforgot",
      "/user/passwordRegister",
      "/user/logout",
    ];

    if (config.url && allowedRoutes.includes(config.url)) {
      return config;
    }

    if (!token) {
      const currentRoute = window.location.pathname;

      // Redirection for admin and user routes
      if (currentRoute.includes("/admin")) {
        window.location.href = "/admin/login";
      } else if (currentRoute.includes("/user")) {
        window.location.href = "/login";
      }

      // Reject the request since there's no token
      return Promise.reject(
        new Error("No token available, redirecting to login.")
      );
    }

    // If token exists, add the Authorization header
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;