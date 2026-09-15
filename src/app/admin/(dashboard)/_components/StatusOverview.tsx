import {
  HiOutlineShoppingCart,
  HiOutlineRefresh,
  HiOutlineCheck,
  HiOutlineX,
} from "react-icons/hi";
import { BsTruck } from "react-icons/bs";

import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
} from "@/components/admin/ui/card";
import Typography from "@/components/admin/ui/typography";
import { DashboardCard } from "@/types/card";

interface StatusOverviewProps {
  data?: {
    today: number;
    total: number;
    pending: number;
    processing: number;
    completed: number;
    cancelled: number;
  };

  isLoading?: boolean;
}

export default function StatusOverview({
  data,
  isLoading,
}: StatusOverviewProps) {
  const cards: DashboardCard[] = [
    {
      icon: <HiOutlineShoppingCart />,
      title: "Today's Orders",
      value: String(data?.today ?? 0),
      className:
        "text-purple-600 dark:text-purple-100 bg-purple-100 dark:bg-purple-500",
    },
    {
      icon: <HiOutlineShoppingCart />,
      title: "Total Orders",
      value: String(data?.total ?? 0),
      className:
        "text-orange-600 dark:text-orange-100 bg-orange-100 dark:bg-orange-500",
    },
    {
      icon: <HiOutlineRefresh />,
      title: "Orders Pending",
      value: String(data?.pending ?? 0),
      className:
        "text-teal-600 dark:text-teal-100 bg-teal-100 dark:bg-teal-500",
    },
    {
      icon: <BsTruck />,
      title: "Orders Processing",
      value: String(data?.processing ?? 0),
      className:
        "text-blue-600 dark:text-blue-100 bg-blue-100 dark:bg-blue-500",
    },
    {
      icon: <HiOutlineCheck />,
      title: "Orders Completed",
      value: String(data?.completed ?? 0),
      className:
        "text-emerald-600 dark:text-emerald-100 bg-emerald-100 dark:bg-emerald-500",
    },
    {
      icon: <HiOutlineX />,
      title: "Orders Cancelled",
      value: String(data?.cancelled ?? 0),
      className:
        "text-red-600 dark:text-red-100 bg-red-100 dark:bg-red-500",
    },
  ];

  return (
    <section>
      <div className="mb-3">
        <Typography
          variant="h3"
          className="text-base font-semibold"
        >
          Order Overview
        </Typography>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {cards.map((card) => (
          <Card
            key={card.title}
            className="rounded-xl shadow-sm"
          >
            <CardContent className="flex items-center gap-4 p-4">
              <div
                className={cn(
                  "size-12 shrink-0 rounded-full grid place-items-center",
                  "[&>svg]:size-5",
                  card.className
                )}
              >
                {card.icon}
              </div>

              <div className="flex flex-col gap-y-1">
                <Typography className="text-sm text-muted-foreground">
                  {card.title}
                </Typography>

                <Typography className="text-2xl font-semibold text-popover-foreground">
                  {isLoading ? "..." : card.value}
                </Typography>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}