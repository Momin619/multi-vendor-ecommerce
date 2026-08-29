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
        group
        flex
        h-full
        min-w-0
        flex-col
        overflow-hidden
        rounded-2xl
        border
        border-slate-200
        bg-white
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-slate-300
        hover:shadow-xl
      "
    >
      {/* Product Image */}
      <Link
        to={`/seller/products/${product.id}`}
        className="
          relative
          block
          aspect-[4/3]
          w-full
          overflow-hidden
          bg-slate-100
        "
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          className="
            h-full
            w-full
            object-cover
            transition-transform
            duration-500
            group-hover:scale-105
          "
        />

        {/* Image overlay */}
        <div
          className="
            absolute
            inset-0
            bg-gradient-to-t
            from-black/20
            via-transparent
            to-transparent
            opacity-0
            transition-opacity
            duration-300
            group-hover:opacity-100
          "
        />

        {/* View badge */}
        <span
          className="
            absolute
            right-3
            top-3
            rounded-full
            bg-white/90
            px-3
            py-1.5
            text-xs
            font-medium
            text-slate-700
            opacity-0
            shadow-sm
            backdrop-blur-sm
            transition-all
            duration-300
            group-hover:opacity-100
          "
        >
          View product
        </span>
      </Link>

      {/* Product Information */}
      <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
        <div className="space-y-3">
          <div className="flex min-w-0 items-start justify-between gap-3">
            <h2
              className="
                min-w-0
                flex-1
                break-words
                text-base
                font-semibold
                leading-snug
                tracking-tight
                text-slate-900s
                sm:text-lg
              "
            >
              {product.name}
            </h2>

            <span
              className="
                shrink-0
                rounded-full
                bg-slate-900
                px-3
                py-1.5
                text-xs
                font-semibold
                tabular-nums
                text-white
                sm:text-sm
              "
            >
              ${product.price.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div
          className="
            mt-5
            flex
            items-center
            justify-end
            gap-1
            border-t
            border-slate-100
            pt-4
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
              items-center
              justify-center
              rounded-xl
              text-slate-500
              transition-all
              duration-200
              hover:bg-slate-100
              hover:text-slate-900
              focus:outline-none
              focus-visible:ring-2
              focus-visible:ring-slate-900
              focus-visible:ring-offset-1
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
              items-center
              justify-center
              rounded-xl
              text-slate-500
              transition-all
              duration-200
              hover:bg-blue-50
              hover:text-blue-600
              focus:outline-none
              focus-visible:ring-2
              focus-visible:ring-blue-500
              focus-visible:ring-offset-1
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
              flex
              h-10
              w-10
              cursor-pointer
              items-center
              justify-center
              rounded-xl
              text-slate-500
              transition-all
              duration-200
              hover:bg-red-50
              hover:text-red-600
              focus:outline-none
              focus-visible:ring-2
              focus-visible:ring-red-500
              focus-visible:ring-offset-1
            "
          >
            <FiTrash2 className="h-5 w-5" />
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;