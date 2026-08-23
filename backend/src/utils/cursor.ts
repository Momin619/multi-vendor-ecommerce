import {productCursorSchema} from '../modules/products/products.schema.js'


export interface ProductCursor {
  createdAt: string;
  id: string;
}



/**
 * Encodes the last item's created_at and id into an opaque Base64 cursor.
 *
 * Example payload:
 * {
 *   "createdAt": "2026-08-23T10:30:00.000Z",
 *   "id": "some-product-id"
 * }
 *
 * The client does not need to understand these values.
 */
export const encodeCursor = (cursor: ProductCursor): string => {
  const payload = JSON.stringify(cursor);

  return Buffer.from(payload, "utf-8").toString("base64url");
};

/**
 * Decodes and validates the Base64 cursor sent by the client.
 */
export const decodeCursor = (cursor: string): ProductCursor => {
  const decoded = JSON.parse(
    Buffer.from(cursor, "base64url").toString("utf8"),
  );

  return productCursorSchema.parse(decoded);
};