import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import DashboardRedirect from "./pages/DashboardRedirect";

import CustomerDashboard from "./pages/customer/CustomerDashboard";
import SellerDashboard from "./pages/seller/SellerDashboard";

import ProtectedRoute from "./routes/ProtectedRoute";
import RoleRoute from "./routes/RoleRoute";

/**
 * Application route configuration.
 *
 * Route structure:
 *
 * Public
 * ├── /login
 * └── /register
 *
 * Protected
 * ├── /dashboard
 * │
 * ├── /customer/*
 * │   └── customer-only pages
 * │
 * └── /seller/*
 *     └── seller-only pages
 *
 * Authentication is handled by ProtectedRoute.
 *
 * Role authorization is handled by RoleRoute.
 */
const App = () => {
  return (
    <Routes>
      {/* =====================================================
          PUBLIC AUTHENTICATION ROUTES
          ===================================================== */}

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      {/* =====================================================
          PROTECTED ROUTES
          ===================================================== */}

      {/*
        Everything inside this route requires
        authentication.

        ProtectedRoute checks:

        isLoading
            ↓
        isAuthenticated
            ↓
        allow / redirect
      */}
      <Route element={<ProtectedRoute />}>

        {/* ===================================================
            GENERAL DASHBOARD REDIRECT
            =================================================== */}

        {/*
          /dashboard doesn't belong to a specific role.

          DashboardRedirect checks the authenticated
          user's role and sends them to:

          seller    → /seller/dashboard
          customer  → /customer/dashboard
        */}
        <Route
          path="/dashboard"
          element={<DashboardRedirect />}
        />

        {/* ===================================================
            CUSTOMER ROUTES
            =================================================== */}

        {/*
          Everything nested here requires:

          user.role === "customer"
        */}
        <Route
          element={
            <RoleRoute allowedRole="customer" />
          }
        >
          <Route
            path="/customer/dashboard"
            element={<CustomerDashboard />}
          />

          {/*

          Future customer routes can be added here:

          <Route
            path="/customer/products"
            element={<CustomerProducts />}
          />

          <Route
            path="/customer/orders"
            element={<CustomerOrders />}
          />

          */}
        </Route>

        {/* ===================================================
            SELLER ROUTES
            =================================================== */}

        {/*
          Everything nested here requires:

          user.role === "seller"
        */}
        <Route
          element={
            <RoleRoute allowedRole="seller" />
          }
        >
          <Route
            path="/seller/dashboard"
            element={<SellerDashboard />}
          />

          {/*

          Future seller routes can be added here:

          <Route
            path="/seller/products"
            element={<SellerProducts />}
          />

          <Route
            path="/seller/orders"
            element={<SellerOrders />}
          />

          */}
        </Route>
      </Route>

      {/* =====================================================
          ROOT ROUTE
          ===================================================== */}

      {/*
        Send "/" to the general dashboard.

        Because /dashboard is protected, a logged-out
        user will eventually be redirected to /login.
      */}
      <Route
        path="/"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />

      {/* =====================================================
          UNKNOWN ROUTES
          ===================================================== */}

      {/*
        If the user enters an invalid URL such as:

        /something-that-does-not-exist

        send them to /dashboard.

        ProtectedRoute will then decide whether they
        are authenticated.
      */}
      <Route
        path="*"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />
    </Routes>
  );
};

export default App;