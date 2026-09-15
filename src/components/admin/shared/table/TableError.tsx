import { AlertCircle, RefreshCw } from "lucide-react";

import { Button } from "@/components/admin/ui/button";
import Typography from "@/components/admin/ui/typography";

type TableErrorProps = {
  errorMessage?: string;
  refetch: () => void | Promise<any>;
};

export default function TableError({
  errorMessage = "Something went wrong while trying to fetch data.",
  refetch,
}: TableErrorProps) {
  return (
    <div className="rounded-md border-destructive border-2 overflow-hidden">
      <div className="px-4 py-12 min-h-60 text-center grid place-items-center">
        <div className="flex flex-col items-center gap-4 text-destructive">
          <AlertCircle className="size-7" />

          <Typography>{errorMessage}</Typography>

          <Button
            onClick={() => refetch()}
            variant="destructive"
            className="py-3 px-8 mt-2"
          >
            <RefreshCw className="size-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    </div>
  );
}