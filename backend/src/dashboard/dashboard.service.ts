/**
 * Dashboard service
 *
 * These functions are intentionally simple.
 *
 * Their purpose is only to verify that:
 *
 * 1. Authentication middleware works.
 * 2. Authorization middleware works.
 * 3. The authenticated user's information reaches the controller/service.
 *
 * These are NOT the final seller/customer dashboard services.
 */

export const getCustomerDashboard = async () => {
  return {
    role: "customer",
    message: "Customer protected API accessed successfully",
  };
};

export const getSellerDashboard = async () => {
  return {
    role: "seller",
    message: "Seller protected API accessed successfully",
  };
};