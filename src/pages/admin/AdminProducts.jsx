import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function AdminProducts() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get("/api/products");
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await axios.delete(`/api/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProducts((prev) => prev.filter((p) => p._id !== productId));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  if (loading)
    return (
      <div className="p-6 min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        Loading products...
      </div>
    );

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-indigo-800">🛒 All Products</h2>
        
      </div>

      {products.length === 0 ? (
        <p className="text-gray-600">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-2xl overflow-hidden bg-white/80 backdrop-blur shadow-md hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              {/* Image */}
              <div className="h-48 bg-gray-100 flex items-center justify-center">
                <img
                  src={product.images?.[0] || "https://via.placeholder.com/300x200?text=No+Image"}
                  alt={product.title}
                  className="max-h-full max-w-full object-contain p-2"
                />
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col gap-1 flex-grow">
                <h3 className="text-lg font-bold text-gray-800 truncate">{product.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
                <p className="text-sm text-gray-400">📦 {product.category}</p>
                <p className="text-lg font-semibold text-indigo-600 mt-1">₹{product.price}</p>

                {/* Actions */}
                <div className="mt-auto pt-4 flex justify-between text-sm font-medium">
                  <button
                    onClick={() => navigate(`/admin/products/edit/${product._id}`)}
                    className="text-indigo-600 hover:underline"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="text-red-500 hover:underline"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
