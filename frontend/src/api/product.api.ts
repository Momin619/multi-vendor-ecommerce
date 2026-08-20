import api from "./axios";

export const getMyProducts = async () => {
  const response = await api.get("/products/my-products");

  return response.data;
};