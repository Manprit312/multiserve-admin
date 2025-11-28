"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Upload,
  X,
  Sparkles,
  Hotel,
  Loader2,
  ImageIcon,
} from "lucide-react";
interface HotelType {
  _id?: string;
  name: string;
  location: string;
  price: number;
  capacity: number;
  description: string;
  images: string[];
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function EditHotelPage() {
  const { id } = useParams();
  const router = useRouter();

  const [hotel, setHotel] = useState<HotelType | null>(null);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);


  // Fetch hotel details
  useEffect(() => {
    async function fetchHotel() {
      try {
        const res = await fetch(`${API_BASE}/api/hotels/${id}`);
        const data = await res.json();
        if (data.success) {
          setHotel(data.hotel);
          setPreviewImages(data.hotel.images || []);
        }
      } catch (err) {
        if (process.env.NODE_ENV === 'development') {
          console.error("Failed to fetch hotel:", err);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchHotel();
  }, [id]);

  // Handle input change
  const handleChange = (key: keyof HotelType, value: string | number) => {
    setHotel((prev) => (prev ? { ...prev, [key]: value } : prev));
  };
  // Handle new image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setNewImages([...newImages, ...files]);
    setPreviewImages([...previewImages, ...files.map((f) => URL.createObjectURL(f))]);
  };

  // Remove selected image (existing or new)
  const removeImage = (index: number) => {
    if (!hotel) return;

    const removedUrl = previewImages[index];
    setPreviewImages(previewImages.filter((_, i) => i !== index));

    // Filter newImages properly
    const newFilesFiltered = newImages.filter(
      (file) => URL.createObjectURL(file) !== removedUrl
    );
    setNewImages(newFilesFiltered);

    // Filter existing images
    setHotel({
      ...hotel,
      images: hotel.images.filter((img) => img !== removedUrl),
    });
  };


  // Submit update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData();
  if (!hotel) return;

(Object.entries(hotel) as [keyof HotelType, string | number | string[]][])
  .forEach(([key, val]) => {
    if (key !== "images") formData.append(key, String(val));
  });


    newImages.forEach((file) => formData.append("images", file));
    formData.append("existingImages", JSON.stringify(hotel.images));

    try {
      const res = await fetch(`${API_BASE}/api/hotels/${id}`, {
        method: "PUT",
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        alert("✅ Hotel updated successfully!");
        router.push("/hotel");
      } else {
        alert("❌ Update failed!");
      }
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error("Error updating:", err);
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center text-slate-600">
        <Loader2 className="animate-spin text-sky-500 mr-2" /> Loading hotel details...
      </div>
    );

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-blue-50 via-white to-sky-100 overflow-hidden p-8">
      {/* Floating Icons */}
      <motion.div
        className="absolute top-16 left-16 text-sky-300 opacity-60"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
      >
        <Sparkles size={32} />
      </motion.div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center gap-3 mb-10"
      >
        <Hotel size={28} className="text-sky-600" />
        <h1 className="text-3xl font-bold text-slate-800">Edit Hotel</h1>
      </motion.div>

      {/* Form */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-5xl mx-auto bg-white p-10 rounded-3xl shadow-lg border border-sky-100 space-y-8"
      >
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Hotel Name
            </label>
            <input
              type="text"
              value={hotel?.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-400 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Location
            </label>
            <input
              type="text"
              value={hotel?.location}
              onChange={(e) => handleChange("location", e.target.value)}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-400 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Price (per night)
            </label>
            <input
              type="number"
              value={hotel?.price}
              onChange={(e) => handleChange("price", e.target.value)}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-400 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Capacity
            </label>
            <input
              type="number"
              value={hotel?.capacity}
              onChange={(e) => handleChange("capacity", e.target.value)}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-400 outline-none"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Description
          </label>
          <textarea
            value={hotel?.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-400 outline-none"
            rows={4}
          ></textarea>
        </div>

        {/* Image Upload */}
        <div className="border border-sky-100 p-6 rounded-2xl bg-sky-50/50">
          <label className="flex items-center gap-2 text-sky-700 font-medium mb-4">
            <Upload size={18} /> Update Images
          </label>

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="mb-4 block w-full text-sm text-slate-700 file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-sky-600 file:text-white file:rounded-lg hover:file:bg-sky-700"
          />

          <div className="flex flex-wrap gap-4">
            {previewImages.length === 0 ? (
              <div className="flex flex-col items-center text-slate-400">
                <ImageIcon size={30} />
                <p>No images selected</p>
              </div>
            ) : (
              previewImages.map((img, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  <Image
                    src={img}
                    alt={`Preview ${i}`}
                    width={112}
                    height={112}
                    className="object-cover rounded-xl border shadow-sm"
                  />

                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                  >
                    <X size={14} />
                  </button>
                </motion.div>
              ))
            )}
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={saving}
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-sky-600 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl transition"
        >
          {saving ? "Saving Changes..." : "Update Hotel"}
        </motion.button>
      </motion.form>
    </main>
  );
}
