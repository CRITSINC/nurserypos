"use client";

interface Brand {
    id: number;
    name: string;
    count?: number;
}

interface BrandFilterProps {
    brands: Brand[];

    selectedBrands: string[];

    onChange: (
        ids: string[]
    ) => void;
}

export default function BrandFilter({
    brands,
    selectedBrands,
    onChange,
}: BrandFilterProps) {

    const toggleBrand = (
        id: number
    ) => {

        const value = String(id);

        if (
            selectedBrands.includes(value)
        ) {
            onChange(
                selectedBrands.filter(
                    (item) => item !== value
                )
            );
        } else {
            onChange([
                ...selectedBrands,
                value,
            ]);
        }
    };

    return (
        <div className="custome-checkbox">

            {brands.length === 0 && (
                <p className="text-muted">
                    No brands available.
                </p>
            )}

            {brands.map((brand) => (
                <div
                    key={brand.id}
                    className="form-check mb-10"
                >
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id={`brand-${brand.id}`}
                        checked={selectedBrands.includes(
                            String(brand.id)
                        )}
                        onChange={() =>
                            toggleBrand(brand.id)
                        }
                    />

                    <label
                        className="form-check-label"
                        htmlFor={`brand-${brand.id}`}
                    >
                        {brand.name}

                        {brand.count !== undefined && (
                            <span className="ml-5 text-muted">
                                ({brand.count})
                            </span>
                        )}
                    </label>
                </div>
            ))}

        </div>
    );
}