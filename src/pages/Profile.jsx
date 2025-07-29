import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { Eye, EyeOff } from "lucide-react";

export default function Profile() {
  const { user, token } = useAuth();
  const { cart } = useCart();

  const [preview, setPreview] = useState(user?.avatar || null);
  const [imageFile, setImageFile] = useState(null);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const cloudName = "sauravkumar";
  const uploadPreset = "unsigned_ecommerce";

  const baseURL = "https://ecommerce-backend-vi8k.onrender.com";

  useEffect(() => {
    if (!token) return;
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/orders/mine`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
      } catch (err) {
        console.error("Order fetch failed:", err);
      }
    };
    fetchOrders();
  }, [token]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (newPassword && newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    try {
      let avatarURL = preview;

      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("upload_preset", uploadPreset);

        const uploadRes = await axios.post(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          formData
        );
        avatarURL = uploadRes.data.secure_url;
      }

      const res = await axios.put(
        `${baseURL}/api/auth/profile`,
        {
          avatar: avatarURL,
          oldPassword: oldPassword || undefined,
          newPassword: newPassword || undefined,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage(res.data.message || "Profile updated.");
      setError("");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setImageFile(null);
    } catch (err) {
      setError(err.response?.data?.error || "Profile update failed.");
      setMessage("");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-6">Your Profile 👤</h2>

      <form
        onSubmit={handleSubmit}
        className="grid md:grid-cols-2 gap-8 bg-white p-6 rounded-xl shadow"
      >
        {/* Profile Image */}
        <div className="text-center">
          <img
            src={preview || "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-32 h-32 rounded-full mx-auto object-cover border"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            id="avatar"
            className="hidden"
          />
          <label
            htmlFor="avatar"
            className="bg-indigo-600 text-white px-4 py-1 rounded hover:bg-indigo-700 cursor-pointer text-sm mt-4 inline-block"
          >
            Upload
          </label>
        </div>

        {/* Password Update */}
        <div className="space-y-4">
          {/* Old Password */}
          <div>
            <label className="font-medium">Old Password</label>
            <div className="relative">
              <input
                type={showOld ? "text" : "password"}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full mt-1 border rounded px-3 py-2 pr-10"
                placeholder="Current password"
              />
              <span
                onClick={() => setShowOld(!showOld)}
                className="absolute right-3 top-3 cursor-pointer text-gray-500"
              >
                {showOld ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="font-medium">New Password</label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full mt-1 border rounded px-3 py-2 pr-10"
                placeholder="New password"
              />
              <span
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-3 cursor-pointer text-gray-500"
              >
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="font-medium">Confirm New Password</label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full mt-1 border rounded px-3 py-2 pr-10"
                placeholder="Confirm new password"
              />
              <span
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-3 cursor-pointer text-gray-500"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>
          </div>

          {/* Messages */}
          {message && <p className="text-green-600">{message}</p>}
          {error && <p className="text-red-600">{error}</p>}

          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Update Profile
          </button>
        </div>
      </form>

      {/* Cart Items */}
      <div className="mt-12">
        <h3 className="text-2xl font-semibold mb-4">Your Cart Items 🛒</h3>
        {cart.length === 0 ? (
          <p className="text-gray-500">Your cart is empty.</p>
        ) : (
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center bg-white p-4 rounded shadow"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.images?.[0] || "/placeholder.png"}
                    alt={item.title}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-800">{item.title}</h4>
                    <p className="text-sm text-gray-500">Qty: {item.qty}</p>
                  </div>
                </div>
                <p className="font-bold text-indigo-600">₹{item.price}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Orders */}
      <div className="mt-12">
        <h3 className="text-2xl font-semibold mb-4">Your Orders 📦</h3>
        {orders.length === 0 ? (
          <p className="text-gray-500">No orders yet.</p>
        ) : (
          <ul className="space-y-4">
            {orders.map((order) => (
              <li key={order._id} className="bg-white p-4 rounded shadow">
                <p className="text-sm">
                  <strong>Status:</strong>{" "}
                  <span
                    className={
                      order.status === "Confirmed"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }
                  >
                    {order.status}
                  </span>
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Total:</strong> ₹{order.totalAmount}
                </p>
                <ul className="mt-2 text-sm">
                  {order.items.map((item, idx) => (
                    <li key={idx}>
                      {item.title} × {item.qty}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
