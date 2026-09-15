"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGetCategoriesQuery } from "@/redux/services/category";

interface Category {
    id: number;
    name: string;
    parent_id: number | null;
    children?: Category[];
}

const MobileCategoryDropdown = () => {
    const router = useRouter();

    const [expanded, setExpanded] = useState<number[]>([]);

    const { data, isLoading } = useGetCategoriesQuery({
        pagination: false,
    });

    const categories = data?.data ?? [];

    // Build category tree from flat API response
    const buildTree = (
        parentId: number | null = null
    ): Category[] => {
        return categories
            .filter(
                (category) =>
                    category.parent_id === parentId
            )
            .map((category) => ({
                ...category,
                children: buildTree(category.id),
            }));
    };

    const categoryTree = buildTree();

    const toggleCategory = (id: number) => {
        setExpanded((prev) =>
            prev.includes(id)
                ? prev.filter((item) => item !== id)
                : [...prev, id]
        );
    };

    const selectCategory = (id: number) => {
        router.push(`/products?category=${id}`);
    };

    const renderCategory = (
        category: Category,
        level = 0
    ): React.ReactNode => {
        const hasChildren =
            !!category.children &&
            category.children.length > 0;

        const isExpanded = expanded.includes(category.id);

        return (
            <div
                key={category.id}
                className="mobile-category-item"
            >
                <div
                    className="mobile-category-row"
                    style={{
                        paddingLeft: `${level * 18}px`,
                    }}
                >
                    {hasChildren ? (
                        <button
                            type="button"
                            className="mobile-category-expand"
                            onClick={() =>
                                toggleCategory(category.id)
                            }
                            aria-label={
                                isExpanded
                                    ? "Collapse category"
                                    : "Expand category"
                            }
                        >
                            <i
                                className={
                                    isExpanded
                                        ? "fi-rs-angle-small-down"
                                        : "fi-rs-angle-small-right"
                                }
                            />
                        </button>
                    ) : (
                        <span className="mobile-category-expand-placeholder" />
                    )}

                    <button
                        type="button"
                        className="mobile-category-name"
                        onClick={() =>
                            selectCategory(category.id)
                        }
                    >
                        {category.name}
                    </button>
                </div>

                {hasChildren && isExpanded && (
                    <div className="mobile-category-children">
                        {category.children!.map((child) =>
                            renderCategory(
                                child,
                                level + 1
                            )
                        )}
                    </div>
                )}
            </div>
        );
    };

    if (isLoading) {
        return (
            <div className="mobile-category-loading">
                Loading Categories...
            </div>
        );
    }

    return (
        <div className="mobile-category-list">
            {/* All Products */}
            <button
                type="button"
                className="mobile-category-all"
                onClick={() =>
                    router.push("/categories")
                }
            >
                All Categories
            </button>

            {categoryTree.map((category) =>
                renderCategory(category)
            )}
        </div>
    );
};

export default MobileCategoryDropdown;