// src/components/AdminRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute() {
  const { user } = useAuth();

  // While user state is being determined (e.g., from context or async), show a loader
  if (user === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user || !user.isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
