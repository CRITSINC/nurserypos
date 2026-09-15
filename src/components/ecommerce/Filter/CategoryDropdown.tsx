"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGetCategoriesQuery } from "@/redux/services/category";

const CategoryDropdown = () => {
    const router = useRouter();

    const { data, isLoading } = useGetCategoriesQuery({
        pagination: false,
    });

    const categories = data?.data ?? [];

    // Show only 10
    const visibleCategories = categories
    .filter(category => category.parent_id === null)
    .slice(0, 10);

    const openCategory = (id: number) => {
        router.push(`/products?category=${id}`);
    };

    return (
        <div className="category-dropdown-wrapper">

            {isLoading ? (
                <div className="category-loading">
                    Loading Categories...
                </div>
            ) : (
                <>
                    <div className="category-grid">

                        {visibleCategories.map((category) => (
                            <div
                                key={category.id}
                                className="category-item"
                                onClick={() => openCategory(category.id)}
                            >
                                <div className="category-icon">
                                    <img
                                        src="/assets/imgs/shop/category1.png"
                                        alt={category.name}
                                    />
                                </div>

                                <div className="category-name">
                                    {category.name}
                                </div>
                            </div>
                        ))}

                    </div>

                    {categories.length > 10 && (
                        <div className="category-footer">
                            <Link href="/categories">
                                View All Categories →
                            </Link>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default CategoryDropdown;