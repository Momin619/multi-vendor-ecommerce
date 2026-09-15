import { pool } from "../../database/pool.js";
import { AppError } from "../../utils/AppError.js";
import { ERROR_CODES } from "../../utils/errorCodes.js";

import {
  decodeCursor,
  encodeCursor,
} from "../../utils/cursor.js";

import type {
  CatalogProduct,
  CatalogProductRow,
  PaginatedCatalogProducts,
} from "./catalog.types.js";

import type { ProductCursor } from "../../utils/cursor.js";

/**
 * Converts a joined products+users row into the
 * application's CatalogProduct format.
 */
const mapCatalogProduct = (
  row: CatalogProductRow,
): CatalogProduct => {
  return {
    id: row.id,
    sellerId: row.seller_id,
    sellerName: row.seller_name,
    name: row.name,
    description: row.description,
    price: Number(row.price),
    stock: row.stock,
    category: row.category,
    imageUrl: row.image_url,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

/**
 * Get products from ALL sellers, cursor-paginated.
 */
export const getCatalogProducts = async (
  limit: number,
  cursor?: string,
): Promise<PaginatedCatalogProducts> => {
  let cursorData: ProductCursor | undefined;

  if (cursor) {
    try {
      cursorData = decodeCursor(cursor);
    } catch {
      throw new AppError(
        "Invalid or malformed cursor",
        400,
        ERROR_CODES.INVALID_CURSOR,
      );
    }
  }

  const queryLimit = limit + 1;

  let result;

  if (cursorData) {
    result = await pool.query<CatalogProductRow>(
      `
        SELECT
          p.id,
          p.seller_id,
          u.name AS seller_name,
          p.name,
          p.description,
          p.price,
          p.stock,
          p.category,
          p.image_url,
          p.created_at,
          p.updated_at
        FROM products p
        JOIN users u ON u.id = p.seller_id
        WHERE (p.created_at, p.id) <
              ($1::timestamptz, $2)
        ORDER BY p.created_at DESC, p.id DESC
        LIMIT $3
      `,
      [
        cursorData.createdAt,
        cursorData.id,
        queryLimit,
      ],
    );
  } else {
    result = await pool.query<CatalogProductRow>(
      `
        SELECT
          p.id,
          p.seller_id,
          u.name AS seller_name,
          p.name,
          p.description,
          p.price,
          p.stock,
          p.category,
          p.image_url,
          p.created_at,
          p.updated_at
        FROM products p
        JOIN users u ON u.id = p.seller_id
        ORDER BY p.created_at DESC, p.id DESC
        LIMIT $1
      `,
      [queryLimit],
    );
  }

  const hasMore = result.rows.length > limit;

  const rows = hasMore
    ? result.rows.slice(0, limit)
    : result.rows;

  const products = rows.map(mapCatalogProduct);

  let nextCursor: string | null = null;

  if (hasMore) {
    const lastRow = rows[rows.length - 1];

    if (lastRow) {
      nextCursor = encodeCursor({
        createdAt: lastRow.created_at.toISOString(),
        id: lastRow.id,
      });
    }
  }

  return {
    data: products,
    pagination: {
      nextCursor,
      hasMore,
      limit,
    },
  };
};

/**
 * Get a single product by ID, from any seller.
 */
export const getCatalogProductById = async (
  productId: string,
): Promise<CatalogProduct> => {
  const result = await pool.query<CatalogProductRow>(
    `
      SELECT
        p.id,
        p.seller_id,
        u.name AS seller_name,
        p.name,
        p.description,
        p.price,
        p.stock,
        p.category,
        p.image_url,
        p.created_at,
        p.updated_at
      FROM products p
      JOIN users u ON u.id = p.seller_id
      WHERE p.id = $1
    `,
    [productId],
  );

  const row = result.rows[0];

  if (!row) {
    throw new AppError(
      "Product not found",
      404,
      ERROR_CODES.PRODUCT_NOT_FOUND,
    );
  }

  return mapCatalogProduct(row);
};
