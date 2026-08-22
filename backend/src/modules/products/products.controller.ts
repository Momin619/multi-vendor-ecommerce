import type {
  Request,
  Response,
  NextFunction,
} from "express";

import {
  createProduct as createProductService,
  getProducts as getProductsService,
  getProductById as getProductByIdService,
  updateProduct as updateProductService,
  deleteProduct as deleteProductService,
} from "./products.service.js";

import { sendSuccess } from "../../utils/response.js";

type ProductParams = {
  id: string;
};

/**
 * POST /api/products
 */
export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const product = await createProductService(
      req.user!.userId,
      req.body
    );

    sendSuccess(
      res,
      "Product created successfully",
      { product },
      201
    );
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/products
 */
export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const products = await getProductsService(
      req.user!.userId,
    );

    sendSuccess(
      res,
      "Products retrieved successfully",
      { products },
    );
  } catch (error) {
    next(error);
  }
};
/**
 * GET /api/products/:id
 */
export const getProductById = async (
  req: Request<ProductParams>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
  const product = await getProductByIdService(
  req.params.id,
  req.user!.userId,
);

    sendSuccess(
      res,
      "Product retrieved successfully",
      { product }
    );
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/products/:id
 */
export const updateProduct = async (
  req: Request<ProductParams>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const product = await updateProductService(
      req.params.id,
      req.user!.userId,
      req.body
    );

    sendSuccess(
      res,
      "Product updated successfully",
      { product }
    );
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/products/:id
 */
export const deleteProduct = async (
  req: Request<ProductParams>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await deleteProductService(
      req.params.id,
      req.user!.userId
    );

    sendSuccess(
      res,
      "Product deleted successfully",
      null
    );
  } catch (error) {
    next(error);
  }
};