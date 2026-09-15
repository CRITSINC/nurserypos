"use client";

import { FaChevronRight, FaFolderOpen } from "react-icons/fa";
import { Category } from "@/types/category.types";

interface CategoryCardProps {
    category: Category;
    onClick: () => void;
}

export default function CategoryCard({
    category,
    onClick,
}: CategoryCardProps) {
    const hasChildren =
        category.children &&
        category.children.length > 0;

    return (
        <div
            className="category-card border rounded-3 p-4 h-100 cursor-pointer"
            onClick={onClick}
        >
            <div className="d-flex justify-content-between align-items-start">

                <div>

                    <div className="category-icon mb-3">
                        <FaFolderOpen size={28} />
                    </div>

                    <h5 className="mb-2">
                        {category.name}
                    </h5>

                    <p className="text-muted mb-0 small">
                        {hasChildren
                            ? `${category?.children?.length} Sub Categories`
                            : "Browse Products"}
                    </p>

                </div>

                <FaChevronRight className="category-arrow" />

            </div>
        </div>
    );
}