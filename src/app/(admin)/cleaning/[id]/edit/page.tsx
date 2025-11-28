"use client";

import React, { useState, useEffect, ChangeEvent, JSX } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Sparkles,
  ImageIcon,
  Loader2,
  Trash2,
  ArrowLeft,
  Save,
} from "lucide-react";
import Image from "next/image";

type CleaningService = {
  _id?: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  images: string[];
  provider?: string | { _id: string; name: string };
};

interface Provider {
  _id: string;
  name: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function EditCleaningServicePage(): JSX.Element {
  const router = useRouter();
  const { id } = useParams();
  const [service, setService] = useState<CleaningService>({
    name: "",
    description: "",
    price: 0,
    duration: 1,
    images: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loadingProviders, setLoadingProviders] = useState(true);

  // Fetch providers
  useEffect(() => {
    async function fetchProviders() {
      try {
        const res = await fetch(`${API_BASE}/api/providers?isActive=true`);
        const data = await res.json();
        if (data.success) {
          setProviders(data.providers);
        }
      } catch (err) {
        if (process.env.NODE_ENV === 'development') {
          console.error("Failed to fetch providers:", err);
        }
      } finally {
        setLoadingProviders(false);
      }
    }
    fetchProviders();
  }, []);

  // Fetch existing service
  useEffect(() => {
    async function fetchService() {
      try {
        const res = await fetch(`${API_BASE}/api/cleaning/${id}`);
        const data = await res.json();
        if (data.success && data.cleaning) {
          const cleaningData = data.cleaning;
          setService({
            ...cleaningData,
            provider: typeof cleaningData.provider === 'object' 
              ? cleaningData.provider._id 
              : cleaningData.provider || '',
          });
        }
      } catch (err) {
        if (process.env.NODE_ENV === 'development') {
          console.error("Error fetching service:", err);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchService();
  }, [id]);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setService((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "duration" ? Number(value) : value,
    }));
  };

  // Handle image upload preview
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles((prev) => [...prev, ...files]);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviews]);
  };

  // Remove unwanted existing image
  const removeImage = (url: string) => {
    setService((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img !== url),
    }));
  };

  // Remove unwanted selected image (preview)
  const removeSelectedImage = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append("name", service.name);
      formData.append("description", service.description);
      formData.append("price", String(service.price));
      formData.append("duration", String(service.duration));
      if (service.provider) {
        formData.append("provider", String(service.provider));
      }

      // ✅ Correct key names for backend
      formData.append("existingImages", JSON.stringify(service.images));
      selectedFiles.forEach((file) => formData.append("newImages", file));

      const res = await fetch(`${API_BASE}/api/cleaning/${id}`, {
        method: "PUT",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        alert("Service updated successfully ✅");
        router.push("/cleaning");
      } else {
        alert("Failed to update service ❌");
      }
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error("Save error:", err);
      }
      alert("Network error while saving");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-slate-500">
        <Loader2 className="animate-spin mr-2" /> Loading service...
      </div>
    );

  return (
    <section className="relative min-h-screen bg-gradient-to-b from-blue-50 to-sky-100 py-16 overflow-hidden">
      {/* Floating icons */}
      <motion.div
        className="absolute top-10 left-16 text-sky-300 opacity-30"
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
      >
        <Sparkles size={36} />
      </motion.div>

      <motion.div
        className="absolute bottom-10 right-16 text-blue-400 opacity-30"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      >
        <ImageIcon size={60} />
      </motion.div>

      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8 relative z-10 border border-blue-100">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-extrabold text-slate-800">
            ✨ Edit Cleaning Service
          </h1>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm text-sky-600 hover:underline"
          >
            <ArrowLeft size={16} /> Back
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Service Name
            </label>
            <input
              type="text"
              name="name"
              value={service.name}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-300 outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={service.description}
              onChange={handleChange}
              rows={4}
              required
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-300 outline-none"
            ></textarea>
          </div>

          {/* Price + Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Price (₹)
              </label>
              <input
                type="number"
                name="price"
                value={service.price}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-300 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Duration (hours)
              </label>
              <input
                type="number"
                name="duration"
                value={service.duration}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-300 outline-none"
              />
            </div>
          </div>

          {/* Provider Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Service Provider
            </label>
            {loadingProviders ? (
              <div className="w-full border rounded-lg px-4 py-2 bg-gray-50 text-gray-500">
                Loading providers...
              </div>
            ) : (
              <select
                name="provider"
                value={typeof service.provider === 'string' ? service.provider : ''}
                onChange={(e) => setService({ ...service, provider: e.target.value })}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-300 outline-none"
              >
                <option value="">Select a provider</option>
                {providers.map((provider) => (
                  <option key={provider._id} value={provider._id}>
                    {provider.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Existing Images */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Existing Images
            </label>
            {service.images.length === 0 ? (
              <p className="text-slate-500 text-sm">No images available.</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {service.images.map((url, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.03 }}
                    className="relative border rounded-lg overflow-hidden"
                  >
                    <Image
                      src={url}
                      alt="Service Image"
                      width={200}
                      height={150}
                      className="object-cover w-full h-32"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(url)}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 shadow hover:bg-red-700"
                      title="Remove image"
                    >
                      <Trash2 size={14} />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Upload New Images + Preview */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Add New Images
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="w-full text-sm border border-dashed border-sky-300 rounded-lg p-3 cursor-pointer hover:bg-sky-50"
            />
            {previewUrls.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                {previewUrls.map((url, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.03 }}
                    className="relative border rounded-lg overflow-hidden"
                  >
                    <Image
                      src={url}
                      alt={`Preview ${i + 1}`}
                      width={200}
                      height={150}
                      className="object-cover w-full h-32"
                    />
                    <button
                      type="button"
                      onClick={() => removeSelectedImage(i)}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 shadow hover:bg-red-700"
                      title="Remove image"
                    >
                      <Trash2 size={14} />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <motion.button
              whileHover={{ scale: 1.03 }}
              disabled={saving}
              type="submit"
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-sky-500 text-white font-semibold px-6 py-3 rounded-full shadow hover:shadow-lg disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2 className="animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save size={18} /> Update Service
                </>
              )}
            </motion.button>
          </div>
        </form>
      </div>
    </section>
  );
}