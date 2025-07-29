import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiMinus, FiTrash2 } from "react-icons/fi";
import { motion } from "framer-motion";

export default function Cart() {
  const { cart, removeFromCart, updateQty } = useCart();
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-16 px-4">
      <h2 className="text-4xl font-bold text-gray-800 text-center mb-12">
        Your Shopping Cart 🛒
      </h2>

      {cart.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">
          Your cart is currently empty.
        </p>
      ) : (
        <div className="max-w-5xl mx-auto space-y-6">
          {cart.map((item) => (
            <motion.div
              key={item._id}
              whileHover={{ scale: 1.01 }}
              className="flex items-center justify-between bg-white p-5 rounded-2xl shadow-md border border-gray-100"
            >
              {/* Product Info */}
              <div className="flex items-center gap-5">
                <img
                  src={item.images}
                  alt={item.title}
                  className="w-20 h-20 object-cover rounded-xl border"
                />
                <div>
                  <h4 className="text-lg font-semibold text-gray-800">
                    {item.title}
                  </h4>
                  <p className="text-gray-500 text-sm">₹{item.price}</p>
                </div>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => updateQty(item._id, item.qty - 1)}
                  disabled={item.qty === 1}
                  className="p-2 rounded-full border text-indigo-600 hover:bg-indigo-100 transition disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Decrease quantity"
                >
                  <FiMinus />
                </button>

                <input
                  type="text"
                  value={item.qty}
                  readOnly
                  className="w-10 text-center border rounded text-sm bg-gray-50"
                />

                <button
                  onClick={() => updateQty(item._id, item.qty + 1)}
                  className="p-2 rounded-full border text-indigo-600 hover:bg-indigo-100 transition"
                  title="Increase quantity"
                >
                  <FiPlus />
                </button>
              </div>

              {/* Delete Button */}
              <button
                onClick={() => removeFromCart(item._id)}
                className="text-red-500 hover:text-red-600 transition"
                title="Remove from cart"
              >
                <FiTrash2 className="text-xl" />
              </button>
            </motion.div>
          ))}

          {/* Total & Checkout */}
          <div className="text-right mt-10">
            <p className="text-2xl font-bold text-gray-700 mb-4">
              Total: ₹{total}
            </p>
            <button
              onClick={handleCheckout}
              className="bg-indigo-600 text-white px-8 py-3 rounded-full hover:bg-indigo-700 transition"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
