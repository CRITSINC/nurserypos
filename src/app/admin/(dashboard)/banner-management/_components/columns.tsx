"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
    PenSquare,
    Trash2,
} from "lucide-react";

import { Button } from "@/components/admin/ui/button";
import { Skeleton } from "@/components/admin/ui/skeleton";
import { SkeletonColumn } from "@/types/skeleton";
import { Switch } from "@/components/admin/ui/switch";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/admin/ui/avatar";

import { HomepageBanner } from "@/types/banner.types";

export const getColumns = ({
    page,
    limit,
    onToggleActive,
    onEdit,
    onDelete,
}: {
    page: number;
    limit: number;

    onToggleActive: (
        id: number,
        is_active: boolean
    ) => void;

    onEdit: (
        banner: HomepageBanner
    ) => void;

    onDelete: (
        banner: HomepageBanner
    ) => void;
}): ColumnDef<HomepageBanner>[] => [
    {
        header: "ID",

        cell: ({ row }) =>
            (page - 1) * limit + row.index + 1,
    },
    {
        header: "Banner",
        cell: ({ row }) => {
            const banner = row.original;

            return (
                <div className="flex items-center gap-3">

                    <Avatar className="h-14 w-20 rounded-md border">
                        <AvatarImage
                            src={
                                banner.image_url ||
                                "/assets/not-available.png"
                            }
                            alt={
                                banner.title ||
                                "Banner"
                            }
                            className="object-cover"
                        />

                        <AvatarFallback>
                            IMG
                        </AvatarFallback>
                    </Avatar>
                </div>
            );
        },
    },
    {
        header: "Title",
        accessorKey: "title",
        cell: ({ row }) =>
            row.original.title || "—",
    },
    {
        header: "Description",
        accessorKey: "description",
        cell: ({ row }) =>
            row.original.description || "—",
    },
    
    {
        header: "Link",
        accessorKey: "link_url",
        cell: ({ row }) => {
            const link =
                row.original.link_url;

            if (!link) {
                return "—";
            }

            return (
                <span
                    className="max-w-[200px] truncate block"
                    title={link}
                >
                    {link}
                </span>
            );
        },
    },
    {
        header: "Button",
        cell: ({ row }) => {
            const banner = row.original;

            if (!banner.button_text) {
                return "—";
            }

            return (
                <div
                    className="inline-flex items-center rounded-md px-3 py-1.5 text-xs font-medium"
                    style={{
                        backgroundColor:
                            banner.button_color ||
                            "#3bb77e",
                        color:
                            banner.button_text_color ||
                            "#ffffff",
                    }}
                >
                    {banner.button_text}
                </div>
            );
        },
    },
    {
        header: "Order",
        accessorKey: "sort_order",
        cell: ({ row }) =>
            row.original.sort_order ?? "—",
    },
    {
        header: "Status",
        cell: ({ row }) =>
            row.original.is_active ? (
                <span className="text-green-600">
                    Active
                </span>
            ) : (
                <span className="text-red-500">
                    Inactive
                </span>
            ),
    },
    {
        id: "actions",
        header: () => (
            <div className="text-center">
                Actions
            </div>
        ),
        cell: ({ row }) => (
            <div className="flex justify-center gap-2">

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                        onEdit(row.original)
                    }
                >
                    <PenSquare className="size-5" />
                </Button>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                        onDelete(
                            row.original
                        )
                    }
                >
                    <Trash2 className="size-5 text-red-500" />
                </Button>

            </div>
        ),
    },
];


export const skeletonColumns: SkeletonColumn[] = [
    {
        header: "ID",
        cell: <Skeleton className="h-8 w-12" />,
    },

    {
        header: "Banner",
        cell: <Skeleton className="h-14 w-20" />,
    },

    {
        header: "Title",
        cell: <Skeleton className="h-8 w-48" />,
    },

    {
        header: "Description",
        cell: <Skeleton className="h-8 w-48" />,
    },

    {
        header: "Link",
        cell: <Skeleton className="h-8 w-40" />,
    },

    {
        header: "Button",
        cell: <Skeleton className="h-8 w-24" />,
    },

    {
        header: "Order",
        cell: <Skeleton className="h-8 w-16" />,
    },

    {
        header: "Status",
        cell: <Skeleton className="h-8 w-16" />,
    },
    {
        header: "Actions",
        cell: <Skeleton className="h-8 w-24" />,
    },
];