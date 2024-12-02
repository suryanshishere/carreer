import axios from "axios";
import store from "shared/store";
import { handleAccountDeactivatedAt } from "shared/store/auth-slice";
import { triggerErrorMsg } from "shared/store/thunks/response-thunk";

const DEACTIVATED_ACCOUNT_DAYS =
  Number(process.env.REACT_APP_DEACTIVATED_ACCOUNT_DAYS) || 30;
const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:5050/api";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

//prevent any !get request before hand only
axiosInstance.interceptors.request.use((config) => {
  const deactivatedAt = store.getState().auth.userData.deactivatedAt;
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
