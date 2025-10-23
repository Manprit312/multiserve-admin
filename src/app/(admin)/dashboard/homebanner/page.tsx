"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Edit, Plus, Sparkles, Loader2 } from "lucide-react";
import Image from "next/image";
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type Banner = {
  _id: string;
  title: string;
  subtitle: string;
  image: string;
  buttonText?: string;
  buttonLink?: string;
  gradientStart?: string;
  gradientEnd?: string;
  metrics?: { label: string; value: string }[];
};

export default function HomeBannerPage() {
  const [banner, setBanner] = useState<Banner | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchBanner() {
      try {
        const res = await fetch(`${API_BASE}/api/home-banners`);
        const data = await res.json();
        if (data.success && data.banners.length > 0) {
          setBanner(data.banners[0]); // only one allowed
        } else {
          setBanner(null);
        }
      } catch (err) {
        console.error("Error loading banner:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchBanner();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-slate-600">
        <Loader2 className="animate-spin mr-2" /> Loading Banner...
      </div>
    );

  return (
    <section className="relative min-h-screen bg-gradient-to-b from-blue-50 to-sky-100 py-16 px-6">
      {/* Floating icon */}
      <motion.div
        className="absolute top-10 left-10 text-sky-300 opacity-30"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
      >
        <Sparkles size={40} />
      </motion.div>

      <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow border border-blue-100 relative z-10">
        {banner ? (
          <>
            {/* ✅ Banner Preview */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${
                  banner.gradientStart || "#e0f2ff"
                }, ${banner.gradientEnd || "#ffffff"})`,
              }}
            >
              <div className="p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1 text-center md:text-left">
                  <p className="text-sky-600 font-medium mb-2">Home Banner</p>
                  <h1 className="text-4xl font-extrabold text-slate-800 mb-4 leading-tight">
                    {banner.title}
                  </h1>
                  <p className="text-slate-600 mb-6">{banner.subtitle}</p>

                  {banner.buttonText && (
                    <a
                      href={banner.buttonLink || "#"}
                      className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full shadow hover:bg-blue-700"
                      target="_blank"
                    >
                      {banner.buttonText}
                    </a>
                  )}

                  {/* Metrics */}
                  {banner.metrics && banner.metrics.length > 0 && (
                    <div className="flex flex-wrap gap-4 mt-8">
                      {banner.metrics.map((m, i) => (
                        <div
                          key={i}
                          className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 shadow-sm"
                        >
                          <p className="text-sky-700 font-semibold">{m.value}</p>
                          <p className="text-xs text-slate-500">{m.label}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  {banner.image ? (
                    <Image
                      src={banner.image}
                      fill
                      alt="Banner"
                      className="rounded-2xl shadow-md border border-sky-100 w-full object-cover"
                    />
                  ) : (
                    <div className="h-48 bg-sky-50 border border-sky-200 rounded-xl flex items-center justify-center text-sky-400">
                      No image
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Edit Button */}
            <div className="flex justify-end mt-8">
              <button
                onClick={() =>
                  router.push(`/dashboard/homebanner/${banner._id}`)
                }
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-sky-500 text-white font-semibold px-5 py-2 rounded-full shadow hover:shadow-lg"
              >
                <Edit size={18} /> Edit Banner
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-16">
            <p className="text-slate-600 text-lg mb-6">
              No Home Banner created yet.
            </p>
            <button
              onClick={() => router.push("/dashboard/homebanner/add")}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-sky-500 text-white font-semibold px-5 py-3 rounded-full shadow hover:shadow-lg"
            >
              <Plus size={18} /> Create Home Banner
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
