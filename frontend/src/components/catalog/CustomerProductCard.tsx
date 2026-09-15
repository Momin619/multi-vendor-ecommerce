import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";

import type { CatalogProduct } from "../../types/catalog.types";

interface CustomerProductCardProps {
  product: CatalogProduct;
}

const CustomerProductCard = ({
  product,
}: CustomerProductCardProps) => {
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
        to={`/customer/products/${product.id}`}
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
          src={product.imageUrl ?? undefined}
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
        <div className="space-y-1">
          <h2
            className="
              min-w-0
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

          <p className="truncate text-xs text-ink-soft sm:text-sm">
            Sold by {product.sellerName}
          </p>
        </div>

        {/* Actions */}
        <div
          className="
            mt-5
            flex
            items-center
            justify-between
            gap-2
            border-t
            border-border
            pt-4
          "
        >
          {/* Reserved for favorite/add-to-cart actions in later phases */}
          <span />

          <Link
            to={`/customer/products/${product.id}`}
            className="
              inline-flex
              items-center
              gap-1.5
              rounded-md
              bg-accent
              px-3
              py-2
              text-sm
              font-medium
              text-accent-ink
              transition
              hover:bg-accent-dark
              focus:outline-none
              focus-visible:ring-2
              focus-visible:ring-accent
              focus-visible:ring-offset-1
            "
          >
            View Details
            <FiArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default CustomerProductCard;
