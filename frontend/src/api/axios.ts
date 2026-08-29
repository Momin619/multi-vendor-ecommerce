import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";
import { notifySessionExpired } from "../auth/session";
/**
 * Extended Axios request configuration.
 *
 * `_retry` prevents an original request from being
 * retried more than once.
 */
interface RetryableRequestConfig
  extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

/**
 * Shape of errors returned by our backend.
 */
interface ApiErrorResponse {
  success: boolean;
  message: string;
  errorCode?: string;
}

/**
 * Axios instance used for all API requests.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,

  /**
   * Required because authentication uses HTTP-only cookies.
   */
  withCredentials: true,
});

/**
 * Response interceptor.
 *
 * Flow:
 *
 * API request
 *     ↓
 * Access token expired
 *     ↓
 * POST /auth/refresh
 *     ↓
 * New tokens stored in cookies
 *     ↓
 * Retry original request
 */
api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest =
      error.config as RetryableRequestConfig | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const requestUrl = originalRequest.url ?? "";

    const isAuthEndpoint =
      requestUrl.includes("/auth/login") ||
      requestUrl.includes("/auth/register") ||
      requestUrl.includes("/auth/refresh");

    const status = error.response?.status;

    const errorCode =
      error.response?.data?.errorCode;

    const isAccessTokenExpired = "AUTH_ACCESS_TOKEN_EXPIRED";

    /*
     * Only attempt refresh when the access token
     * specifically expired.
     */
    if (
      isAuthEndpoint ||
      status !== 401 ||
      !isAccessTokenExpired ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      /*
       * Try to refresh the tokens.
       */
      await api.post("/auth/refresh");

      /*
       * Refresh succeeded.
       *
       * Backend has now placed new tokens
       * into the HTTP-only cookies.
       *
       * Retry the original request.
       */
      return api(originalRequest);

    } catch (refreshError) {

      /*
       * Refresh failed.
       *
       * This normally means:
       *
       * AUTH_REFRESH_TOKEN_EXPIRED
       * OR
       * AUTH_REFRESH_TOKEN_INVALID
       *
       * The user's session is no longer valid.
       */
      notifySessionExpired();

      return Promise.reject(refreshError);
    }
  }
);

export default api;