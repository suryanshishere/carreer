import axios from "axios";
import store from "shared/store";
import { handleAccountDeactivatedAt } from "shared/store/userSlice";

// const DEACTIVATED_ACCOUNT_DAYS =
//   Number(process.env.REACT_APP_DEACTIVATED_ACCOUNT_DAYS) || 30;
const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:5050/api";

const getTokenFromLocalStorage = () => {
  const state = JSON.parse(localStorage.getItem("persist:auth") || "{}");
  const userData = state.userData ? JSON.parse(state.userData) : null;
  return userData ? userData.token : null;
};

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getTokenFromLocalStorage()}`,
  },
});

// Add an interceptor to include the Authorization header for all requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getTokenFromLocalStorage();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//prevent any !get request before hand only
axiosInstance.interceptors.request.use((config) => {
  const deactivatedAt = store.getState().user.deactivatedAt;
  const authHeader =
    config.headers["Authorization"] || config.headers["authorization"];
  if (
    deactivatedAt &&
    config.method !== "get" &&
    authHeader &&
    config.url &&
    !EXEMPT_URLS.includes(config.url)
  ) {
    return Promise.reject({
      response: {
        data: {
          message: "Your account is deactivated. Please activate it first.",
        },
      },
    });
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    if (response.data) {
      const deactivatedAt = response.data.deactivated_at;
      store.dispatch(handleAccountDeactivatedAt(deactivatedAt));
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;

const EXEMPT_URLS = ["/user/account/activate-account"];
