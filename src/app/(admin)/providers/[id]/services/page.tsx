"use client";

import React, { useEffect, useState, JSX } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Loader2,
  Trash2,
  Edit3,
  PlusCircle,
  ArrowLeft,
  Sparkles,
  Building2,
} from "lucide-react";
import Link from "next/link";

type Service = {
  _id: string;
  name: string;
  description?: string;
  price: number | string;
  duration?: number | string;
  images?: string[];
  createdAt?: string;
};

type Provider = {
  _id: string;
  name: string;
  description?: string;
  logo?: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ProviderServicesPage(): JSX.Element {
  const router = useRouter();
  const { id } = useParams();
  const [services, setServices] = useState<Service[]>([]);
  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchProvider();
      fetchServices();
    }
  }, [id]);

  async function fetchProvider() {
    try {
      const res = await fetch(`${API_BASE}/api/providers/${id}`);
      const data = await res.json();
      if (data.success) {
        setProvider(data.provider);
      }
    } catch (err) {
      console.error("Failed to fetch provider:", err);
    }
  }

  async function fetchServices() {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/cleaning?providerId=${id}`);
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

  async function deleteService(serviceId: string) {
    if (!confirm("Delete this service? This action cannot be undone.")) return;
    setProcessingId(serviceId);
    try {
      const res = await fetch(`${API_BASE}/api/cleaning/${serviceId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setServices((prev) => prev.filter((s) => s._id !== serviceId));
      } else {
        alert("Delete failed");
      }
    } catch (err) {
      console.error(err);
      alert("Network error");
    } finally {
      setProcessingId(null);
    }
  }

  function goToEdit(serviceId: string) {
    router.push(`/cleaning/${serviceId}/edit`);
  }

  const filtered = services.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.description || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="p-8 bg-gradient-to-b from-sky-50 via-white to-blue-100 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.push("/providers")}
          className="inline-flex items-center gap-2 text-sky-600 hover:underline mb-4"
        >
          <ArrowLeft size={18} />
          Back to Providers
        </button>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {provider?.logo && (
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow">
                <Image
                  src={provider.logo}
                  alt={provider.name}
                  width={64}
                  height={64}
                  className="object-cover"
                />
              </div>
            )}
            <div>
              <h1 className="text-3xl font-extrabold text-slate-800 flex items-center gap-3">
                <Building2 className="text-sky-600" />
                {provider?.name || "Provider"} Services
              </h1>
              {provider?.description && (
                <p className="text-slate-600 mt-2">{provider.description}</p>
              )}
            </div>
          </div>
          <Link
            href={`/cleaning/add?provider=${id}`}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-sky-500 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all"
          >
            <PlusCircle size={20} />
            Add Service
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-sky-400 outline-none"
          />
        </div>
      </div>

      {/* Services List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-sky-600" size={40} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow">
          <Sparkles className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-600 mb-4">No services found for this provider</p>
          <Link
            href={`/cleaning/add?provider=${id}`}
            className="inline-flex items-center gap-2 bg-sky-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-sky-700"
          >
            <PlusCircle size={20} />
            Add First Service
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filtered.map((service, i) => (
              <motion.div
                key={service._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
              >
                {service.images && service.images.length > 0 && service.images[0].includes('cloudinary.com') && (
                  <div className="relative h-48">
                    <Image
                      src={service.images[0]}
                      alt={service.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{service.name}</h3>
                  {service.description && (
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                      {service.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sky-600 font-bold text-lg">
                      ₹{service.price}
                    </div>
                    {service.duration && (
                      <div className="text-sm text-gray-500">
                        {service.duration} hrs
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 pt-4 border-t">
                    <button
                      onClick={() => goToEdit(service._id)}
                      className="flex-1 px-4 py-2 bg-sky-50 text-sky-600 rounded-lg font-medium hover:bg-sky-100 transition text-sm"
                    >
                      Edit
                    </button>
                    <button
                      title="Delete"
                      onClick={() => deleteService(service._id)}
                      disabled={processingId === service._id}
                      className="p-2 rounded-lg hover:bg-red-50 text-red-600 disabled:opacity-50"
                    >
                      {processingId === service._id ? (
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

