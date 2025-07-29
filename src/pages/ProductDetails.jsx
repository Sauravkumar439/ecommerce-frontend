// src/pages/ProductDetails.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../axios";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // ✅ FIX: use relative path — NO /api prefix!
        const res = await axios.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Error fetching product:", err);
        toast.error("Product not found or network error.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh] text-xl">
        Loading Product...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center mt-10 text-red-500 text-lg">
        Product not found.
      </div>
    );
  }

  return (
    <motion.div
      className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold mb-4 text-indigo-600">
        {product.title}
      </h1>
      <img
        src={product.images?.[0]}
        alt={product.title}
        className="w-full max-h-[400px] object-contain rounded-lg mb-6"
      />
      <p className="text-gray-700 text-lg mb-2">{product.description}</p>
      <p className="text-2xl font-semibold text-green-600 mb-4">
        ₹{product.price}
      </p>
      <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg shadow">
        Add to Cart
      </button>
    </motion.div>
  );
}
