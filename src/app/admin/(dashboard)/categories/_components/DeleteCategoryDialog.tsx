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

interface DeleteCategoryDialogProps {
  open: boolean;
  categoryName?: string;
  loading?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export default function DeleteCategoryDialog({
  open,
  categoryName,
  loading = false,
  onOpenChange,
  onConfirm,
}: DeleteCategoryDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete Category?
          </AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            {categoryName ? `"${categoryName}"` : "this category"}?
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