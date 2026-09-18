"use client";

import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import SingleProduct from "../ecommerce/SingleProduct";
import { useGetLandingSectionsQuery } from "@/redux/services/product";

const CategoryTab = () => {
    const {
        data,
        isLoading,
        isFetching,
        isError,
    } = useGetLandingSectionsQuery(undefined, {
        refetchOnMountOrArgChange: true,
    });

    const products = (data?.data?.popular ?? []).slice(0, 15);

    return (
        <>
            {/* ================= SECTION ================= */}

            <div
                className="position-relative"
                style={{
                    width: "100%",
                }}
            >
                {/* ================= SECTION TITLE ================= */}

                <div className="section-title style-2 wow animate__animated animate__fadeIn">
                    <h3>Popular Products</h3>
                </div>

                {/* ================= ARROWS ================= */}

                {products.length > 5 && (
                    <div
                        className="slider-arrow slider-arrow-2 flex-right"
                        style={{
                            position: "absolute",
                            top: "0",
                            right: "0",
                            zIndex: 10,
                        }}
                    >
                        <span className="slider-btn slider-prev slick-arrow custom_prev_popular">
                            <i className="fi-rs-arrow-small-left"></i>
                        </span>

                        <span className="slider-btn slider-next slick-arrow custom_next_popular">
                            <i className="fi-rs-arrow-small-right"></i>
                        </span>
                    </div>
                )}

                {/* ================= PRODUCTS ================= */}

                <div className="tab-content wow fadeIn animated">
                    {isLoading || isFetching ? (
                        <div
                            className="d-flex align-items-center justify-content-center"
                            style={{
                                minHeight: "400px",
                            }}
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
                                style={{
                                    minHeight: "400px",
                                }}
                            >
                                <div className="text-center">
                                    <p className="mt-15 text-muted">
                                        Failed to load Popular Products.
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : products.length > 0 ? (
                    <Swiper
                        modules={[Navigation]}
                        navigation={{
                            prevEl: ".custom_prev_popular",
                            nextEl: ".custom_next_popular",
                        }}
                        spaceBetween={20}
                        slidesPerView={5}
                        slidesPerGroup={5}
                        breakpoints={{
                            320: {
                                slidesPerView: 1,
                                slidesPerGroup: 1,
                            },
                            576: {
                                slidesPerView: 2,
                                slidesPerGroup: 2,
                            },
                            768: {
                                slidesPerView: 3,
                                slidesPerGroup: 3,
                            },
                            992: {
                                slidesPerView: 4,
                                slidesPerGroup: 4,
                            },
                            1200: {
                                slidesPerView: 5,
                                slidesPerGroup: 5,
                            },
                        }}
                    >
                        {products.map((product: any) => (
                            <SwiperSlide key={product.id}>
                                <SingleProduct product={product} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    ) : (
                        <div
                            className="d-flex align-items-center justify-content-center"
                            style={{
                                minHeight: "400px",
                            }}
                        >
                            <div className="text-center">
                                <p className="mt-15 text-muted">
                                    No Product found.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default CategoryTab;