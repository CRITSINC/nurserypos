import { cookies } from "next/headers";

import Header from "@/components/admin/shared/header";
import Container from "@/components/admin/ui/container";
import AppSidebar from "@/components/admin/shared/sidebar/AppSidebar";
import { SidebarProvider } from "@/components/admin/ui/sidebar";
import "../../styles/admin.css";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();

  const sidebarCookie =
    cookieStore.get("sidebar_state")?.value;

  const defaultOpen =
    sidebarCookie === undefined
      ? true
      : sidebarCookie === "true";

  return (
    <div className="admin-layout">
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />

        <div className="flex flex-col flex-grow min-w-0">
          <Header />

          <main className="pt-6 pb-8 flex-grow print:!py-0">
            <Container>
              {children}
            </Container>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}