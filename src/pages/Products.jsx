import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get("/api/products");
        console.log("Fetched products:", data);

        const productsArray = Array.isArray(data)
          ? data
          : Array.isArray(data.products)
          ? data.products
          : null;

        if (productsArray) {
          setProducts(productsArray);
        } else {
          toast.error("Unexpected product data format");
        }
      } catch (err) {
        toast.error("Failed to load products");
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="relative py-16 px-6 min-h-screen bg-gradient-to-br from-white via-indigo-50 to-purple-100 overflow-hidden">
      {/* Background Visuals */}
      <div className="absolute top-[-60px] right-[-40px] w-80 h-80 bg-purple-300 opacity-20 rounded-full blur-3xl z-0"></div>
      <div className="absolute bottom-[-80px] left-[-50px] w-96 h-96 bg-indigo-300 opacity-20 rounded-full blur-2xl z-0"></div>
      <div className="absolute top-[40%] left-[50%] w-40 h-40 bg-pink-200 opacity-30 rounded-full blur-2xl z-0 transform -translate-x-1/2 -translate-y-1/2"></div>

      {/* Heading */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative text-4xl font-extrabold text-center mb-12 text-indigo-700 z-10"
      >
        Explore Our Products
      </motion.h2>

      {/* Product Grid */}
      {loading ? (
        <div className="text-center text-gray-500 z-10">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="text-center text-gray-500 z-10">No products found.</div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="relative grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 max-w-6xl mx-auto z-10"
        >
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </motion.div>
      )}
    </section>
  );
}
