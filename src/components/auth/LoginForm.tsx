"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { useLoginMutation } from "@/redux/services/auth";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setCredentials } from "@/redux/slices/auth.slice";
import { initCart, addToCart } from "@/redux/slices/cart.slice";
import { initWishlist, addToWishlist } from "@/redux/slices/wishlist.slice";
import { toasterError, toasterSuccess } from "@/components/core/Toaster";
import { redirectUser } from "@/util/authRedirect";
import PasswordInput from "../common/PasswordInput";
import AuthLayout from "./AuthLayout";
import { setRoleCookie } from "@/lib/cookies";
import storage from "@/util/localStorage";

export default function LoginForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();

  const hasPendingActionParam =
      searchParams.get("pendingAction") === "1";
  const auth = useAppSelector((state) => state.auth);

  const [login, { isLoading }] = useLoginMutation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!auth.user) return;

    const role = auth.user;

    redirectUser(router, role);
  }, [auth.user, router]);

  useEffect(() => {
    if (!hasPendingActionParam) {
        sessionStorage.removeItem("pendingAction");
    }
}, [hasPendingActionParam]);

const processPendingAction = () => {
    if (!hasPendingActionParam) {
        return false;
    }

    const pendingAction = sessionStorage.getItem("pendingAction");

    if (!pendingAction) {
        return false;
    }

    try {
        const action = JSON.parse(pendingAction);

        // Pending action expires after 10 minutes
        const TEN_MINUTES = 10 * 60 * 1000;

        if (
            !action.createdAt ||
            Date.now() - action.createdAt > TEN_MINUTES
        ) {
            sessionStorage.removeItem("pendingAction");
            return false;
        }

        if (action.type === "cart" && action.product) {
            dispatch(
                addToCart({
                    ...action.product,
                    ...(action.quantity
                        ? { quantity: action.quantity }
                        : {}),
                })
            );

            toasterSuccess("Product added to cart");
        }

        if (action.type === "wishlist" && action.product) {
            dispatch(addToWishlist(action.product));

            toasterSuccess("Added to Wishlist");
        }

        sessionStorage.removeItem("pendingAction");

        if (action.redirectTo) {
            router.push(action.redirectTo);
        }

        return true;
    } catch (error) {
        console.error(
            "Failed to process pending action:",
            error
        );

        sessionStorage.removeItem("pendingAction");

        return false;
    }
};

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log(email, password);

    if (!email.trim()) {
      toasterError("Please enter your email.");
      return;
    }

    if (!password.trim()) {
      toasterError("Please enter your password.");
      return;
    }

    try {
      const response = await login({ email, password }).unwrap();

      dispatch(
        setCredentials({
          accessToken: response.data.accessToken,
          user: response.data.user,
        })
      );

      const userId = response.data.user.id;
      const cart = storage.get(`glenecho_cart_${userId}`) || [];
      const wishlist = storage.get(`glenecho_wishlist_${userId}`) || [];

      dispatch(initCart({ userId, items: cart }));
      dispatch(initWishlist({ userId, items: wishlist }));

      if (response.data.user.roles) {
        setRoleCookie(response.data.user.roles.role);
      }

      if (rememberMe) {
        localStorage.setItem("rememberEmail", email);
      } else {
        localStorage.removeItem("rememberEmail");
      }

      toasterSuccess("Login Successful");

      const user = response.data.user;

      const role = user?.roles?.role;

      const isNormalUser =
          role === "User";

      let hasPendingAction = false;

      if (isNormalUser) {
          hasPendingAction = processPendingAction();
      } else {
          sessionStorage.removeItem("pendingAction");
      }

      if (!hasPendingAction) {
          redirectUser(router, user);
      }
    } catch (error: any) {
      console.error(error);
    }
  };

  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberEmail");

    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  return (
    <AuthLayout
      title="Login"
      subtitle={
        <>
          Don't have an account? <Link href="/register">Create here</Link>
        </>
      }
    >
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <PasswordInput
          value={password}
          onChange={setPassword}
          placeholder="Password"
        />

        <div className="login_footer form-group mb-50">
          <div className="chek-form">
            <div className="custome-checkbox">
              <input
                className="form-check-input"
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />

              <label className="form-check-label" htmlFor="rememberMe">
                <span>Remember me</span>
              </label>
            </div>
          </div>

          <Link href="/forgot-password" className="text-muted">
            Forgot password?
          </Link>
        </div>

        <div className="form-group">
          <button
            className="btn btn-heading btn-block hover-up"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Log In"}
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}
