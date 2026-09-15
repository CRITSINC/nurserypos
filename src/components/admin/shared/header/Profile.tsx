"use client";

import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/admin/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/admin/ui/avatar";

import { Settings, LogOut, LayoutGrid } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import useLogout from "@/hooks/useLogout";

export default function Profile() {
  const user = useAppSelector((state) => state.auth.user);
  const logout = useLogout();
  const getInitials = (name: string | null | undefined): string => {
    if (!name) return "??";
    const names = name.split(" ");
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const fullName =
`${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim();

  return (
    <div className="flex ml-2">
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger className="rounded-full ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
          <Avatar>
            <AvatarImage
              src={"/assets/no-profile-picture.jpg"}
              alt={fullName ?? "User avatar"}
              className="object-cover object-center"
            />
            <AvatarFallback>{getInitials(fullName)}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          alignOffset={-10}
          className="flex flex-col"
          align="end"
        >
          {/* <DropdownMenuItem asChild>
            <Link
              href="/admin"
              className="w-full justify-start py-3.5 pl-3 pr-8 tracking-wide !cursor-pointer"
            >
              <LayoutGrid className="mr-3 size-5" /> Dashboard
            </Link>
          </DropdownMenuItem> */}

          <DropdownMenuItem asChild>
            <Link
              href="/admin/edit-profile"
              className="w-full justify-start py-3.5 pl-3 pr-8 tracking-wide !cursor-pointer"
            >
              <Settings className="mr-3 size-5" /> Edit Profile
            </Link>
          </DropdownMenuItem>

          {/* <form action="/" method="post">
            <DropdownMenuItem asChild>
              <button
                type="submit"
                className="w-full justify-start py-3.5 pl-3 pr-8 tracking-wide !cursor-pointer"
                onClick={logout}
              >
                <LogOut className="mr-3 size-5" /> Log Out
              </button>
            </DropdownMenuItem>
          </form> */}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
