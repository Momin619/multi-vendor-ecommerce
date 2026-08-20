import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { getMyProducts } from "./products.controller.js";

const productRouter = Router();

productRouter.get(
  "/my-products",
  authenticate,
  getMyProducts,
);

export default productRouter;