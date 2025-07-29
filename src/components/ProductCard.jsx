import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { FiShoppingCart } from "react-icons/fi";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <motion.div
      whileHover={{ scale: 1.04 }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
    >
      {/* Image wrapped in Link */}
      <Link to={`/product/${product._id}`}>
        <img
          src={product.images?.[0] || "/placeholder.jpg"}
          alt={product.title}
          className="w-full h-48 object-cover hover:opacity-90 transition"
        />
      </Link>

      <div className="p-5">
        {/* Title and Category */}
        <Link to={`/product/${product._id}`}>
          <h3 className="text-lg font-semibold text-gray-800 hover:underline">
            {product.title}
          </h3>
        </Link>
        <p className="text-sm text-gray-400 mb-2">{product.category}</p>

        {/* Price and Add to Cart */}
        <div className="flex justify-between items-center mt-4">
          <span className="text-indigo-600 font-bold text-xl">
            ₹{product.price}
          </span>
          <button
            onClick={() => addToCart(product)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-1.5 rounded hover:bg-indigo-700 transition text-sm font-medium"
            aria-label={`Add ${product.name} to cart`}
          >
            <FiShoppingCart className="text-lg" />
            Add
          </button>
        </div>
      </div>
    </motion.div>
  );
}
