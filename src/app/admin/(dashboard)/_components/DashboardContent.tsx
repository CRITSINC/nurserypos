"use client";

import { useState } from "react";

import SalesOverview from "./SalesOverview";
import StatusOverview from "./StatusOverview";
import DashboardCharts from "./dashboard-charts";
import {
  DashboardSource,
  useGetDashboardQuery,
} from "@/redux/services/dashboardApi";

export default function DashboardContent() {
  const [source, setSource] = useState<DashboardSource>("all");

  const {
    data,
    isLoading,
    isError,
  } = useGetDashboardQuery(source);

  const dashboard = data?.data;

  return (
    <div className="space-y-6 mb-8">
      {/* Source Filter */}
      <div className="flex items-center gap-3">
        <label
          htmlFor="dashboard-source"
          className="text-sm font-medium text-foreground"
        >
          Source
        </label>

        <select
          id="dashboard-source"
          value={source}
          onChange={(e) =>
            setSource(e.target.value as DashboardSource)
          }
          className="h-10 w-[160px] rounded-md border border-input bg-background px-3 text-sm font-medium text-foreground shadow-sm outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">All</option>
          <option value="web">Web</option>
          <option value="pos">POS</option>
        </select>
      </div>

      {isError ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          Failed to load dashboard data.
        </div>
      ) : (
        <>
          <SalesOverview
            data={dashboard?.collections}
            isLoading={isLoading}
          />

          <StatusOverview
            data={dashboard?.orders}
            isLoading={isLoading}
          />

          <DashboardCharts
            weeklySales={dashboard?.weeklySales ?? []}
            topSellingProducts={
              dashboard?.topSellingProducts ?? []
            }
            isLoading={isLoading}
          />
        </>
      )}
    </div>
  );
}