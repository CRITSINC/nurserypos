"use client";

import { useRouter } from "next/navigation";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { useGetFeaturedCategoriesQuery } from "@/redux/services/category";

const bgClasses = [
  "bg-9",
  "bg-10",
  "bg-11",
  "bg-12",
  "bg-13",
  "bg-14",
  "bg-15",
];

const CategorySlider = () => {
  const router = useRouter();

  const {
    data,
    isLoading,
    isError,
  } = useGetFeaturedCategoriesQuery({
    limit: 10,
  });

  const categories = data?.data || [];

  const handleCategoryClick = (id: number) => {
    router.push(`/products?category=${id}`);
  };

  if (isLoading) {
    return (
           <div
              className="d-flex align-items-center justify-content-center"
              style={{ minHeight: "400px" }}
          >
              <div className="text-center">
                  <img
                      src="/assets/imgs/theme/loading.gif"
                      alt="Loading Featured Categories"
                      width={80}
                      height={80}
                  />
                  <p className="mt-15 text-muted">
                      Loading Featured Categories...
                  </p>
              </div>
          </div>

    );
  }

  if (isError) {
    return (
      <div className="text-center py-5">
        Failed to load featured categories.
      </div>
    );
  }

  return (
    <>
      <Swiper
        modules={[Navigation, Autoplay]}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        navigation={{
          prevEl: ".custom_prev_ct1",
          nextEl: ".custom_next_ct1",
        }}
        spaceBetween={20}
        breakpoints={{
          320: {
            slidesPerView: 2,
          },
          576: {
            slidesPerView: 2,
          },
          768: {
            slidesPerView: 3,
          },
          992: {
            slidesPerView: 4,
          },
          1200: {
            slidesPerView: 6,
          },
          1400: {
            slidesPerView: 8,
          },
        }}
      >
        {categories.map((category: any, index: number) => (
          <SwiperSlide key={category.id}>
            <div
              className={`card-2 ${
                bgClasses[index % bgClasses.length]
              } wow animate__animated animate__fadeInUp`}
              onClick={() => handleCategoryClick(category.id)}
              style={{
                cursor: "pointer",
                height: 260,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "20px 12px",
                textAlign: "center",
              }}
            >

            <figure
                style={{
                    width: 120,
                    height: 120,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <img
                    src={`/assets/imgs/shop/category1.png`}
                    alt={category.name}
                    className="category-image"
                />
            </figure>

              <h6
                style={{
                  // minHeight: 72,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  lineHeight: "1.35",
                  fontWeight: 700,
                  marginBottom: 5,
                }}
              >
                {category.name}
              </h6>

              <span
                style={{
                  marginTop: "auto",
                  color: "#7E7E7E",
                  fontSize: 15,
                }}
              >
                {category.product_count.toLocaleString()} Items
              </span>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div
        className="slider-arrow slider-arrow-2 flex-right carausel-10-columns-arrow"
        id="carausel-10-columns-arrows"
      >
        <span className="slider-btn slider-prev slick-arrow custom_prev_ct1">
          <i className="fi-rs-arrow-small-left"></i>
        </span>

        <span className="slider-btn slider-next slick-arrow custom_next_ct1">
          <i className="fi-rs-arrow-small-right"></i>
        </span>
      </div>
    </>
  );
};

export default CategorySlider;