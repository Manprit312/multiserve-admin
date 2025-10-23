"use client";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function MonthlyBookingsChart() {
  const options: ApexOptions = {
    colors: ["#3b82f6"],
    chart: { type: "bar", toolbar: { show: false } },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "40%",
        borderRadius: 6,
      },
    },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
    },
    dataLabels: { enabled: false },
    grid: { borderColor: "#E5E7EB" },
    tooltip: {
      y: { formatter: (val) => `${val} bookings` },
    },
  };

  const series = [
    {
      name: "Bookings",
      data: [20, 45, 35, 60, 50, 80, 90, 120],
    },
  ];

  return (
    <div className="rounded-2xl border border-sky-100 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Monthly Bookings
      </h3>
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height={240}
      />
    </div>
  );
}
