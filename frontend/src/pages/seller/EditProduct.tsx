import {
  useEffect,
  useState,
} from "react";

import { useParams } from "react-router-dom";

import { toast } from "react-hot-toast";

import ProductForm from "../../components/products/ProductForm";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

import {
  getProductById,
} from "../../api/product.api";

import {
  getErrorMessage,
} from "../../api/error.utils";

import type {
  Product,
} from "../../types/products.types.ts";

const EditProduct = () => {
  const { id } = useParams<{
    id: string;
  }>();

  const [product, setProduct] =
    useState<Product | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  useEffect(() => {
    if (!id) {
      toast.error("Invalid product ID.");
      return;
    }

    const loadProduct = async () => {
      try {
        const response =
          await getProductById(id);

        setProduct(response.data.product);
      } catch (error) {
        toast.error(
          getErrorMessage(error),
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadProduct();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-6 text-center">
        <p className="text-danger">
          Product could not be found.
        </p>
      </div>
    );
  }

 return (
  <div className="min-h-screen bg-paper p-4 sm:p-6">
    <div className="mx-auto max-w-2xl">
      <div className="rounded-md border border-border bg-surface p-5 sm:p-8">
        <h1 className="font-display text-2xl font-semibold text-ink">
          Edit Product
        </h1>

        <p className="mt-2 text-sm text-ink-soft">
          Update your product information.
        </p>

        <div className="mt-6">
          <ProductForm product={product} />
        </div>
      </div>
    </div>
  </div>
);
};

export default EditProduct;