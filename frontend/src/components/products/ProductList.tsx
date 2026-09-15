import { useEffect, useState , useRef } from "react";
import { toast } from "react-hot-toast";

import ProductCard from "./ProductCard";
import LoadingSpinner from "../ui/LoadingSpinner";

import { getProducts } from "../../api/product.api";
import { getErrorMessage } from "../../api/error.utils";

import type { Product } from "../../types/products.types";

const LIMIT = 5;

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
const loadMoreRef = useRef<HTMLDivElement | null>(null);
const isLoadingMoreRef = useRef(false);
 const loadProducts = async (cursor?: string) => {
  try {
   console.log("LOADING PRODUCTS:", {
  cursor,
  limit: LIMIT,
  currentProducts: products.length,
});

    const response = await getProducts(LIMIT, cursor);
    const result = response.data;

    console.log("PRODUCT RESPONSE:", {
      receivedProducts: result.data.length,
      hasMore: result.pagination.hasMore,
      nextCursor: result.pagination.nextCursor,
    });

    if (cursor) {
      setProducts((previous) => [
        ...previous,
        ...result.data,
      ]);
    } else {
      setProducts(result.data);
    }

    setNextCursor(result.pagination.nextCursor);
    setHasMore(result.pagination.hasMore);
  } catch (error) {
    toast.error(getErrorMessage(error));
  }
};

  useEffect(() => {
    const loadInitialProducts = async () => {
      setIsLoading(true);

      await loadProducts();

      setIsLoading(false);
    };

    void loadInitialProducts();
  }, []);

  const handleLoadMore = async () => {
  if (!nextCursor || !hasMore || isLoadingMoreRef.current) {
    return;
  }
console.log("HANDLE LOAD MORE:", {
  nextCursor,
  hasMore,
  isLoadingMore,
  isLoadingMoreRef: isLoadingMoreRef.current,
});
  isLoadingMoreRef.current = true;
  setIsLoadingMore(true);

  try {
    await loadProducts(nextCursor);
  } finally {
    isLoadingMoreRef.current = false;
    setIsLoadingMore(false);
  }
};

useEffect(() => {
  const element = loadMoreRef.current;

  if (!element) {
    return;
  }

  const observer = new IntersectionObserver(
  (entries) => {
    const entry = entries[0];

    if (entry.isIntersecting) {
      console.log("OBSERVER FIRED");
      void handleLoadMore();
    }
  },
  {
    rootMargin: "300px",
  },
);
  observer.observe(element);

  return () => {
    observer.disconnect();
  };
}, [nextCursor, hasMore, isLoadingMore]);

  const handleDeleted = (productId: string) => {
    setProducts((previous) =>
      previous.filter(
        (product) => product.id !== productId,
      ),
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-border bg-surface p-6 text-center sm:p-10">
        <p className="text-sm text-ink-soft sm:text-base">
          You have no products yet.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Responsive product grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onDeleted={handleDeleted}
          />
        ))}
      </div>

      {/* Load more */}
      {hasMore && (
  <div
    ref={loadMoreRef}
    className="flex justify-center py-8"
  >
    {isLoadingMore && <LoadingSpinner />}
  </div>
)}

      {/* End message */}
      {!hasMore && products.length > 0 && (
        <p className="mt-8 px-4 text-center text-xs text-ink-soft sm:text-sm">
          You have reached the end of your products.
        </p>
      )}
    </div>
  );
};

export default ProductList;