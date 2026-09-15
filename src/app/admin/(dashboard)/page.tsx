import { Fragment } from "react";
import { Metadata } from "next";

import PageTitle from "@/components/admin/shared/PageTitle";
import DashboardContent from "./_components/DashboardContent";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <Fragment>
      <section>
        <PageTitle>Dashboard Overview</PageTitle>

        <DashboardContent />
      </section>
    </Fragment>
  );
}