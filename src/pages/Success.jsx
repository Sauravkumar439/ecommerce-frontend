import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

export default function Success() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-200 px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="bg-white rounded-2xl shadow-xl p-10 max-w-lg w-full text-center"
      >
        {/* ✅ Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 180, delay: 0.2 }}
          className="flex justify-center mb-6"
        >
          <CheckCircle className="text-green-500 w-16 h-16" />
        </motion.div>

        {/* ✅ Heading */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-3xl font-extrabold text-green-700 mb-3"
        >
          Order Confirmed!
        </motion.h1>

        {/* ✅ Subtext */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-gray-600 text-lg mb-6"
        >
          Your order has been placed successfully. We’ll notify you once it’s shipped.
        </motion.p>

        {/* ✅ CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Link
            to="/products"
            className="inline-block bg-green-600 text-white text-sm font-semibold px-6 py-3 rounded-full hover:bg-green-700 transition-all shadow-md"
          >
            Continue Shopping
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
