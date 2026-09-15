import filterProductList from "@/util/filterProduct";

export const fetchByCatagory = async (
  url: string,
  filters?: Record<string, any>
) => {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const products = await response.json();

    return filterProductList(products, filters);
  } catch (error) {
    console.error(error);
    return [];
  }
};