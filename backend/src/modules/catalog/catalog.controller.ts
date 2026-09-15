import type {
  Request,
  Response,
  NextFunction,
} from "express";

import {
  getCatalogProducts as getCatalogProductsService,
  getCatalogProductById as getCatalogProductByIdService,
} from "./catalog.service.js";

import { productsPaginationSchema } from "./catalog.schema.js";

import { sendSuccess } from "../../utils/response.js";

type CatalogProductParams = {
  id: string;
};

/**
 * GET /api/catalog
 */
export const getCatalogProducts = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { limit, cursor } =
      productsPaginationSchema.parse(req.query);

    const result = await getCatalogProductsService(
      limit,
      cursor,
    );

    sendSuccess(
      res,
      "Products retrieved successfully",
      result,
    );
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/catalog/:id
 */
export const getCatalogProductById = async (
  req: Request<CatalogProductParams>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const product = await getCatalogProductByIdService(
      req.params.id,
    );

    sendSuccess(
      res,
      "Product retrieved successfully",
      { product },
    );
  } catch (error) {
    next(error);
  }
};
