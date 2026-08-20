import type { Request, Response, NextFunction } from "express";
import { sendSuccess } from "../../utils/response.js";

export const getMyProducts = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // req.user was added by authenticate middleware
    sendSuccess(res, "Protected products request successful", {
      userId: req.user!.userId,
      message: "You are allowed to access this protected resource.",
    });
  } catch (error) {
    next(error);
  }
};