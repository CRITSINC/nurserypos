import { Bell } from "lucide-react";
import { redirect } from "next/navigation";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/admin/ui/popover";
import { Button } from "@/components/admin/ui/button";
import { ScrollArea } from "@/components/admin/ui/scroll-area";
import NotificationsBadge from "./NotificationsBadge";
import NotificationContent from "./NotificationContent";

export default async function Notifications() {
  const userId = '1';

  if (!userId) {
    redirect("/login");
  }

  return (
    <div className="relative">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon">
            <Bell />
            <span className="sr-only">Toggle notifications</span>
          </Button>
        </PopoverTrigger>

        <PopoverContent
          align="end"
          alignOffset={-60}
          asChild
          className="flex flex-col p-0 w-[18rem] sm:w-[22rem]"
        >
          <ScrollArea type="auto" className="h-full max-h-[22rem]">
            <NotificationContent userId={userId} />
          </ScrollArea>
        </PopoverContent>
      </Popover>

      <NotificationsBadge userId={userId} />
    </div>
  );
}
