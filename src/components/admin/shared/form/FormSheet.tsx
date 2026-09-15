import { X } from "lucide-react";

import { SheetClose, SheetHeader, SheetFooter } from "@/components/admin/ui/sheet";
import { Button } from "@/components/admin/ui/button";

type FormSheetContentProps = {
  children: React.ReactNode;
};

export const FormSheetContent = ({ children }: FormSheetContentProps) => (
  <div className="flex h-full flex-col bg-background">{children}</div>
);

type FormSheetBodyProps = {
  children: React.ReactNode;
};

export const FormSheetBody = ({ children }: FormSheetBodyProps) => (
 <div className="flex-1 overflow-y-auto p-6 sm:p-10">{children}</div>
);

type FormSheetHeaderProps = {
  children: React.ReactNode;
};

export const FormSheetHeader = ({ children }: FormSheetHeaderProps) => (
  <SheetHeader className="flex-shrink-0 flex-row gap-4 justify-between text-left bg-popover p-6 border-b">
    {children}

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
);

type FormSheetFooterProps = {
  className?: any;
  children: React.ReactNode;
};

export const FormSheetFooter = ({ className, children }: FormSheetFooterProps) => (
  <SheetFooter className={className ? "flex-shrink-0 border-t bg-popover sm:flex-row-reverse" : className }>
    {children}

    <SheetClose asChild>
      <Button
        variant="secondary"
        size="lg"
        className="w-full hidden sm:inline-flex"
      >
        Cancel
      </Button>
    </SheetClose>
  </SheetFooter>
);
