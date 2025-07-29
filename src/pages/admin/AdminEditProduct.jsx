// src/pages/admin/AdminEditProduct.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";

// ✅ API Base URL support
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export default function AdminEditProduct() {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    image: "",
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/products/${id}`);
        setFormData({
          title: data.title,
          description: data.description,
          price: data.price,
          category: data.category,
          image: data.images?.[0] || "",
        });
      } catch (err) {
        toast.error("Failed to fetch product");
      }
    };

    fetchProduct();
  }, [id]);

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
      setFormData({ ...formData, image: res.data.secure_url });
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
      await axios.put(
        `${BASE_URL}/products/${id}`,
        {
          ...formData,
          images: [formData.image], // ⬅️ fix image format for backend
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Product updated successfully");
      setTimeout(() => {
        navigate("/admin/products");
      }, 1500);
    } catch (err) {
      toast.error("Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-100 via-purple-50 to-white flex items-center justify-center overflow-hidden">
      <motion.div
        className="w-full max-w-xl mx-auto bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-indigo-100"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-extrabold mb-6 text-center text-indigo-700">
          Edit Product
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            name="title"
            type="text"
            placeholder="Product Title"
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <input
            name="price"
            type="number"
            placeholder="Price (₹)"
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={formData.price}
            onChange={handleChange}
            required
          />
          <input
            name="category"
            type="text"
            placeholder="Category"
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={formData.category}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            rows="4"
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={formData.description}
            onChange={handleChange}
            required
          />

          <div className="text-center">
            <input
              id="imageUpload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <label
              htmlFor="imageUpload"
              className="inline-block bg-indigo-100 text-indigo-700 font-medium px-5 py-2 rounded-xl cursor-pointer hover:bg-indigo-200 transition text-sm"
            >
              {uploading ? "Uploading..." : "Upload Image"}
            </label>
          </div>

          {formData.image && (
            <motion.img
              src={formData.image}
              alt="Preview"
              className="h-40 w-full object-cover rounded-xl shadow-md mt-2"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            />
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl hover:bg-indigo-700 transition"
          >
            {loading ? "Updating..." : "Update Product"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
