"use client";

import Typography from "@/components/admin/ui/typography";
import NotificationItem from "./NotificationItem";
import NotificationItemSkeleton from "./NotificationItemSkeleton";
import { useState } from "react";
import { demoNotifications } from "@/demo/notifications";


export default function NotificationContent({ userId }: { userId: string }) {
  const [notifications, setNotifications] = useState(demoNotifications);
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)


  if (isLoading) {
    return new Array(6)
      .fill(0)
      .map((_, index) => (
        <NotificationItemSkeleton key={`notification-skeleton-${index}`} />
      ));
  }

  if (!notifications || isError) {
    return (
      <div className="w-full text-center px-4 py-6">
        <Typography component="p" className="text-sm md:text-sm">
          Something went wrong while fetching notifications. Please try again.
        </Typography>
      </div>
    );
  }

  if (notifications.length > 0) {
    return notifications.map((notification, index) => (
      <NotificationItem
        key={`notification-${index}`}
        notification={notification}
      />
    ));
  }

  return (
    <div className="w-full text-center px-4 py-6">
      <Typography component="p" className="text-sm md:text-sm">
        You have no notifications!
      </Typography>
    </div>
  );
}
