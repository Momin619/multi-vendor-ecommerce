import { Router } from "express";

import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "./products.controller.js";

import {
  productSchema,
  updateProductSchema,
  productIdSchema
} from "./products.schema.js";

import {
  validate,
} from "../../middlewares/validate.middleware.js";

import {
  authenticate,
} from "../../middlewares/auth.middleware.js";

import {
  authorize,
} from "../../middlewares/authorize.middleware.js";

import { uploadProductImage } from "../../middlewares/upload.middleware.js"

const productsRouter = Router();

/**
 * Every product route requires authentication.
 */
productsRouter.use(authenticate);

/**
 * POST /api/products
 *
 * Seller only.
 */
productsRouter.post(
  "/",
  authorize("seller"),
  uploadProductImage,          // ← NEW: parses the file first
  validate(productSchema, "body"),
  createProduct,
);
/**
 * PUT /api/products/:id
 *
 * Seller only.
 *
 * Service additionally verifies ownership.
 */

productsRouter.put(
  "/:id",
  authorize("seller"),
  validate(productIdSchema, "params"),
  uploadProductImage,                       // ← must come before body validation
  validate(updateProductSchema, "body"),
  updateProduct,
);
/**
 * DELETE /api/products/:id
 *
 * Seller only.
 *
 * Service additionally verifies ownership.
 */
productsRouter.delete(
  "/:id",
  authorize("seller"),
   validate(productIdSchema, "params"),
  deleteProduct,
);

/**
 * GET /api/products
 *
 * Authenticated users.
 */
productsRouter.get(
  "/",
  authorize("seller"),
  getProducts,
);

/**
 * GET /api/products/:id
 *
 * Authenticated users.
 */
productsRouter.get(
  "/:id",
  authorize('seller'),
  validate(productIdSchema, "params"),
  getProductById,
);

export default productsRouter;