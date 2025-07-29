import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    address: "",
    phone: "",
    pin: "",
    city: "",
    state: "",
  });

  const handleChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    if (!token) {
      toast.error("Please login to place an order.");
      return navigate("/login");
    }

    if (cart.length === 0) {
      return toast.error("Cart is empty.");
    }

    const { name, address, phone, pin, city, state } = shippingInfo;
    if (!name || !address || !phone || !pin || !city || !state) {
      return toast.error("Please fill in all shipping details.");
    }

    setLoading(true);
    try {
      const { data } = await axios.post(
        "/api/orders",
        {
          items: cart.map((item) => ({
            id: item.id || item._id,
            title: item.title,
            image: item.images?.[0], // ✅ fixed image source
            price: item.price,
            qty: item.qty,
          })),
          totalAmount: total,
          shippingInfo,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Order placed successfully!");
      clearCart();
      navigate("/success");
    } catch (err) {
      console.error("Order error:", err);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 min-h-screen bg-gradient-to-br from-gray-50 to-indigo-100">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Checkout</h2>

      {/* Shipping Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded-lg shadow mb-8">
        {["name", "address", "phone", "pin", "city", "state"].map((field) => (
          <div key={field} className="flex flex-col">
            <label className="text-gray-700 font-medium capitalize">
              {field === "pin" ? "Pin Code" : field}
            </label>
            <input
              type="text"
              name={field}
              value={shippingInfo[field]}
              onChange={handleChange}
              className="border px-3 py-2 rounded focus:outline-none focus:ring focus:border-indigo-500"
              placeholder={`Enter ${field === "pin" ? "pin code" : field}`}
            />
          </div>
        ))}
      </div>

      {cart.length === 0 ? (
        <p className="text-center text-gray-600">Your cart is empty.</p>
      ) : (
        <div className="space-y-6">
          {cart.map((item) => (
            <div key={item._id || item.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
              <div className="flex items-center gap-4">
                <img
                  src={item.images?.[0] || "/placeholder.png"}
                  alt={item.title}
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <h4 className="font-semibold text-gray-800">{item.title}</h4>
                  <p className="text-sm text-gray-500">
                    ₹{item.price} × {item.qty}
                  </p>
                </div>
              </div>
              <p className="text-indigo-600 font-bold">₹{item.price * item.qty}</p>
            </div>
          ))}

          <div className="text-right mt-8">
            <p className="text-xl font-bold mb-4 text-gray-700">Total: ₹{total}</p>
            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? "Placing Order..." : "Place Order"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
