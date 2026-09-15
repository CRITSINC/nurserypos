function SelectOp({ selectChange, showLimit }:any) {
    return (
        <>
            <div className="sort-by-product-wrap">
                <div className="sort-by">
                    <span>
                        <i className="fi-rs-apps"></i>
                        Show:
                    </span>
                </div>
                <div className="sort-by-dropdown-wrap custom-select">
                    <select onChange={selectChange}>
                        <option value={showLimit}>{showLimit}</option>
                        <option value={10}>10</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                </div>
            </div>
        </>
    );
}
export default SelectOp;
