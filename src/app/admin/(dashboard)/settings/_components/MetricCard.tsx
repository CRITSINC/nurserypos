"use client";

import { LucideIcon } from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/admin/ui/card";

import { Skeleton } from "@/components/admin/ui/skeleton";

interface MetricCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  loading?: boolean;
  danger?: boolean;
  subtitle?: string;
}

export default function MetricCard({
  title,
  value,
  icon: Icon,
  loading,
  danger,
  subtitle,
}: MetricCardProps) {
  const color = danger
    ? {
        border: "border-l-red-500",
        bg: "bg-red-100",
        text: "text-red-600",
      }
    : {
        border: "border-l-blue-500",
        bg: "bg-blue-100",
        text: "text-blue-600",
      };

  return (
    <Card className={`border-l-4 ${color.border}`}>
      <CardContent className="p-6">

        <div className="flex items-start justify-between">

          <div className="space-y-2">

            <p className="text-sm text-muted-foreground">
              {title}
            </p>

            {loading ? (
              <Skeleton className="h-10 w-20" />
            ) : (
              <h2
                className={`text-4xl font-bold ${
                  danger ? "text-red-600" : ""
                }`}
              >
                {value}
              </h2>
            )}

            <p className="text-xs text-muted-foreground">
              {subtitle}
            </p>

          </div>

          <div
            className={`rounded-full p-3 ${color.bg}`}
          >
            <Icon
              className={`h-6 w-6 ${color.text}`}
            />
          </div>

        </div>

      </CardContent>
    </Card>
  );
}