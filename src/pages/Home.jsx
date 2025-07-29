import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

export default function Home() {
  return (
    <motion.section
      variants={container}
      initial="hidden"
      animate="show"
      className="relative min-h-screen bg-gradient-to-b from-indigo-100 via-white to-indigo-50 overflow-hidden flex flex-col items-center justify-center px-6 text-center"
    >
      {/* Background Blobs */}
      <div className="absolute top-[-6rem] left-[-6rem] w-[400px] h-[400px] bg-purple-300 rounded-full opacity-30 blur-3xl animate-pulse -z-10"></div>
      <div className="absolute bottom-[-6rem] right-[-6rem] w-[500px] h-[500px] bg-indigo-300 rounded-full opacity-20 blur-2xl animate-ping -z-10"></div>
      <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-pink-200 rounded-full opacity-10 blur-[100px] -translate-x-1/2 -translate-y-1/2 -z-10"></div>

      {/* Content */}
      <motion.h1
        variants={fadeUp}
        className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4 text-indigo-800 drop-shadow"
      >
        Discover Smarter Shopping 🛍️
      </motion.h1>

      <motion.p
        variants={fadeUp}
        className="text-lg sm:text-xl max-w-2xl mb-10 text-gray-700"
      >
        Explore a new world of personalized, AI-powered product recommendations tailored just for you.
      </motion.p>

      <motion.div variants={fadeUp}>
        <Link to="/products">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative bg-indigo-600 text-white font-semibold text-lg px-6 py-3 rounded-lg shadow-md hover:bg-indigo-700 transition-all flex items-center gap-2 overflow-hidden"
          >
            Explore Products <FiArrowRight className="mt-0.5" />
          </motion.button>
        </Link>
      </motion.div>
    </motion.section>
  );
}
