"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const Search = () => {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = () => {
        const query = searchTerm.trim();

        if (!query) return;

        router.push(`/products?search=${encodeURIComponent(query)}`);
        setSearchTerm("");
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSearch();
        }
    };

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
            }}
        >
            <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
            />

            <button type="submit" aria-label="Search">
                <i className="fi-rs-search" />
            </button>
        </form>
    );
};

export default Search;