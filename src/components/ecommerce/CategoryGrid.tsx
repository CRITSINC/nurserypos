"use client";

import CategoryCard from "./CategoryCard";
import { Category } from "@/types/category.types";

interface CategoryGridProps {
    categories: Category[];
    onCategoryClick: (category: Category) => void;
}

export default function CategoryGrid({
    categories,
    onCategoryClick,
}: CategoryGridProps) {
    if (!categories.length) {
        return (
            <div className="text-center py-5">
                <h4>No Categories Found</h4>
            </div>
        );
    }

    return (
        <div className="row">
            {categories.map((category) => (
                <div
                    key={category.id}
                    className="col-xl-3 col-lg-4 col-md-6 col-sm-6 mb-4"
                >
                    <CategoryCard
                        category={category}
                        onClick={() => onCategoryClick(category)}
                    />
                </div>
            ))}
        </div>
    );
}