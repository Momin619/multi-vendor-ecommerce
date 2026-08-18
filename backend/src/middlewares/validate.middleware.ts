import type {
  Request,
  Response,
  NextFunction,
} from "express";

import type { ZodType } from "zod";

/**
 * Creates middleware that validates req.body using a Zod schema.
 */
export const validateBody = (
  schema: ZodType,
) => {
  return (
    req: Request,
    _res: Response,
    next: NextFunction,
  ): void => {
    /**
     * If validation fails, Zod throws an error.
     *
     * The global error middleware will handle it.
     */
    req.body = schema.parse(req.body);

    next();
  };
};