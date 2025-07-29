import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// ✅ Properly configured BASE_URL
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export default function AdminAddProduct() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    images: [],
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", "unsigned_ecommerce");

    try {
      setUploading(true);
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/sauravkumar/image/upload",
        form
      );
      setFormData({ ...formData, images: [res.data.secure_url] });
      toast.success("Image uploaded");
    } catch (err) {
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post(`${BASE_URL}/products`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Product added successfully!");
      navigate("/admin/products");
    } catch (err) {
      toast.error("Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto mt-6 bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl"
    >
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Add New Product
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          name="title"
          type="text"
          placeholder="Product Title"
          className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <input
          name="price"
          type="number"
          placeholder="Price (₹)"
          className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={formData.price}
          onChange={handleChange}
          required
        />

        <input
          name="category"
          type="text"
          placeholder="Category"
          className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={formData.category}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          rows="4"
          className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <div className="space-y-2">
          <label
            htmlFor="imageUpload"
            className="inline-block cursor-pointer bg-indigo-100 text-indigo-700 px-5 py-2 rounded-xl text-sm hover:bg-indigo-200 transition"
          >
            {uploading ? "Uploading..." : "Upload Image"}
          </label>
          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />

          {formData.images.length > 0 && (
            <img
              src={formData.images[0]}
              alt="Preview"
              className="h-48 w-full object-cover rounded-lg shadow"
            />
          )}
        </div>

        <motion.button
          type="submit"
          disabled={loading}
          whileTap={{ scale: 0.97 }}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Product"}
        </motion.button>
      </form>
    </motion.div>
  );
}
