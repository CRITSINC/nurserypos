"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useRegisterMutation } from "@/redux/services/auth";
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

export default function RegisterForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const auth = useAppSelector((state) => state.auth);

  const [registerUser, { isLoading }] = useRegisterMutation();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (auth.user) {
      redirectUser(router, auth.user);
    }
  }, [auth.user, router]);

  const validate = () => {
    if (!firstName.trim()) {
      toasterError("First name is required.");
      return false;
    }

    if (!lastName.trim()) {
      toasterError("Last name is required.");
      return false;
    }

    if (!email.trim()) {
      toasterError("Email is required.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      toasterError("Please enter a valid email.");
      return false;
    }

    if (!password.trim()) {
      toasterError("Password is required.");
      return false;
    }

    if (password.length < 6) {
      toasterError("Password must be at least 6 characters.");
      return false;
    }

    return true;
  };

  const processPendingAction = () => {
    const pendingAction = sessionStorage.getItem("pendingAction");

    if (!pendingAction) {
      return false;
    }

    try {
      const action = JSON.parse(pendingAction);

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
      console.error("Failed to process pending action:", error);
      sessionStorage.removeItem("pendingAction");
      return false;
    }
  };

  const handleRegister = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const response = await registerUser({
        firstName,
        lastName,
        email,
        password,
      }).unwrap();

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

      toasterSuccess("Registration Successful");

      const hasPendingAction = processPendingAction();

      if (!hasPendingAction) {
        redirectUser(router, response.data.user);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AuthLayout
      title="Register"
      subtitle={
        <>
          Already have an account? <Link href="/login">Login</Link>
        </>
      }
      image="/assets/imgs/page/signup.jpg"
    >
      <form onSubmit={handleRegister}>
        <div className="form-group">
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

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

        <div className="form-group">
          <button
            type="submit"
            className="btn btn-heading btn-block hover-up"
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Register"}
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}
