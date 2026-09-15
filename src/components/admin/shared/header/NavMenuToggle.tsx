"use client";

import { Menu } from "lucide-react";

import { Button } from "@/components/admin/ui/button";
import { useSidebar } from "@/components/admin/ui/sidebar";

export default function NavMenuToggle() {
  const { toggleSidebar } = useSidebar();

  return (
    <Button variant="ghost" size="icon" onClick={toggleSidebar}>
      <Menu />
    </Button>
  );
}
