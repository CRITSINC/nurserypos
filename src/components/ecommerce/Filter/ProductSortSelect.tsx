"use client";

import { ProductSort } from "@/types/product.types";

interface Props {
    value: ProductSort;
    onChange: (value: ProductSort) => void;
}

export default function ProductSortSelect({
    value,
    onChange,
}: Props) {
    return (
        <div className="sort-by-dropdown-wrap">
            <select
                value={value}
                onChange={(e) => onChange(e.target.value as ProductSort)}
                className="form-select"
            >
                <option value="relevance">Relevance</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name_asc">Name: A to Z</option>
                <option value="name_desc">Name: Z to A</option>
            </select>
        </div>
    );
}