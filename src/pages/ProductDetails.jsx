import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${id}`);
        setProduct(data);
      } catch (error) {
        toast.error("Failed to fetch product.");
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find((item) => item._id === product._id);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({ ...product, qty });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    toast.success("Added to cart");
  };

  if (!product) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto p-4 grid md:grid-cols-2 gap-10 items-center">
      <motion.img
        src={product.images?.[0]}
        alt={product.title}
        className="rounded-xl w-full h-[400px] object-cover shadow-md"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      />
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-3xl font-bold mb-4">{product.title}</h2>
        <p className="text-gray-700 mb-4">{product.description}</p>
        <p className="text-xl font-semibold text-indigo-600 mb-4">₹{product.price}</p>
        <div className="mb-4">
          <label className="mr-2 font-medium">Quantity:</label>
          <input
            type="number"
            min="1"
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
            className="w-16 px-2 py-1 border rounded-md"
          />
        </div>
        <button
          onClick={handleAddToCart}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg shadow transition duration-200"
        >
          Add to Cart
        </button>
      </motion.div>
    </div>
  );
}
