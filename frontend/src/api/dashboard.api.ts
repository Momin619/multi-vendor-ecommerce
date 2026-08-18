import api from "./axios";

import type {
  ApiResponse,
} from "../types/api.types";

/**
 * Simple dashboard response.
 *
 * These APIs are only for testing protected routes.
 */
interface DashboardData {
  message: string;
  role: "customer" | "seller";
}

/**
 * Customer dashboard API.
 */
export const getCustomerDashboard =
  async (): Promise<ApiResponse<DashboardData>> => {
    const response =
      await api.get<ApiResponse<DashboardData>>(
        "/customer/dashboard",
      );

    return response.data;
  };

/**
 * Seller dashboard API.
 */
export const getSellerDashboard =
  async (): Promise<ApiResponse<DashboardData>> => {
    const response =
      await api.get<ApiResponse<DashboardData>>(
        "/seller/dashboard",
      );

    return response.data;
  };