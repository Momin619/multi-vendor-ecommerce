import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import CustomerDashboard from "./pages/customer/CustomerDashboard";
import SellerDashboard from "./pages/seller/SellerDashboard";

import ProtectedRoute from "./routes/ProtectedRoute";
import RoleRoute from "./routes/RoleRoute";
import Navbar from "./components/ui/Navbar";
import NotFound from "./pages/NotFound";
import SellerProducts
  from "./pages/seller/SellerProducts";

import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

import CreateProduct
  from "./pages/seller/CreateProduct";

import EditProduct
  from "./pages/seller/EditProduct";
import ProductDetails from "./pages/seller/ProductsDetails";
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
<Route
  path="/forgot-password"
  element={<ForgotPassword />}
/>

<Route
  path="/reset-password"
  element={<ResetPassword />}
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

  {/* Customer routes */}
  <Route element={<RoleRoute allowedRole="customer" />}>
    <Route
      path="/dashboard/customer"
      element={<CustomerDashboard />}
    />
  </Route>

  {/* Seller routes */}
 <Route element={<RoleRoute allowedRole="seller" />}>
  <Route
    path="/dashboard/seller"
    element={<SellerDashboard />}
  />

  <Route
    path="/seller/products"
    element={<SellerProducts />}
  />

  <Route
    path="/seller/products/create"
    element={<CreateProduct />}
  />

  <Route
    path="/seller/products/:id"
    element={<ProductDetails />}
  />

  <Route
    path="/seller/products/:id/edit"
    element={<EditProduct />}
  />
</Route>

</Route>

      {/* =====================================================
          ROOT ROUTE
          ===================================================== */}

     

      {/* =====================================================
          UNKNOWN ROUTES
          ===================================================== */}

      <Route
        path="*"
        element={
          <NotFound/>
        }
        />
    </Routes>
        </>
  );
};

export default App;