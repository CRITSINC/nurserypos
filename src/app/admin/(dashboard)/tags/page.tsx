'use client';

import PageTitle from "@/components/admin/shared/PageTitle";
import TagsTable from "./_components/TagsTable";
import TagFilter from "./_components/TagFilter";
import { Button } from "@/components/admin/ui/button";
import { Plus, SquarePen } from "lucide-react";
import { useState } from "react";
import TagForm from "./_components/TagForm";
import { Tag } from "@/types/tag.types";

export type TagStatus =
  | "all"
  | "active"
  | "archived";

export default function TagsPage() {
  const [open, setOpen] = useState(false);
  const [selectedTag, setSelectedTag] =
    useState<Tag | null>(null);
  const [
    status,
    setStatus,
  ] = useState<TagStatus>(
    "active"
  );

  const [
    appliedStatus,
    setAppliedStatus,
  ] = useState<TagStatus>(
    "active"
  );

  const handleResetFilter = () => {

    setStatus(
      "active"
    );

    setAppliedStatus(
      "active"
    );
  };

  const handleApplyFilter = (
    selectedStatus: TagStatus
  ) => {

    setAppliedStatus(
      selectedStatus
    );
  };

  const handleAdd = () => {
    setSelectedTag(null);
    setOpen(true);
  };

  const handleEdit = (
    category: Tag
  ) => {
    setSelectedTag(category);
    setOpen(true);
  };

  const handleClose = (
    value: boolean
  ) => {
    setOpen(value);

    if (!value) {
      setSelectedTag(null);
    }
  };


  return (
    <section>
      <PageTitle>Tags</PageTitle>
      <div className="mb-6 flex items-center justify-end gap-3">
        {/* <Button variant="outline">
          <SquarePen className="mr-2 h-4 w-4" />
          Bulk Upload
        </Button> */}

        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add Tag
        </Button>
      </div>
      <TagFilter
        status={
          status
        }

        onStatusChange={
          setStatus
        }

        onFilter={
          handleApplyFilter
        }

        onReset={
          handleResetFilter
        }
      />
      <TagsTable
        status={appliedStatus}
        onEdit={handleEdit}
      />
      <TagForm
        open={open}
        onOpenChange={handleClose}
        isEdit={!!selectedTag}
        tagId={
          selectedTag?.id
        }
        initialData={
          selectedTag ?? undefined
        }
      />
    </section>
  );
}