import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { FiShoppingCart } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";

export default function Navbar() {
  const { cart, clearCart } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname.startsWith("/admin")) return null;

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  const handleLogout = () => {
    logout();
    clearCart();
    navigate("/");
  };

  return (
    <motion.header
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-gradient-to-r from-indigo-600 to-purple-700 shadow-lg sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-extrabold tracking-tight text-white drop-shadow"
        >
          E-Commerce Store
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-6 text-white font-medium relative">
          <NavLink
            to="/products"
            className={({ isActive }) =>
              `hover:text-white/90 transition ${
                isActive ? "underline font-semibold" : ""
              }`
            }
          >
            Products
          </NavLink>

          {/* Cart */}
          <NavLink
            to="/cart"
            className="relative flex items-center gap-1 bg-white text-indigo-700 font-semibold px-4 py-2 rounded-full shadow hover:bg-indigo-100 transition"
          >
            <FiShoppingCart className="text-xl" />
            Cart
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-xs text-white w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </NavLink>

          {/* Avatar Dropdown */}
          <div className="relative group">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white cursor-pointer bg-white">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="User Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <FaUserCircle className="w-full h-full text-indigo-600" />
              )}
            </div>

            {/* Dropdown Menu */}
            <div className="absolute right-0 top-12 bg-white shadow-lg rounded w-40 p-2 space-y-2 opacity-0 group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 invisible">
              {!user ? (
                <>
                  <Link
                    to="/login"
                    className="block px-3 py-1 text-gray-800 hover:bg-indigo-50 hover:text-indigo-700 rounded transition"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="block px-3 py-1 text-gray-800 hover:bg-indigo-50 hover:text-indigo-700 rounded transition"
                  >
                    Signup
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/profile"
                    className="block px-3 py-1 text-gray-800 hover:bg-indigo-50 hover:text-indigo-700 rounded transition"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-1 text-red-600 hover:bg-red-50 rounded transition"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </nav>
      </div>
    </motion.header>
  );
}
