"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Shield, UserRound } from "lucide-react";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/admin/ui/card";

import { Form } from "@/components/admin/ui/form";

import {
    FormPasswordInput,
    FormReadonly,
} from "@/components/admin/shared/form";

import { FormSubmitButton } from "@/components/admin/shared/form/FormSubmitButton";

import {
    passwordSchema,
    PasswordFormData,
} from "./schema";

import {
    useUpdateProfileMutation,
} from "@/redux/services/profile";

import {
    toasterError,
    toasterSuccess,
} from "@/components/core/Toaster";

import {
    useAppDispatch,
    useAppSelector,
} from "@/redux/hooks";

import {
    updateUser,
} from "@/redux/slices/auth.slice";


interface ProfileFormData {
    first_name: string;
    last_name: string;
    email: string;
}


export default function EditProfileForm() {
    const dispatch = useAppDispatch();

    const user = useAppSelector(
        (state) => state.auth.user
    );

    const profileForm = useForm<ProfileFormData>({
        defaultValues: {
            first_name: "",
            last_name: "",
            email: "",
        },
    });

    const passwordForm = useForm<PasswordFormData>({
        resolver: zodResolver(passwordSchema),

        defaultValues: {
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    const [
        updatePassword,
        {
            isLoading: isPasswordUpdating,
        },
    ] = useUpdateProfileMutation();

    useEffect(() => {
        if (!user) return;

        profileForm.reset({
            first_name: user.first_name || "",
            last_name: user.last_name || "",
            email: user.email || "",
        });
    }, [user, profileForm]);

    const onProfileSubmit = async (
        values: ProfileFormData
    ) => {
        if (!user?.id) {
            toasterError("User information not found.");
            return;
        }

        try {
            const updatedUser = {
                ...user,

                first_name:
                    values.first_name,

                last_name:
                    values.last_name,

                email:
                    values.email,
            };

            dispatch(
                updateUser(updatedUser)
            );

            toasterSuccess(
                "Profile updated successfully."
            );

        } catch (error: any) {

            toasterError(
                error?.data?.message ??
                "Failed to update profile."
            );
        }
    };

    const onPasswordSubmit = (
        values: PasswordFormData
    ) => {

        if (
            values.newPassword !==
            values.confirmPassword
        ) {
            toasterError(
                "New passwords do not match."
            );

            return;
        }

        updatePassword({
            oldPassword:
                values.oldPassword,

            newPassword:
                values.newPassword,
        })
            .unwrap()
            .then(() => {

                toasterSuccess(
                    "Password updated successfully."
                );

                passwordForm.reset();

            })
            .catch((error: any) => {

                toasterError(
                    error?.data?.message ??
                    "Failed to update password."
                );

            });
    };


return (
    <div className="mx-auto w-full max-w-5xl space-y-5">
        <Card className="overflow-hidden border border-slate-200 shadow-sm">

            <CardHeader className="border-b border-slate-100 bg-slate-50/60 px-6 py-5">

                <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
                        <UserRound className="h-5 w-5 text-emerald-600" />
                    </div>

                    <div>
                        <CardTitle className="text-lg font-semibold text-slate-800">
                            Personal Information
                        </CardTitle>

                        <CardDescription className="mt-1 text-sm text-slate-500">
                            Update the information associated with your account.
                        </CardDescription>
                    </div>

                </div>

            </CardHeader>


            <CardContent className="px-8 py-7">

                <div className="space-y-5">

                    <FormReadonly
                        label="First Name"
                        value={user?.first_name ?? "-"}
                    />

                    <FormReadonly
                        label="Last Name"
                        value={user?.last_name ?? "-"}
                    />

                    <FormReadonly
                        label="Email Address"
                        value={user?.email ?? "-"}
                    />

                </div>

            </CardContent>
        </Card>


        <Card className="overflow-hidden border border-slate-200 shadow-sm">

            <CardHeader className="border-b border-slate-100 bg-slate-50/60 px-6 py-5">

                <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                        <Shield className="h-5 w-5 text-blue-600" />
                    </div>

                    <div>
                        <CardTitle className="text-lg font-semibold text-slate-800">
                            Password & Security
                        </CardTitle>

                        <CardDescription className="mt-1 text-sm text-slate-500">
                            Keep your account secure by using a strong password.
                        </CardDescription>
                    </div>

                </div>

            </CardHeader>


            <CardContent className="px-6 py-6">

                <Form {...passwordForm}>

                    <form
                        onSubmit={passwordForm.handleSubmit(
                            onPasswordSubmit
                        )}
                        className="space-y-5"
                    >

                        <FormPasswordInput
                            control={passwordForm.control}
                            name="oldPassword"
                            label="Current Password"
                            placeholder="Enter current password"
                        />

                        <FormPasswordInput
                            control={passwordForm.control}
                            name="newPassword"
                            label="New Password"
                            placeholder="Enter new password"
                        />

                        <FormPasswordInput
                            control={passwordForm.control}
                            name="confirmPassword"
                            label="Confirm Password"
                            placeholder="Confirm new password"
                        />

                        <div className="border-t border-slate-100 pt-5">

                            <div className="flex items-center justify-between">

                                <p className="text-xs text-slate-500">
                                    Use at least 8 characters with a mix of letters,
                                    numbers and symbols.
                                </p>

                                <FormSubmitButton
                                    isPending={isPasswordUpdating}
                                >
                                    Update Password
                                </FormSubmitButton>

                            </div>

                        </div>

                    </form>

                </Form>

            </CardContent>

        </Card>

    </div>
);
}