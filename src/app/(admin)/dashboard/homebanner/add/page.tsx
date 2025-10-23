"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, Upload, Plus, Trash2, X } from "lucide-react";
import Image from "next/image";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
interface BannerForm {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  gradientStart: string;
  gradientEnd: string;
}

export default function AddHomeBanner() {
  const router = useRouter();
const [form, setForm] = useState<BannerForm>({
  title: "",
  subtitle: "",
  buttonText: "",
  buttonLink: "",
  gradientStart: "#e0f2ff",
  gradientEnd: "#ffffff",
});

  const [metrics, setMetrics] = useState<{ label: string; value: string }[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  const addMetric = () => setMetrics([...metrics, { label: "", value: "" }]);
  const updateMetric = (i: number, key: string, val: string) =>
    setMetrics(metrics.map((m, idx) => (idx === i ? { ...m, [key]: val } : m)));
  const removeMetric = (i: number) => setMetrics(metrics.filter((_, idx) => idx !== i));

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const removeSelectedImage = () => {
    setImage(null);
    setPreview("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    fd.append("metrics", JSON.stringify(metrics));
    if (image) fd.append("image", image);

    await fetch(`${API_BASE}/api/home-banners`, { method: "POST", body: fd });
    alert("✅ Banner added successfully!");
    router.push("/dashboard/homebanner");
  };

  return (
    <section className="relative bg-gradient-to-b from-blue-50 to-sky-100 py-16">
      <motion.div
        className="absolute top-10 left-10 text-sky-300 opacity-30"
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
      >
        <Sparkles size={40} />
      </motion.div>

      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow border border-blue-100">
        <h1 className="text-2xl font-bold mb-6 text-slate-800">Add Home Banner</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {["title", "subtitle", "buttonText", "buttonLink"].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-slate-700 mb-1 capitalize">
                {field}
              </label>
              <input
                type="text"
                name={field}
             value={form[field as keyof BannerForm]}

                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-300 outline-none"
              />
            </div>
          ))}

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Banner Image
            </label>

            {!preview ? (
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full border border-dashed rounded-lg p-3 text-sm cursor-pointer hover:bg-sky-50"
              />
            ) : (
              <div className="relative w-full border rounded-lg overflow-hidden">
              <Image
  src={preview}
  alt="New banner preview"
  width={800}
  height={400}
  className="w-full rounded-lg object-cover"
/>

                <button
                  type="button"
                  onClick={removeSelectedImage}
                  className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full"
                  title="Remove image"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Metrics */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Metrics
            </label>
            <div className="space-y-3">
              {metrics.map((m, i) => (
                <div key={i} className="flex gap-3">
                  <input
                    placeholder="Label"
                    value={m.label}
                    onChange={(e) => updateMetric(i, "label", e.target.value)}
                    className="flex-1 border rounded-lg px-3 py-2"
                  />
                  <input
                    placeholder="Value"
                    value={m.value}
                    onChange={(e) => updateMetric(i, "value", e.target.value)}
                    className="flex-1 border rounded-lg px-3 py-2"
                  />
                  <button type="button" onClick={() => removeMetric(i)} className="text-red-600">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addMetric}
                className="flex items-center gap-2 text-sm text-blue-600 mt-2"
              >
                <Plus size={16} /> Add Metric
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-sky-500 text-white font-semibold px-5 py-2 rounded-full shadow hover:shadow-lg"
          >
            <Upload size={18} /> Add Banner
          </button>
        </form>
      </div>
    </section>
  );
}
