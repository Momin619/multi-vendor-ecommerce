import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";

/**
 * Extended request config.
 * _retry stops us from retrying the same request twice.
 */
interface RetryableRequestConfig
  extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

/**
 * Axios instance used for every API call.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,

  /**
   * VERY IMPORTANT.
   * Without this, the browser will NOT send or
   * store the accessToken / refreshToken cookies
   * on requests to a different port/origin.
   */
  withCredentials: true,

  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Response interceptor.
 *
 * Flow:
 *
 * Any request fails with 401 (not an /auth/* route, not already retried)
 *        ↓
 * call /auth/refresh (browser sends refreshToken cookie automatically)
 *        ↓
 * backend sets new accessToken + refreshToken cookies
 *        ↓
 * retry the original request (browser sends the new accessToken cookie)
 *
 * NOTE: We deliberately do NOT check a specific `errorCode` here.
 * Requiring an exact string like "AUTH_TOKEN_EXPIRED" is fragile —
 * if the backend ever sends a 401 without that exact code, refresh
 * never happens and the user gets logged out for no real reason.
 * Any 401 from a non-auth endpoint is treated as "try refreshing once."
 */
api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest =
      error.config as RetryableRequestConfig | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const requestUrl = originalRequest.url ?? "";

    /**
     * Never attempt a refresh for auth endpoints themselves.
     * Otherwise a failed /auth/refresh could try to refresh itself
     * forever (infinite loop).
     */
    const isAuthEndpoint =
      requestUrl.includes("/auth/login") ||
      requestUrl.includes("/auth/register") ||
      requestUrl.includes("/auth/refresh") ||
      requestUrl.includes("/auth/logout");

    const status = error.response?.status;

    /**
     * Only try to refresh when:
     * - it's a 401 (unauthorized)
     * - it's not an auth endpoint
     * - we haven't already retried this exact request
     */
    if (isAuthEndpoint || status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      await api.post("/auth/refresh");
      return api(originalRequest);
    } catch (refreshError) {
      /**
       * Refresh token is invalid/expired too.
       * The caller (AuthContext, etc.) will treat this
       * as "not logged in".
       */
      return Promise.reject(refreshError);
    }
  },
);

export default api;