import api from "./axios";

import type {
  ApiResponse,
  PaginatedProducts,
  Product,
} from "../types/products.types.ts";

export const getProducts = async (
  limit = 5,
  cursor?: string,
): Promise<ApiResponse<PaginatedProducts>> => {
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

/**
 * Creates a product.
 *
 * Accepts FormData (not a plain object) because the request now
 * carries a file (the product image) alongside the text fields,
 * which requires "multipart/form-data" instead of JSON.
 */
export const createProduct = async (
  data: FormData,
): Promise<ApiResponse<{ product: Product }>> => {
  const response = await api.post<
    ApiResponse<{ product: Product }>
  >("/products", data);

  return response.data;
};

/**
 * Updates a product.
 *
 * Also accepts FormData, for the same reason as createProduct —
 * a new image file may or may not be included in an edit.
 */
export const updateProduct = async (
  productId: string,
  data: FormData,
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

// Kept for reference/type-checking elsewhere in the app where a
// plain (non-FormData) product input shape is still useful, e.g.
// building the FormData itself in ProductForm.
