"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";

import PageTitle from "@/components/admin/shared/PageTitle";

import { Button } from "@/components/admin/ui/button";
import { Switch } from "@/components/admin/ui/switch";

import DashboardCards from "./_components/DashboardCards";
import EntitySyncTable from "./_components/EntitySyncTable";
import QueueTable from "./_components/QueueTable";
import ManualActions from "./_components/ManualActions";
import { useAppDispatch } from "@/redux/hooks";
import { lightspeedApi } from "@/redux/services/lightspeed";

export default function PosSyncPage() {
  const [autoRefresh, setAutoRefresh] =
    useState(true);

  const [refreshInterval, setRefreshInterval] =
    useState(15000);

    const dispatch = useAppDispatch();

    const handleRefresh = () => {
      dispatch(
        lightspeedApi.util.invalidateTags([
          "LightspeedDashboard",
          "LightspeedQueue",
        ])
      );
    };
  return (
    <section className="space-y-6">

      <div className="flex items-center justify-between">

        <PageTitle>
          POS Sync Monitoring
        </PageTitle>

        <div className="flex items-center gap-4">

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRefresh}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>

          {/* <div className="flex items-center gap-2">

            <span className="text-sm">
              Auto Refresh
            </span>

            <Switch
              checked={autoRefresh}
              onCheckedChange={setAutoRefresh}
            />

          </div>

          <select
            className="h-9 rounded-md border px-3 text-sm"
            value={refreshInterval}
            onChange={(e) =>
              setRefreshInterval(
                Number(e.target.value)
              )
            }
            disabled={!autoRefresh}
          >
            <option value={5000}>
              5 sec
            </option>

            <option value={10000}>
              10 sec
            </option>

            <option value={15000}>
              15 sec
            </option>

            <option value={30000}>
              30 sec
            </option>

            <option value={60000}>
              60 sec
            </option>

          </select> */}

        </div>

      </div>

      <DashboardCards
        // pollingInterval={
        //   autoRefresh
        //     ? refreshInterval
        //     : 0
        // }
      />

      <EntitySyncTable
        // pollingInterval={
        //   autoRefresh
        //     ? refreshInterval
        //     : 0
        // }
      />

      <QueueTable
        // pollingInterval={
        //   autoRefresh
        //     ? refreshInterval
        //     : 0
        // }
      />

      <ManualActions />

    </section>
  );
}