"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Layout from "@/components/layout/Layout";
import Breadcrumb2 from "@/components/layout/Breadcrumb2";
import CategoryGrid from "@/components/ecommerce/CategoryGrid";
import { useGetCategoriesQuery } from "@/redux/services/category";
import { Category } from "@/types/category.types";

export default function CategoriesPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const categoryId = searchParams.get("category");

    const {
        data,
        isLoading,
        isError,
    } = useGetCategoriesQuery({
        pagination: false,
    });

    const categories = data?.data || [];

    const currentCategory = useMemo(() => {
        if (!categoryId) return null;

        return categories.find(
            (item) => item.id === Number(categoryId)
        );
    }, [categoryId, categories]);

    const displayedCategories = useMemo(() => {
        if (!categoryId) {
            return categories.filter(
                (item) => item.node_depth === 0
            );
        }

        return categories.filter(
            (item) => item.parent_id === Number(categoryId)
        );
    }, [categoryId, categories]);

    const breadcrumb = useMemo(() => {
        if (!currentCategory?.full_path_name)
            return ["Categories"];

        return [
            "Categories",
            ...currentCategory.full_path_name.split("/"),
        ];
    }, [currentCategory]);

    const handleCategoryClick = (category: Category) => {
        const hasChildren =
            category.children &&
            category.children.length > 0;

        if (hasChildren) {
            router.push(`/categories?category=${category.id}`);
            return;
        }

        router.push(`/products?category=${category.id}`);
    };

    return (
        <Layout noBreadcrumb="d-none">
            {/* <Breadcrumb2 /> */}

            <section className="mt-50 mb-50">
                <div className="container">

                    <div className="mb-4">

                        <h2 className="mb-3">
                            {currentCategory
                                ? currentCategory.name
                                : "Shop by Categories"}
                        </h2>

                        <div className="d-flex flex-wrap gap-2">

                            {breadcrumb.map((item, index) => (
                                <span key={index}>
                                    {item}
                                    {index !==
                                        breadcrumb.length - 1 &&
                                        " > "}
                                </span>
                            ))}

                        </div>

                    </div>

                    {isLoading && (
                        <h5>Loading Categories...</h5>
                    )}

                    {isError && (
                        <h5>Unable to load categories.</h5>
                    )}

                    {!isLoading && (
                        <CategoryGrid
                            categories={displayedCategories}
                            onCategoryClick={
                                handleCategoryClick
                            }
                        />
                    )}
                </div>
            </section>
        </Layout>
    );
}