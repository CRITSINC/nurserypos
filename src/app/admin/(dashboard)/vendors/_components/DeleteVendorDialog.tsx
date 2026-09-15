"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/admin/ui/alert-dialog";

interface DeleteVendorDialogProps {
  open: boolean;
  vendorName?: string;
  loading?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export default function DeleteVendorDialog({
  open,
  vendorName,
  loading = false,
  onOpenChange,
  onConfirm,
}: DeleteVendorDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete Vendor?
          </AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            {vendorName ? `"${vendorName}"` : "this vendor"}?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex-row justify-end gap-2">
          <AlertDialogCancel
            disabled={loading}
            className="m-0 h-10 w-[94px] min-w-[94px]"
          >
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={onConfirm}
            disabled={loading}
            className="m-0 h-10 w-[94px] min-w-[94px]"
          >
            {loading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}