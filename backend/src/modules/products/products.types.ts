export interface Product {
  id: string;
  sellerId: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  category: string;
  imageUrl: string | null;
  imagePublicId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductRow {
  id: string;
  seller_id: string;
  name: string;
  description: string | null;
  price: string;
  stock: number;
  category: string;
  image_url: string | null;
  image_public_id: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface CreateProductInput {
  name: string;
  description?: string;
  price: number;
  stock: number;
  category: string;
  imageUrl?: string;
  imagePublicId?: string;
}

export interface UpdateProductInput {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  category?: string;
  imageUrl?: string;
  imagePublicId?: string;
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

