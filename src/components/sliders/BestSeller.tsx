import Link from "next/link";
import { useGetLandingSectionsQuery } from "@/redux/services/product";

const BestSellerSlider = () => {

    const {
        data,
        isLoading,
        isFetching,
        isError,
    } = useGetLandingSectionsQuery(undefined, {
        refetchOnMountOrArgChange: true,
    });

    const products = (data?.data?.topSelling ?? []).slice(0, 3);


    return (
        <>
            {(isLoading || isFetching) ? (
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
                            Loading Bestseller Products...
                        </p>
                    </div>
                </div>
            ) :  isError ? (
                            <div className="col-12 text-center py-5">
                                <div
                                    className="d-flex align-items-center justify-content-center"
                                    style={{ minHeight: "400px" }}
                                >
                                    <div className="text-center">
                                        <p className="mt-15 text-muted">
                                            Failed to load Bestseller products.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )
                :
                products?.map((product: any, i: number) => (
                    <article className="row align-items-center hover-up" key={i}>
                        <figure className="col-md-4 mb-0">
                            <Link href={`/products/${product.slug}`}>
                                <img src={
                                    product.images?.length
                                        ? product.images[0]?.local_path || product.images[0]?.lightspeed_url
                                        : "/assets/not-available.png"
                                }
                                    alt="nest" />
                            </Link>
                        </figure>
                        <div className="col-md-8 mb-0">
                            <h6>
                                <Link href={`/products/${product.id}`}>
                                    {product.description}
                                </Link>
                            </h6>

                            <div className="product-price">
                                <span>${product.price} </span>
                            </div>
                        </div>
                    </article>
                ))}
        </>
    );
};

export default BestSellerSlider;
