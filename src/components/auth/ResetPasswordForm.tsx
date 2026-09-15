"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import {
  toasterError,
  toasterSuccess,
} from "@/components/core/Toaster";

import PasswordInput from "../common/PasswordInput";
import AuthLayout from "./AuthLayout";

import { useResetPasswordMutation } from "@/redux/services/auth";

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [resetPassword, { isLoading }] =
    useResetPasswordMutation();

  const validate = () => {
    if (!password.trim()) {
      toasterError("Password is required.");
      return false;
    }

    if (password.length < 6) {
      toasterError(
        "Password must be at least 6 characters."
      );
      return false;
    }

    if (!confirmPassword.trim()) {
      toasterError("Confirm password is required.");
      return false;
    }

    if (password !== confirmPassword) {
      toasterError("Passwords do not match.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!token) {
      toasterError("Invalid or expired reset link.");
      return;
    }

    if (!validate()) return;

    try {
      const response = await resetPassword({
        token,
        password,
      }).unwrap();

      toasterSuccess(response.data.message);

      setPassword("");
      setConfirmPassword("");

      router.replace("/login");
    } catch (error: any) {
      console.error(error);

      toasterError(
        error?.data?.error ??
          error?.data?.message ??
          "Unable to reset password."
      );
    }
  };

  return (
    <AuthLayout
      title="Reset Password"
      subtitle={
        <>
          <Link href="/login">Back to login</Link>
        </>
      }
      image="/assets/login.jpg"
    >
      <form onSubmit={handleSubmit}>
        <PasswordInput
          label="New Password"
          value={password}
          onChange={setPassword}
          placeholder="Enter new password"
        />

        <PasswordInput
          label="Confirm Password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          placeholder="Confirm password"
        />

        <div className="form-group mt-4">
          <button
            type="submit"
            className="btn btn-heading btn-block hover-up"
            disabled={isLoading}
          >
            {isLoading
              ? "Updating Password..."
              : "Reset Password"}
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}