"use client";

import { Line } from "react-chartjs-2";
import { useTheme } from "next-themes";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/admin/ui/tabs";
import {
  Card,
  CardContent,
} from "@/components/admin/ui/card";
import { Skeleton } from "@/components/admin/ui/skeleton";
import Typography from "@/components/admin/ui/typography";
import useGetMountStatus from "@/hooks/use-get-mount-status";

interface WeeklySalesProps {
  weeklySales: {
    date: string;
    label: string;
    dayOfWeek: string;
    sales: number;
    orders: number;
  }[];

  isLoading?: boolean;
}

export default function WeeklySales({
  weeklySales,
  isLoading,
}: WeeklySalesProps) {
  const { theme } = useTheme();
  const mounted = useGetMountStatus();

  const gridColor = `rgba(161, 161, 170, ${
    theme === "light" ? "0.5" : "0.3"
  })`;

  const labels = weeklySales.map((item) => item.label);

  const salesData = weeklySales.map((item) => item.sales);

  const ordersData = weeklySales.map((item) => item.orders);

  return (
    <Card>
      <Typography variant="h3" className="mb-4">
        Weekly Sales
      </Typography>

      <CardContent className="pb-2">
        <Tabs defaultValue="sales">
          <TabsList className="mb-6">
            <TabsTrigger
              value="sales"
              className="data-[state=active]:text-primary"
            >
              Sales
            </TabsTrigger>

            <TabsTrigger
              value="orders"
              className="data-[state=active]:text-orange-500"
            >
              Orders
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="sales"
            className="relative h-60"
          >
            {mounted && !isLoading ? (
              <Line
                data={{
                  labels,

                  datasets: [
                    {
                      label: "Sales",
                      data: salesData,
                      borderColor: "rgb(34, 197, 94)",
                      backgroundColor: "rgb(34, 197, 94)",
                    },
                  ],
                }}
                options={{
                  maintainAspectRatio: false,

                  scales: {
                    y: {
                      grid: {
                        color: gridColor,
                      },

                      border: {
                        color: gridColor,
                      },

                      ticks: {
                        callback: function (value) {
                          return "$" + value;
                        },

                        padding: 4,
                      },
                    },

                    x: {
                      grid: {
                        display: false,
                      },
                    },
                  },

                  plugins: {
                    legend: {
                      display: false,
                    },

                    tooltip: {
                      callbacks: {
                        label: (context) =>
                          `${context.dataset.label}: $${context.parsed.y}`,
                      },
                    },
                  },
                }}
              />
            ) : (
              <Skeleton className="size-full" />
            )}
          </TabsContent>

          <TabsContent
            value="orders"
            className="relative h-60"
          >
            {mounted && !isLoading ? (
              <Line
                data={{
                  labels,

                  datasets: [
                    {
                      label: "Orders",
                      data: ordersData,
                      borderColor: "rgb(249, 115, 22)",
                      backgroundColor: "rgb(249, 115, 22)",
                    },
                  ],
                }}
                options={{
                  maintainAspectRatio: false,

                  scales: {
                    y: {
                      grid: {
                        color: gridColor,
                      },

                      border: {
                        color: gridColor,
                      },

                      ticks: {
                        stepSize: 1,
                        padding: 4,
                      },

                      min: 0,
                    },

                    x: {
                      grid: {
                        display: false,
                      },
                    },
                  },

                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                }}
              />
            ) : (
              <Skeleton className="size-full" />
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}