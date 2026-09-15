import { connect } from "react-redux";
import { openCart } from "../../redux/slices/cart.slice";
import { openCompare } from "../../redux/slices/compare.slice";
import { openWishlist } from "../../redux/slices/wishlist.slice";

const SideBarIcons = ({
    openCompare,
    openCart,
    totalCartItems,
    totalCompareItems,
    totalWishlistItems,
    openWishlist,
}:any) => {
    return (
        <>
            <div className="right-sidebar-popup-btn">
                <div className="popup-btn cart" onClick={openCart}>
                    Cart
                    <span> {totalCartItems}</span>
                </div>
                <div className="popup-btn wishlist" onClick={openWishlist}>
                    Wishlist
                    <span> {totalWishlistItems}</span>
                </div>

                <div
                    className="popup-btn compare"
                    onClick={openCompare}
                    style={{ top: "60%" }}
                >
                    compare
                    <span> {totalCompareItems}</span>
                </div>
            </div>
        </>
    );
};

const mapStateToProps = (state:any) => ({
    totalCartItems: state.cart.length,
    totalCompareItems: state.compare.items.length,
    totalWishlistItems: state.wishlist.items.length,
});

const mapDispatchToProps = {
    openCompare,
    openWishlist,
    openCart,
};

export default connect(mapStateToProps, mapDispatchToProps)(SideBarIcons);
