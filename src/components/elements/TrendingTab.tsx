import { Product } from "@/types/product.types";
import SingleProduct from "../ecommerce/SingleProduct";

interface Props {
    products: Product[];
}

export default function TrendingTab({
    products,
}: Props) {
    return (
        <>
            {products.slice(0, 10).map((product) => (
                <div
                    key={product.id}
                    className="col-lg-1-5 col-md-4 col-sm-6 col-12"
                >
                    <SingleProduct product={product} />
                </div>
            ))}
        </>
    );
}