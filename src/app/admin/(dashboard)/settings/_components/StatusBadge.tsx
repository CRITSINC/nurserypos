"use client";

import { Badge } from "@/components/admin/ui/badge";

interface Props {
  status: "idle" | "syncing" | "failed";
}

export default function StatusBadge({
  status,
}: Props) {
  switch (status) {
    case "idle":
      return (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
          Idle
        </Badge>
      );

    case "syncing":
      return (
        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
          Syncing
        </Badge>
      );

    case "failed":
      return (
        <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
          Failed
        </Badge>
      );

    default:
      return (
        <Badge variant="secondary">
          Unknown
        </Badge>
      );
  }
}