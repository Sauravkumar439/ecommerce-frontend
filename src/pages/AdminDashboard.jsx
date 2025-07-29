import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export default function AdminDashboard() {
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user === null) return;

    if (!user?.isAdmin) {
      navigate("/admin/login");
    } else {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [ordersRes, statsRes] = await Promise.all([
        axios.get(`${BASE_URL}/admin/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${BASE_URL}/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setOrders(ordersRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error("Error loading dashboard:", err);
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  const confirmOrder = async (orderId) => {
    try {
      await axios.patch(`${BASE_URL}/orders/${orderId}/confirm`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchData();
    } catch (err) {
      console.error("Failed to confirm order", err);
    }
  };

  if (loading) return <p className="text-center text-gray-500 mt-10 animate-pulse">Loading dashboard...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 py-10 px-4">
      <motion.div
        className="max-w-6xl mx-auto space-y-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-indigo-700 tracking-tight">Admin Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Users" value={stats.totalUsers} color="bg-blue-100 text-blue-900" />
          <StatCard title="Total Orders" value={stats.totalOrders} color="bg-green-100 text-green-900" />
          <StatCard title="Revenue" value={`₹${stats.totalRevenue}`} color="bg-yellow-100 text-yellow-900" />
          <StatCard title="Products" value={stats.totalProducts} color="bg-purple-100 text-purple-900" />
        </div>

        <motion.div
          className="bg-white bg-opacity-90 backdrop-blur-lg rounded-xl shadow-md p-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recent Orders</h2>

          {orders.length === 0 ? (
            <p className="text-gray-500">No orders found.</p>
          ) : (
            <div className="space-y-6">
              {orders.slice(0, 5).map((order) => (
                <motion.div
                  key={order._id}
                  className="border rounded-lg p-5 bg-white bg-opacity-80 backdrop-blur shadow hover:shadow-md transition"
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <p className="text-lg font-bold text-indigo-600">{order.user?.name}</p>
                      <p className="text-sm text-gray-500">{order.user?.email}</p>
                    </div>
                    <span className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</span>
                  </div>

                  <p className="text-gray-700 mb-1">Total: <strong>₹{order.totalAmount}</strong></p>
                  <p className="mb-2">
                    <strong>Status:</strong>
                    <span className={`ml-2 px-2 py-1 rounded-full text-white text-sm ${
                      order.status === "Pending" ? "bg-yellow-500" : order.status === "Confirmed" ? "bg-green-600" : "bg-red-600"
                    }`}>
                      {order.status}
                    </span>
                  </p>

                  <ul className="list-disc ml-5 text-sm text-gray-700 space-y-1">
                    {order.items.map((item, i) => (
                      <li key={i}>{item.title} × {item.qty}</li>
                    ))}
                  </ul>

                  {order.status === "Pending" && (
                    <button
                      onClick={() => confirmOrder(order._id)}
                      className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                    >
                      Confirm Order
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}

function StatCard({ title, value, color }) {
  return (
    <motion.div
      className={`rounded-xl p-5 shadow ${color}`}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </motion.div>
  );
}
