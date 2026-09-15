import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import SingleProduct from "./../ecommerce/SingleProduct";
import { Product } from "@/types/product.types";

interface RelatedSliderProps {
    products: Product[];
}

const RelatedSlider = ({
    products,
}: RelatedSliderProps) => {
    return (
        <>
            <Swiper
                modules={[Navigation]}
                slidesPerView={3}
                spaceBetween={30}
                
                navigation={{
                    prevEl: ".custom_prev_n",
                    nextEl: ".custom_next_n",
                }}
                className="custom-class"
            >
                {products.map((product, i) => (
                    <SwiperSlide key={i}>
                        <SingleProduct product={product} />
                    </SwiperSlide>
                ))}
            </Swiper>

          {products?.length > 4 && (
            <div className="slider-arrow slider-arrow-2 carausel-6-columns-arrow">
                <span className="slider-btn slider-prev slick-arrow custom_prev_n">
                    <i className="fi-rs-angle-left"></i>
                </span>

                <span className="slider-btn slider-next slick-arrow custom_next_n">
                    <i className="fi-rs-angle-right"></i>
                </span>
            </div>
        )}
            
        </>
    );
};

export default RelatedSlider;
