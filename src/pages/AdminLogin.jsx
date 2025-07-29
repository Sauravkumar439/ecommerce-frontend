import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export default function AdminLogin() {
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.isAdmin) {
      navigate("/admin/dashboard");
    }
  }, [user, navigate]);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${BASE_URL}/auth/login`,
        { email, password },
        { withCredentials: true }
      );

      console.log("Login response:", res.data);

      const { user: loggedInUser, token } = res.data;

      if (!loggedInUser?.isAdmin) {
        setError("🚫 Access denied. You are not an admin.");
        login(null, null); // Clear any login state
        setLoading(false);
        return;
      }

      login(loggedInUser, token);
      navigate("/admin/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      const message = err?.response?.data?.error || "Login failed.";
      setError(`❌ ${message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-300 flex items-center justify-center px-4">
      <motion.form
        onSubmit={handleAdminLogin}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-sm bg-white/30 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/20"
      >
        <h2 className="text-3xl font-extrabold mb-6 text-center text-white drop-shadow-sm">
          🔐 Admin Login
        </h2>

        {error && (
          <div className="text-red-100 bg-red-500/80 px-4 py-2 mb-4 text-sm rounded-lg shadow text-center">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            className="w-full px-4 py-2 rounded-xl bg-white/80 border border-gray-300 shadow focus:ring-2 focus:ring-indigo-400 focus:outline-none placeholder:text-gray-500"
          />
          <input
            type="password"
            placeholder="Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            className="w-full px-4 py-2 rounded-xl bg-white/80 border border-gray-300 shadow focus:ring-2 focus:ring-indigo-400 focus:outline-none placeholder:text-gray-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full mt-6 py-2 rounded-xl font-semibold transition-all duration-200 ${
            loading
              ? "bg-indigo-300 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700 text-white"
          }`}
        >
          {loading ? "Logging in..." : "Login as Admin"}
        </button>
      </motion.form>
    </div>
  );
}
