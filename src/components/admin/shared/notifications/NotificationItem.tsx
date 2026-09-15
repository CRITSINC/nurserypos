"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { X, Loader2 } from "lucide-react";

import { Badge } from "@/components/admin/ui/badge";
import Typography from "@/components/admin/ui/typography";
import { Button } from "@/components/admin/ui/button";

import { Notification } from "@/types/notifications.types";

type Props = {
  notification: Notification;
};

export default function NotificationItem({ notification }: Props) {
const [isPending, setIsPending] = useState(false);
  return (
    <div className="flex items-center justify-between p-3 border-t border-t-border first:border-t-0 sm:gap-x-2">
      <div className="flex items-center gap-x-3">
        <div className="flex flex-col">
          <Typography
            component="p"
            className="text-[0.8125rem] md:text-[0.8125rem] line-clamp-2 sm:line-clamp-1 mb-2 sm:mb-1.5"
          >
            {notification.title}
          </Typography>

          <div className="flex flex-col-reverse items-start sm:items-center sm:flex-row gap-x-2 gap-y-2">
            {notification.type === "low_stock" ? (
              <Badge variant="destructive" className="flex-shrink-0">
                Stock Out
              </Badge>
            ) : (
              <Badge variant="success" className="flex-shrink-0">
                New Order
              </Badge>
            )}

            <Typography component="p" className="text-xs md:text-xs">
              {format(new Date(notification.created_at), "MMM d yyyy - hh:mma")}
            </Typography>
          </div>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="flex-shrink-0 w-8 h-8"
        disabled={isPending}
        onClick={() => console.log("Deleted")}
      >
        {isPending ? (
          <Loader2 className="size-3.5 animate-spin" />
        ) : (
          <X className="size-3.5" />
        )}
      </Button>
    </div>
  );
}
