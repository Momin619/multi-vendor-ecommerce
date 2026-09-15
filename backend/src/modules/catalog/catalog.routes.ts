import { Router } from "express";

import {
  getCatalogProducts,
  getCatalogProductById,
} from "./catalog.controller.js";

import { productIdSchema } from "./catalog.schema.js";

import { validate } from "../../middlewares/validate.middleware.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/authorize.middleware.js";

const catalogRouter = Router();

/**
 * Every catalog route requires authentication.
 */
catalogRouter.use(authenticate);

/**
 * GET /api/catalog
 *
 * Customer only. Lists products from ALL sellers.
 */
catalogRouter.get(
  "/",
  authorize("customer"),
  getCatalogProducts,
);

/**
 * GET /api/catalog/:id
 *
 * Customer only. No ownership scoping.
 */
catalogRouter.get(
  "/:id",
  authorize("customer"),
  validate(productIdSchema, "params"),
  getCatalogProductById,
);

export default catalogRouter;
