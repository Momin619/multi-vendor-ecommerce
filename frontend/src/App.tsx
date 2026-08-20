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
import Navbar from "./components/ui/Navbar";
import ProtectedTest from "./pages/ProtectedTest";

const App = () => {
  return (
    <>
      <Navbar />


    <Routes>
      {/* =====================================================
          PUBLIC ROUTES
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
          
          Everything inside this route requires authentication.
          ProtectedRoute checks:
          
          isLoading
          ↓
          isAuthenticated
          ↓
          allow / redirect to /login
          ===================================================== */}

      <Route element={<ProtectedRoute />}>

        {/* General dashboard */}

        <Route
          path="/dashboard"
          element={<DashboardRedirect />}
          />

        {/* =================================================
            PROTECTED TEST ROUTE
            
            This route exists specifically to test API
            requests when access + refresh tokens expire.
            ================================================= */}

        <Route
          path="/protected-test"
          element={<ProtectedTest />}
          />

        {/* =================================================
            CUSTOMER ROUTES
            ================================================= */}

        <Route element={<RoleRoute allowedRole="customer" />}>

          <Route
            path="/customer/dashboard"
            element={<CustomerDashboard />}
            />

          {/* Future customer routes */}

          {/*
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

        {/* =================================================
            SELLER ROUTES
            ================================================= */}

        <Route element={<RoleRoute allowedRole="seller" />}>

          <Route
            path="/seller/dashboard"
            element={<SellerDashboard />}
            />

          {/* Future seller routes */}

          {/*
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
        </>
  );
};

export default App;