import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${id}`);
        setProduct(data);
      } catch (err) {
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <div className="p-6 text-center text-lg">Loading...</div>;
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-lg">
        Product not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 py-20 px-6 md:px-10 relative overflow-hidden">
      {/* Decorative blurred circles */}
      <div className="absolute top-[-60px] right-[-60px] w-72 h-72 bg-indigo-300 opacity-20 rounded-full blur-3xl z-0"></div>
      <div className="absolute bottom-[-60px] left-[-60px] w-96 h-96 bg-purple-300 opacity-20 rounded-full blur-2xl z-0"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative max-w-7xl mx-auto bg-white rounded-3xl shadow-xl flex flex-col md:flex-row overflow-hidden z-10"
      >
        {/* Image Section */}
        <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-6 md:p-10">
          <img
            src={product.images}
            alt={product.title}
            className="w-full max-h-[500px] object-contain"
          />
        </div>

        {/* Product Details */}
        <div className="w-full md:w-1/2 px-6 md:px-10 py-8 flex flex-col justify-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">{product.title}</h2>
          <p className="text-gray-500 text-sm mb-1">Category: {product.category}</p>
          <p className="text-indigo-600 text-2xl font-semibold mb-6">₹{product.price}</p>
          <p className="text-gray-600 text-base leading-relaxed mb-8">{product.description}</p>

          <button
            onClick={() => addToCart(product)}
            className="bg-indigo-600 hover:bg-indigo-700 transition duration-300 text-white font-medium text-lg py-3 px-6 rounded-xl w-full md:w-fit"
          >
            Add to Cart
          </button>
        </div>
      </motion.div>
    </div>
  );
}
