"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";

import { Button } from "@/components/admin/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/admin/ui/alert-dialog";

interface RetryButtonProps {
  jobId: string;
  onRetry: (jobId: string) => void | Promise<void>;
}

export default function RetryButton({
  jobId,
  onRetry,
}: RetryButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

const handleRetry = async () => {
try {
    setLoading(true);
    await onRetry(jobId);
    setOpen(false);
} finally {
    setLoading(false);
}
};

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Retry Queue Job?
          </AlertDialogTitle>

          <AlertDialogDescription>
            This will requeue the selected job for processing.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            disabled={loading}
            onClick={(e) => {
              e.preventDefault();
              handleRetry();
            }}
          >
            {loading ? "Retrying..." : "Retry"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}