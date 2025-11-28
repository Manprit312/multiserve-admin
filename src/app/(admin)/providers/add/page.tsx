"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Cloud, ImagePlus, XCircle, PlusCircle, Building2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function AddProvider() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    description: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    rating: "",
    specialties: "",
    isActive: true,
  });
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogo(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(files);
    setPreviews(files.map((file) => URL.createObjectURL(file)));
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name) {
      alert("Please fill all required fields!");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== "" && value !== null) {
        formData.append(key, value.toString());
      }
    });

    if (logo) {
      formData.append("logo", logo);
    }
    images.forEach((img) => formData.append("images", img));

    try {
      const res = await fetch(`${API_BASE}/api/providers/add`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        alert("Provider added successfully!");
        router.push("/providers");
      } else {
        alert("Error adding provider!");
      }
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error("Failed to add provider:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-sky-50 via-white to-blue-100 overflow-hidden p-8">
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

      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl font-bold text-slate-800 mb-8 flex items-center gap-3"
      >
        <Building2 className="text-sky-600" />
        Add Service Provider
      </motion.h1>

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-xl rounded-2xl p-8 border border-sky-100 mx-auto relative max-w-4xl"
      >
        <div className="grid md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-slate-700 font-medium mb-2">
              Provider Name *
            </label>
            <input
              type="text"
              placeholder="e.g. CleanPro Services"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-400 outline-none"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-slate-700 font-medium mb-2">
              Description
            </label>
            <textarea
              placeholder="Describe the provider..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-400 outline-none h-24"
            ></textarea>
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-2">Email</label>
            <input
              type="email"
              placeholder="info@provider.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-2">Phone</label>
            <input
              type="text"
              placeholder="+91 98765 43210"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-2">City</label>
            <input
              type="text"
              placeholder="Mumbai"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-2">State</label>
            <input
              type="text"
              placeholder="Maharashtra"
              value={form.state}
              onChange={(e) => setForm({ ...form, state: e.target.value })}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-2">Rating</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="5"
              placeholder="4.5"
              value={form.rating}
              onChange={(e) => setForm({ ...form, rating: e.target.value })}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-2">
              Specialties (comma-separated)
            </label>
            <input
              type="text"
              placeholder="Home Cleaning, Office Cleaning"
              value={form.specialties}
              onChange={(e) => setForm({ ...form, specialties: e.target.value })}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-2">Logo</label>
            <div className="border-2 border-dashed border-sky-200 rounded-xl p-6 bg-sky-50/30">
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="hidden"
                id="logo-upload"
              />
              <label
                htmlFor="logo-upload"
                className="flex flex-col items-center justify-center cursor-pointer"
              >
                <ImagePlus className="text-sky-400 mb-2" size={40} />
                <p className="text-sky-600 font-medium">Upload Logo</p>
              </label>
            </div>
            {logoPreview && (
              <div className="mt-4 relative w-32 h-32 rounded-full overflow-hidden border-2 border-sky-200">
                <Image
                  src={logoPreview}
                  alt="Logo preview"
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-2">Images</label>
            <div className="border-2 border-dashed border-sky-200 rounded-xl p-6 bg-sky-50/30">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
                id="images-upload"
              />
              <label
                htmlFor="images-upload"
                className="flex flex-col items-center justify-center cursor-pointer"
              >
                <ImagePlus className="text-sky-400 mb-2" size={40} />
                <p className="text-sky-600 font-medium">Upload Images</p>
              </label>
            </div>
            {previews.length > 0 && (
              <div className="flex flex-wrap gap-4 mt-4">
                {previews.map((src, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative w-32 h-24 rounded-lg overflow-hidden shadow-md group"
                  >
                    <Image
                      fill
                      src={src}
                      alt={`preview-${i}`}
                      className="object-cover"
                    />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 bg-white/80 p-1 rounded-full text-red-600"
                    >
                      <XCircle size={20} />
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50"
          >
            Cancel
          </button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            type="submit"
            disabled={loading}
            className={`flex items-center gap-2 px-8 py-3 rounded-full text-white font-semibold shadow-md transition-all ${
              loading
                ? "bg-sky-300 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-sky-500 hover:shadow-lg"
            }`}
          >
            <PlusCircle size={18} />
            {loading ? "Adding..." : "Add Provider"}
          </motion.button>
        </div>
      </motion.form>
    </main>
  );
}

