import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

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

      const res = await axios.post("http://localhost:5000/api/auth/signup", {
        name,
        email,
        password,
        avatar: avatarURL,
      });

      const { token, user } = res.data;
      login(user, token);
      navigate("/profile");
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-indigo-600">
          Create Your Account
        </h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        {/* Avatar Upload */}
        <div className="flex flex-col items-center">
          {preview ? (
            <img
              src={preview}
              alt="Preview"
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

        {/* Input Fields */}
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
          required
        />

        <button
          type="submit"
          className="bg-indigo-600 text-white w-full py-2 rounded hover:bg-indigo-700 transition"
        >
          Sign Up
        </button>

        <p className="text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
