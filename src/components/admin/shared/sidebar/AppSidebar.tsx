"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import { FaBagShopping } from "react-icons/fa6";

import { cn } from "@/lib/utils";
import { navItems } from "@/components/admin/shared/sidebar/navItems";
import Typography from "@/components/admin/ui/typography";
import { Button, buttonVariants } from "@/components/admin/ui/button";
import { Sidebar, SidebarContent } from "@/components/admin/ui/sidebar";
import { useSidebar } from "@/components/admin/ui/sidebar";
import useLogout from "@/hooks/useLogout";

export default function AppSidebar() {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();
  const logout = useLogout();
  return (
  <Sidebar className="shadow-md">
    <SidebarContent className="flex h-full flex-col">
      {/* Logo */}
      <div className="px-2 pt-2">
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "font-bold text-2xl gap-2 justify-start min-h-fit hover:bg-transparent"
          )}
        >
          <img src="/assets/imgs/theme/LOGO-GEN.svg" alt="logo" />
        </Link>
      </div>

      {/* Scrollable Menu */}
      <div className="flex-1 overflow-y-auto px-2">
        <ul className="flex flex-col gap-y-1">
          {navItems.map((navItem, index) => (
            <li key={`nav-item-${index}`}>
              <Link
                onClick={isMobile ? () => setOpenMobile(false) : undefined}
                href={navItem.url}
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "relative w-full justify-start px-5 py-4 gap-x-2.5 [&_svg]:size-6 [&_svg]:flex-shrink-0 font-medium text-base focus-visible:bg-accent focus-visible:text-accent-foreground",
                  pathname === navItem.url &&
                    "bg-accent text-accent-foreground after:content-[''] after:absolute after:top-0 after:left-0 after:h-full after:w-1 after:bg-primary after:rounded-r-lg"
                )}
              >
                {navItem.icon}
                {navItem.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Fixed Bottom */}
      <div className="border-t p-4">
        <Button
          className="w-full py-3 text-base"
          onClick={logout}
        >
          <LogOut className="mr-3 size-6 flex-shrink-0" />
          Log out
        </Button>
      </div>
    </SidebarContent>
  </Sidebar>
  );
}
