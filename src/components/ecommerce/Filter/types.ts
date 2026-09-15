export interface ProductFilters {
    brandIds: string[];
    vendorIds: string[];
    categoryIds: string[];
    tagIds: string[];

    minPrice?: number;
    maxPrice?: number;
}

export const emptyProductFilters: ProductFilters = {
    brandIds: [],
    vendorIds: [],
    categoryIds: [],
    tagIds: [],
    minPrice: undefined,
    maxPrice: undefined,
};