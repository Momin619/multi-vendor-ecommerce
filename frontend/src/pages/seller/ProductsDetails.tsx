import {
  useEffect,
  useState,
} from "react";
import {
  Link,
  useParams,
} from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  FiArrowLeft,
  FiEdit2,
} from "react-icons/fi";

import {
  getProductById,
} from "../../api/product.api";

import {
  getErrorMessage,
} from "../../api/error.utils";

import LoadingSpinner from "../../components/ui/LoadingSpinner";

import type {
  Product,
} from "../../types/products.types";

const ProductDetails = () => {
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
      setIsLoading(false);
      return;
    }

    const loadProduct = async () => {
      try {
        const response =
          await getProductById(id);

        setProduct(
          response.data.product,
        );
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
      <div className="flex min-h-[70vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[70vh] bg-gray-100 p-4 sm:p-6">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-xl bg-white p-6 text-center shadow sm:p-8">
            <h1 className="text-xl font-semibold text-gray-900">
              Product Not Found
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              The product could not be loaded.
            </p>

            <Link
              to="/seller/products"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              <FiArrowLeft />
              Back to Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="mx-auto max-w-3xl">
        {/* Back */}
        <Link
          to="/seller/products"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-blue-600"
        >
          <FiArrowLeft />
          Back to Products
        </Link>

        <div className="overflow-hidden rounded-xl bg-white shadow">
          {/* Product Image */}
          {product.imageUrl ? (
            <div className="bg-gray-50">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="h-64 w-full object-contain p-6 sm:h-80"
              />
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center bg-gray-100 text-sm text-gray-400 sm:h-80">
              No image available
            </div>
          )}

          {/* Product Content */}
          <div className="p-5 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="text-sm font-medium text-blue-600">
                  {product.category}
                </p>

                <h1 className="mt-1 break-words text-2xl font-bold text-gray-900 sm:text-3xl">
                  {product.name}
                </h1>
              </div>

              <p className="shrink-0 text-2xl font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </p>
            </div>

            {/* Description */}
            {product.description && (
              <div className="mt-8">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                  Description
                </h2>

                <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-gray-600">
                  {product.description}
                </p>
              </div>
            )}

            {/* Information */}
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-sm text-gray-500">
                  Stock
                </p>

                <p className="mt-1 text-lg font-semibold text-gray-900">
                  {product.stock}
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-sm text-gray-500">
                  Category
                </p>

                <p className="mt-1 text-lg font-semibold text-gray-900">
                  {product.category}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to={`/seller/products/${product.id}/edit`}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-700 sm:w-auto"
              >
                <FiEdit2 />
                Edit Product
              </Link>

              <Link
                to="/seller/products"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 sm:w-auto"
              >
                <FiArrowLeft />
                Back
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;