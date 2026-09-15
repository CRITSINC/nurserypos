"use client";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useSearchParams,
} from "next/navigation";

import ShowSelect from "../../../components/ecommerce/Filter/ShowSelect";
import QuickView from "../../../components/ecommerce/QuickView";
import SingleProduct from "../../../components/ecommerce/SingleProduct";
import Layout from "../../../components/layout/Layout";

import {
    useCategoryProductsQuery,
    useGetProductsQuery,
    useSearchProductsQuery,
} from "@/redux/services/product";

import {
    useGetCategoriesQuery,
} from "@/redux/services/category";

import {
    useGetBrandsQuery,
} from "@/redux/services/brand";

import {
    useGetVendorsQuery,
} from "@/redux/services/vendor";

import {
    useGetTagsQuery,
} from "@/redux/services/tag";

import ProductSortSelect from "@/components/ecommerce/Filter/ProductSortSelect";

import {
    ProductSort,
} from "@/types/product.types";

import FilterDrawer from "@/components/ecommerce/Filter/FilterDrawer";

import {
    emptyProductFilters,
    ProductFilters,
} from "@/components/ecommerce/Filter/types";

const Products = () => {

    const searchParams =
        useSearchParams();
    const search =
        searchParams.get("search") || "";

    const category =
        searchParams.get("category");

    const brand =
        searchParams.get("brand");

    const subcategoryIds =
        searchParams.get(
            "subcategory_ids"
        );

    const encodedSearch =
        search
            .trim()
            .replace(/\s+/g, "+");


    const isSearchMode =
        !!encodedSearch;

    const isCategoryMode =
        !isSearchMode &&
        !!category;

    const isNormalMode =
        !isSearchMode &&
        !isCategoryMode;


    const [page, setPage] =
        useState(1);

    const [limit, setLimit] =
        useState(10);

    const [sortBy, setSortBy] =
        useState<ProductSort>(
            "relevance"
        );

    const [filters, setFilters] =
        useState<ProductFilters>(
            emptyProductFilters
        );


    const [pendingFilters, setPendingFilters] =
        useState<ProductFilters>(
            emptyProductFilters
        );

    const [isFilterOpen, setIsFilterOpen] =
        useState(false);


    const urlFilters = useMemo<ProductFilters>(
        () => ({
            ...emptyProductFilters,

            brandIds: brand
                ? [String(brand)]
                : [],

            categoryIds:
                isCategoryMode
                    ? []
                    : [],

            vendorIds: [],

            tagIds: [],

            minPrice:
                undefined,

            maxPrice:
                undefined,
        }),
        [
            brand,
            isCategoryMode,
        ]
    );

    useEffect(() => {
        setFilters(urlFilters);

        setPendingFilters({
            ...urlFilters,
            brandIds: [
                ...urlFilters.brandIds,
            ],
            categoryIds: [
                ...urlFilters.categoryIds,
            ],
            vendorIds: [
                ...urlFilters.vendorIds,
            ],
            tagIds: [
                ...urlFilters.tagIds,
            ],
        });

        setPage(1);
    }, [urlFilters]);

    const categorySort =
        useMemo<{
            sort: string;
            order: "asc" | "desc";
        }>(() => {

            switch (sortBy) {

                case "price_asc":
                    return {
                        sort: "price",
                        order: "asc",
                    };

                case "price_desc":
                    return {
                        sort: "price",
                        order: "desc",
                    };

                case "name_asc":
                    return {
                        sort: "description",
                        order: "asc",
                    };

                case "name_desc":
                    return {
                        sort: "description",
                        order: "desc",
                    };

                default:
                    return {
                        sort: "createdAt",
                        order: "desc",
                    };
            }

        }, [sortBy]);


    const brandIdsString =
        filters.brandIds.join(",");

    const vendorIdsString =
        filters.vendorIds.join(",");

    const categoryIdsString =
        filters.categoryIds.join(",");

    const tagIdsString =
        filters.tagIds.join(",");



    const {
        data: categoriesData,
    } = useGetCategoriesQuery({
        pagination: false,
    });

    const categories =
        categoriesData?.data ?? [];


    const {
        data: brandsData,
    } = useGetBrandsQuery({
        page: 1,
        limit: 1000,
    });

    const {
        data: vendorsData,
    } = useGetVendorsQuery({
        page: 1,
        limit: 1000,
        archived: false
    });
    //uncomment if need tags
    // const {
    //     data: tagsData,
    // } = useGetTagsQuery({
    //     page: 1,
    //     limit: 1000,
    // });

    const normalBrands =
        brandsData?.data ?? [];

    const normalVendors =
        vendorsData?.data ?? [];

    // const normalTags =
    //     tagsData?.data ?? [];

    const normalQuery =
        useGetProductsQuery(
            {
                page,
                limit,
                pagination: true,
                archived: false,
                sort: categorySort.sort,
                order: categorySort.order,

                ...(brandIdsString && {
                    brand_id: brandIdsString,
                }),

                ...(categoryIdsString && {
                    category_id: categoryIdsString,
                }),

                ...(vendorIdsString && {
                    vendor_id: vendorIdsString,
                }),

                ...(tagIdsString && {
                    tag_id: tagIdsString,
                }),

                ...(filters.minPrice !== undefined && {
                    minPrice: filters.minPrice,
                }),

                ...(filters.maxPrice !== undefined && {
                    maxPrice: filters.maxPrice,
                }),
            },
            {
                skip: !isNormalMode,
            }
        );

    const searchQuery =
        useSearchProductsQuery(
            {
                q: encodedSearch,

                page,

                limit,

                sort:
                    sortBy === "price_asc"
                        ? "default_cost"
                        : sortBy === "price_desc"
                            ? "default_cost"
                            : sortBy === "name_asc"
                                ? "description"
                                : sortBy === "name_desc"
                                    ? "description"
                                    : "createdAt",

                order:
                    sortBy === "price_asc" ||
                        sortBy === "name_asc"
                        ? "asc"
                        : "desc",

                ...(brandIdsString && {
                    brandId:
                        brandIdsString,
                }),

                ...(categoryIdsString && {
                    categoryId:
                        categoryIdsString,
                }),

                ...(vendorIdsString && {
                    vendorId:
                        vendorIdsString,
                }),

                ...(tagIdsString && {
                    tag_id:
                        tagIdsString,
                }),

                ...(filters.minPrice !==
                    undefined && {
                    min_price:
                        filters.minPrice,
                }),

                ...(filters.maxPrice !==
                    undefined && {
                    max_price:
                        filters.maxPrice,
                }),
            },
            {
                skip:
                    !isSearchMode,
            }
        );


    const categoryQuery =
        useCategoryProductsQuery(
            {
                id:
                    Number(category),

                page,

                limit,

                pagination: true,

                /*
                 * URL-provided subcategories
                 */
                ...(subcategoryIds && {
                    subcategory_ids:
                        subcategoryIds,
                }),

                /*
                 * Subcategories selected
                 * through the filter popup.
                 *
                 * In category mode,
                 * filters.categoryIds contains
                 * subcategory IDs.
                 */
                ...(categoryIdsString && {
                    subcategory_ids:
                        categoryIdsString,
                }),

                ...(brandIdsString && {
                    brandId:
                        brandIdsString,
                }),

                ...(vendorIdsString && {
                    vendorId:
                        vendorIdsString,
                }),

                ...(filters.minPrice !==
                    undefined && {
                    minPrice:
                        filters.minPrice,
                }),

                ...(filters.maxPrice !==
                    undefined && {
                    maxPrice:
                        filters.maxPrice,
                }),

                sort:
                    categorySort.sort,

                order:
                    categorySort.order,

                /*
                 * If your category products API
                 * supports tags, add:
                 *
                 * ...(tagIdsString && {
                 *     tagId: tagIdsString,
                 * }),
                 */
            },
            {
                skip:
                    !isCategoryMode,
            }
        );


    const activeQuery =
        isSearchMode
            ? searchQuery
            : isCategoryMode
                ? categoryQuery
                : normalQuery;

    const loading =
        activeQuery.isFetching;

    const error =
        activeQuery.isError;

    const products =
        useMemo(() => {

            if (isSearchMode) {
                return (
                    searchQuery.data?.data
                        .products ?? []
                );
            }

            if (isCategoryMode) {
                return (
                    categoryQuery.data?.data
                        .products ?? []
                );
            }

            return (
                normalQuery.data?.data ?? []
            );

        }, [
            isSearchMode,
            isCategoryMode,
            searchQuery.data,
            categoryQuery.data,
            normalQuery.data,
        ]);

    const totalProducts =
        isSearchMode
            ? searchQuery.data?.data
                .pagination.total ?? 0
            : isCategoryMode
                ? categoryQuery.data?.count ??
                0
                : normalQuery.data?.count ??
                0;


    const totalPages =
        isSearchMode
            ? searchQuery.data?.data
                .pagination.totalPages ??
            1
            : Math.ceil(
                totalProducts / limit
            );

    const searchFacets =
        searchQuery.data?.data.facets;

    const filterBrands =
        isSearchMode
            ? searchFacets?.brands ??
            normalBrands
            : normalBrands;

    const filterTags =
        isSearchMode
            ? searchFacets?.tags ??
            []
            : [];

    const filterVendors =
        normalVendors;

    const filterPriceRange =
        isSearchMode
            ? searchFacets?.priceRange
            : undefined;

    const filterCategories =
        isSearchMode
            ? searchFacets?.categories ??
            []
            : categories.filter(
                (category) =>
                    category.parent_id ===
                    null
            );

    const categoryFilterCategories =
        isCategoryMode &&
            categoryQuery.data?.data
                ?.category
            ? [
                {
                    id:
                        categoryQuery
                            .data
                            .data
                            .category.id,

                    name:
                        categoryQuery
                            .data
                            .data
                            .category.name,
                },
            ]
            : filterCategories;

    const categoryFilterSubcategories =
        isCategoryMode
            ? (
                categoryQuery.data?.data
                    ?.subcategories ?? []
            ).map(
                (subcategory) => ({
                    id:
                        subcategory.id,

                    name:
                        subcategory.name,
                })
            )
            : [];

    const priceRange =
        filterPriceRange;


    const getPageNumbers = () => {

        const pages: (
            | number
            | string
        )[] = [];

        const siblingCount = 2;

        const startPage =
            Math.max(
                2,
                page - siblingCount
            );

        const endPage =
            Math.min(
                totalPages - 1,
                page + siblingCount
            );

        pages.push(1);

        if (startPage > 2) {
            pages.push("...");
        }

        for (
            let i = startPage;
            i <= endPage;
            i++
        ) {
            pages.push(i);
        }

        if (
            endPage <
            totalPages - 1
        ) {
            pages.push("...");
        }

        if (totalPages > 1) {
            pages.push(totalPages);
        }

        return pages;
    };

    const selectChange = (
        e: React.ChangeEvent<
            HTMLSelectElement
        >
    ) => {

        setLimit(
            Number(
                e.target.value
            )
        );

        setPage(1);
    };

    const handleOpenFilters = () => {

        setPendingFilters({
            ...filters,

            brandIds: [
                ...filters.brandIds,
            ],

            categoryIds: [
                ...filters.categoryIds,
            ],

            vendorIds: [
                ...filters.vendorIds,
            ],

            tagIds: [
                ...filters.tagIds,
            ],
        });

        setIsFilterOpen(true);
    };

    const handleApplyFilters = () => {

        setFilters({
            ...pendingFilters,

            brandIds: [
                ...pendingFilters.brandIds,
            ],

            categoryIds: [
                ...pendingFilters.categoryIds,
            ],

            vendorIds: [
                ...pendingFilters.vendorIds,
            ],

            tagIds: [
                ...pendingFilters.tagIds,
            ],
        });

        setPage(1);

        setIsFilterOpen(false);
    };

    const handleClearFilters = () => {
        const clearedFilters: ProductFilters = {
            ...emptyProductFilters,
            brandIds: [],
            categoryIds: [],
            vendorIds: [],
            tagIds: [],
            minPrice: undefined,
            maxPrice: undefined,
        };

        setPendingFilters(clearedFilters);
        setFilters(clearedFilters);
        setPage(1);
    };

    // const handleClearFilters = () => {

    //     setPendingFilters({
    //         ...emptyProductFilters,

    //         brandIds: [],

    //         categoryIds: [],

    //         vendorIds: [],

    //         tagIds: [],
    //     });
    // };

    const handleCloseFilters = () => {
        setIsFilterOpen(false);
    };

    return (
        <>
            <Layout
                parent="Products"
                parent_link="/products"
            >

                <section className="mt-50 mb-50">

                    <div className="container mb-30">

                        <div className="row">

                            <div className="col-lg-12">

                                <div className="shop-product-fillter">

                                    <div className="product-filter-left">

                                        <button
                                            type="button"
                                            className="product-filter-btn"
                                            onClick={
                                                handleOpenFilters
                                            }
                                        >
                                            <i className="fi-rs-filter"></i>

                                            <span>
                                                Filters
                                            </span>
                                        </button>

                                        <p className="product-result-count">
                                            We found{" "}

                                            <strong className="text-brand">
                                                {
                                                    totalProducts
                                                }
                                            </strong>{" "}

                                            items for you!
                                        </p>

                                    </div>

                                    <div className="sort-by-product-area">

                                        <div className="sort-by-cover mr-10">

                                            <ShowSelect
                                                selectChange={
                                                    selectChange
                                                }
                                                showLimit={
                                                    limit
                                                }
                                            />

                                        </div>

                                        <div className="sort-by-cover">

                                            <ProductSortSelect
                                                value={
                                                    sortBy
                                                }
                                                onChange={(
                                                    value
                                                ) => {

                                                    setSortBy(
                                                        value
                                                    );

                                                    setPage(
                                                        1
                                                    );
                                                }}
                                            />

                                        </div>

                                    </div>

                                </div>

                                {loading && (
                                    <div
                                        className="d-flex align-items-center justify-content-center"
                                        style={{
                                            minHeight:
                                                "600px",
                                        }}
                                    >
                                        <div className="text-center">

                                            <img
                                                src="/assets/imgs/theme/loading.gif"
                                                alt="Loading products"
                                                width={100}
                                                height={100}
                                            />

                                            <p className="mt-15 text-muted">
                                                Loading products...
                                            </p>

                                        </div>
                                    </div>
                                )}

                                {error && (
                                    <div className="col-12 text-center py-5">

                                        <div
                                            className="d-flex align-items-center justify-content-center"
                                            style={{
                                                minHeight:
                                                    "400px",
                                            }}
                                        >
                                            <div className="text-center">

                                                <p className="mt-15 text-muted">
                                                    Unable to load products.
                                                </p>

                                            </div>
                                        </div>

                                    </div>
                                )}

                                {!loading &&
                                    !error && (
                                        <>
                                            <div className="row product-grid">

                                                {products.length ===
                                                    0 && (
                                                        <div className="col-12">

                                                            <h3>
                                                                No Products Found
                                                            </h3>

                                                        </div>
                                                    )}

                                                {products.map(
                                                    (
                                                        item: any
                                                    ) => (
                                                        <div
                                                            key={
                                                                item.id
                                                            }
                                                            className="col-lg-1-5 col-md-4 col-sm-6 col-12"
                                                        >
                                                            <SingleProduct
                                                                product={
                                                                    item
                                                                }
                                                            />
                                                        </div>
                                                    )
                                                )}

                                            </div>

                                            {totalPages >
                                                1 && (
                                                    <div className="pagination-wrapper mt-30">
                                                        <nav>
                                                            <ul className="pagination justify-content-center">
                                                                <li
                                                                    className={`page-item ${page ===
                                                                            1
                                                                            ? "disabled"
                                                                            : ""
                                                                        }`}
                                                                >
                                                                    <button
                                                                        className="page-link"
                                                                        disabled={
                                                                            page ===
                                                                            1
                                                                        }
                                                                        onClick={() =>
                                                                            setPage(
                                                                                page -
                                                                                1
                                                                            )
                                                                        }
                                                                    >
                                                                        <i className="fi-rs-arrow-small-left"></i>
                                                                    </button>
                                                                </li>

                                                                {getPageNumbers().map(
                                                                    (
                                                                        item,
                                                                        index
                                                                    ) =>
                                                                        item ===
                                                                            "..." ? (
                                                                            <li
                                                                                key={`dots-${index}`}
                                                                                className="page-item pagination-dots"
                                                                            >
                                                                                <span className="page-link">
                                                                                    ...
                                                                                </span>
                                                                            </li>
                                                                        ) : (
                                                                            <li
                                                                                key={`${item}-${index}`}
                                                                                className={`page-item ${page ===
                                                                                        item
                                                                                        ? "active"
                                                                                        : ""
                                                                                    }`}
                                                                            >
                                                                                <button
                                                                                    className="page-link"
                                                                                    onClick={() =>
                                                                                        setPage(
                                                                                            item as number
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        item
                                                                                    }
                                                                                </button>
                                                                            </li>
                                                                        )
                                                                )}
                                                                <li
                                                                    className={`page-item ${page ===
                                                                            totalPages
                                                                            ? "disabled"
                                                                            : ""
                                                                        }`}
                                                                >
                                                                    <button
                                                                        className="page-link"
                                                                        disabled={
                                                                            page ===
                                                                            totalPages
                                                                        }
                                                                        onClick={() =>
                                                                            setPage(
                                                                                page +
                                                                                1
                                                                            )
                                                                        }
                                                                    >
                                                                        <i className="fi-rs-arrow-small-right"></i>
                                                                    </button>
                                                                </li>

                                                            </ul>

                                                        </nav>

                                                        <div className="pagination-info">

                                                            <strong>
                                                                {
                                                                    page
                                                                }
                                                            </strong>{" "}
                                                            of{" "}
                                                            <strong>
                                                                {
                                                                    totalPages
                                                                }
                                                            </strong>

                                                        </div>

                                                    </div>
                                                )}

                                        </>
                                    )}

                            </div>

                        </div>

                    </div>

                </section>

                <FilterDrawer

                    isOpen={
                        isFilterOpen
                    }

                    filters={
                        pendingFilters
                    }

                    onChange={
                        setPendingFilters
                    }

                    onApply={
                        handleApplyFilters
                    }

                    onClear={
                        handleClearFilters
                    }

                    onClose={
                        handleCloseFilters
                    }

                    categories={
                        categoryFilterCategories
                    }

                    subcategories={
                        categoryFilterSubcategories
                    }

                    brands={
                        filterBrands
                    }

                    vendors={
                        filterVendors
                    }

                    tags={
                        filterTags
                    }

                    priceRange={
                        priceRange
                    }

                    categoryMode={
                        isCategoryMode
                    }
                />

                <QuickView />

            </Layout>
        </>
    );
};

export default Products;