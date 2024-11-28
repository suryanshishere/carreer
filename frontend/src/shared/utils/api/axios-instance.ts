import axios from "axios";
import store from "shared/store";

const DEACTIVATED_ACCOUNT_DAYS =
  Number(process.env.REACT_APP_DEACTIVATED_ACCOUNT_DAYS) || 30;
const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:5050/api";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// const deactivatedAt = store.getState().auth.userData.deactivatedAt;

//prevent any !get request before hand only
axiosInstance.interceptors.request.use((config) => {
  const authHeader =
    config.headers["Authorization"] || config.headers["authorization"];

  if (
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

//setting deactivateAt field after looking from the header
axiosInstance.interceptors.response.use((response) => {
  const headerDeactivatedAt = response.headers["x-deactivated-at"];
  if (headerDeactivatedAt) {
    console.log(headerDeactivatedAt);
    // store.dispatch(setAccountDeactivated(headerDeactivatedAt));
  }
  return response;
});

export default axiosInstance;

const EXEMPT_URLS = ["/user/account/activate-account"];
