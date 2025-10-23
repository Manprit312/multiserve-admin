"use client";

import React, { useEffect, useState,JSX } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Loader2,
  Trash2,
  Edit3,
  PlusCircle,
  Sparkles,
  Cloud,
  ImageIcon,
} from "lucide-react";

type Service = {
  _id: string;
  name: string;
  description?: string;
  price: number | string;
  duration?: number; // hours
  images?: string[];
  active?: boolean;
  createdAt?: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function AdminServicesPage(): JSX.Element {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  async function fetchServices() {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/cleaning`);
      const data = await res.json();
      if (data?.success && Array.isArray(data.cleanings)) {
        setServices(data.cleanings);
      } else {
        setServices([]);
      }
    } catch (err) {
      console.error("Failed to fetch services:", err);
      setServices([]);
    } finally {
      setLoading(false);
    }
  }

  async function deleteService(id: string) {
    if (!confirm("Delete this service? This action cannot be undone.")) return;
    setProcessingId(id);
    try {
      const res = await fetch(`${API_BASE}/api/cleaning/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setServices((prev) => prev.filter((s) => s._id !== id));
      } else {
        const err = await res.text();
        console.error("Delete failed:", err);
        alert("Delete failed");
      }
    } catch (err) {
      console.error(err);
      alert("Network error");
    } finally {
      setProcessingId(null);
    }
  }

  function goToEdit(id: string) {
    // edit route: /admin/services/{id}/edit
    router.push(`/cleaning/${id}/edit`);
  }

  const filtered = services.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.description || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-blue-50 to-sky-100 p-8 overflow-hidden">
      {/* Floating decorative icons */}
      <motion.div
        className="absolute top-8 left-8 text-sky-300 opacity-40"
        animate={{ y: [0, -18, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
      >
        <Sparkles size={40} />
      </motion.div>

      <motion.div
        className="absolute bottom-12 right-12 text-blue-300 opacity-30"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
      >
        <Cloud size={64} />
      </motion.div>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl p-3 text-white shadow-lg">
            <ImageIcon size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800">All Services</h1>
            <p className="text-sm text-slate-500">Manage cleaning & services — add, edit or remove</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              aria-label="Search services"
              placeholder="Search services..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-full border border-sky-200 px-4 py-2 pr-10 w-72 shadow-sm focus:ring-2 focus:ring-sky-200 outline-none"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>

          <Link
            href="/cleaning/add"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-sky-500 text-white px-4 py-2 rounded-full shadow hover:scale-105 transition"
          >
            <PlusCircle size={16} /> Add Service
          </Link>
        </div>
      </div>

      {/* Content */}
      <section className="bg-white rounded-2xl shadow p-6 border border-sky-100">
        {/* If only one banner / single service scenario can be handled here, but we show table/list */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gradient-to-r from-sky-50 to-blue-50 text-slate-700 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Preview</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Duration (hrs)</th>
                <th className="px-4 py-3 text-left">Price</th>
                <th className="px-4 py-3 text-left hidden md:table-cell">Description</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              <AnimatePresence>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500">
                      <Loader2 className="inline animate-spin mr-2" /> Loading services...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500">
                      No services found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((s, i) => (
                    <motion.tr
                      key={s._id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.18 }}
                      className="hover:bg-sky-50/60"
                    >
                      <td className="px-4 py-4 text-slate-700">{i + 1}</td>

                      <td className="px-4 py-4">
                        <div className="w-24 h-14 rounded-lg overflow-hidden bg-gray-100 relative">
                          <Image
                            src={s.images?.[0] || "/default-service.jpg"}
                            alt={s.name}
                            fill
                            sizes="96px"
                            className="object-cover"
                          />
                        </div>
                      </td>

                      <td className="px-4 py-4 font-semibold text-slate-800">{s.name}</td>
                      <td className="px-4 py-4">{s.duration ?? "-"}</td>
                      <td className="px-4 py-4 text-sky-600 font-medium">₹{s.price}</td>

                      <td className="px-4 py-4 hidden md:table-cell text-slate-600">
                        <div className="line-clamp-2 max-w-xl">{s.description || "—"}</div>
                      </td>

                      <td className="px-4 py-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            title="Edit"
                            onClick={() => goToEdit(s._id)}
                            className="p-2 rounded-md hover:bg-sky-50 text-sky-600"
                          >
                            <Edit3 />
                          </button>

                          <button
                            title="Delete"
                            onClick={() => deleteService(s._id)}
                            disabled={processingId === s._id}
                            className="p-2 rounded-md hover:bg-red-50 text-red-600 disabled:opacity-50"
                          >
                            {processingId === s._id ? (
                              <Loader2 className="animate-spin" />
                            ) : (
                              <Trash2 />
                            )}
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </section>

      {/* Small footer note */}
      <div className="mt-6 text-sm text-slate-500 flex items-center gap-2">
        <Sparkles className="text-sky-400" />
       
      </div>
    </main>
  );
}
