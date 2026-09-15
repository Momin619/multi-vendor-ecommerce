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
  createdAt: string;
  updatedAt: string;
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
