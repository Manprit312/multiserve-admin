"use client";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function GrowthStatisticsChart() {
  const options: ApexOptions = {
    chart: { type: "area", toolbar: { show: false } },
    colors: ["#3b82f6", "#93c5fd"],
    stroke: { width: 2, curve: "smooth" },
    xaxis: { categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"] },
    grid: { borderColor: "#E5E7EB" },
    tooltip: { y: { formatter: (val) => `₹${val} revenue` } },
  };

  const series = [
    { name: "Revenue", data: [12000, 15000, 18000, 22000, 27000, 31000] },
    { name: "Bookings", data: [30, 45, 50, 65, 85, 90] },
  ];

  return (
    <div className="rounded-2xl border border-sky-100 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Growth Overview
      </h3>
      <ReactApexChart
        options={options}
        series={series}
        type="area"
        height={260}
      />
    </div>
  );
}
