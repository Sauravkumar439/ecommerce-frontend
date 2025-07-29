import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { motion } from "framer-motion";

// ✅ Automatically switch between local and Netlify/Render
const BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api"
    : "/api";

export default function Signup() {
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const cloudName = "sauravkumar";
  const uploadPreset = "unsigned_ecommerce";

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      let avatarURL = "";

      if (avatar) {
        const formData = new FormData();
        formData.append("file", avatar);
        formData.append("upload_preset", uploadPreset);

        const uploadRes = await axios.post(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          formData
        );
        avatarURL = uploadRes.data.secure_url;
      }

      const res = await axios.post(`${BASE_URL}/auth/signup`, {
        name,
        email,
        password,
        avatar: avatarURL,
      });

      const { token, user } = res.data;
      login(user, token);
      navigate("/profile");
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-100 via-white to-purple-100 px-4">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md space-y-6"
      >
        <h2 className="text-3xl font-extrabold text-center text-indigo-700">
          Create Your Account
        </h2>

        {error && (
          <p className="text-red-600 text-sm text-center">{error}</p>
        )}

        {/* Avatar Upload */}
        <div className="flex flex-col items-center">
          {preview ? (
            <img
              src={preview}
              alt="Avatar Preview"
              className="w-24 h-24 rounded-full object-cover mb-2 border-2 border-indigo-500"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mb-2">
              No Image
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            id="avatar"
            className="hidden"
          />
          <label
            htmlFor="avatar"
            className="bg-indigo-600 text-white px-4 py-1 rounded hover:bg-indigo-700 cursor-pointer text-sm"
          >
            Upload Image
          </label>
        </div>

        {/* Form Inputs */}
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />

        <motion.button
          type="submit"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="w-full py-2 text-lg rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md transition"
        >
          Sign Up
        </motion.button>

        <p className="text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 hover:underline">
            Login
          </Link>
        </p>
      </motion.form>
    </div>
  );
}
