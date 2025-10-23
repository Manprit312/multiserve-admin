"use client";

import React, { useEffect, useState } from "react";
import {
  Inbox,
  Mail,
  User,
  Calendar,
  Cloud,
  Star,
  Circle,
} from "lucide-react";
interface Contact {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  message: string;
  createdAt: string;
}

export default function AdminInquiries() {
const [contacts, setContacts] = useState<Contact[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContacts() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contacts`);
        const data = await res.json();
        if (data.success) setContacts(data.contacts);
      } catch (err) {
        console.error("Error loading contacts:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchContacts();
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-blue-50 to-blue-100 py-10">
      {/* Floating Lucide icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {Array.from({ length: 15 }).map((_, i) => {
          const icons = [Cloud, Star, Circle];
          const Icon = icons[i % icons.length];
          const top = Math.random() * 100;
          const left = Math.random() * 100;
          const size = Math.floor(Math.random() * 24) + 14;
          const color = "#93c5fd"; // soft blue
          const duration = Math.random() * 6 + 6;
          const delay = Math.random() * 5;
          const rotate = Math.random() > 0.5;

          return (
            <Icon
              key={i}
              className="absolute opacity-20"
              style={{
                top: `${top}%`,
                left: `${left}%`,
                color,
                width: `${size}px`,
                height: `${size}px`,
                animation: `${rotate ? "float-rotate" : "float"} ${duration}s ease-in-out infinite`,
                animationDelay: `${delay}s`,
              }}
            />
          );
        })}
      </div>

      {/* Page Header */}
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-8">
          <Inbox className="text-blue-600 w-7 h-7" />
          <h1 className="text-3xl md:text-4xl font-extrabold text-blue-700">
            Contact Inquiries
          </h1>
        </div>

        {/* Data Table */}
        <div className="bg-white/70 backdrop-blur rounded-2xl shadow-lg overflow-hidden border border-blue-100">
          <table className="w-full table-auto">
            <thead className="bg-blue-100 text-blue-800 font-semibold">
              <tr>
                <th className="py-3 px-4 text-left w-[25%]">Name</th>
                <th className="py-3 px-4 text-left w-[25%]">Email</th>
                <th className="py-3 px-4 text-left w-[35%]">Message</th>
                <th className="py-3 px-4 text-left w-[15%]">Date</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-slate-500">
                    Loading inquiries...
                  </td>
                </tr>
              ) : contacts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-slate-500">
                    No inquiries yet 📨
                  </td>
                </tr>
              ) : (
                contacts.map((c) => (
                  <tr
                    key={c._id}
                    className="border-b border-blue-100 hover:bg-blue-50 transition"
                  >
                    <td className="py-4 px-4">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 text-blue-600 font-medium">
                          <User className="w-4 h-4" />
                          {c.firstName} {c.lastName}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-blue-500 mt-1">
                          <Mail className="w-4 h-4" />
                          {c.email}
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-sm text-slate-700 break-words">
                      {c.email}
                    </td>

                    <td className="py-4 px-4 text-sm text-slate-700 break-words">
                      {c.message}
                    </td>

                    <td className="py-4 px-4 text-sm text-slate-500 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-400" />
                        {new Date(c.createdAt).toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0px);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-25px);
            opacity: 0.6;
          }
          100% {
            transform: translateY(0px);
            opacity: 0.3;
          }
        }
        @keyframes float-rotate {
          0% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-25px) rotate(20deg);
          }
          100% {
            transform: translateY(0px) rotate(0deg);
          }
        }
      `}</style>
    </section>
  );
}
