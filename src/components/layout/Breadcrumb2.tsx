"use client"

import React from "react";
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Tags from "../ecommerce/Filter/Tags";

const Breadcrumb2 = ({ parent = "Home", sub = "Shop", subChild = "", noBreadcrumb = "" }) => {
    const searchParams = useSearchParams()

    const titlex = searchParams.get("cat")
    return (
        <>
            <div className="page-header mt-30 mb-50">
            <div className="container">
                <div className="archive-header">
                    <div className="row align-items-center">
                        <div className="col-xl-3">
                            <h1 className="mb-15 text-capitalize">{titlex ? titlex : "Category"}</h1>
                            <div className="breadcrumb">
                                <Link href="/"><i className="fi-rs-home mr-5"></i>Home</Link>
                                <span></span> Products <span></span> {titlex}
                            </div>
                        </div>
                        <div className="col-xl-9 text-end d-none d-xl-block">
                            {/* <Tags/> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};

export default Breadcrumb2;
