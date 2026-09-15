"use client";

import SingleProduct from "../ecommerce/SingleProduct";
import { useGetLandingSectionsQuery } from "@/redux/services/product";

export default function CategoryTab() {
    const {
        data,
        isLoading,
        isFetching,
        isError,
    } = useGetLandingSectionsQuery(undefined, {
        refetchOnMountOrArgChange: true,
    });

    const products = (data?.data?.popular ?? []).slice(0, 5);

    return (
        <>
            <div className="section-title style-2 wow animate__animated animate__fadeIn">
                <h3>Popular Products</h3>
            </div>

            <div className="tab-content wow fadeIn animated">
                {isLoading || isFetching ? (
                    <div
                        className="d-flex align-items-center justify-content-center"
                        style={{ minHeight: "400px" }}
                    >
                        <div className="text-center">
                            <img
                                src="/assets/imgs/theme/loading.gif"
                                alt="Loading products"
                                width={80}
                                height={80}
                            />

                            <p className="mt-15 text-muted">
                                Loading products...
                            </p>
                        </div>
                    </div>
                ) : isError ? (
                    <div className="col-12 text-center py-5">
                        <div
                            className="d-flex align-items-center justify-content-center"
                            style={{ minHeight: "400px" }}
                        >
                            <div className="text-center">
                                <p className="mt-15 text-muted">
                                    Failed to load Popular Products.
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="product-grid-4 row">
                        {products.length > 0 ? (
                            products.map((product: any) => (
                                <div
                                    key={product.id}
                                    className="col-lg-1-5 col-md-4 col-sm-6 col-12"
                                >
                                    <SingleProduct product={product} />
                                </div>
                            ))
                        ) : (
                            <div
                                className="d-flex align-items-center justify-content-center"
                                style={{ minHeight: "400px" }}
                            >
                                <div className="text-center">
                                    <p className="mt-15 text-muted">
                                        No Product found.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}