"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import WeeklySales from "./WeeklySales";
import BestSellers from "./BestSellers";

ChartJS.register(
  LinearScale,
  CategoryScale,
  PointElement,
  LineElement,
  ArcElement,
  Legend,
  Tooltip
);

interface DashboardChartsProps {
  weeklySales: {
    date: string;
    label: string;
    dayOfWeek: string;
    sales: number;
    orders: number;
  }[];

  topSellingProducts: {
    productId: number;
    name: string;
    sku: string | null;
    unitsSold: number;
    totalRevenue: number;
    percentage: number;
    imageUrl: string;
  }[];

  isLoading?: boolean;
}

export default function DashboardCharts({
  weeklySales,
  topSellingProducts,
  isLoading,
}: DashboardChartsProps) {
  ChartJS.defaults.font.family = "'Poppins', sans-serif";
  ChartJS.defaults.font.size = 12;
  ChartJS.defaults.font.weight = "normal";
  ChartJS.defaults.responsive = true;

  return (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <WeeklySales
      weeklySales={weeklySales}
      isLoading={isLoading}
    />

    <BestSellers
      products={topSellingProducts}
      isLoading={isLoading}
    />
  </div>
  );
}