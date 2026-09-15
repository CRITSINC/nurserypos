"use client";

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
    useDeleteBannerMutation,
    useGetBannersQuery,
    useUpdateStatusBannerMutation,
} from "@/redux/services/banner";

import {
    toasterError,
    toasterSuccess,
} from "@/components/core/Toaster";
import { HomepageBanner } from "@/types/banner.types";
import DeleteBannerDialog from "./DeleteBannerDialog";
import { useState } from "react";

type Props = {
    onEdit: (banner: HomepageBanner) => void;
};

export default function BannersTable({ onEdit }: Props) {
    const searchParams = useSearchParams();

    const page =
        Number(searchParams.get("page")) || 1;

    const limit =
        Number(searchParams.get("limit")) || 10;

    const search =
        searchParams.get("search") || "";

    const {
        data,
        isLoading,
        isError,
        refetch,
    } = useGetBannersQuery({
        page,
        limit,
        search,
        sort: "desc",
        pagination: true,
    });

    const [
        deleteBanner,
        { isLoading: deleting },
    ] = useDeleteBannerMutation();

    const [
        deleteDialogOpen,
        setDeleteDialogOpen,
    ] = useState(false);

    const [
        selectedBanner,
        setSelectedBanner,
    ] = useState<HomepageBanner | null>(null);


    const [updateStatusBanner] =
        useUpdateStatusBannerMutation();

    const handleDelete = (banner: HomepageBanner) => {
        setSelectedBanner(banner);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedBanner) {
            return;
        }

        try {
            const response = await deleteBanner(
                selectedBanner.id
            ).unwrap();

            toasterSuccess(
                response?.data?.message ??
                "Banner deleted successfully."
            );

            setDeleteDialogOpen(false);
            setSelectedBanner(null);
        } catch (err: any) {
            toasterError(
                err?.data?.error?.message ??
                err?.data?.message ??
                "Unable to delete banner."
            );
        }
    };


    const columns = getColumns({
        page,
        limit,

        onToggleActive: async (
            id,
            is_active
        ) => {
            try {
                await updateStatusBanner({
                    id,
                    is_active,
                }).unwrap();

                toasterSuccess(
                    "Banner status updated successfully."
                );
            } catch {
                toasterError(
                    "Unable to update Banner status."
                );
            }
        },
        onEdit,

        onDelete:
            handleDelete,
    });

    const table = useReactTable({
        data: data?.data ?? [],
        columns,

        getCoreRowModel:
            getCoreRowModel(),
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
                errorMessage="Unable to load banners."
                refetch={refetch}
            />
        );
    }

    const totalItems =
        data.count ?? 0;

    const totalPages =
        Math.ceil(
            totalItems / limit
        );


    return (
        <>
            <DataTable
                table={table}

                pagination={{
                    current: page,

                    limit,

                    items: totalItems,

                    pages: totalPages,

                    next:
                        page < totalPages
                            ? page + 1
                            : null,

                    prev:
                        page > 1
                            ? page - 1
                            : null,
                }}
            />

            <DeleteBannerDialog
                open={deleteDialogOpen}
                bannerName={selectedBanner?.title}
                loading={deleting}
                onOpenChange={(open) => {
                    setDeleteDialogOpen(open);

                    if (!open && !deleting) {
                        setSelectedBanner(null);
                    }
                }}
                onConfirm={handleConfirmDelete}
            />
        </>
    );
}