"use client";

import { Navigation, Pagination } from "swiper/modules";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";

import { useGetHomePageBannersQuery } from "@/redux/services/banner";
import { useRouter } from "next/navigation";

export default function Intro1() {
    const router = useRouter();
    const {
        data,
        isLoading,
        isError,
    } = useGetHomePageBannersQuery({});

    if (isLoading) {
        return null;
    }

    if (isError || !data?.data?.length) {
        return null;
    }
    return (
        <>
            <Swiper
                modules={[Navigation, Pagination]}
                slidesPerView={1}
                spaceBetween={0}
                pagination={{ clickable: true }}
                navigation={{
                    prevEl: ".custom_prev_i1",
                    nextEl: ".custom_next_i1",
                }}
                className="hero-slider-1 style-4 dot-style-1 dot-style-1-position-1"
            >
                {data.data.map((item) => (
                    <SwiperSlide key={item.id}>
                        <div
                            className="single-hero-slider single-animation-wrap hero-slide"
                            style={{
                                backgroundImage: `url(${item.image_url})`,
                            }}
                        >
                            <div className="hero-overlay"></div>

                            <div className="slider-content">
                                <h1
                                    className="display-2 hero-title"
                                    style={{
                                        color: item.color || "#ffffff",
                                    }}
                                >
                                    {item.title}
                                </h1>

                                <p
                                    className="hero-subtitle"
                                    style={{
                                        color: item.color || "#ffffff",
                                    }}
                                >
                                    {item.description}
                                </p>

                                    {item.button_text && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (item.link_url) {
                                                    router.push(item.link_url);
                                                }
                                            }}
                                            className="hero-banner-button"
                                            style={{
                                                color: item.button_text_color || "#ffffff",
                                                backgroundColor: item.button_color || "#3bb77e",
                                            }}
                                        >
                                            <span>{item.button_text}</span>

                                            <i className="fi-rs-arrow-right"></i>
                                        </button>
                                    )}
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            <div className="slider-arrow hero-slider-1-arrow">
                <span className="slider-btn slider-prev custom_prev_i1">
                    <i className="fi-rs-angle-left"></i>
                </span>

                <span className="slider-btn slider-next custom_next_i1">
                    <i className="fi-rs-angle-right"></i>
                </span>
            </div>
        </>
    );
}