"use client";

interface Category {
    id: number;
    name: string;
    productCount?: number;
    count?: number;
}

interface CategoryFilterProps {
    /**
     * Normal mode:
     * List of main categories.
     *
     * Category mode:
     * The selected/main category can also be passed here.
     */
    categories: Category[];

    /**
     * Used when a category is already selected in URL.
     * These are the children/subcategories returned
     * by the category API.
     */
    subcategories?: Category[];

    selectedCategories: string[];

    onChange: (categoryIds: string[]) => void;

    /**
     * If true, categories are displayed as:
     *
     * Parent Category
     *   ├─ Subcategory
     *   ├─ Subcategory
     *   └─ Subcategory
     */
    showSubcategories?: boolean;
}

const CategoryFilter = ({
    categories,
    subcategories = [],
    selectedCategories,
    onChange,
    showSubcategories = false,
}: CategoryFilterProps) => {

    const toggleCategory = (id: number) => {
        const value = String(id);

        if (selectedCategories.includes(value)) {
            onChange(
                selectedCategories.filter(
                    (categoryId) =>
                        categoryId !== value
                )
            );

            return;
        }

        onChange([
            ...selectedCategories,
            value,
        ]);
    };

    if (
        categories.length === 0 &&
        subcategories.length === 0
    ) {
        return (
            <div className="filter-empty-state">
                No categories available.
            </div>
        );
    }

    /*
     * CATEGORY MODE
     *
     * Example:
     *
     * Services
     *   Consult & Design
     *   Delivery
     *   Planting/Install
     *   Workshops
     */
    if (
        showSubcategories &&
        categories.length > 0
    ) {
        const parent = categories[0];

        const parentSelected =
            selectedCategories.includes(
                String(parent.id)
            );

        return (
            <div className="filter-category-tree">

                {/* Parent category */}
                <div className="filter-category-parent">

                    <div
                        className={`filter-category-row parent-row ${
                            parentSelected
                                ? "selected"
                                : ""
                        }`}
                    >
                        <span className="filter-category-parent-icon">
                            <i className="fi-rs-folder"></i>
                        </span>

                        <span className="filter-category-name">
                            {parent.name}
                        </span>

                    </div>

                </div>

                {/* Subcategories */}
                {subcategories.length > 0 ? (
                    <div className="filter-subcategory-list">

                        {subcategories.map(
                            (subcategory) => {

                                const subcategoryId =
                                    String(
                                        subcategory.id
                                    );

                                const isSelected =
                                    selectedCategories.includes(
                                        subcategoryId
                                    );

                                return (
                                    <label
                                        key={
                                            subcategory.id
                                        }
                                        className={`filter-category-row filter-subcategory-row ${
                                            isSelected
                                                ? "selected"
                                                : ""
                                        }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={
                                                isSelected
                                            }
                                            onChange={() =>
                                                toggleCategory(
                                                    subcategory.id
                                                )
                                            }
                                        />

                                        <span className="filter-category-name">
                                            {
                                                subcategory.name
                                            }
                                        </span>

                                        {(
                                            subcategory.productCount !==
                                                undefined ||
                                            subcategory.count !==
                                                undefined
                                        ) && (
                                            <span className="filter-category-count">
                                                (
                                                {subcategory.productCount ??
                                                    subcategory.count}
                                                )
                                            </span>
                                        )}
                                    </label>
                                );
                            }
                        )}

                    </div>
                ) : (
                    <div className="filter-empty-state">
                        No subcategories available.
                    </div>
                )}

            </div>
        );
    }

    /*
     * NORMAL MODE
     *
     * Example:
     *
     * ☐ Store Use
     * ☐ Services
     * ☐ Plants
     * ☐ Plant Care
     */
    return (
        <div className="filter-category-tree">

            {categories.map((category) => {

                const categoryId =
                    String(category.id);

                const isSelected =
                    selectedCategories.includes(
                        categoryId
                    );

                return (
                    <label
                        key={category.id}
                        className={`filter-category-row ${
                            isSelected
                                ? "selected"
                                : ""
                        }`}
                    >
                        <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() =>
                                toggleCategory(
                                    category.id
                                )
                            }
                        />

                        <span className="filter-category-name">
                            {category.name}
                        </span>

                        {(
                            category.productCount !==
                                undefined ||
                            category.count !==
                                undefined
                        ) && (
                            <span className="filter-category-count">
                                (
                                {category.productCount ??
                                    category.count}
                                )
                            </span>
                        )}

                    </label>
                );
            })}

        </div>
    );
};

export default CategoryFilter;