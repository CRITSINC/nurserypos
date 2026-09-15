import {
  HiOutlineSquare3Stack3D,
  HiCalendarDays,
} from "react-icons/hi2";

import { cn } from "@/lib/utils";
import Typography from "@/components/admin/ui/typography";
import { DashboardCard } from "@/types/card";
import { HiOutlineRefresh } from "react-icons/hi";

interface SalesOverviewProps {
  data?: {
    today: number;
    yesterday: number;
    weekly: number;
    thisMonth: number;
    lastMonth: number;
    allTime: number;
  };

  isLoading?: boolean;
}

const formatCurrency = (value: number = 0) => {
  return `$${value.toFixed(2)}`;
};

export default function SalesOverview({
  data,
  isLoading,
}: SalesOverviewProps) {
  const cards: DashboardCard[] = [
    {
      icon: <HiOutlineSquare3Stack3D />,
      title: "Today",
      value: formatCurrency(data?.today),
      className: "bg-teal-600",
    },
    {
      icon: <HiOutlineSquare3Stack3D />,
      title: "Yesterday",
      value: formatCurrency(data?.yesterday),
      className: "bg-orange-400",
    },
    {
      icon: <HiOutlineRefresh />,
      title: "Weekly",
      value: formatCurrency(data?.weekly),
      className: "bg-violet-500",
    },
    {
      icon: <HiOutlineRefresh />,
      title: "This Month",
      value: formatCurrency(data?.thisMonth),
      className: "bg-blue-500",
    },
    {
      icon: <HiCalendarDays />,
      title: "Last Month",
      value: formatCurrency(data?.lastMonth),
      className: "bg-cyan-600",
    },
    {
      icon: <HiCalendarDays />,
      title: "All Time",
      value: formatCurrency(data?.allTime),
      className: "bg-emerald-600",
    },
  ];

  return (
    <section>
      <div className="mb-3">
        <Typography
          variant="h3"
          className="text-base font-semibold"
        >
          Sales Overview
        </Typography>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {cards.map((card, index) => (
          <div
            key={`sales-overview-${index}`}
            className={cn(
              "rounded-xl px-4 py-4 text-white",
              "flex flex-col justify-between",
              "min-h-[125px]",
              "shadow-sm",
              card.className
            )}
          >
            <div className="flex items-center justify-between">
              <Typography className="text-sm font-medium text-white/90">
                {card.title}
              </Typography>

              <div className="[&>svg]:size-5 text-white/90">
                {card.icon}
              </div>
            </div>

            <Typography className="text-2xl font-semibold">
              {isLoading ? "..." : card.value}
            </Typography>
          </div>
        ))}
      </div>
    </section>
  );
}