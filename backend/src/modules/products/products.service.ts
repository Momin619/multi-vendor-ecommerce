import { pool } from "../../database/pool.js";
import { AppError } from "../../utils/AppError.js";
import { ERROR_CODES } from "../../utils/errorCodes.js";

import {
  decodeCursor,
  encodeCursor,
} from "../../utils/cursor.js";

import {
  deleteCloudinaryImage,
} from "../../utils/cloudinary.js";

import type {
  Product,
  CreateProductInput,
  UpdateProductInput,
  PaginatedProducts,
  ProductCursor,
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
  image_public_id: string | null;
  created_at: Date;
  updated_at: Date;
}

/**
 * Converts a PostgreSQL product row
 * into the application's Product format.
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
    imagePublicId: row.image_public_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

/**
 * Create a product for the authenticated seller.
 */
export const createProduct = async (
  sellerId: string,
  input: CreateProductInput,
): Promise<Product> => {
console.log('data provided as argument from controller : ', input)

  const result = await pool.query<ProductRow>(
    `
      INSERT INTO products (
        seller_id,
        name,
        description,
        price,
        stock,
        category,
        image_url,
        image_public_id
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING
        id,
        seller_id,
        name,
        description,
        price,
        stock,
        category,
        image_url,
        image_public_id,
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
      input.imagePublicId ?? null,
    ],
  );

  const row = result.rows[0];

  if (!row) {
    throw new AppError(
      "Failed to create product",
      500,
      ERROR_CODES.INTERNAL_SERVER_ERROR,
    );
  }

  return mapProduct(row);
};

/**
 * Get all products.
 */
export const getProducts = async (
  sellerId: string,
  limit: number,
  cursor?: string,
): Promise<PaginatedProducts> => {
  let cursorData: ProductCursor | undefined;

  // Decode cursor only when the client provides one.
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

  /*
   * Fetch one extra item.
   *
   * Example:
   *
   * limit = 20
   *
   * Request 21 rows.
   *
   * If 21 rows are returned:
   *   → another page exists
   *   → return only 20
   *
   * If 20 or fewer are returned:
   *   → no next page
   */
  const queryLimit = limit + 1;

  let result;

  if (cursorData) {
    result = await pool.query<ProductRow>(
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
          image_public_id,
          created_at,
          updated_at
        FROM products
        WHERE seller_id = $1
          AND (created_at, id) <
              ($2::timestamptz, $3)
        ORDER BY created_at DESC, id DESC
        LIMIT $4
      `,
      [
        sellerId,
        cursorData.createdAt,
        cursorData.id,
        queryLimit,
      ],
    );
  } else {
    result = await pool.query<ProductRow>(
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
          image_public_id,
          created_at,
          updated_at
        FROM products
        WHERE seller_id = $1
        ORDER BY created_at DESC, id DESC
        LIMIT $2
      `,
      [
        sellerId,
        queryLimit,
      ],
    );
  }

  const hasMore = result.rows.length > limit;

  // Remove the extra row used to determine
  // whether another page exists.
  const rows = hasMore
    ? result.rows.slice(0, limit)
    : result.rows;

  const products = rows.map(mapProduct);

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
        image_public_id,
        created_at,
        updated_at
      FROM products
      WHERE id = $1
        AND seller_id = $2
    `,
    [
      productId,
      sellerId,
    ],
  );

  const row = result.rows[0];

  if (!row) {
    throw new AppError(
      "Product not found",
      404,
      ERROR_CODES.PRODUCT_NOT_FOUND,
    );
  }

  return mapProduct(row);
};

/**
 * Update a product.
 *
 * If a new image is uploaded:
 *
 * 1. New image is already uploaded to Cloudinary
 *    by the multer middleware.
 *
 * 2. Update database with the new URL and public ID.
 *
 * 3. Delete the old image from Cloudinary.
 *
 * If the database update fails:
 *
 * 4. Delete the NEW image to prevent an orphaned
 *    image in Cloudinary.
 */
