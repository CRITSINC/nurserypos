"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toasterError, toasterSuccess } from "@/components/core/Toaster";
import AuthLayout from "./AuthLayout";
import { useForgotPasswordMutation } from "@/redux/services/auth";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

const handleForgotPassword = async (
  e: React.FormEvent<HTMLFormElement>
) => {
  e.preventDefault();

  if (!email.trim()) {
    toasterError("Email is required.");
    return;
  }

  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    toasterError("Please enter a valid email.");
    return;
  }

  try {
    const response = await forgotPassword({ email }).unwrap();

    toasterSuccess(response.data.message);
    setEmail("");
  } catch (error: any) {
    toasterError(
      error?.data?.error ??
      error?.data?.message ??
      "Something went wrong."
    );
  }
};

  return (
    <AuthLayout
      title="Forgot Password"
      subtitle={
        <>
         Enter your email to receive a password reset link.
        </>
      }
      image="/assets/forgot-password.jpg"
    >

                    <form onSubmit={handleForgotPassword}>

                      <div className="form-group">

                        <input
                          type="email"
                          placeholder="Email"
                          value={email}
                          onChange={(e) =>
                            setEmail(e.target.value)
                          }
                        />

                      </div>

                      <button
                        className="btn btn-heading btn-block hover-up"
                        disabled={isLoading}
                      >
                        {isLoading
                          ? "Sending..."
                          : "Send Reset Link"}
                      </button>

                    </form>

                    <div className="mt-20">

                      <Link href="/login">
                        Back to Login
                      </Link>

                    </div>

</AuthLayout>
  );
}