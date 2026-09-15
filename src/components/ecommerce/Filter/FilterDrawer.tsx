"use client";

import { useEffect } from "react";

import ShopFilter from "./Filter";
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

interface FilterDrawerProps {
    isOpen: boolean;

    filters: ProductFilters;

    onChange: (
        filters: ProductFilters
    ) => void;

    onApply: () => void;

    onClear: () => void;

    onClose: () => void;

    categories?: CategoryFilterOption[];

    subcategories?: CategoryFilterOption[];

    brands?: FilterOption[];

    vendors?: FilterOption[];

    tags?: FilterOption[];

    priceRange?: {
        min: number;
        max: number;
    };

    categoryMode?: boolean;
}

const FilterDrawer = ({
    isOpen,
    filters,
    onChange,
    onApply,
    onClear,
    onClose,
    categories = [],
    subcategories = [],
    brands = [],
    vendors = [],
    tags = [],
    priceRange,
    categoryMode = false,
}: FilterDrawerProps) => {

    useEffect(() => {

        if (!isOpen) {
            document.body.style.overflow = "";
            return;
        }

        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = "";
        };

    }, [isOpen]);

    if (!isOpen) {
        return null;
    }

    return (
        <div className="filter-drawer-overlay">

            {/* Backdrop */}
            <div
                className="filter-drawer-backdrop"
                onClick={onClose}
            />

            {/* Drawer */}
            <div
                className="filter-drawer"
                onClick={(event) =>
                    event.stopPropagation()
                }
            >

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="filter-drawer-header">

                    <h4>
                        Filters
                    </h4>

                    <button
                        type="button"
                        className="filter-drawer-close"
                        onClick={onClose}
                        aria-label="Close filters"
                    >
                        <i className="fi-rs-cross-small"></i>
                    </button>

                </div>

                {/* =================================================
                    CONTENT
                ================================================= */}

                <div className="filter-drawer-content">

                    <ShopFilter
                        filters={filters}
                        onChange={onChange}
                        categories={categories}
                        subcategories={
                            subcategories
                        }
                        brands={brands}
                        vendors={vendors}
                        tags={tags}
                        priceRange={priceRange}
                        categoryMode={
                            categoryMode
                        }
                    />

                </div>

                {/* =================================================
                    FOOTER
                ================================================= */}

                <div className="filter-drawer-footer">

                    <button
                        type="button"
                        className="filter-clear-button"
                        onClick={onClear}
                    >
                        Remove All
                    </button>

                    <button
                        type="button"
                        className="filter-apply-button"
                        onClick={onApply}
                    >
                        Apply Filters
                    </button>

                </div>

            </div>

        </div>
    );
};

export default FilterDrawer;