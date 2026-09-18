import Link from "next/link";
import { useGetLandingSectionsQuery } from "@/redux/services/product";

const NewArrival2 = () => {
    const {
        data,
        isLoading,
        isFetching,
        isError,
    } = useGetLandingSectionsQuery(undefined, {
        refetchOnMountOrArgChange: true,
    });

    const products = (data?.data?.recentlyAdded ?? []).slice(0, 4);

    if (isLoading || isFetching) {
        return (
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
                        Loading New Products...
                    </p>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="col-12 text-center py-5">
                <div
                    className="d-flex align-items-center justify-content-center"
                    style={{ minHeight: "400px" }}
                >
                    <p className="mt-15 text-muted">
                        Failed to load New Products.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bottom-product-list">
            {products.map((product: any) => (
                <article
                    className="bottom-product-item"
                    key={product.id}
                >
                    {/* IMAGE */}
                    <div
                        className="bottom-product-image"
                        style={{
                            width: "33.333%",
                            minWidth: 0,
                            height: "90px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "hidden",
                        }}
                    >
                        <Link
                            href={`/products/${product.slug}`}
                            style={{
                                width: "100%",
                                height: "90px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <img
                                src={
                                    product.images?.length
                                        ? product.images[0]?.local_path ||
                                          product.images[0]?.lightspeed_url
                                        : "/assets/not-available.png"
                                }
                                alt={
                                    product.description || "Product"
                                }
                                style={{
                                    width: "90px",
                                    height: "90px",
                                    maxWidth: "90px",
                                    maxHeight: "90px",
                                    objectFit: "contain",
                                    display: "block",
                                }}
                            />
                        </Link>
                    </div>

                    {/* PRODUCT INFO */}
                    <div
                        className="bottom-product-info"
                        style={{
                            width: "66.667%",
                            minWidth: 0,
                            height: "90px",
                            paddingLeft: "15px",
                            paddingRight: "5px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                        }}
                    >
                        <h6>
                            <Link href={`/products/${product.id}`}>
                                {product.description}
                            </Link>
                        </h6>

                        <div className="product-price">
                            <span>${product.price}</span>
                        </div>
                    </div>
                </article>
            ))}
        </div>
    );
};

export default NewArrival2;