export const updateProduct = async (
  productId: string,
  sellerId: string,
  input: UpdateProductInput,
): Promise<Product> => {
  // --------------------------------------------
  // 1. Make sure something was provided
  // --------------------------------------------

  if (Object.keys(input).length === 0) {
    throw new AppError(
      "At least one field is required to update the product",
      400,
      ERROR_CODES.INVALID_REQUEST,
    );
  }

  // --------------------------------------------
  // 2. Get the existing product
  // --------------------------------------------

  const existingResult = await pool.query<ProductRow>(
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
        image_public_id,
        created_at,
        updated_at
      FROM products
      WHERE id = $1
        AND seller_id = $2
    `,
    [
      productId,
      sellerId,
    ],
  );

  const existingProduct = existingResult.rows[0];

  if (!existingProduct) {
    throw new AppError(
      "Product not found",
      404,
      ERROR_CODES.PRODUCT_NOT_FOUND,
    );
  }

  // --------------------------------------------
  // 3. Check whether something actually changed
  // --------------------------------------------

  const hasChanges =
    (input.name !== undefined &&
      input.name !== existingProduct.name) ||

    (input.description !== undefined &&
      input.description !== existingProduct.description) ||

    (input.price !== undefined &&
      input.price !== Number(existingProduct.price)) ||

    (input.stock !== undefined &&
      input.stock !== existingProduct.stock) ||

    (input.category !== undefined &&
      input.category !== existingProduct.category) ||

    (input.imageUrl !== undefined &&
      input.imageUrl !== existingProduct.image_url);

  if (!hasChanges) {
    throw new AppError(
      "No changes were made to the product",
      400,
      ERROR_CODES.PRODUCT_NO_CHANGES,
    );
  }

  // --------------------------------------------
  // 4. Check whether a NEW image was uploaded
  // --------------------------------------------

  const isImageChanged =
    input.imageUrl !== undefined &&
    input.imagePublicId !== undefined;

  try {
    // ------------------------------------------
    // 5. Update PostgreSQL
    // ------------------------------------------

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
          image_public_id = COALESCE($7, image_public_id),
          updated_at = NOW()
        WHERE id = $8
          AND seller_id = $9
        RETURNING
          id,
          seller_id,
          name,
          description,
          price,
          stock,
          category,
          image_url,
          image_public_id,
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
        input.imagePublicId,
        productId,
        sellerId,
      ],
    );

    const row = result.rows[0];

    if (!row) {
      throw new AppError(
        "Product not found",
        404,
        ERROR_CODES.PRODUCT_NOT_FOUND,
      );
    }

    // ------------------------------------------
    // 6. Database update succeeded.
    //
    // Now delete the OLD image.
    // ------------------------------------------

    if (
      isImageChanged &&
      existingProduct.image_public_id
    ) {
      try {
        await deleteCloudinaryImage(
          existingProduct.image_public_id,
        );
      } catch (cloudinaryError) {
        // Database is already correct.
        // Cloudinary cleanup failed.
        //
        // Log it so it can be retried later.
        console.error(
          "Failed to delete old Cloudinary image:",
          cloudinaryError,
        );
      }
    }

    return mapProduct(row);
  } catch (error) {
    // ------------------------------------------
    // 7. Database update failed.
    //
    // The NEW image was already uploaded by
    // multer/cloudinary, so delete it.
    // ------------------------------------------

    if (
      isImageChanged &&
      input.imagePublicId
    ) {
      try {
        await deleteCloudinaryImage(
          input.imagePublicId,
        );
      } catch (cloudinaryError) {
        console.error(
          "Failed to delete newly uploaded Cloudinary image after update failure:",
          cloudinaryError,
        );
      }
    }

    throw error;
  }
};

/**
 * Delete a product.
 *
 * Also deletes its image from Cloudinary.
 */
export const deleteProduct = async (
  productId: string,
  sellerId: string,
): Promise<void> => {
  // --------------------------------------------
  // 1. Get the product first
  // --------------------------------------------

  const existingResult = await pool.query<ProductRow>(
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
        image_public_id,
        created_at,
        updated_at
      FROM products
      WHERE id = $1
        AND seller_id = $2
    `,
    [
      productId,
      sellerId,
    ],
  );

  const existingProduct = existingResult.rows[0];

  if (!existingProduct) {
    throw new AppError(
      "Product not found",
      404,
      ERROR_CODES.PRODUCT_NOT_FOUND,
    );
  }

  // --------------------------------------------
  // 2. Delete product from PostgreSQL
  // --------------------------------------------

  await pool.query(
    `
      DELETE FROM products
      WHERE id = $1
        AND seller_id = $2
    `,
    [
      productId,
      sellerId,
    ],
  );

  // --------------------------------------------
  // 3. Delete image from Cloudinary
  // --------------------------------------------

  if (existingProduct.image_public_id) {
    try {
      await deleteCloudinaryImage(
        existingProduct.image_public_id,
      );
    } catch (cloudinaryError) {
      // Product has already been deleted from DB.
      //
      // Don't make the API pretend that the product
      // deletion failed just because Cloudinary
      // cleanup failed.
      console.error(
        "Failed to delete product image from Cloudinary:",
        cloudinaryError,
      );
    }
  }
};