"use client";

import {
  Activity,
  Server,
  TriangleAlert,
  Gauge,
} from "lucide-react";

import {
  useDashboardQuery,
} from "@/redux/services/lightspeed";

import MetricCard from "./MetricCard";
import RateLimitProgress from "./RateLimitProgress";

interface DashboardCardsProps {
  pollingInterval?: number;
}

export default function DashboardCards({
  pollingInterval,
}: DashboardCardsProps) {
  const { data, isLoading } = useDashboardQuery(undefined, {
    pollingInterval,
    skipPollingIfUnfocused: true,
    refetchOnReconnect: true,
  });

  const dashboard = data?.data;

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

    <MetricCard
      title="Active Workers"
      value={dashboard?.activeWorkerCount ?? 0}
      icon={Server}
      subtitle="Workers processing jobs"
    />

    <MetricCard
      title="Pending Jobs"
      value={dashboard?.jobCounts.pending ?? 0}
      icon={Activity}
      subtitle="Waiting in queue"
    />

    <MetricCard
      title="Dead Letter Jobs"
      value={dashboard?.jobCounts.dead_letter ?? 0}
      icon={TriangleAlert}
      subtitle="Requires attention"
      danger={(dashboard?.jobCounts.dead_letter ?? 0) > 0}
    />

      <RateLimitProgress
        bucket={
          dashboard?.rateLimitBucket ??
          "0/90"
        }
        loading={isLoading}
      />

    </div>
  );
}