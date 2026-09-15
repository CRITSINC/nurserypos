import { Metadata } from "next";

import PageTitle from "@/components/admin/shared/PageTitle";
import EditProfileForm from "./_components/EditProfileForm";

export const metadata: Metadata = {
  title: "Edit Profile",
};

export default function EditProfilePage() {
  return (
    <section className="space-y-6">
      <PageTitle>Edit Profile</PageTitle>

      <EditProfileForm />
    </section>
  );
}