"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Pencil,
  Trash2,
  Hotel,
  Sparkles,
  Search,
  Loader2,
  Cloud,
  Image as ImageIcon,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
interface HotelType {
  _id: string;
  name: string;
  location: string;
  price: number;
  capacity?: number;
  description?: string;
  images?: string[];
}

export default function AdminHotels() {
const [hotels, setHotels] = useState<HotelType[]>([]);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/hotels`);
      const data = await res.json();
      if (data.success) setHotels(data.hotels);
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error("Failed to fetch hotels:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteHotel = async (id: string) => {
    if (!confirm("Are you sure you want to delete this hotel?")) return;
    try {
      await fetch(`${API_BASE}/api/hotels/${id}`, { method: "DELETE" });
      setHotels((prev) => prev.filter((h) => h._id !== id));
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error("Failed to delete:", err);
      }
    }
  };

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-sky-50 via-white to-blue-100 overflow-hidden p-8">
      {/* Floating Background Icons */}
      <motion.div
        className="absolute text-sky-400 opacity-40"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
      >
        <Sparkles size={36} />
      </motion.div>
      <motion.div
        className="absolute bottom-10 right-16 text-blue-400 opacity-40"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      >
        <Cloud size={48} />
      </motion.div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center gap-3 mb-10"
      >
        <Hotel size={28} className="text-sky-600" />
        <h1 className="text-3xl font-bold text-slate-800">All Hotels</h1>
      </motion.div>

      {/* Search Bar */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center border border-sky-200 bg-white rounded-full px-4 py-2 w-full max-w-md shadow-sm">
          <Search className="text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by name or location..."
            className="w-full px-3 py-1 bg-transparent outline-none text-slate-700"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl shadow-md bg-white border border-sky-100">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gradient-to-r from-sky-100 to-blue-100 text-slate-800 font-semibold uppercase text-xs">
            <tr>
              <th className="py-4 px-6">#</th>
              <th className="py-4 px-6">Image</th>
              <th className="py-4 px-6">Name</th>
              <th className="py-4 px-6">Location</th>
              <th className="py-4 px-6">Price</th>
              <th className="py-4 px-6">Capacity</th>
              <th className="py-4 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-500">
                    <Loader2 className="inline animate-spin mr-2 text-sky-500" />
                    Loading hotels...
                  </td>
                </tr>
              ) : hotels.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-500">
                    No hotels found.
                  </td>
                </tr>
              ) : (
                hotels
                  .filter(
                    (h) =>
                      h.name.toLowerCase().includes(search.toLowerCase()) ||
                      h.location.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((hotel, i) => (
                    <motion.tr
                      key={hotel._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="border-b border-sky-50 hover:bg-sky-50/40 transition"
                    >
                      <td className="py-4 px-6 text-slate-700">{i + 1}</td>

                      {/* Hotel Image */}
                      <td className="py-3 px-6">
                        <motion.div
                          whileHover={{ scale: 1.08 }}
                          className="w-16 h-16 rounded-lg overflow-hidden shadow-sm border border-sky-100 bg-sky-50 flex items-center justify-center"
                        >
                          {hotel.images?.[0] && typeof hotel.images[0] === 'string' && hotel.images[0].includes('cloudinary.com') ? (
                            <Image
                              src={hotel.images[0]}
                              alt={hotel.name}
                              width={80}
                              height={80}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <ImageIcon className="text-sky-300" size={22} />
                          )}
                        </motion.div>
                      </td>

                      <td className="py-4 px-6 font-semibold text-slate-800">
                        {hotel.name}
                      </td>

                      <td className="py-4 px-6 text-slate-700">
                        {hotel.location}
                      </td>

                      <td className="py-4 px-6 text-sky-600 font-semibold">
                        ${hotel.price}
                      </td>

                      <td className="py-4 px-6 text-slate-700">
                        {hotel.capacity || "-"}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 h-full">
                        <motion.button
                          whileHover={{ scale: 1.2 }}
                          onClick={() =>
                            router.push(`/hotel/${hotel._id}`)
                          }
                          className="text-sky-600 hover:text-sky-800 transition px-2"
                        >
                          <Pencil size={18} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.2 }}
                          onClick={() => deleteHotel(hotel._id)}
                          className="text-red-500 hover:text-red-700 transition"
                        >
                          <Trash2 size={18} />
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </main>
  );
}
