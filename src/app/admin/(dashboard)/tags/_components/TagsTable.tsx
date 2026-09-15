"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

import {
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import DataTable from "@/components/admin/shared/table/DataTable";
import TableSkeleton from "@/components/admin/shared/table/TableSkeleton";
import TableError from "@/components/admin/shared/table/TableError";

import {
  getColumns,
  skeletonColumns,
} from "./columns";

import {
  useDeleteTagMutation,
  useGetTagsQuery,
  useUpdateStatusTagMutation,
} from "@/redux/services/tag";

import {
  toasterError,
  toasterSuccess,
} from "@/components/core/Toaster";

import { TagStatus } from "../page";
import { Tag } from "@/types/tag.types";

import DeleteTagDialog from "./DeleteTagDialog";

type Props = {
  status: TagStatus;

  onEdit: (
    tag: Tag
  ) => void;
};

export default function TagsTable({
  status,
  onEdit,
}: Props) {
  const searchParams = useSearchParams();

  const page =
    Number(searchParams.get("page")) || 1;

  const limit =
    Number(searchParams.get("limit")) || 10;

  const search =
    searchParams.get("search") || "";

  const archived =
    status === "active"
      ? false
      : status === "archived"
        ? true
        : undefined;

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useGetTagsQuery({
    page,
    limit,
    search,
    archived,
  });

  const [
    deleteTag,
    { isLoading: deleting },
  ] = useDeleteTagMutation();

  const [
    deleteDialogOpen,
    setDeleteDialogOpen,
  ] = useState(false);

  const [
    selectedTag,
    setSelectedTag,
  ] = useState<Tag | null>(null);


  const [updateStatusTag] =
    useUpdateStatusTagMutation();

  const handleDelete = (tag: Tag) => {
    setSelectedTag(tag);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedTag) {
      return;
    }

    try {
      const response = await deleteTag({
        id: selectedTag.id,
      }).unwrap();

      toasterSuccess(
        response?.data?.message ??
          "Tag deleted successfully."
      );

      setDeleteDialogOpen(false);
      setSelectedTag(null);
    } catch (err: any) {
      toasterError(
        err?.data?.error?.message ??
          err?.data?.message ??
          "Unable to delete tag."
      );
    }
  };

  const columns = getColumns({
    page,
    limit,

    onToggleArchived: async (
      id,
      archived
    ) => {
      try {
        await updateStatusTag({
          id,
          archived,
        }).unwrap();

        toasterSuccess(
          "Tag updated successfully."
        );
      } catch {
        toasterError(
          "Unable to update tag."
        );
      }
    },

    onEdit,

    onDelete: handleDelete,
  });

  const table = useReactTable({
    data: data?.data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return (
      <TableSkeleton
        perPage={limit}
        columns={skeletonColumns}
      />
    );
  }

  if (isError || !data) {
    return (
      <TableError
        errorMessage="Unable to load Tags."
        refetch={refetch}
      />
    );
  }

  return (
    <>
      <DataTable
        table={table}
        pagination={{
          current: page,
          limit,
          items: data.count,
          pages: Math.ceil(
            data.count / limit
          ),

          next:
            page <
            Math.ceil(data.count / limit)
              ? page + 1
              : null,

          prev:
            page > 1
              ? page - 1
              : null,
        }}
      />

      <DeleteTagDialog
        open={deleteDialogOpen}
        tagName={selectedTag?.name}
        loading={deleting}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);

          if (!open && !deleting) {
            setSelectedTag(null);
          }
        }}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}