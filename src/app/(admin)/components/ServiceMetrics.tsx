"use client";
import React from "react";
import Badge from "@/components/ui/badge/Badge";
import { Users, CalendarDays, Wallet, Layers } from "lucide-react";

export default function ServiceMetrics() {
  const metrics = [
    {
      title: "Total Services",
      value: 28,
      icon: <Layers className="text-sky-500 size-6" />,
      change: "+5%",
      color: "success",
    },
    {
      title: "Active Bookings",
      value: 142,
      icon: <CalendarDays className="text-blue-500 size-6" />,
      change: "+12%",
      color: "success",
    },
    {
      title: "Total Revenue",
      value: "₹89,320",
      icon: <Wallet className="text-indigo-500 size-6" />,
      change: "-3%",
      color: "error",
    },
    {
      title: "Customers",
      value: 980,
      icon: <Users className="text-purple-500 size-6" />,
      change: "+8%",
      color: "success",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
      {metrics.map((item, i) => (
        <div
          key={i}
          className="rounded-2xl border border-sky-100 bg-white p-6 shadow-sm hover:shadow-md transition"
        >
          <div className="flex items-center justify-center w-12 h-12 bg-sky-50 rounded-xl">
            {item.icon}
          </div>

          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500">{item.title}</span>
              <h4 className="mt-2 font-bold text-gray-800 text-xl">
                {item.value}
              </h4>
            </div>
            <Badge>{item.change}</Badge>
          </div>
        </div>
      ))}
    </div>
  );
}
