"use client"

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { updateProductFilters } from "../../../redux/slices/productFilter.slice";

const SortSelect = ({ updateProductFilters }:any) => {
    const searchParams = useSearchParams();
    const searchTerm = searchParams.get("search");

    const [featured, setFeatured] = useState("");

    useEffect(() => {
        const filters = {
            featured,
        };

        updateProductFilters(filters);
    }, [searchTerm, featured]);

    const seleceOption = (e:any) => {
        setFeatured(e.target.value);
    };

    return (
        <>
            <div className="sort-by-product-wrap">
                <div className="sort-by">
                    <span>
                        <i className="fi-rs-apps-sort"></i>
                        Sort by:
                    </span>
                </div>
                <div className="sort-by-dropdown-wrap custom-select">
                    <select onChange={(e) => seleceOption(e)}>
                        <option value="">Defaults</option>
                        <option value="featured">Featured</option>
                        <option value="trending">Trending</option>
                        <option value="lowToHigh">Low To High</option>
                        <option value="highToLow">High To Low</option>
                    </select>
                </div>
            </div>
        </>
    );
};

const mapStateToProps = (state:any) => ({
    products: state.products.items,
});

const mapDidpatchToProps = {
    updateProductFilters,
};

export default connect(mapStateToProps, mapDidpatchToProps)(SortSelect);
