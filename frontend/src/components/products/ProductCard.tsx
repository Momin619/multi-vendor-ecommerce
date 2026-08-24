import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

import {
  FiEdit2,
  FiEye,
  FiTrash2,
} from "react-icons/fi";

import { deleteProduct } from "../../api/product.api";
import { getErrorMessage } from "../../api/error.utils";

import type { Product } from "../../types/products.types";

interface ProductCardProps {
  product: Product;
  onDeleted: (productId: string) => void;
}

const ProductCard = ({
  product,
  onDeleted,
}: ProductCardProps) => {
  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteProduct(product.id);

      toast.success("Product deleted successfully.");

      onDeleted(product.id);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <article
      className="
        flex
        h-full
        min-w-0
        flex-col
        overflow-hidden
        rounded-xl
        bg-white
        shadow
        transition
        hover:shadow-md
      "
    >
      {/* Product content */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {/* Header */}
        <div className="flex min-w-0 items-start gap-3">
          {/* Name + category */}
          <div className="min-w-0 flex-1">
            <h2
              className="
                break-words
                text-base
                font-semibold
                leading-6
                text-gray-900
                sm:text-lg
              "
            >
              {product.name}
            </h2>

            <p className="mt-1 truncate text-sm text-gray-500">
              {product.category}
            </p>
          </div>

          {/* Price */}
          <span
            className="
              shrink-0
              rounded-full
              bg-blue-50
              px-2.5
              py-1
              text-xs
              font-semibold
              text-blue-700
              sm:px-3
              sm:text-sm
            "
          >
            ${product.price.toFixed(2)}
          </span>
        </div>

        {/* Description */}
        {product.description && (
          <p
            className="
              mt-4
              line-clamp-3
              break-words
              text-sm
              leading-5
              text-gray-600
            "
          >
            {product.description}
          </p>
        )}

        {/* Product information */}
        <div
          className="
            mt-4
            grid
            grid-cols-1
            gap-2
            xs:grid-cols-2
            sm:grid-cols-2
            sm:gap-3
          "
        >
          {/* Stock */}
          <div className="min-w-0 rounded-lg bg-gray-50 p-3">
            <p className="text-xs text-gray-500 sm:text-sm">
              Stock
            </p>

            <p className="mt-1 truncate text-sm font-semibold text-gray-900 sm:text-base">
              {product.stock}
            </p>
          </div>

          {/* Category */}
          <div className="min-w-0 rounded-lg bg-gray-50 p-3">
            <p className="text-xs text-gray-500 sm:text-sm">
              Category
            </p>

            <p className="mt-1 truncate text-sm font-semibold text-gray-900 sm:text-base">
              {product.category}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div
        className="
          flex
          items-center
          justify-end
          gap-1
          border-t
          border-gray-100
          px-3
          py-3
          sm:gap-2
          sm:px-5
        "
      >
        {/* View */}
        <Link
          to={`/seller/products/${product.id}`}
          title="View product"
          aria-label="View product"
          className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-lg
            text-gray-600
            transition
            hover:bg-gray-100
            hover:text-blue-600
            focus:outline-none
            focus:ring-2
            focus:ring-blue-500
            focus:ring-offset-1
          "
        >
          <FiEye className="h-5 w-5" />
        </Link>

        {/* Edit */}
        <Link
          to={`/seller/products/${product.id}/edit`}
          title="Edit product"
          aria-label="Edit product"
          className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-lg
            text-gray-600
            transition
            hover:bg-blue-50
            hover:text-blue-600
            focus:outline-none
            focus:ring-2
            focus:ring-blue-500
            focus:ring-offset-1
          "
        >
          <FiEdit2 className="h-5 w-5" />
        </Link>

        {/* Delete */}
        <button
          type="button"
          onClick={handleDelete}
          title="Delete product"
          aria-label="Delete product"
          className="
          cursor-pointer
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-lg
            text-gray-600
            transition
            hover:bg-red-50
            hover:text-red-600
            focus:outline-none
            focus:ring-2
            focus:ring-red-500
            focus:ring-offset-1
          "
        >
          <FiTrash2 className="h-5 w-5" />
        </button>
      </div>
    </article>
  );
};

export default ProductCard;