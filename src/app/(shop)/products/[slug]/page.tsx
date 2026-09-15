import Layout from "../../../../components/layout/Layout";
import ProductPageClient from "../../../../components/ecommerce/ProductPageClient";

interface Props {
    params: Promise<{
        slug: string;
    }>;
}

export default async function ProductId({ params }: Props) {
    const { slug } = await params;

    const id = Number(slug);

    return (
        <Layout
            parent="Home"
            sub="Products"
        >
            <div className="container">
                <ProductPageClient productId={id} />
            </div>
        </Layout>
    );
}