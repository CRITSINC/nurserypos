"use client";

import { Pie } from "react-chartjs-2";
import { useTheme } from "next-themes";

import {
  Card,
  CardContent,
} from "@/components/admin/ui/card";
import { Skeleton } from "@/components/admin/ui/skeleton";
import Typography from "@/components/admin/ui/typography";
import useGetMountStatus from "@/hooks/use-get-mount-status";

interface BestSellersProps {
  products: {
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

const getShortProductName = (name: string) => {
  const maxLength = 32;

  if (name.length <= maxLength) {
    return name;
  }

  return `${name.substring(0, maxLength).trim()}...`;
};

export default function BestSellers({
  products,
  isLoading,
}: BestSellersProps) {
  const mounted = useGetMountStatus();
  const { theme } = useTheme();

  const labels = products.map((product) =>
    getShortProductName(product.name)
  );

  const unitsSold = products.map(
    (product) => product.unitsSold
  );

  return (
    <Card>
      <Typography variant="h3" className="mb-4">
        Best Selling Products
      </Typography>

      <CardContent className="pb-2">
        <div className="relative h-[18.625rem]">
          {mounted && !isLoading ? (
            products.length > 0 ? (
              <Pie
                data={{
                  labels,

                  datasets: [
                    {
                      label: "Units Sold",
                      data: unitsSold,

                      backgroundColor: [
                        "rgb(34, 197, 94)",
                        "rgb(59, 130, 246)",
                        "rgb(249, 115, 22)",
                        "rgb(99, 102, 241)",
                        "rgb(234, 179, 8)",
                      ],

                      borderColor:
                        theme === "light"
                          ? "rgb(255,255,255)"
                          : "rgb(23,23,23)",

                      borderWidth: 2,
                    },
                  ],
                }}
                options={{
                  maintainAspectRatio: false,

                  plugins: {
                    legend: {
                      position: "top",
                      labels: {
                        boxWidth: 36,
                        boxHeight: 12,
                        padding: 6,
                        font: {
                          size: 11,
                        },
                      },
                    },

                    tooltip: {
                      callbacks: {
                        label: (context) => {
                          const product =
                            products[context.dataIndex];

                          return [
                            product.name,
                            `Units Sold: ${product.unitsSold}`,
                            `Revenue: $${product.totalRevenue.toFixed(2)}`,
                          ];
                        },
                      },
                    },
                  },
                }}
              />
            ) : (
              <div className="h-full grid place-items-center text-sm text-muted-foreground">
                No sales data available
              </div>
            )
          ) : (
            <Skeleton className="size-full" />
          )}
        </div>
      </CardContent>
    </Card>
  );
}