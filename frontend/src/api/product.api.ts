import api from "./axios";

import type {
  ApiResponse,
  CreateProductInput,
  PaginatedProducts,
  Product,
  UpdateProductInput,
} from "../types/products.types.ts";

export const getProducts = async (
  limit = 5,
  cursor?: string,
): Promise<ApiResponse<PaginatedProducts>> => {
console.log("API REQUEST:", {
    limit,
    cursor,
  });


  const response = await api.get<
    ApiResponse<PaginatedProducts>
  >("/products", {
    params: {
      limit,
      ...(cursor ? { cursor } : {}),
    },
  });

  return response.data;
};

export const getProductById = async (
  productId: string,
): Promise<ApiResponse<{ product: Product }>> => {
  const response = await api.get<
    ApiResponse<{ product: Product }>
  >(`/products/${productId}`);

  return response.data;
};

export const createProduct = async (
  data: CreateProductInput,
): Promise<ApiResponse<{ product: Product }>> => {
  const response = await api.post<
    ApiResponse<{ product: Product }>
  >("/products", data);

  return response.data;
};

export const updateProduct = async (
  productId: string,
  data: UpdateProductInput,
): Promise<ApiResponse<{ product: Product }>> => {
  const response = await api.put<
    ApiResponse<{ product: Product }>
  >(`/products/${productId}`, data);

  return response.data;
};

export const deleteProduct = async (
  productId: string,
): Promise<ApiResponse<null>> => {
  const response = await api.delete<ApiResponse<null>>(
    `/products/${productId}`,
  );

  return response.data;
};