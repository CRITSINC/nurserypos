"use client";

import ProductDetails from "./ProductDetails";
import { useGetProductByIdQuery } from "@/redux/services/product";

interface Props {
    productId: number;
}

export default function ProductPageClient({
    productId,
}: Props) {
    const {
        data,
        isLoading,
        isError,
    } = useGetProductByIdQuery(productId);

    if (!productId || Number.isNaN(productId)) {
        return (
            <div className="py-5 text-center">
                <h3>Invalid product ID.</h3>
            </div>
        );
    }

    if (isLoading) {
        return (
               <div className="col-12 text-center py-5">
                <div
                    className="d-flex align-items-center justify-content-center"
                    style={{ minHeight: "400px" }}
                >
                    <div className="text-center">
                        <img
                            src="/assets/imgs/theme/loading.gif"
                            alt="Loading Products"
                            width={100}
                            height={100}
                        />
                        <p className="mt-15 text-muted">
                            Loading Products...
                        </p>
                    </div>
                </div>

            </div>
        );
    }

    if (isError || !data?.data) {
        return (
            <div className="col-12 text-center py-5">
                <div
                    className="d-flex align-items-center justify-content-center"
                    style={{ minHeight: "400px" }}
                >
                    <div className="text-center">
                        <p className="mt-15 text-muted">
                            Product not found.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <ProductDetails
            product={data.data}
        />
    );
}