"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  PlusCircle,
  Trash2,
  Edit3,
  Sparkles,
  Cloud,
  ImagePlus,
  Loader2,
  XCircle,
  Save,
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function AdminCleaningBanner() {
  const [banner, setBanner] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    image: null as File | null,
  });
  const [preview, setPreview] = useState<string | null>(null);

  // Fetch banner on load
  useEffect(() => {
    fetchBanner();
  }, []);

  const fetchBanner = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/cleaning-banners`);
      const data = await res.json();
      if (data.success && data.banners.length > 0) {
        setBanner(data.banners[0]);
      } else {
        setBanner(null);
      }
    } catch (err) {
      console.error("Failed to fetch banner:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setForm((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const removePreview = () => {
    setPreview(null);
    setForm((prev) => ({ ...prev, image: null }));
  };

  const saveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title && !banner) return alert("Title and image are required!");

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("subtitle", form.subtitle);
    if (form.image) formData.append("image", form.image);

    const url = banner
      ? `${API_BASE}/api/cleaning-banners/${banner._id}`
      : `${API_BASE}/api/cleaning-banners/add`;
    const method = banner ? "PUT" : "POST";

    try {
      await fetch(url, { method, body: formData });
      setEditing(false);
      setPreview(null);
      setForm({ title: "", subtitle: "", image: null });
      fetchBanner();
    } catch (err) {
      console.error("Failed to save banner:", err);
    }
  };

  const deleteBanner = async () => {
    if (!banner) return;
    if (!confirm("Are you sure you want to delete this banner?")) return;
    try {
      await fetch(`${API_BASE}/api/cleaning-banners/${banner._id}`, {
        method: "DELETE",
      });
      setBanner(null);
    } catch (err) {
      console.error("Failed to delete banner:", err);
    }
  };

  const startEdit = () => {
    setEditing(true);
    setForm({
      title: banner?.title || "",
      subtitle: banner?.subtitle || "",
      image: null,
    });
    setPreview(banner?.image || null);
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
        className="text-3xl font-bold text-slate-800 flex items-center gap-3 mb-8"
      >
        🧽 Cleaning Banner
      </motion.h1>

      {loading ? (
        <div className="flex justify-center items-center h-64 text-sky-500">
          <Loader2 className="animate-spin" size={36} />
        </div>
      ) : (
        <>
          {/* ✅ If banner exists and not editing → show banner */}
         {banner && !editing && (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className=" rounded-2xl    p-8 mx-auto text-center relative overflow-hidden"
  >
    {/* Floating Sparkles Animation */}
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 6, repeat: Infinity }}
      className="absolute top-3 right-10 text-sky-300"
    >
      <Sparkles size={24} />
    </motion.div>



    {/* Banner Content */}
    <h2 className="text-2xl font-semibold text-slate-800 mb-2">
      {banner.title}
    </h2>
    <p className="text-slate-500 mb-6">{banner.subtitle}</p>

    <div className="relative w-full h-104 rounded-xl overflow-hidden mb-6">
      <Image
        src={banner.image}
        alt={banner.title}
        fill
        className="object-contain"
      />
    </div>

    {/* Action Buttons */}
    <div className="flex justify-center gap-4">
      <motion.button
        whileHover={{ scale: 1.05 }}
        onClick={startEdit}
        className="px-5 py-2 bg-blue-600 text-white rounded-full font-semibold flex items-center gap-2 hover:bg-blue-700 transition"
      >
        <Edit3 size={18} /> Edit Banner
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        onClick={deleteBanner}
        className="px-5 py-2 bg-red-100 text-red-600 rounded-full font-semibold flex items-center gap-2 hover:bg-red-200 transition"
      >
        <Trash2 size={18} /> Delete
      </motion.button>
    </div>
  </motion.div>
)}

          {/* ✅ If no banner or editing → show form */}
          {(!banner || editing) && (
            <motion.form
              onSubmit={saveBanner}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl shadow-lg border border-sky-100 p-6 mx-auto mt-10 relative"
            >
              <h2 className="text-xl font-semibold mb-4 text-slate-700 flex items-center gap-2">
                <ImagePlus className="text-sky-600" />{" "}
                {banner ? "Edit Banner" : "Add New Banner"}
              </h2>
    {/* ❌ Cancel / Close Button */}
    <motion.button
      whileHover={{ scale: 1.1 }}
      onClick={() => setBanner(null)}
      className="absolute top-4 right-4 bg-white/90 hover:bg-red-50 border border-red-200 text-red-500 hover:text-red-700 p-2 rounded-full shadow-md transition"
      title="Close Preview"
    >
      <XCircle size={22} />
    </motion.button>
              <div className="grid md:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="Title"
                  className="border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-sky-400"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Subtitle"
                  className="border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-sky-400"
                  value={form.subtitle}
                  onChange={(e) =>
                    setForm({ ...form, subtitle: e.target.value })
                  }
                />

                {/* Image Upload */}
                <div className="flex flex-col gap-3">
                  <label className="font-medium text-slate-600">
                    Upload Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="border border-sky-200 rounded-lg p-2 cursor-pointer"
                  />

                  {/* Image Preview */}
                  {preview && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="relative w-64 h-36 rounded-lg overflow-hidden shadow group"
                    >
                      <Image
                        src={preview}
                        alt="Preview"
                        fill
                        className="object-contain  rounded-lg"
                      />
                      <motion.button
                        onClick={removePreview}
                        whileHover={{ scale: 1.1 }}
                        className="absolute top-2 right-2 bg-white/80 p-1 rounded-full text-red-600 hover:text-red-800 transition opacity-80 group-hover:opacity-100"
                      >
                        <XCircle size={22} />
                      </motion.button>
                    </motion.div>
                  )}
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-full font-semibold flex items-center gap-2 hover:scale-105 transition"
                >
                  {banner ? <Save size={18} /> : <PlusCircle size={18} />}
                  {banner ? "Save Changes" : "Add Banner"}
                </button>

                {banner && (
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-slate-700 rounded-full font-semibold transition"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </motion.form>
          )}
        </>
      )}
    </main>
  );
}
