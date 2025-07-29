import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// ✅ Context Providers
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";

// ✅ Toast
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <App />
        <Toaster position="top-right" reverseOrder={false} /> {/* ✅ Toast */}
      </CartProvider>
    </AuthProvider>
  </StrictMode>
);
