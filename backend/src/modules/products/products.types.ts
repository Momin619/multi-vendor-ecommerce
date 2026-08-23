export interface Product {
  id: string;
  sellerId: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  category: string;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductInput {
  name: string;
  description?: string;
  price: number;
  stock: number;
  category: string;
  imageUrl?: string;
}

export interface UpdateProductInput {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  category?: string;
  imageUrl?: string;
}

export interface ProductCursor {
  createdAt: string;
  id: string;
}

export interface ProductPagination {
  nextCursor: string | null;
  hasMore: boolean;
  limit: number;
}

export interface PaginatedProducts {
  data: Product[];
  pagination: ProductPagination;
}

