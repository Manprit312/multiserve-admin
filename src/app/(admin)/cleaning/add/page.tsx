"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Cloud, ImagePlus, XCircle, PlusCircle } from "lucide-react";
import Image from "next/image";
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function AddCleaningService() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
    category: "",
    active: true,
  });
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(files);
    setPreviews(files.map((file) => URL.createObjectURL(file)));
  };

  // remove selected image
  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.price || images.length === 0) {
      alert("Please fill all required fields and upload at least one image!");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) =>
      formData.append(key, value.toString())
    );
    images.forEach((img) => formData.append("images", img));

    try {
      const res = await fetch(`${API_BASE}/api/cleaning/add`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        alert("Service added successfully!");
        setForm({
          name: "",
          description: "",
          price: "",
          duration: "",
          category: "",
          active: true,
        });
        setImages([]);
        setPreviews([]);
      } else {
        alert("Error adding service!");
      }
    } catch (err) {
      console.error("Failed to add service:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-sky-50 via-white to-blue-100 overflow-hidden p-8">
      {/* Floating Background Icons */}
      <motion.div
        className="absolute top-10 left-16 text-sky-400 opacity-40"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
      >
        <Sparkles size={36} />
      </motion.div>
      <motion.div
        className="absolute bottom-16 right-16 text-blue-400 opacity-30"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
      >
        <Cloud size={56} />
      </motion.div>

      {/* Header */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl font-bold text-slate-800 mb-8 flex items-center gap-3"
      >
        🧹 Add Cleaning Service
      </motion.h1>

      {/* Form Card */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-xl rounded-2xl p-8 border border-sky-100  mx-auto relative"
      >
        <div className="grid md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="block text-slate-700 font-medium mb-2">
              Service Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Home Deep Cleaning"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-400 outline-none"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-slate-700 font-medium mb-2">
              Price (₹) *
            </label>
            <input
              type="number"
              placeholder="e.g. 999"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-400 outline-none"
            />
          </div>

          {/* Duration */}
          <div>
            <label className="block text-slate-700 font-medium mb-2">
              Duration (hours)
            </label>
            <input
              type="text"
              placeholder="e.g. 2 hours"
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-400 outline-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-slate-700 font-medium mb-2">
              Category
            </label>
            <input
              type="text"
              placeholder="e.g. Home, Office, Sofa"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-400 outline-none"
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-slate-700 font-medium mb-2">
              Description
            </label>
            <textarea
              placeholder="Describe the cleaning service..."
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-400 outline-none h-24"
            ></textarea>
          </div>

          {/* Upload Images */}
          <div className="md:col-span-2">
            <label className="block text-slate-700 font-medium mb-3">
              Upload Images *
            </label>
            <div className="border-2 border-dashed border-sky-200 rounded-xl p-6 bg-sky-50/30 hover:bg-sky-50 transition cursor-pointer">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center cursor-pointer"
              >
                <ImagePlus className="text-sky-400 mb-2" size={40} />
                <p className="text-sky-600 font-medium">
                  Click to upload or drag & drop
                </p>
              </label>
            </div>

            {/* Image Preview */}
            {previews.length > 0 && (
              <div className="flex flex-wrap gap-4 mt-4">
                {previews.map((src, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="relative w-32 h-24 rounded-lg overflow-hidden shadow-md group"
                  >
                    <Image
                    fill
                      src={src}
                      alt={`preview-${i}`}
                      className="object-cover w-full h-full"
                    />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 bg-white/80 p-1 rounded-full text-red-600 hover:text-red-800 transition opacity-80 group-hover:opacity-100"
                    >
                      <XCircle size={20} />
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="mt-8 flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            type="submit"
            disabled={loading}
            className={`flex items-center gap-2 px-8 py-3 rounded-full text-white font-semibold shadow-md transition-all duration-300 ${
              loading
                ? "bg-sky-300 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-sky-500 hover:shadow-lg"
            }`}
          >
            <PlusCircle size={18} />
            {loading ? "Adding..." : "Add Service"}
          </motion.button>
        </div>
      </motion.form>
    </main>
  );
}
