"use client";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/admin/ui/sheet";

import { ScrollArea } from "@/components/admin/ui/scroll-area";
import { X } from "lucide-react";
import { Button } from "@/components/admin/ui/button";

interface PayloadSheetProps {
  payload: Record<string, unknown> | null;
  onClose: () => void;
}

export default function PayloadSheet({
  payload,
  onClose,
}: PayloadSheetProps) {
  return (
    <Sheet
      open={!!payload}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <SheetContent className="sm:max-w-xl">
        <SheetHeader 
        className="flex-shrink-0 flex-row gap-4 justify-between text-left bg-popover"
        >
          <SheetTitle className="m-3">Job Payload</SheetTitle>
              <SheetClose asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-foreground flex-shrink-0"
                >
                  <X className="size-6" />
                </Button>
              </SheetClose>
        </SheetHeader>

        <ScrollArea className="mt-6 h-[calc(100vh-120px)] rounded-md border">
          <pre className="rounded-md bg-muted p-4 font-mono text-xs whitespace-pre-wrap break-all">
            {payload
              ? JSON.stringify(payload, null, 2)
              : "No payload available."}
          </pre>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}