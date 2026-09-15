"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/admin/ui/sheet";

import { ScrollArea } from "@/components/admin/ui/scroll-area";

interface ErrorSheetProps {
  error: string;
  onClose: () => void;
}

export default function ErrorSheet({
  error,
  onClose,
}: ErrorSheetProps) {
  return (
    <Sheet
      open={!!error}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <SheetContent className="sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>Job Error</SheetTitle>
        </SheetHeader>

        <ScrollArea className="mt-6 h-[calc(100vh-120px)] rounded-md border">
          <pre className="rounded-md bg-muted p-4 font-mono text-xs whitespace-pre-wrap break-all">
            {error || "No error message available."}
          </pre>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}