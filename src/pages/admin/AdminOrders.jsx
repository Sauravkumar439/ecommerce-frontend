import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

export default function AdminOrders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  const [filterStatus, setFilterStatus] = useState("All");
  const [sortOrder, setSortOrder] = useState("Newest");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get("/api/admin/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(data);
      } catch (err) {
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [token]);

  const updateOrderStatus = async (orderId, status) => {
    setActionId(orderId);
    try {
      await axios.patch(`/api/orders/${orderId}/${status}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(`Order ${status}`);
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId
            ? { ...order, status: status === "confirm" ? "Confirmed" : "Rejected" }
            : order
        )
      );
    } catch (err) {
      toast.error(`Failed to ${status} order`);
    } finally {
      setActionId(null);
    }
  };

  const filteredOrders = orders
    .filter((order) => (filterStatus === "All" ? true : order.status === filterStatus))
    .sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === "Newest" ? dateB - dateA : dateA - dateB;
    });

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  const handlePageChange = (dir) => {
    if (dir === "prev" && currentPage > 1) setCurrentPage((p) => p - 1);
    if (dir === "next" && currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  if (loading) return <div className="p-6 text-lg font-semibold">Loading orders...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-50 p-6">
      {/* Filters */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h2 className="text-3xl font-bold text-indigo-800">🧾 All Orders</h2>
        <div className="flex gap-2 flex-wrap">
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="border px-3 py-2 rounded-lg text-sm shadow-sm"
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Rejected">Rejected</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border px-3 py-2 rounded-lg text-sm shadow-sm"
          >
            <option value="Newest">Newest First</option>
            <option value="Oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">
          😢 No orders match the selected filters.
        </div>
      ) : (
        <div className="space-y-6">
          {paginatedOrders.map((order) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="border rounded-2xl p-5 shadow-md bg-white/80 backdrop-blur"
            >
              <div className="flex justify-between flex-wrap gap-6">
                {/* Order Info */}
                <div className="text-sm space-y-1 text-gray-800">
                  <p><strong>🆔 Order ID:</strong> {order._id}</p>
                  <p><strong>👤 User:</strong> {order.user?.name} ({order.user?.email})</p>
                  <p><strong>💰 Total:</strong> ₹{order.totalAmount}</p>
                  <p>
                    <strong>📌 Status:</strong>{" "}
                    {order.status === "Confirmed" && (
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">Confirmed</span>
                    )}
                    {order.status === "Rejected" && (
                      <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs">Rejected</span>
                    )}
                    {order.status === "Pending" && (
                      <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs">Pending</span>
                    )}
                  </p>
                  <p><strong>🕒 Placed On:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                </div>

                {/* Action Buttons */}
                {order.status === "Pending" && (
                  <div className="flex gap-3 items-start">
                    <button
                      onClick={() => updateOrderStatus(order._id, "confirm")}
                      className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 disabled:opacity-50 transition-all"
                      disabled={actionId === order._id}
                    >
                      {actionId === order._id ? "Processing..." : "Confirm"}
                    </button>
                    <button
                      onClick={() => updateOrderStatus(order._id, "reject")}
                      className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 disabled:opacity-50 transition-all"
                      disabled={actionId === order._id}
                    >
                      {actionId === order._id ? "Processing..." : "Reject"}
                    </button>
                  </div>
                )}
              </div>

              {/* Shipping Info */}
              <div className="mt-4 text-sm text-gray-700">
                <p className="font-medium mb-1">🚚 Shipping Info:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong>Name:</strong> {order.shippingInfo?.name}</li>
                  <li><strong>Phone:</strong> {order.shippingInfo?.phone}</li>
                  <li><strong>Address:</strong> {order.shippingInfo?.address}, {order.shippingInfo?.city}, {order.shippingInfo?.state} - {order.shippingInfo?.pin}</li>
                </ul>
              </div>

              {/* Items */}
              <div className="mt-4 text-sm text-gray-700">
                <p className="font-medium mb-1">📦 Items:</p>
                <ul className="list-disc pl-6 space-y-1">
                  {order.items.map((item, idx) => (
                    <li key={idx}>
                      {item.title} × {item.qty} — ₹{item.price * item.qty}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-10">
          <button
            onClick={() => handlePageChange("prev")}
            className="px-4 py-2 border rounded-xl hover:bg-gray-100 disabled:opacity-50"
            disabled={currentPage === 1}
          >
            ← Prev
          </button>
          <span className="text-sm font-medium text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange("next")}
            className="px-4 py-2 border rounded-xl hover:bg-gray-100 disabled:opacity-50"
            disabled={currentPage === totalPages}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
