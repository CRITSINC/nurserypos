"use client";

import BrandFilter from "./BrandFilter";
import CategoryFilter from "./CategoryProduct";
import PriceRangeSlider from "./PriceRangeSlider";
import Tags from "./Tags";
import VendorFilter from "./VendorFilter";

import { ProductFilters } from "./types";

interface FilterOption {
    id: number;
    name: string;
    count?: number;
}

interface CategoryFilterOption
    extends FilterOption {
    productCount?: number;
}

interface ShopFilterProps {
    filters: ProductFilters;

    onChange: (
        filters: ProductFilters
    ) => void;

    categories?: CategoryFilterOption[];

    subcategories?: CategoryFilterOption[];

    brands?: FilterOption[];

    vendors?: FilterOption[];

    tags?: FilterOption[];

    priceRange?: {
        min: number;
        max: number;
    };

    /**
     * true when URL contains category.
     *
     * In category mode:
     *
     * Services
     *   Consult & Design
     *   Delivery
     *   Planting/Install
     */
    categoryMode?: boolean;
}

const ShopFilter = ({
    filters,
    onChange,
    categories = [],
    subcategories = [],
    brands = [],
    vendors = [],
    tags = [],
    priceRange,
    categoryMode = false,
}: ShopFilterProps) => {

    const minPrice =
        priceRange?.min ?? 0;

    const maxPrice =
        priceRange?.max ?? 1000;

    const selectedMinPrice =
        filters.minPrice ?? minPrice;

    const selectedMaxPrice =
        filters.maxPrice ?? maxPrice;

    return (
        <div className="shop-filter-grid">

            <div className="row">

                {/* =====================================================
                    CATEGORIES
                ===================================================== */}

                <div className="filter-column">

                    <div className="card filter-card">

                        <h5 className="filter-card-title">
                            By Categories
                        </h5>

                        <div className="filter-card-body">

                            <div className="categories-dropdown-wrap font-heading">

                                <CategoryFilter
                                    categories={
                                        categories
                                    }

                                    subcategories={
                                        subcategories
                                    }

                                    selectedCategories={
                                        filters.categoryIds
                                    }

                                    showSubcategories={
                                        categoryMode
                                    }

                                    onChange={(
                                        categoryIds
                                    ) =>
                                        onChange({
                                            ...filters,
                                            categoryIds,
                                        })
                                    }
                                />

                            </div>

                        </div>

                    </div>

                </div>

                {/* =====================================================
                    BRANDS
                ===================================================== */}

                <div className="filter-column">

                    <div className="card filter-card">

                        <h5 className="filter-card-title">
                            By Brands
                        </h5>

                        <div className="filter-card-body">

                            <BrandFilter
                                brands={brands}
                                selectedBrands={
                                    filters.brandIds
                                }
                                onChange={(
                                    brandIds
                                ) =>
                                    onChange({
                                        ...filters,
                                        brandIds,
                                    })
                                }
                            />

                        </div>

                    </div>

                </div>

                {/* =====================================================
                    VENDORS
                ===================================================== */}

                <div className="filter-column">

                    <div className="card filter-card">

                        <h5 className="filter-card-title">
                            By Vendors
                        </h5>

                        <div className="filter-card-body">

                            <VendorFilter
                                vendors={vendors}
                                selectedVendors={
                                    filters.vendorIds
                                }
                                onChange={(
                                    vendorIds
                                ) =>
                                    onChange({
                                        ...filters,
                                        vendorIds,
                                    })
                                }
                            />

                        </div>

                    </div>

                </div>

                {/* =====================================================
                    TAGS
                ===================================================== */}

                <div className="filter-column">

                    <div className="card filter-card">

                        <h5 className="filter-card-title">
                            By Tags
                        </h5>

                        <div className="filter-card-body">

                            <Tags
                                tags={tags}
                                selectedTags={
                                    filters.tagIds
                                }
                                onChange={(
                                    tagIds
                                ) =>
                                    onChange({
                                        ...filters,
                                        tagIds,
                                    })
                                }
                            />

                        </div>

                    </div>

                </div>

                {/* =====================================================
                    PRICE
                ===================================================== */}

                <div className="filter-column">

                    <div className="card filter-card price-filter-card">

                        <h5 className="filter-card-title">
                            Price range
                        </h5>

                        <div className="filter-card-body price-filter-body">

                            {/* Selected price */}
                            <div className="price-value-display">

                                <span>
                                    $
                                    {selectedMinPrice.toLocaleString(
                                        "en-US",
                                        {
                                            minimumFractionDigits: 0,
                                            maximumFractionDigits: 2,
                                        }
                                    )}
                                </span>

                                <span className="price-separator">
                                    -
                                </span>

                                <span>
                                    $
                                    {selectedMaxPrice.toLocaleString(
                                        "en-US",
                                        {
                                            minimumFractionDigits: 0,
                                            maximumFractionDigits: 2,
                                        }
                                    )}
                                </span>

                            </div>

                            {/* Slider */}
                            <div className="price-slider-wrapper">

                                <PriceRangeSlider
                                    min={minPrice}
                                    max={maxPrice}
                                    value={{
                                        min: selectedMinPrice,
                                        max: selectedMaxPrice,
                                    }}
                                    onChange={(
                                        min,
                                        max
                                    ) =>
                                        onChange({
                                            ...filters,
                                            minPrice: min,
                                            maxPrice: max,
                                        })
                                    }
                                />

                            </div>

                            {/* Min / Max labels */}
                            <div className="price-range-labels">

                                <span>
                                    $
                                    {minPrice.toLocaleString(
                                        "en-US",
                                        {
                                            minimumFractionDigits: 0,
                                            maximumFractionDigits: 2,
                                        }
                                    )}
                                </span>

                                <span>
                                    $
                                    {maxPrice.toLocaleString(
                                        "en-US",
                                        {
                                            minimumFractionDigits: 0,
                                            maximumFractionDigits: 2,
                                        }
                                    )}
                                </span>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default ShopFilter;