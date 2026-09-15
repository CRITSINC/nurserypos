import { demoProducts } from "@/demo/products";
import { paginate } from "@/helpers/paginate";
import {
  Product,
  FetchProductsParams,
  FetchProductsResponse,
  ProductDetails,
} from "./types";

export async function fetchProducts({
  page = 1,
  limit = 10,
  search,
  category,
  priceSort,
  status,
  published,
  dateSort,
}: FetchProductsParams): Promise<FetchProductsResponse> {
  let data = [...demoProducts];

  if (search) {
    const text = search.toLowerCase();
    data = data.filter((product) =>
      product.name.toLowerCase().includes(text)
    );
  }

  if (category) {
    data = data.filter(
      (product) => product.categories?.slug === category
    );
  }

  if (status) {
    data = data.filter((product) =>
      status === "selling"
        ? product.stock > 0
        : product.stock === 0
    );
  }

  if (published !== undefined) {
    data = data.filter(
      (product) => product.published === published
    );
  }

  if (priceSort) {
    data.sort((a, b) =>
      priceSort === "lowest-first"
        ? a.selling_price - b.selling_price
        : b.selling_price - a.selling_price
    );
  } else if (dateSort) {
    const [field, direction] = dateSort.split("-");

    data.sort((a, b) => {
      const dateA =
        field === "added"
          ? new Date(a.created_at).getTime()
          : new Date(a.updated_at).getTime();

      const dateB =
        field === "added"
          ? new Date(b.created_at).getTime()
          : new Date(b.updated_at).getTime();

      return direction === "asc"
        ? dateA - dateB
        : dateB - dateA;
    });
  }

  return paginate(data, page, limit);
}

export async function fetchProductDetails({
  slug,
}: {
  slug: string;
}) {
  const product = demoProducts.find(
    (product) => product.slug === slug
  );

  if (!product) {
    throw new Error("Product not found");
  }

  return {
    product,
  };
}
