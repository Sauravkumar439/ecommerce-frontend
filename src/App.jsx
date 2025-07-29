import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import ProductDetails from "./pages/ProductDetails";
import Success from "./pages/Success";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Checkout from "./pages/Checkout"; // ✅ NEW

import MainLayout from "./layouts/MainLayout";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLayout from "./layouts/AdminLayout";
import AdminRoute from "./components/AdminRoute";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminAddProduct from "./pages/admin/AdminAddProduct";
import AdminEditProduct from "./pages/admin/AdminEditProduct"; // ✅ NEW

import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* 🧑 User Side (Main Layout) */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} /> {/* ✅ NEW */}
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/success" element={<Success />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* 🔐 Admin Login (Public) */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* 🔒 Protected Admin Routes */}
          <Route path="/admin" element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="products/add" element={<AdminAddProduct />} />
              <Route path="products/edit/:id" element={<AdminEditProduct />} />
            </Route>
          </Route>
        </Routes>
      </Router>

      {/* ✅ Global Toasts */}
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
}
