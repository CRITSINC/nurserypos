"use client";

import { useState } from "react";

interface Props {
    product: any;
}

export default function ThumbSlider({ product }: Props) {
    const images =
        product?.images?.length > 0
            ? product.images.map((img: any) => img.local_path || img.lightspeed_url)
            : ["/assets/not-available.png"];

    const [activeImage, setActiveImage] = useState(images[0]);

    return (
        <div className="detail-gallery">

            <div className="product-image-slider border-radius-10 mb-20">
                <img
                    src={activeImage}
                    alt={product.description}
                    style={{
                        width: "100%",
                        maxHeight: "500px",
                        objectFit: "contain",
                    }}
                />
            </div>

            {images.length > 1 && (
                <div
                    className="d-flex flex-wrap"
                    style={{ gap: 10 }}
                >
                    {images.map((image: string, index: number) => (
                        <img
                            key={index}
                            src={image}
                            alt=""
                            onClick={() => setActiveImage(image)}
                            style={{
                                width: 90,
                                height: 90,
                                objectFit: "cover",
                                cursor: "pointer",
                                border:
                                    activeImage === image
                                        ? "2px solid #3bb77e"
                                        : "1px solid #ddd",
                                borderRadius: 6,
                                padding: 2,
                            }}
                        />
                    ))}
                </div>
            )}

        </div>
    );
}