import { connect } from "react-redux";
import { Modal } from "react-responsive-modal";
import { clearCompare, closeCompare, deleteFromCompare  } from "../../redux/slices/compare.slice";
import CompareTable from "./CompareTable";

const CompareModal = ({ compare, closeCompare, deleteFromCompare , clearCompare }:any) => {
    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col-xl-12">
                        {compare.items.length > 0 ? (
                            <>
                                <CompareTable
                                    data={compare.items}
                                    features={["name", "price", "size"]}
                                    deleteFromCompare={deleteFromCompare}
                                />
                                <div className="text-right">
                                    <span
                                        className="clear-btn"
                                        onClick={clearCompare}
                                    >
                                        Clear All
                                    </span>
                                </div>
                            </>
                        ) : (
                            <h4>No Products</h4>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

const mapStateToProps = (state:any) => ({
    compare: state.compare,
});

const mapDispatchToProps = {
    closeCompare,
    clearCompare,
    deleteFromCompare
};

export default connect(mapStateToProps, mapDispatchToProps)(CompareModal);
