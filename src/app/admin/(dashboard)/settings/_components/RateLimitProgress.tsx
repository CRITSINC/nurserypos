"use client";

import { Gauge } from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/admin/ui/card";
import { Skeleton } from "@/components/admin/ui/skeleton";

interface RateLimitProgressProps {
  bucket: string;
  loading?: boolean;
}

export default function RateLimitProgress({
  bucket,
  loading,
}: RateLimitProgressProps) {
  const [remaining = "0", total = "0"] = bucket.split("/");

  const remainingValue = Number(remaining);
  const totalValue = Number(total);

  const percent =
    totalValue > 0
      ? (remainingValue / totalValue) * 100
      : 0;

  return (
    <Card className="border-l-4 border-l-green-500">
      <CardContent className="p-6">

        <div className="flex items-start justify-between">

          <div className="space-y-2">

            <p className="text-sm text-muted-foreground">
              Rate Limit
            </p>

            {loading ? (
              <Skeleton className="h-10 w-28" />
            ) : (
              <h2 className="text-3xl font-bold">
                {remainingValue}
                <span className="ml-1 text-lg font-medium text-muted-foreground">
                  / {totalValue}
                </span>
              </h2>
            )}

            <p className="text-xs text-muted-foreground">
              API requests remaining
            </p>

          </div>

          <div className="rounded-full bg-green-100 p-3">
            <Gauge className="h-6 w-6 text-green-600" />
          </div>

        </div>

        <div className="mt-6">

          <div className="mb-2 flex items-center justify-between text-xs">

            <span className="text-muted-foreground">
              Capacity
            </span>

            <span className="font-medium text-green-600">
              {percent.toFixed(1)}%
            </span>

          </div>

          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">

            <div
              className={`h-full rounded-full transition-all duration-500 ${
                percent > 50
                  ? "bg-green-500"
                  : percent > 20
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
              style={{
                width: `${percent}%`,
              }}
            />

          </div>

        </div>

      </CardContent>
    </Card>
  );
}