"use client";

import React, { useEffect, useState, JSX } from "react";
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
  Users,
  Star,
  Building2,
} from "lucide-react";

type Provider = {
  _id: string;
  name: string;
  description?: string;
  email?: string;
  phone?: string;
  city?: string;
  rating?: number;
  totalReviews?: number;
  logo?: string;
  isActive?: boolean;
  specialties?: string[];
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ProvidersPage(): JSX.Element {
  const router = useRouter();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchProviders();
  }, []);

  async function fetchProviders() {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/providers`);
      const data = await res.json();
      if (data?.success && Array.isArray(data.providers)) {
        setProviders(data.providers);
      } else {
        setProviders([]);
      }
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error("Failed to fetch providers:", err);
      }
      setProviders([]);
    } finally {
      setLoading(false);
    }
  }

  async function deleteProvider(id: string) {
    if (!confirm("Delete this provider? This action cannot be undone.")) return;
    setProcessingId(id);
    try {
      const res = await fetch(`${API_BASE}/api/providers/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setProviders((prev) => prev.filter((p) => p._id !== id));
      } else {
        const err = await res.text();
        if (process.env.NODE_ENV === 'development') {
          console.error("Delete failed:", err);
        }
        alert("Delete failed");
      }
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error("Delete error:", err);
      }
      alert("Network error");
    } finally {
      setProcessingId(null);
    }
  }

  function goToEdit(id: string) {
    router.push(`/providers/${id}/edit`);
  }

  function goToServices(id: string) {
    router.push(`/providers/${id}/services`);
  }

  const filtered = providers.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.description || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.city || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="p-8 bg-gradient-to-b from-sky-50 via-white to-blue-100 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 flex items-center gap-3">
            <Building2 className="text-sky-600" />
            Service Providers
          </h1>
          <p className="text-slate-600 mt-2">Manage all service providers</p>
        </div>
        <Link
          href="/providers/add"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-sky-500 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all"
        >
          <PlusCircle size={20} />
          Add Provider
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search providers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-sky-400 outline-none"
          />
        </div>
      </div>

      {/* Providers Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-sky-600" size={40} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow">
          <Users className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-600">No providers found</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filtered.map((provider, i) => (
              <motion.div
                key={provider._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
              >
                {/* Provider Header */}
                <div className="p-6 bg-gradient-to-br from-sky-50 to-blue-50">
                  <div className="flex items-start justify-between mb-4">
                    {provider.logo ? (
                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow">
                        <Image
                          src={provider.logo}
                          alt={provider.name}
                          width={64}
                          height={64}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center text-white font-bold text-xl shadow">
                        {provider.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          provider.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {provider.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{provider.name}</h3>
                  {provider.description && (
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {provider.description}
                    </p>
                  )}
                  {provider.rating && (
                    <div className="flex items-center gap-2">
                      <Star className="text-yellow-400 fill-yellow-400" size={16} />
                      <span className="text-sm font-semibold">{provider.rating.toFixed(1)}</span>
                      {provider.totalReviews && (
                        <span className="text-xs text-gray-500">
                          ({provider.totalReviews} reviews)
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Provider Details */}
                <div className="p-6">
                  <div className="space-y-2 mb-4">
                    {provider.city && (
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Location:</span> {provider.city}
                      </div>
                    )}
                    {provider.phone && (
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Phone:</span> {provider.phone}
                      </div>
                    )}
                    {provider.specialties && provider.specialties.length > 0 && (
                      <div className="text-sm">
                        <span className="font-medium text-gray-700">Specialties:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {provider.specialties.slice(0, 3).map((spec, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-sky-100 text-sky-700 rounded text-xs"
                            >
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-4 border-t">
                    <button
                      onClick={() => goToServices(provider._id)}
                      className="flex-1 px-4 py-2 bg-sky-50 text-sky-600 rounded-lg font-medium hover:bg-sky-100 transition text-sm"
                    >
                      View Services
                    </button>
                    <button
                      title="Edit"
                      onClick={() => goToEdit(provider._id)}
                      className="p-2 rounded-lg hover:bg-sky-50 text-sky-600"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button
                      title="Delete"
                      onClick={() => deleteProvider(provider._id)}
                      disabled={processingId === provider._id}
                      className="p-2 rounded-lg hover:bg-red-50 text-red-600 disabled:opacity-50"
                    >
                      {processingId === provider._id ? (
                        <Loader2 className="animate-spin" size={18} />
                      ) : (
                        <Trash2 size={18} />
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </main>
  );
}

