"use client";

interface Tag {
    id: number;
    name: string;
    count?: number;
}

interface TagsProps {
    tags: Tag[];

    selectedTags: string[];

    onChange: (
        ids: string[]
    ) => void;
}

const Tags = ({
    tags,
    selectedTags,
    onChange,
}: TagsProps) => {

    const toggleTag = (
        id: number
    ) => {

        const value = String(id);

        if (
            selectedTags.includes(value)
        ) {
            onChange(
                selectedTags.filter(
                    (item) =>
                        item !== value
                )
            );

            return;
        }

        onChange([
            ...selectedTags,
            value,
        ]);
    };

    if (tags.length === 0) {
        return (
            <div className="filter-empty-state">
                No tags available.
            </div>
        );
    }

    return (
        <div className="filter-tags-list">

            {tags.map((tag) => {

                const selected =
                    selectedTags.includes(
                        String(tag.id)
                    );

                return (
                    <button
                        key={tag.id}
                        type="button"
                        className={`filter-tag-item ${
                            selected
                                ? "selected"
                                : ""
                        }`}
                        onClick={() =>
                            toggleTag(
                                tag.id
                            )
                        }
                    >

                        <span className="filter-tag-check">
                            {selected ? (
                                <i className="fi-rs-check"></i>
                            ) : (
                                <i className="fi-rs-plus"></i>
                            )}
                        </span>

                        <span className="filter-tag-name">
                            {tag.name}
                        </span>

                        {tag.count !==
                            undefined && (
                            <span className="filter-tag-count">
                                {tag.count}
                            </span>
                        )}

                    </button>
                );
            })}

        </div>
    );
};

export default Tags;