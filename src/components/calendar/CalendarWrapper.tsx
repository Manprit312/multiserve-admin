"use client";

import dynamic from "next/dynamic";
import React from "react";

// Dynamically import Calendar component with SSR disabled
const Calendar = dynamic(() => import("./Calendar"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-96">
      <div className="text-gray-500">Loading calendar...</div>
    </div>
  ),
});

export default function CalendarWrapper() {
  return <Calendar />;
}

