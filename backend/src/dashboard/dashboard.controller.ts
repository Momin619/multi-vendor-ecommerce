import type {
  Request,
  Response,
  NextFunction,
} from "express";

import {
  sendSuccess,
} from "../utils/response.js";

import {
  getCustomerDashboard,
  getSellerDashboard,
} from "./dashboard.service.js";

/**
 * Customer dashboard controller.
 *
 * Authentication and authorization have already happened
 * before this controller is reached.
 */
export const customerDashboard = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = await getCustomerDashboard();

    sendSuccess(
      res,
      "Customer dashboard accessed successfully",
      result,
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Seller dashboard controller.
 */
export const sellerDashboard = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = await getSellerDashboard();

    sendSuccess(
      res,
      "Seller dashboard accessed successfully",
      result,
    );
  } catch (error) {
    next(error);
  }
};