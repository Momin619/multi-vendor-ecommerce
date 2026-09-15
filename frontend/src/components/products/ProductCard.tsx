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
        rounded-md
        border
        border-border
        bg-surface
        transition-shadow
        duration-300
        hover:shadow-md
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
          bg-paper
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

        {/* Price tag */}
        <span
          className="
            absolute
            bottom-0
            left-0
            rounded-tr-md
            bg-accent
            px-3
            py-1.5
            font-display
            text-sm
            font-semibold
            tabular-nums
            text-accent-ink
            sm:text-base
          "
        >
          ${product.price.toFixed(2)}
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
                text-ink
                sm:text-lg
              "
            >
              {product.name}
            </h2>
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
            border-border
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
              rounded-md
              text-ink-soft
              transition-all
              duration-200
              hover:bg-paper
              hover:text-ink
              focus:outline-none
              focus-visible:ring-2
              focus-visible:ring-ink
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
              rounded-md
              text-ink-soft
              transition-all
              duration-200
              hover:bg-accent-soft
              hover:text-accent-ink
              focus:outline-none
              focus-visible:ring-2
              focus-visible:ring-accent
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
              rounded-md
              text-ink-soft
              transition-all
              duration-200
              hover:bg-danger-soft
              hover:text-danger
              focus:outline-none
              focus-visible:ring-2
              focus-visible:ring-danger
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