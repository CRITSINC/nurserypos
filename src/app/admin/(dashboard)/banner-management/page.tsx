"use client";

import { useState } from "react";
import PageTitle from "@/components/admin/shared/PageTitle";
import BannersTable from "./_components/BannersTable";
import BannerFilter from "./_components/BannerFilter";
import BannerForm from "./_components/BannerForm";
import { Button } from "@/components/admin/ui/button";
import { Plus } from "lucide-react";

export default function BannerManagementPage() {
    const [open, setOpen] = useState(false);
    const [selectedBanner, setSelectedBanner] =
        useState<any>(null);


    const handleAdd = () => {
        setSelectedBanner(null);
        setOpen(true);
    };

    const handleEdit = (banner: any) => {
        setSelectedBanner(banner);
        setOpen(true);
    };


    const handleClose = (value: boolean) => {
        setOpen(value);

        if (!value) {
            setSelectedBanner(null);
        }
    };

    return (
        <section>
            <PageTitle>
                Banner Management
            </PageTitle>

            <div className="mb-6 flex items-center justify-end gap-3">
                <Button onClick={handleAdd}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Banner
                </Button>
            </div>

            <BannerFilter />

            <BannersTable
                onEdit={handleEdit}
            />

            <BannerForm
                open={open}
                onOpenChange={handleClose}
                isEdit={!!selectedBanner}
                bannerId={selectedBanner?.id}
                initialData={selectedBanner ?? undefined}
                imageUrl={selectedBanner?.image_url}
            />
        </section>
    );
}