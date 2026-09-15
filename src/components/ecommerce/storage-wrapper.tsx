"use client";

import { useEffect, ReactNode } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { initCart, resetCart } from "@/redux/slices/cart.slice";
import {
  initWishlist,
  resetWishlist,
} from "@/redux/slices/wishlist.slice";
import { initCompare } from "@/redux/slices/compare.slice";
import storage from "@/util/localStorage";

interface StorageWrapperProps {
  children: ReactNode;
}

export default function StorageWrapper({
  children,
}: StorageWrapperProps) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    if (!user?.id) {
      dispatch(resetCart());
      dispatch(resetWishlist());
      return;
    }

    const cart =
      storage.get(`glenecho_cart_${user.id}`) || [];
    const wishlist =
      storage.get(`glenecho_wishlist_${user.id}`) || [];
    const compare = storage.get("glenecho_compare") || [];

    dispatch(
      initCart({
        userId: user.id,
        items: cart,
      })
    );

    dispatch(
      initWishlist({
        userId: user.id,
        items: wishlist,
      })
    );

    dispatch(initCompare(compare));
  }, [dispatch, user?.id]);

  return <>{children}</>;
}
