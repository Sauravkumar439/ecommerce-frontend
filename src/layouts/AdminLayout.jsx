import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Plus,
  LogOut,
} from "lucide-react";
import { motion } from "framer-motion";

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const navItems = [
    {
      to: "/admin/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="w-5 h-5 mr-2" />,
    },
    {
      to: "/admin/orders",
      label: "Orders",
      icon: <ShoppingCart className="w-5 h-5 mr-2" />,
    },
    {
      to: "/admin/products",
      label: "Products",
      icon: <Package className="w-5 h-5 mr-2" />,
    },
    {
      to: "/admin/products/add",
      label: "Add Product",
      icon: <Plus className="w-5 h-5 mr-2" />,
    },
  ];

  return (
    <div className="h-screen flex overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-indigo-700 to-purple-800 text-white flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="p-6 text-3xl font-extrabold text-center bg-indigo-800 shadow-md"
        >
          AdminZone
        </motion.div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center px-4 py-2 rounded-lg font-semibold tracking-wide transition-all group ${
                  isActive
                    ? "bg-white text-indigo-700 shadow-lg border-l-4 border-pink-500"
                    : "hover:bg-indigo-600 hover:text-white text-indigo-100"
                }`
              }
              end
            >
              <span className="transition-transform group-hover:scale-110">{icon}</span>
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center px-4 py-3 text-red-300 hover:text-white hover:bg-red-600 transition rounded-md m-4"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
