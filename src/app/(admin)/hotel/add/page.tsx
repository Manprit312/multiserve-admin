"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Upload,
  X,
  Sparkles,
  Building2,
  MapPin,
  Home,
  Cloud,
} from "lucide-react";

export default function AddHotel() {
  const [hotel, setHotel] = useState({
    name: "",
    location: "",
    price: "",
    capacity: "2",
    outsideFoodAllowed: false,
    description: "",
    amenities: "",
  });
  const [images, setImages] = useState<File[]>([]);
  const [preview, setPreview] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages([...images, ...files]);
    setPreview([...preview, ...files.map((f) => URL.createObjectURL(f))]);
  };

  const removeImage = (i: number) => {
    setImages(images.filter((_, idx) => idx !== i));
    setPreview(preview.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    Object.entries(hotel).forEach(([key, val]) =>
      formData.append(key, String(val))
    );
    images.forEach((file) => formData.append("images", file));

    const res = await fetch("http://localhost:5000/api/hotels/add", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    setLoading(false);

    if (data.success) {
      alert("✅ Hotel added successfully!");
      setHotel({
        name: "",
        location: "",
        price: "",
        capacity: "2",
        outsideFoodAllowed: false,
        description: "",
        amenities: "",
      });
      setImages([]);
      setPreview([]);
    } else {
      alert("❌ Failed to add hotel!");
    }
  };

  return (
    <main className="relative overflow-hidden min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-100">
      {/* Animated background shapes */}
      <motion.div
        className="absolute top-20 left-10 text-sky-300 opacity-60"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <Sparkles size={36} />
      </motion.div>

      <motion.div
        className="absolute bottom-20 right-10 text-blue-400 opacity-40"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      >
        <Home size={40} />
      </motion.div>

      <motion.div
        className="absolute bottom-10 left-20 text-sky-200 opacity-50"
        animate={{ x: [0, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
      >
        <Cloud size={48} />
      </motion.div>

      {/* Main Form Container */}
      <motion.div
        className="relative mx-auto max-w-6xl bg-white shadow-lg rounded-3xl p-10 border border-blue-50"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex items-center justify-center gap-3 mb-8">
          <Building2 size={28} className="text-sky-600" />
          <h1 className="text-3xl font-bold text-sky-700 tracking-wide">
            Add New Hotel
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <input
              type="text"
              placeholder="Hotel Name"
              className="border border-gray-200 rounded-xl p-4 w-full focus:ring-2 focus:ring-sky-400 transition"
              value={hotel.name}
              onChange={(e) => setHotel({ ...hotel, name: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Location"
              className="border border-gray-200 rounded-xl p-4 w-full focus:ring-2 focus:ring-sky-400 transition"
              value={hotel.location}
              onChange={(e) => setHotel({ ...hotel, location: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Price (per night)"
              className="border border-gray-200 rounded-xl p-4 w-full focus:ring-2 focus:ring-sky-400 transition"
              value={hotel.price}
              onChange={(e) => setHotel({ ...hotel, price: e.target.value })}
              required
            />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <input
              type="number"
              placeholder="Capacity (people)"
              className="border border-gray-200 rounded-xl p-4 w-full focus:ring-2 focus:ring-sky-400 transition"
              value={hotel.capacity}
              onChange={(e) => setHotel({ ...hotel, capacity: e.target.value })}
              required
              min={1}
            />

            <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl">
              <input
                type="checkbox"
                checked={hotel.outsideFoodAllowed}
                onChange={(e) =>
                  setHotel({ ...hotel, outsideFoodAllowed: e.target.checked })
                }
                className="w-5 h-5 text-sky-500 accent-sky-500"
              />
              <label className="text-gray-700 text-sm font-medium">
                Outside food allowed
              </label>
            </div>
          </div>

          <textarea
            placeholder="Description"
            className="border border-gray-200 rounded-xl p-4 w-full focus:ring-2 focus:ring-sky-400 transition"
            rows={4}
            value={hotel.description}
            onChange={(e) => setHotel({ ...hotel, description: e.target.value })}
          />

          <input
            type="text"
            placeholder="Amenities (comma-separated)"
            className="border border-gray-200 rounded-xl p-4 w-full focus:ring-2 focus:ring-sky-400 transition"
            value={hotel.amenities}
            onChange={(e) =>
              setHotel({ ...hotel, amenities: e.target.value })
            }
          />

          {/* Image Upload */}
          <div className="border border-gray-200 rounded-xl p-6 bg-gradient-to-r from-sky-50 to-blue-50">
            <label className="font-medium flex items-center gap-2 mb-3 text-sky-700">
              <Upload size={18} /> Upload Images
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border p-2 rounded-lg bg-white"
            />
            <div className="mt-4 flex flex-wrap gap-4">
              {preview.map((img, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  <img
                    src={img}
                    alt="preview"
                    className="w-28 h-28 rounded-xl object-cover border"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                  >
                    <X size={14} />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-sky-600 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl transition-all"
          >
            {loading ? "Uploading..." : "Add Hotel"}
          </motion.button>
        </form>
      </motion.div>
    </main>
  );
}
