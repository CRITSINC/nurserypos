"use client";

import Link from "next/link";
import React, { useState } from "react";
import Layout from "../../../components/layout/Layout";
import { useGetVendorsQuery } from "@/redux/services/vendor";

const VendorPage = () => {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(12);
    const [search, setSearch] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);

    const { data, isLoading, isError } = useGetVendorsQuery({
        page,
        limit,
        search,
        archived: false
    });

    const vendors = data?.data ?? [];
    const total = data?.count ?? 0;
    const totalPages = Math.ceil(total / limit);

const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    const siblingCount = 2;

    const startPage = Math.max(2, page - siblingCount);
    const endPage = Math.min(totalPages - 1, page + siblingCount);

    // Always show first page
    pages.push(1);

    // Left dots
    if (startPage > 2) {
        pages.push("...");
    }

    // Middle pages
    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    // Right dots
    if (endPage < totalPages - 1) {
        pages.push("...");
    }

    // Always show last page
    if (totalPages > 1) {
        pages.push(totalPages);
    }

    return pages;
};
    return (
        <Layout parent="Vendors" parent_link="/vendors">
            <div className="page-content pt-50">
                <div className="container">

                    <div className="archive-header-2 text-center">
                        <div className="row">
                            <div className="col-lg-5 mx-auto">

                                <div className="sidebar-widget-2 widget_search mb-50">
                                    <div className="search-form">

                                        <form
                                            onSubmit={(e) =>
                                                e.preventDefault()
                                            }
                                        >
                                            <input
                                                type="text"
                                                placeholder="Search vendor..."
                                                value={search}
                                                onChange={(e) => {
                                                    setSearch(
                                                        e.target.value
                                                    );
                                                    setPage(1);
                                                }}
                                            />

                                            <button type="submit">
                                                <i className="fi-rs-search"></i>
                                            </button>

                                        </form>

                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    <div className="row mb-50">

                        <div className="col-lg-12">

                            <div className="shop-product-fillter">

                                <div className="totall-product">
                                    <p>
                                        We have{" "}
                                        <strong className="text-brand">
                                            {total}
                                        </strong>{" "}
                                        vendors.
                                    </p>
                                </div>

                                <div className="sort-by-product-area">

                                    <div className="sort-by-cover mr-10">

                                        <div
                                                className="sort-by-product-wrap"
                                                onClick={() => setShowDropdown(!showDropdown)}
                                            >

                                            <div className="sort-by">
                                                <span>
                                                    <i className="fi-rs-apps"></i>
                                                    Show:
                                                </span>
                                            </div>

                                            <div className="sort-by-dropdown-wrap">
                                                <span>
                                                    {limit}
                                                    <i className="fi-rs-angle-small-down"></i>
                                                </span>
                                            </div>

                                        </div>

                                        <div className={`sort-by-dropdown ${showDropdown ? "show" : ""}`}>
                                            <ul>

                                                {[12, 25, 50, 100, 200].map(
                                                    (size) => (
                                                        <li key={size}>
                                                            <button
                                                                type="button"
                                                                className={`dropdown-item ${
                                                                    limit === size
                                                                        ? "active"
                                                                        : ""
                                                                }`}
                                                                onClick={() => {
                                                                    setLimit(size);
                                                                    setPage(1);
                                                                    setShowDropdown(false);
                                                                }}
                                                            >
                                                                {size}
                                                            </button>
                                                        </li>
                                                    )
                                                )}

                                                <li>
                                                    <button
                                                        type="button"
                                                        className="dropdown-item"
                                                        onClick={() => {
                                                            setLimit(total);
                                                            setPage(1);
                                                            setShowDropdown(false);
                                                        }}
                                                    >
                                                        All
                                                    </button>
                                                </li>

                                            </ul>
                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>


                     <div className="row vendor-grid">

                        {isLoading && (
                            <div className="col-12 text-center py-5">
                                <div
                                    className="d-flex align-items-center justify-content-center"
                                    style={{ minHeight: "400px" }}
                                >
                                    <div className="text-center">
                                        <img
                                            src="/assets/imgs/theme/loading.gif"
                                            alt="Loading Vendors"
                                            width={100}
                                            height={100}
                                        />
                                        <p className="mt-15 text-muted">
                                            Loading Vendors...
                                        </p>
                                    </div>
                                </div>

                            </div>
                        )}

                            {isError && (
                            <div className="col-12 text-center py-5">
                                <div
                                    className="d-flex align-items-center justify-content-center"
                                    style={{ minHeight: "400px" }}
                                >
                                    <div className="text-center">
                                        <p className="mt-15 text-muted">
                                            Failed to load vendors.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            )}

                            {!isLoading &&
                                !isError &&
                                vendors.map((vendor) => (
                                    <div
                                        className="col-lg-3 col-md-6 col-12 col-sm-6 mb-50"
                                        key={vendor.id}
                                    >
                                        <div className="vendor-wrap mb-40">

                                            <div className="vendor-img-action-wrap">

                                                <div className="vendor-img d-flex justify-content-center align-items-center">
                                                    <Link
                                                        href={`/vendor/${vendor.id}`}
                                                    >
                                                        <img
                                                            className="default-img"
                                                            src="/assets/imgs/shop/Vendors.png"
                                                            alt={vendor.name}
                                                        />
                                                    </Link>
                                                </div>

                                                <div className="product-badges product-badges-position product-badges-mrg">
                                                    <span
                                                        className={
                                                            vendor.archived
                                                                ? "hot"
                                                                : "new"
                                                        }
                                                    >
                                                        {vendor.archived
                                                            ? "Archived"
                                                            : "Active"}
                                                    </span>
                                                </div>

                                            </div>

                                            <div className="vendor-content-wrap">
                                                <h4>{vendor.name}</h4>

                                                <ul className="vendor-info mt-3">

                                                    {/* <li>
                                                        <strong>Price Level:</strong>{" "}
                                                        {vendor.price_level || "-"}
                                                    </li> */}

                                                    <li>
                                                        <strong>Representative:</strong>{" "}
                                                        {[vendor.rep_first_name, vendor.rep_last_name]
                                                            .filter(Boolean)
                                                            .join(" ") || "-"}
                                                    </li>

                                                </ul>

                                            </div>
                                        </div>
                                        </div>
                                    ))

                                }
                    </div>
                    {
                        totalPages > 1 && (
                            <div className="pagination-wrapper mt-30">

                                <nav>
                                    <ul className="pagination justify-content-center">

                                        <li
                                            className={`page-item ${page === 1 ? "disabled" : ""}`}
                                        >
                                            <button
                                                className="page-link"
                                                disabled={page === 1}
                                                onClick={() => setPage(page - 1)}
                                            >
                                                <i className="fi-rs-arrow-small-left"></i>
                                            </button>
                                        </li>

                                        {getPageNumbers().map((item, index) =>
                                            item === "..." ? (
                                                <li
                                                    key={`dots-${index}`}
                                                    className="page-item pagination-dots"
                                                >
                                                    <span className="page-link">...</span>
                                                </li>
                                            ) : (
                                                <li
                                                    key={`${item}-${index}`}
                                                    className={`page-item ${
                                                        page === item ? "active" : ""
                                                    }`}
                                                >
                                                    <button
                                                        className="page-link"
                                                        onClick={() =>
                                                            setPage(item as number)
                                                        }
                                                    >
                                                        {item}
                                                    </button>
                                                </li>
                                            )
                                        )}

                                        <li
                                            className={`page-item ${
                                                page === totalPages ? "disabled" : ""
                                            }`}
                                        >
                                            <button
                                                className="page-link"
                                                disabled={page === totalPages}
                                                onClick={() => setPage(page + 1)}
                                            >
                                                <i className="fi-rs-arrow-small-right"></i>
                                            </button>
                                        </li>

                                    </ul>
                                </nav>

                                <div className="pagination-info">
                                    <strong>{page}</strong> of <strong>{totalPages}</strong>
                                </div>

                            </div>
                        )
                    }

                </div>
            </div>
        </Layout>
    );
};

export default VendorPage;