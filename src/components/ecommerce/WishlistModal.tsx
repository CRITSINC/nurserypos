import { connect } from "react-redux";
import { Modal } from "react-responsive-modal";
import { addToCart } from "../../redux/slices/cart.slice";
import { toast } from "react-toastify";
import {
    clearWishlist,
    closeWishlist,
    deleteFromWishlist
} from "../../redux/slices/wishlist.slice";

const WishlistModal = ({
    wishlist,
    clearWishlist,
    closeWishlist,
    deleteFromWishlist,
    addToCart,
}:any) => {

    const handleCart = (product:any) => {
        addToCart(product);
        toast("Product added to Cart !");
    };

    return (
        <>
            <Modal
                open={wishlist.modal ? true : false}
                onClose={closeWishlist}
                center={true}
                classNames={{ modal: "full-modal" }}
            >
                {wishlist.items.length > 0 ? (
                    <div className="table-responsive">
                        <table className="table">
                            <tbody>
                                <tr>
                                    {/* <td></td> */}
                                    <td>
                                        <strong>Product Name</strong>
                                    </td>
                                    <td>
                                        <strong>Price</strong>
                                    </td>
                                    <td>
                                        <strong>Quantity</strong>
                                    </td>
                                    <td>
                                        <strong>Action</strong>
                                    </td>
                                </tr>

                                {wishlist.items.map((product:any) => (
                                    <tr>
                                        <td>
                                            <img
                                                src={product.image}
                                                alt="nest"
                                                className="img-fluid"
                                                width="70"
                                            />
                                        </td>

                                        <td>${product.price}</td>
                                        <td style={{ width: "200px" }}>
                                            <span
                                                onClick={(e) => handleCart(product)}
                                            >
                                                Add To Cart
                                            </span>
                                        </td>
                                        <td
                                            style={{ width: "50px" }}
                                            className="text-center"
                                        >
                                            <span
                                                onClick={(e) =>
                                                    deleteFromWishlist(product.id)
                                                }
                                            >
                                                <button>Delete</button>
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="text-right">
                            <span className="clear-btn" onClick={clearWishlist}>
                                Clear All
                            </span>
                        </div>
                    </div>
                ) : (
                    <h4 className="mb-0">No Products</h4>
                )}
            </Modal>
        </>
    );
};

const mapStateToProps = (state:any) => ({
    wishlist: state.wishlist,
});

const mapDispatchToProps = {
    closeWishlist,
    deleteFromWishlist,
    clearWishlist,
    addToCart,
};

export default connect(mapStateToProps, mapDispatchToProps)(WishlistModal);
