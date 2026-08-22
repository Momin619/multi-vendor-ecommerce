import type { Request, Response, NextFunction } from "express";
import type { ZodType } from "zod";

export const validate = (
  schema: ZodType,
  source: "body" | "params" | "query",
) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      schema.parse(req[source]);
      next();
    } catch (error) {
      next(error);
    }
  };
};