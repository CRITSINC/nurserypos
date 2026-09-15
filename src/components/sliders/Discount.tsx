import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import SingleProduct from "./../ecommerce/SingleProduct";

const DiscountSlider = ({ products = [] }) => {
    return (
        <>
            <Swiper
                modules={[Navigation]}
                slidesPerView={4}
                spaceBetween={15}
                
                navigation={{
                    prevEl: ".custom_prev_d",
                    nextEl: ".custom_next_d",
                }}
                className="custom-class"
            >
                {products.map((product, i) => (
                    <SwiperSlide key={i}>
                        <SingleProduct product={product} />
                    </SwiperSlide>
                ))}
            </Swiper>

            <div className="custom-nav">
                <button type="button" className="custom_prev_d">
                    Prev
                </button>
                <button type="button" className="custom_next_d">
                    Next
                </button>
            </div>
        </>
    );
};


export default DiscountSlider;
