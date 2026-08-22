import { pool } from "../../database/pool.js";
import { AppError } from "../../utils/AppError.js";
import { ERROR_CODES } from "../../utils/errorCodes.js";

import type {
  Product,
  CreateProductInput,
  UpdateProductInput,
} from "./products.types.js";

interface ProductRow {
  id: string;
  seller_id: string;
  name: string;
  description: string | null;
  price: string;
  stock: number;
  category: string;
  image_url: string | null;
  created_at: Date;
  updated_at: Date;
}

/**
 * Converts a PostgreSQL product row into
 * the application's Product format.
 */
const mapProduct = (row: ProductRow): Product => {
  return {
    id: row.id,
    sellerId: row.seller_id,
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
 * Create a product for the authenticated seller.
 */
export const createProduct = async (
  sellerId: string,
  input: CreateProductInput
): Promise<Product> => {
  const result = await pool.query<ProductRow>(
    `
      INSERT INTO products (
        seller_id,
        name,
        description,
        price,
        stock,
        category,
        image_url
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING
        id,
        seller_id,
        name,
        description,
        price,
        stock,
        category,
        image_url,
        created_at,
        updated_at
    `,
    [
      sellerId,
      input.name,
      input.description ?? null,
      input.price,
      input.stock,
      input.category,
      input.imageUrl ?? null,
    ]
  );

  const row = result.rows[0];

  if (!row) {
    throw new AppError(
      "Failed to create product",
      500,
      ERROR_CODES.INTERNAL_SERVER_ERROR
    );
  }

  return mapProduct(row);
};

/**
 * Get all products.
 */
export const getProducts = async (
  sellerId: string,
): Promise<Product[]> => {
  const result = await pool.query<ProductRow>(
    `
      SELECT
        id,
        seller_id,
        name,
        description,
        price,
        stock,
        category,
        image_url,
        created_at,
        updated_at
      FROM products
      WHERE seller_id = $1
      ORDER BY created_at DESC
    `,
    [sellerId],
  );

  return result.rows.map(mapProduct);
};

/**
 * Get one product by ID.
 */
export const getProductById = async (
  productId: string,
  sellerId: string,
): Promise<Product> => {
  const result = await pool.query<ProductRow>(
    `
      SELECT
        id,
        seller_id,
        name,
        description,
        price,
        stock,
        category,
        image_url,
        created_at,
        updated_at
      FROM products
      WHERE id = $1
        AND seller_id = $2
    `,
    [productId, sellerId],
  );

  const row = result.rows[0];

  if (!row) {
    throw new AppError(
      "Product not found",
      404,
      ERROR_CODES.NOT_FOUND,
    );
  }

  return mapProduct(row);
};

/**
 * Update a product.
 *
 * The seller must own the product.
 */
export const updateProduct = async (
  productId: string,
  sellerId: string,
  input: UpdateProductInput
): Promise<Product> => {
  const result = await pool.query<ProductRow>(
    `
      UPDATE products
      SET
        name = COALESCE($1, name),
        description = COALESCE($2, description),
        price = COALESCE($3, price),
        stock = COALESCE($4, stock),
        category = COALESCE($5, category),
        image_url = COALESCE($6, image_url),
        updated_at = NOW()
      WHERE id = $7
        AND seller_id = $8
      RETURNING
        id,
        seller_id,
        name,
        description,
        price,
        stock,
        category,
        image_url,
        created_at,
        updated_at
    `,
    [
      input.name,
      input.description,
      input.price,
      input.stock,
      input.category,
      input.imageUrl,
      productId,
      sellerId,
    ]
  );

  const row = result.rows[0];

  if (!row) {
    throw new AppError(
      "Product not found or you do not have permission to modify this product",
      404,
      ERROR_CODES.NOT_FOUND
    );
  }

  return mapProduct(row);
};
/**
 * Delete a product.
 *
 * The seller must own the product.
 */
export const deleteProduct = async (
  productId: string,
  sellerId: string
): Promise<void> => {
  const result = await pool.query(
    `
      DELETE FROM products
      WHERE id = $1
        AND seller_id = $2
    `,
    [productId, sellerId]
  );

  if (result.rowCount === 0) {
    throw new AppError(
      "Product not found or you do not have permission to delete this product",
      404,
      ERROR_CODES.NOT_FOUND
    );
  }
};