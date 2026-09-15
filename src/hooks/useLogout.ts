"use client";

import { useRouter } from "next/navigation";

import { useLogoutMutation } from "@/redux/services/auth";
import { useAppDispatch } from "@/redux/hooks";

import { clearAuth } from "@/redux/slices/auth.slice";
import { resetCart } from "@/redux/slices/cart.slice";
import { resetWishlist } from "@/redux/slices/wishlist.slice";
import { removeRoleCookie } from "@/lib/cookies";
import { toasterSuccess } from "@/components/core/Toaster";

export default function useLogout() {
  const router = useRouter();

  const dispatch = useAppDispatch();

  const [logoutApi] = useLogoutMutation();

  const logout = async () => {
    try {
      await logoutApi().unwrap();
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(resetCart());
      dispatch(resetWishlist());
      dispatch(clearAuth());

      removeRoleCookie();
      toasterSuccess("You have Logged out successfully.");
      router.replace("/");
    }
  };

  return logout;
}
