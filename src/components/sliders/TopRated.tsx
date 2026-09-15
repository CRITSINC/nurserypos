import Link from "next/link";
import React, { useEffect, useState } from "react";
import { fetchByCatagory } from "../../redux/services/product.service";

const TopRatedSlider = () => {
    const [discount, setDiscount] = useState<any>([]);

    // console.log(discount);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        // With Category
        const allProducts = await fetchByCatagory("/static/product.json");

        // Discount
        const discountProduct = allProducts.filter((item:any) => item.discount.isActive);

        setDiscount(discountProduct);
    };
    return (
        <>
            {discount.slice(0, 3).map((product:any, i:number) => (
                <article className="row align-items-center hover-up" key={i}>
                    <figure className="col-md-4 mb-0">
                        <Link href={`/products/${product.slug}`}>
                            <img src={product.images[0].img} alt="nest" />
                        </Link>
                    </figure>
                    <div className="col-md-8 mb-0">
                        <h6>
                            <Link href={`/products/${product.slug}`}>
                                {product.title}
                            </Link>
                        </h6>
                        <div className="product-rate-cover">
                            <div className="product-rate d-inline-block">
                                <div className="product-rating" style={{ width: "90%" }}></div>
                            </div>
                            <span className="font-small ml-5 text-muted"> (4.0)</span>
                        </div>
                        <div className="product-price">
                            <span>${product.price} </span>
                            <span className="old-price">{product.oldPrice && `$ ${product.oldPrice}`}</span>
                        </div>
                    </div>
                </article>
            ))}
        </>
    );
};

export default TopRatedSlider;
