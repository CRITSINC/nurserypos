import filterProductList from "@/util/filterProduct";

export async function fetchByCategory(
  url: string,
  filters?: Record<string, any>
) {
  try {
    const response = await fetch(url);
    const data = await response.json();

    return filterProductList(data, filters);
  } catch {
    return [];
  }
}