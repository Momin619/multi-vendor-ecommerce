import {
  Router,
} from "express";

import {
  customerDashboard,
  sellerDashboard,
} from "./dashboard.controller.js";

import {
  authenticate,
} from "../middlewares/auth.middleware.js";

import {
  authorize,
} from "../middlewares/authorize.middleware.js";

const router = Router();

/**
 * CUSTOMER DASHBOARD
 *
 * Request flow:
 *
 * GET /customer/dashboard
 *        ↓
 * authenticate
 *        ↓
 * authorize("customer")
 *        ↓
 * customerDashboard
 *
 * The user must:
 *
 * 1. Have a valid JWT.
 * 2. Have role = customer.
 */
router.get(
  "/customer/dashboard",
  authenticate,
  authorize("customer"),
  customerDashboard,
);

/**
 * SELLER DASHBOARD
 *
 * Request flow:
 *
 * GET /seller/dashboard
 *        ↓
 * authenticate
 *        ↓
 * authorize("seller")
 *        ↓
 * sellerDashboard
 *
 * The user must:
 *
 * 1. Have a valid JWT.
 * 2. Have role = seller.
 */
router.get(
  "/seller/dashboard",
  authenticate,
  authorize("seller"),
  sellerDashboard,
);

export default router;