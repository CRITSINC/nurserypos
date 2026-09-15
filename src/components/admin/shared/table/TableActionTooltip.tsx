import { cn } from "@/lib/utils";
import { Button } from "@/components/admin/ui/button";
import { SheetTrigger } from "@/components/admin/ui/sheet";
import { AlertDialogTrigger } from "@/components/admin/ui/alert-dialog";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/admin/ui/tooltip";

type Props = {
  content: string;
  children: React.ReactNode;
  buttonClassName?: string;
};

export const TooltipWrapper = ({ content, children }: Props) => (
  <Tooltip>
    <TooltipTrigger asChild>{children}</TooltipTrigger>

    <TooltipContent>
      <p>{content}</p>
    </TooltipContent>
  </Tooltip>
);

export const SheetTooltip = ({ content, children, buttonClassName }: Props) => (
  <TooltipWrapper content={content}>
    <SheetTrigger asChild>
      <Button
        variant="ghost"
        size="icon"
        className={cn("text-foreground", buttonClassName)}
      >
        {children}
      </Button>
    </SheetTrigger>
  </TooltipWrapper>
);

export const AlertDialogTooltip = ({ content, children }: Props) => (
  <TooltipWrapper content={content}>
    <AlertDialogTrigger asChild>
      <Button variant="ghost" size="icon" className="text-foreground">
        {children}
      </Button>
    </AlertDialogTrigger>
  </TooltipWrapper>
);
