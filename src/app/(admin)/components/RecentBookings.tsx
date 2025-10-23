"use client";
import React from "react";

export default function RecentBookings() {
  const data = [
    {
      customer: "Aman Verma",
      service: "Sofa Cleaning",
      date: "22 Oct 2025",
      price: "₹1200",
      status: "Completed",
    },
    {
      customer: "Ritika Sharma",
      service: "Laundry Service",
      date: "21 Oct 2025",
      price: "₹850",
      status: "In Progress",
    },
  ];

  return (
    <div className="rounded-2xl border border-sky-100 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Recent Bookings
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-sky-50 text-sky-700">
            <tr>
              <th className="text-left py-2 px-3">Customer</th>
              <th className="text-left py-2 px-3">Service</th>
              <th className="text-left py-2 px-3">Date</th>
              <th className="text-left py-2 px-3">Price</th>
              <th className="text-left py-2 px-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => (
              <tr key={i} className="border-b hover:bg-sky-50">
                <td className="py-2 px-3">{item.customer}</td>
                <td className="py-2 px-3">{item.service}</td>
                <td className="py-2 px-3">{item.date}</td>
                <td className="py-2 px-3">{item.price}</td>
                <td className="py-2 px-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      item.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
