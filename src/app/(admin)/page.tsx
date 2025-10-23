"use client";
import React from "react";
import ServiceMetrics from "./components/ServiceMetrics";
import MonthlyBookingsChart from "./components/MonthlyBookingsChart";
import RevenueTarget from "./components/RevenueTarget";
import GrowthStatisticsChart from "./components/GrowthStatisticsChart";
import CategoryDistributionChart from "./components/CategoryDistributionChart";
import RecentBookings from "./components/RecentBookings";

export default function AdminDashboard() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6 mt-10">
      {/* Metrics Cards */}
      <div className="col-span-12 space-y-6 xl:col-span-7">
        <ServiceMetrics />
        <MonthlyBookingsChart />
      </div>

      {/* Target / Progress */}
      <div className="col-span-12 xl:col-span-5">
        <RevenueTarget />
      </div>

      {/* Growth chart */}
      <div className="col-span-12">
        <GrowthStatisticsChart />
      </div>

      {/* Category Split */}
      <div className="col-span-12 xl:col-span-5">
        <CategoryDistributionChart />
      </div>

      {/* Recent Bookings */}
      <div className="col-span-12 xl:col-span-7">
        <RecentBookings />
      </div>
    </div>
  );
}