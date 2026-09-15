import api from "./axios";

import type {
  ApiResponse,
} from "../types/api.types";

import type {
  CatalogProduct,
  PaginatedCatalogProducts,
} from "../types/catalog.types";

export const getCatalogProducts = async (
  limit = 5,
  cursor?: string,
): Promise<ApiResponse<PaginatedCatalogProducts>> => {
  const response = await api.get<
    ApiResponse<PaginatedCatalogProducts>
  >("/catalog", {
    params: {
      limit,
      ...(cursor ? { cursor } : {}),
    },
  });

  return response.data;
};

export const getCatalogProductById = async (
  productId: string,
): Promise<ApiResponse<{ product: CatalogProduct }>> => {
  const response = await api.get<
    ApiResponse<{ product: CatalogProduct }>
  >(`/catalog/${productId}`);

  return response.data;
};
