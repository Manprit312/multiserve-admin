"use client";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function RevenueTarget() {
  const series = [72];
  const options: ApexOptions = {
    chart: { type: "radialBar", sparkline: { enabled: true } },
    plotOptions: {
      radialBar: {
        hollow: { size: "80%" },
        track: { background: "#E5E7EB" },
        dataLabels: {
          value: {
            fontSize: "32px",
            color: "#1E3A8A",
            formatter: (val) => `${val}%`,
          },
        },
      },
    },
    colors: ["#3b82f6"],
  };

  return (
    <div className="rounded-2xl border border-sky-100 bg-white shadow-sm p-6 text-center">
      <h3 className="text-lg font-semibold mb-2 text-gray-800">
        Revenue Target
      </h3>
      <ReactApexChart
        options={options}
        series={series}
        type="radialBar"
        height={270}
      />
      <p className="text-sm text-gray-500 mt-3">
        You’ve achieved 72% of your monthly target 🎉
      </p>
    </div>
  );
}
