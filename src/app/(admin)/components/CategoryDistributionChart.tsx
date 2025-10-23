"use client";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function CategoryDistributionChart() {
  const series = [40, 25, 20, 15];
  const options: ApexOptions = {
    labels: ["Home Cleaning", "Sofa", "Laundry", "AC Service"],
    colors: ["#3b82f6", "#2563eb", "#60a5fa", "#93c5fd"],
    legend: { position: "bottom" },
  };

  return (
    <div className="rounded-2xl border border-sky-100 bg-white shadow-sm p-6 text-center">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        Service Category Distribution
      </h3>
      <ReactApexChart
        options={options}
        series={series}
        type="donut"
        height={260}
      />
    </div>
  );
}
