export interface CatalogProduct {
  id: string;
  sellerId: string;
  sellerName: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  category: string;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CatalogProductRow {
  id: string;
  seller_id: string;
  seller_name: string;
  name: string;
  description: string | null;
  price: string;
  stock: number;
  category: string;
  image_url: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface CatalogPagination {
  nextCursor: string | null;
  hasMore: boolean;
  limit: number;
}

export interface PaginatedCatalogProducts {
  data: CatalogProduct[];
  pagination: CatalogPagination;
}
